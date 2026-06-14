import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { BleConnectionState } from "@/lib/types";

const TROUBLESHOOTING = [
  "Enable Bluetooth in system settings",
  "Keep phone within 2m of the MCU module",
  "Power-cycle the unit — hold rear button 5s",
  "Confirm firmware ≥ 0.2.0 on unit label",
  "Revoke and re-grant Bluetooth permission",
  "Try USB-C debug cable if BLE fails repeatedly",
];

interface BlePairingPanelProps {
  state: BleConnectionState;
  deviceName: string;
  onScan: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function BlePairingPanel({
  state,
  deviceName,
  onScan,
  onConnect,
  onDisconnect,
}: BlePairingPanelProps) {
  const statusColor =
    state === "connected"
      ? colors.success
      : state === "error"
        ? colors.danger
        : colors.warning;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>BLE Pairing</Text>
        <Text style={styles.subtitle}>Connect handset to onboard MCU (stub)</Text>

        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{state.toUpperCase()}</Text>
        </View>

        <Text style={styles.deviceLabel}>Target device</Text>
        <Text style={styles.deviceName}>{deviceName}</Text>

        <View style={styles.actions}>
          {state === "disconnected" || state === "error" ? (
            <Pressable style={styles.primaryBtn} onPress={onScan}>
              <Text style={styles.primaryBtnText}>Scan for device</Text>
            </Pressable>
          ) : null}

          {state === "scanning" ? (
            <Pressable style={styles.primaryBtn} onPress={onConnect}>
              <Text style={styles.primaryBtnText}>Connect</Text>
            </Pressable>
          ) : null}

          {state === "connected" ? (
            <Pressable style={styles.secondaryBtn} onPress={onDisconnect}>
              <Text style={styles.secondaryBtnText}>Disconnect</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.troubleTitle}>Troubleshooting</Text>
        {TROUBLESHOOTING.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepNum}>{i + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMain,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMain,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  deviceLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accentSoft,
    fontFamily: "monospace",
  },
  actions: {
    marginTop: 8,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryBtnText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  troubleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceSoft,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
    overflow: "hidden",
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
