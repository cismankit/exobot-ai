import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

const BAR_COUNT = 9;
const BASE_HEIGHTS = [10, 16, 8, 20, 12, 18, 9, 22, 11];

interface ListeningWaveformProps {
  active: boolean;
  label?: string;
}

export function ListeningWaveform({ active, label = "LISTENING" }: ListeningWaveformProps) {
  const anims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.4)),
  ).current;

  useEffect(() => {
    if (!active) {
      anims.forEach((a) => a.setValue(0.25));
      return;
    }

    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 350 + i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.35,
            duration: 350 + i * 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [active, anims]);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {BASE_HEIGHTS.map((h, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height: h,
                transform: [{ scaleY: anims[i] }],
              },
            ]}
          />
        ))}
      </View>
      {active && <Animated.Text style={styles.label}>{label}</Animated.Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
    height: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(0,0,0,0.35)",
    minWidth: "90%",
  },
  bar: {
    width: 4,
    borderRadius: 1,
    backgroundColor: colors.accent,
  },
  label: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 2,
    color: colors.accentSoft,
    fontFamily: "monospace",
  },
});
