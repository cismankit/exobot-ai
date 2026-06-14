import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BlePairingPanel } from "@/components/BlePairingPanel";
import { colors } from "@/theme/colors";
import { loadClaimedUnit, setBlePaired } from "@/lib/storage";
import type { BleConnectionState, CompanionUnitProfile } from "@/lib/types";

export default function BlePairingScreen() {
  const router = useRouter();
  const [unit, setUnit] = useState<CompanionUnitProfile | null>(null);
  const [bleState, setBleState] = useState<BleConnectionState>("disconnected");

  useEffect(() => {
    loadClaimedUnit().then(setUnit);
  }, []);

  const deviceName = unit ? `Exobod-${unit.serialNumber.slice(-4)}` : "Exobod-????";

  const onScan = useCallback(() => {
    setBleState("scanning");
  }, []);

  const onConnect = useCallback(async () => {
    setBleState("connecting");
    // Stub: simulate BLE handshake delay
    await new Promise((r) => setTimeout(r, 1200));
    setBleState("connected");
    await setBlePaired(true);
  }, []);

  const onDisconnect = useCallback(async () => {
    setBleState("disconnected");
    await setBlePaired(false);
  }, []);

  const onContinue = useCallback(() => {
    router.replace("/face");
  }, [router]);

  return (
    <View style={styles.container}>
      <BlePairingPanel
        state={bleState}
        deviceName={deviceName}
        onScan={onScan}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />

      {bleState === "connected" && (
        <View style={styles.footer}>
          <Pressable style={styles.continueBtn} onPress={onContinue}>
            <Text style={styles.continueText}>Run connection test → Face UI</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  continueBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
