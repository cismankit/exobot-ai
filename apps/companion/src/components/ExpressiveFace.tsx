import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { FaceMood } from "@/lib/types";
import { ListeningWaveform } from "./ListeningWaveform";

interface ExpressiveFaceProps {
  mood: FaceMood;
}

export function ExpressiveFace({ mood }: ExpressiveFaceProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulse]);

  useEffect(() => {
    if (mood === "estop") return;

    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2800 + Math.random() * 2000),
        Animated.timing(blink, { toValue: 0.08, duration: 80, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]),
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, [mood, blink]);

  const isListening = mood === "listening";
  const isEstop = mood === "estop";
  const mouthOpen = mood === "speaking" || mood === "listening";

  return (
    <View style={styles.wrapper}>
      <View style={[styles.phoneFrame, isEstop && styles.phoneFrameEstop]}>
        <View style={styles.phoneHeader}>
          <Text style={styles.phoneHeaderText}>PHONE CORE</Text>
          <Text style={styles.phoneHeaderLink}>LINK</Text>
        </View>

        <View style={styles.screen}>
          <View style={[styles.facePlate, isEstop && styles.facePlateEstop]}>
            <View style={styles.eyesRow}>
              <Animated.View
                style={[
                  styles.eye,
                  { transform: [{ scaleY: blink }] },
                  isEstop && styles.eyeEstop,
                ]}
              />
              <Animated.View
                style={[
                  styles.eye,
                  { transform: [{ scaleY: blink }] },
                  isEstop && styles.eyeEstop,
                ]}
              />
            </View>

            <View style={[styles.mouth, mouthOpen && styles.mouthOpen, isEstop && styles.mouthEstop]} />

            <Animated.View
              style={[
                styles.coreOrb,
                { transform: [{ scale: pulse }] },
                isEstop && styles.coreOrbEstop,
              ]}
            />

            <Text style={styles.coreLabel}>AI core</Text>
          </View>

          <ListeningWaveform active={isListening} label="LISTENING" />

          <Text style={styles.caption}>
            {isEstop
              ? "Motion halted — reset E-STOP to continue"
              : isListening
                ? "Voice + vision on handset"
                : "Ready for commands"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: 8,
  },
  phoneFrame: {
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#070a0f",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 32,
    elevation: 12,
  },
  phoneFrameEstop: {
    borderColor: colors.danger,
  },
  phoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  phoneHeaderText: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: "monospace",
  },
  phoneHeaderLink: {
    fontSize: 9,
    color: colors.accent,
    fontFamily: "monospace",
  },
  screen: {
    aspectRatio: 10 / 19,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#0d1219",
  },
  facePlate: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,122,26,0.4)",
    backgroundColor: "rgba(255,122,26,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  facePlateEstop: {
    borderColor: colors.danger,
    backgroundColor: "rgba(239,68,68,0.12)",
  },
  eyesRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 10,
    zIndex: 2,
  },
  eye: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.textMain,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  eyeEstop: {
    backgroundColor: colors.danger,
  },
  mouth: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentSoft,
    marginBottom: 8,
    zIndex: 2,
  },
  mouthOpen: {
    height: 12,
    borderRadius: 6,
  },
  mouthEstop: {
    backgroundColor: colors.danger,
    width: 20,
    height: 3,
  },
  coreOrb: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    opacity: 0.35,
  },
  coreOrbEstop: {
    backgroundColor: colors.danger,
    opacity: 0.25,
  },
  coreLabel: {
    position: "absolute",
    bottom: 8,
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: colors.accentSoft,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  caption: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: "monospace",
    lineHeight: 14,
  },
});
