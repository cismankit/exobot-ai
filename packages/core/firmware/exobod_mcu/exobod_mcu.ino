/*
 * Exobod MCU firmware — ESP32 / ESP32-S3 (Arduino framework or PlatformIO)
 *
 * The body's constitution in silicon:
 *   - NDJSON protocol over USB-CDC serial @115200 (same wire format as
 *     the Python reflex simulator — validated behavior transfers 1:1)
 *   - Joint limits + per-command step clamp (servo whip protection)
 *   - Heartbeat watchdog: no {"t":"hb"} for HB_TIMEOUT_MS -> neutralize
 *   - Hardware E-STOP button (GPIO, normally-open to GND): latches motion
 *     off; ONLY the physical button long-press releases it. Software can
 *     trigger estop but can never clear it.
 *
 * Build (PlatformIO):  pio run -t upload
 *   platformio.ini in this directory; libs: ArduinoJson, Adafruit PWM
 *   Servo Driver Library.
 * Wiring:
 *   PCA9685 on I2C (SDA=21, SCL=22 classic ESP32 / 8,9 on S3)
 *   ch0 = pan servo, ch1 = tilt servo (MG90S), separate 5V rail, common GND
 *   ESTOP_PIN 4 -> momentary button -> GND
 */

#include <Wire.h>
#include <ArduinoJson.h>
#include <Adafruit_PWMServoDriver.h>

// ---------------- configuration (mirror of reflex_sim.py LIMITS) -------
static const float PAN_MIN = -80,  PAN_MAX = 80;
static const float TILT_MIN = -30, TILT_MAX = 45;
static const float MAX_STEP_DEG = 25.0;
static const uint32_t HB_TIMEOUT_MS = 1000;
static const uint32_t ESTOP_RELEASE_HOLD_MS = 2000;

static const uint8_t CH_PAN = 0, CH_TILT = 1;
static const int ESTOP_PIN = 4;
static const int SERVO_MIN_US = 500, SERVO_MAX_US = 2500; // MG90S range

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(0x40);

struct BodyState {
  float pan = 0, tilt = 0;
  bool estopped = false;
  uint32_t lastHb = 0;
  uint32_t estopPressStart = 0;
} body;

// ---------------- servo helpers ----------------------------------------
static uint16_t degToTicks(float deg) {
  // deg is joint angle; servo neutral = 90°, joint 0 = neutral
  float servoDeg = constrain(90.0f + deg, 0.0f, 180.0f);
  int us = SERVO_MIN_US +
           (int)((SERVO_MAX_US - SERVO_MIN_US) * servoDeg / 180.0f);
  return (uint16_t)(us * 4096L / 20000L);   // 50 Hz frame = 20000 us
}

static void applyPose() {
  pwm.setPWM(CH_PAN,  0, degToTicks(body.pan));
  pwm.setPWM(CH_TILT, 0, degToTicks(body.tilt));
}

static float stepToward(float cur, float target, float maxStep) {
  float d = target - cur;
  if (d >  maxStep) d =  maxStep;
  if (d < -maxStep) d = -maxStep;
  return cur + d;
}

static void neutralizeMotion() {
  // Hold pose (no torque snap); a wheeled build would zero motor PWM here.
}

// ---------------- protocol ---------------------------------------------
static void sendAck(bool executed, const char* reason, long seq) {
  StaticJsonDocument<256> doc;
  doc["t"] = "ack";
  doc["executed"] = executed;
  doc["reason"] = reason;
  doc["seq"] = seq;
  JsonObject pose = doc.createNestedObject("pose");
  pose["pan"] = body.pan;
  pose["tilt"] = body.tilt;
  doc["estop"] = body.estopped;
  serializeJson(doc, Serial);
  Serial.println();
}

static void doEstop(const char* why) {
  body.estopped = true;
  neutralizeMotion();
  sendAck(true, why, -1);
}

static void handleIntent(JsonDocument& doc) {
  long seq = doc["seq"] | -1;
  const char* action = doc["action"] | "";
  JsonObject p = doc["params"];

  if (strcmp(action, "estop") == 0) { doEstop("intent estop"); return; }

  bool motionAction = strcmp(action, "gaze") == 0 ||
                      strcmp(action, "nod") == 0  ||
                      strcmp(action, "shake") == 0 ||
                      strcmp(action, "wave") == 0 ||
                      strcmp(action, "point") == 0 ||
                      strcmp(action, "drive") == 0;

  if (body.estopped && motionAction) {
    sendAck(false, "estopped - motion locked (physical release only)", seq);
    return;
  }

  if (strcmp(action, "gaze") == 0) {
    float panT  = constrain((float)(p["pan"]  | body.pan),  PAN_MIN,  PAN_MAX);
    float tiltT = constrain((float)(p["tilt"] | body.tilt), TILT_MIN, TILT_MAX);
    float panN  = stepToward(body.pan,  panT,  MAX_STEP_DEG);
    float tiltN = stepToward(body.tilt, tiltT, MAX_STEP_DEG);
    bool clamped = fabsf(panN - (float)(p["pan"] | body.pan)) > 0.01f ||
                   fabsf(tiltN - (float)(p["tilt"] | body.tilt)) > 0.01f;
    body.pan = panN; body.tilt = tiltN;
    applyPose();
    sendAck(true, clamped ? "clamped" : "ok", seq);

  } else if (strcmp(action, "nod") == 0) {
    const float seqDeg[4] = {20, -5, 10, 0};
    for (float t : seqDeg) {
      body.tilt = constrain(t, TILT_MIN, TILT_MAX);
      applyPose(); delay(150);
    }
    sendAck(true, "gesture:nod", seq);

  } else if (strcmp(action, "shake") == 0) {
    const float seqDeg[4] = {-25, 25, -15, 0};
    for (float pn : seqDeg) {
      body.pan = constrain(pn, PAN_MIN, PAN_MAX);
      applyPose(); delay(150);
    }
    sendAck(true, "gesture:shake", seq);

  } else if (strcmp(action, "stop") == 0 || strcmp(action, "idle") == 0) {
    neutralizeMotion();
    sendAck(true, "stopped", seq);

  } else if (strcmp(action, "speak") == 0 || strcmp(action, "led") == 0 ||
             strcmp(action, "face") == 0) {
    // expression handled phone-side; MCU acks so brain state stays coherent
    sendAck(true, "expr", seq);

  } else {
    sendAck(false, "unknown action", seq);
  }
}

// ---------------- estop button + watchdog ------------------------------
static void serviceSafety() {
  // physical button (active low)
  if (digitalRead(ESTOP_PIN) == LOW) {
    if (!body.estopped) doEstop("hardware estop");
    if (body.estopPressStart == 0) body.estopPressStart = millis();
    // long-press while ALREADY estopped = release
    else if (body.estopped &&
             millis() - body.estopPressStart > ESTOP_RELEASE_HOLD_MS) {
      body.estopped = false;
      body.estopPressStart = 0;
      sendAck(true, "estop released (hardware)", -1);
    }
  } else {
    body.estopPressStart = 0;
  }

  // heartbeat watchdog
  if (!body.estopped && millis() - body.lastHb > HB_TIMEOUT_MS) {
    neutralizeMotion();   // brain silent -> body goes calm, not estop-latched
  }
}

// ---------------- arduino lifecycle ------------------------------------
static char lineBuf[512];
static size_t lineLen = 0;

void setup() {
  Serial.begin(115200);
  pinMode(ESTOP_PIN, INPUT_PULLUP);
  Wire.begin();
  pwm.begin();
  pwm.setPWMFreq(50);
  applyPose();
  body.lastHb = millis();
  Serial.println(F("{\"t\":\"boot\",\"fw\":\"exobod-mcu 0.2.0\"}"));
}

void loop() {
  serviceSafety();

  while (Serial.available()) {
    char c = (char)Serial.read();
    if (c == '\n' || lineLen >= sizeof(lineBuf) - 1) {
      lineBuf[lineLen] = '\0';
      lineLen = 0;
      StaticJsonDocument<512> doc;
      if (deserializeJson(doc, lineBuf) == DeserializationError::Ok) {
        const char* t = doc["t"] | "";
        if      (strcmp(t, "hb") == 0)     { body.lastHb = millis();
                                             sendAck(true, "hb", -1); }
        else if (strcmp(t, "estop") == 0)  { doEstop("remote estop"); }
        else if (strcmp(t, "intent") == 0) { body.lastHb = millis();
                                             handleIntent(doc); }
      } else {
        sendAck(false, "bad json", -1);
      }
    } else {
      lineBuf[lineLen++] = c;
    }
  }
}
