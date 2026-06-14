import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { VoiceIntent } from "@/lib/types";

interface VoiceMicButtonProps {
  listening: boolean;
  onPress: () => void;
  intents: VoiceIntent[];
}

export function VoiceMicButton({ listening, onPress, intents }: VoiceMicButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.micBtn,
          listening && styles.micBtnActive,
          pressed && styles.micBtnPressed,
        ]}
        accessibilityLabel={listening ? "Stop listening" : "Start voice command"}
      >
        <Text style={styles.micIcon}>{listening ? "◼" : "🎤"}</Text>
        <Text style={styles.micLabel}>{listening ? "Listening…" : "Voice"}</Text>
      </Pressable>

      {intents.length > 0 && (
        <View style={styles.queue}>
          <Text style={styles.queueTitle}>Intent queue</Text>
          {intents.slice(0, 4).map((intent) => (
            <View key={intent.id} style={styles.intentRow}>
              <Text style={styles.intentTranscript} numberOfLines={1}>
                "{intent.transcript}"
              </Text>
              <Text style={styles.intentMeta}>
                → {intent.intent} · {intent.status}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  micBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14,
  },
  micBtnActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(255,122,26,0.12)",
  },
  micBtnPressed: {
    opacity: 0.85,
  },
  micIcon: {
    fontSize: 18,
  },
  micLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMain,
  },
  queue: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    gap: 6,
  },
  queueTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  intentRow: {
    gap: 2,
  },
  intentTranscript: {
    fontSize: 12,
    color: colors.textMain,
    fontStyle: "italic",
  },
  intentMeta: {
    fontSize: 10,
    color: colors.accentSoft,
    fontFamily: "monospace",
  },
});
