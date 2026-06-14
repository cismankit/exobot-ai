import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { EStopButton } from "@/components/EStopButton";
import { ExpressiveFace } from "@/components/ExpressiveFace";
import { MotionPrimitiveButtons } from "@/components/MotionPrimitiveButtons";
import { SafetyGovernorPanel } from "@/components/SafetyGovernorPanel";
import { SkillPackDisplay } from "@/components/SkillPackDisplay";
import { VoiceMicButton } from "@/components/VoiceMicButton";
import { colors } from "@/theme/colors";
import {
  getAvailablePrimitives,
  mapIntentToPrimitive,
  type MotionPrimitive,
} from "@/lib/motion-primitives";
import {
  checkMotionAllowed,
  createInitialGovernorState,
  resetEstop,
  triggerEstop,
  type SafetyGovernorState,
} from "@/lib/safety-governor";
import { clearClaimedUnit, loadClaimedUnit } from "@/lib/storage";
import { createVoiceIntent, stubSpeechToText } from "@/lib/voice-intent";
import type { CompanionUnitProfile, FaceMood, VoiceIntent } from "@/lib/types";

export default function FaceScreen() {
  const router = useRouter();
  const [unit, setUnit] = useState<CompanionUnitProfile | null>(null);
  const [governor, setGovernor] = useState<SafetyGovernorState | null>(null);
  const [mood, setMood] = useState<FaceMood>("idle");
  const [listening, setListening] = useState(false);
  const [intents, setIntents] = useState<VoiceIntent[]>([]);
  const [lastMotion, setLastMotion] = useState<string | null>(null);
  const [motionLog, setMotionLog] = useState<string[]>([]);
  const tapCount = useRef(0);

  useEffect(() => {
    loadClaimedUnit().then((u) => {
      if (!u) {
        router.replace("/onboarding");
        return;
      }
      setUnit(u);
      setGovernor(createInitialGovernorState(u.bodyTypeSlug));
      setGovernor((g) => (g ? { ...g, bleConnected: true } : g));
    });
  }, [router]);

  const runPrimitive = useCallback(
    (primitive: MotionPrimitive) => {
      if (!unit || !governor) return;

      if (primitive.id === "estop") {
        setGovernor(triggerEstop(governor));
        setMood("estop");
        setLastMotion("E-STOP triggered");
        setMotionLog((log) => ["E-STOP", ...log].slice(0, 5));
        return;
      }

      const check = checkMotionAllowed(governor, primitive.maxSpeedPct, unit.safetyLimits);
      if (!check.allowed) {
        setMotionLog((log) => [`BLOCKED: ${check.reason}`, ...log].slice(0, 5));
        return;
      }

      setMood("speaking");
      setLastMotion(`${primitive.label} → ${primitive.firmwareId}`);
      setMotionLog((log) => [`${primitive.label} queued`, ...log].slice(0, 5));

      setTimeout(() => setMood(listening ? "listening" : "idle"), primitive.durationMs || 800);
    },
    [unit, governor, listening],
  );

  const onEstopPress = useCallback(() => {
    if (!governor) return;
    if (governor.estopActive) {
      setGovernor(resetEstop({ ...governor, bleConnected: true }));
      setMood("idle");
      setLastMotion("E-STOP reset");
    } else {
      setGovernor(triggerEstop(governor));
      setMood("estop");
      setLastMotion("E-STOP triggered");
    }
  }, [governor]);

  const onVoicePress = useCallback(() => {
    if (!unit || !governor) return;

    if (governor.estopActive) return;

    if (!listening) {
      setListening(true);
      setMood("listening");
      return;
    }

    setListening(false);
    const transcript = stubSpeechToText(tapCount.current);
    tapCount.current += 1;

    const intent = createVoiceIntent(transcript);
    setIntents((q) => [intent, ...q].slice(0, 8));

    const primitive = mapIntentToPrimitive(
      intent.intent,
      unit.bodyTypeSlug,
      unit.motionPrimitives,
    );

    if (primitive) {
      runPrimitive(primitive);
      setIntents((q) =>
        q.map((i) => (i.id === intent.id ? { ...i, status: "done" } : i)),
      );
    } else {
      setIntents((q) =>
        q.map((i) => (i.id === intent.id ? { ...i, status: "blocked" } : i)),
      );
      setMood("thinking");
      setTimeout(() => setMood("idle"), 1200);
    }
  }, [unit, governor, listening, runPrimitive]);

  const onReset = useCallback(async () => {
    await clearClaimedUnit();
    router.replace("/onboarding");
  }, [router]);

  if (!unit || !governor) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Loading unit…</Text>
      </SafeAreaView>
    );
  }

  const primitives = getAvailablePrimitives(unit.bodyTypeSlug, unit.motionPrimitives);
  const bodyLabel = `${unit.bodyTypeSlug} · ${unit.tierSlug}`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>EXOBOD</Text>
        <Text style={styles.serial}>{unit.serialNumber}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ExpressiveFace mood={mood} />

        <View style={styles.estopRow}>
          <EStopButton active={governor.estopActive} onPress={onEstopPress} />
          <View style={styles.estopHint}>
            <Text style={styles.estopHintTitle}>Always visible</Text>
            <Text style={styles.estopHintText}>
              Tap to {governor.estopActive ? "reset" : "halt"} all motion
            </Text>
            {lastMotion && <Text style={styles.lastMotion}>{lastMotion}</Text>}
          </View>
        </View>

        <VoiceMicButton listening={listening} onPress={onVoicePress} intents={intents} />

        <MotionPrimitiveButtons
          primitives={primitives}
          disabled={governor.estopActive || !governor.bleConnected}
          onRun={runPrimitive}
        />

        <SafetyGovernorPanel
          state={governor}
          limits={unit.safetyLimits}
          bodyTypeLabel={bodyLabel}
        />

        <SkillPackDisplay
          packs={unit.skillPacks}
          firmwareVersion={unit.firmwareVersion}
          serial={unit.serialNumber}
        />

        {motionLog.length > 0 && (
          <View style={styles.logBox}>
            <Text style={styles.logTitle}>Motion log (stub)</Text>
            {motionLog.map((line, i) => (
              <Text key={i} style={styles.logLine}>
                {line}
              </Text>
            ))}
          </View>
        )}

        <Pressable style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetText}>Unclaim unit (dev)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brand: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    color: colors.accent,
  },
  serial: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: "monospace",
  },
  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  estopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  estopHint: {
    flex: 1,
    gap: 4,
  },
  estopHintTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMain,
  },
  estopHintText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  lastMotion: {
    fontSize: 10,
    color: colors.accentSoft,
    fontFamily: "monospace",
    marginTop: 4,
  },
  logBox: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 4,
  },
  logTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  logLine: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: "monospace",
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resetText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
