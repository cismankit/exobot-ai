import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import { claimUnit } from "@/lib/api";
import { saveClaimedUnit } from "@/lib/storage";

const DEMO_SERIALS = ["EXB-2026-0001", "EXB-2026-0002", "EXB-2026-0003", "EXB-2026-0004"];

export default function OnboardingScreen() {
  const router = useRouter();
  const [serial, setSerial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleClaim = useCallback(
    async (serialInput: string) => {
      setError(null);
      setLoading(true);
      try {
        const unit = await claimUnit(serialInput.trim().toUpperCase());
        await saveClaimedUnit(unit);
        router.replace("/ble-pairing");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Claim failed");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const onBarcode = useCallback(
    ({ data }: { data: string }) => {
      const match = data.match(/EXB-\d{4}-\d{4}/i);
      if (match) {
        setScanMode(false);
        setSerial(match[0].toUpperCase());
        void handleClaim(match[0]);
      }
    },
    [handleClaim],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Claim your Exobod unit</Text>
      <Text style={styles.sub}>
        Scan the QR on your packaging or enter serial EXB-YYYY-NNNN
      </Text>

      {scanMode && Platform.OS !== "web" ? (
        <View style={styles.scannerWrap}>
          {!permission?.granted ? (
            <Pressable style={styles.primaryBtn} onPress={requestPermission}>
              <Text style={styles.primaryBtnText}>Allow camera for QR scan</Text>
            </Pressable>
          ) : (
            <CameraView
              style={styles.scanner}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={onBarcode}
            />
          )}
          <Pressable style={styles.linkBtn} onPress={() => setScanMode(false)}>
            <Text style={styles.linkText}>Enter serial manually</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="EXB-2026-0001"
            placeholderTextColor={colors.textMuted}
            value={serial}
            onChangeText={setSerial}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            disabled={loading || !serial.trim()}
            onPress={() => handleClaim(serial)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Claim unit</Text>
            )}
          </Pressable>

          {Platform.OS !== "web" && (
            <Pressable style={styles.secondaryBtn} onPress={() => setScanMode(true)}>
              <Text style={styles.secondaryBtnText}>Scan QR code</Text>
            </Pressable>
          )}
        </>
      )}

      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Demo serials (dev)</Text>
        {DEMO_SERIALS.map((s) => (
          <Pressable key={s} onPress={() => setSerial(s)} style={styles.demoChip}>
            <Text style={styles.demoChipText}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textMain,
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textMain,
    fontFamily: "monospace",
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
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
  btnDisabled: {
    opacity: 0.6,
  },
  scannerWrap: {
    gap: 12,
  },
  scanner: {
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
  },
  linkBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: colors.accentSoft,
    fontSize: 14,
  },
  demoBox: {
    marginTop: "auto",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    gap: 8,
  },
  demoTitle: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  demoChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.surfaceSoft,
  },
  demoChipText: {
    fontSize: 12,
    color: colors.accentSoft,
    fontFamily: "monospace",
  },
});
