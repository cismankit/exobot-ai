import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { MotionPrimitive } from "@/lib/motion-primitives";

interface MotionPrimitiveButtonsProps {
  primitives: MotionPrimitive[];
  disabled: boolean;
  onRun: (primitive: MotionPrimitive) => void;
}

export function MotionPrimitiveButtons({
  primitives,
  disabled,
  onRun,
}: MotionPrimitiveButtonsProps) {
  const actionable = primitives.filter((p) => p.id !== "estop");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motion Primitives</Text>
      <View style={styles.grid}>
        {actionable.map((p) => (
          <Pressable
            key={p.id}
            disabled={disabled}
            onPress={() => onRun(p)}
            style={({ pressed }) => [
              styles.btn,
              disabled && styles.btnDisabled,
              pressed && !disabled && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnLabel}>{p.label}</Text>
            <Text style={styles.btnHint}>{p.durationMs ? `${p.durationMs}ms` : "hold"}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMain,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    minWidth: "30%",
    flexGrow: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,122,26,0.25)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnPressed: {
    backgroundColor: "rgba(255,122,26,0.15)",
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accentSoft,
  },
  btnHint: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "monospace",
    marginTop: 2,
  },
});
