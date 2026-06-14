import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

interface EStopButtonProps {
  active: boolean;
  onPress: () => void;
}

export function EStopButton({ active, onPress }: EStopButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && styles.buttonActive,
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Emergency stop"
      accessibilityHint="Immediately halts all robot motion"
    >
      <View style={styles.innerRing}>
        <Text style={styles.label}>E-STOP</Text>
        {active && <Text style={styles.sub}>ACTIVE</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.danger,
    borderWidth: 4,
    borderColor: "#fca5a5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: colors.dangerDark,
    borderColor: "#fecaca",
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  innerRing: {
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sub: {
    color: "#fecaca",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },
});
