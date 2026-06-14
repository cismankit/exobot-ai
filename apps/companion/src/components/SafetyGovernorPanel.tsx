import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import {
  effectiveMaxSpeedDeg,
  type SafetyGovernorState,
  type SafetyLimits,
} from "@/lib/safety-governor";

interface SafetyGovernorPanelProps {
  state: SafetyGovernorState;
  limits: SafetyLimits;
  bodyTypeLabel: string;
}

export function SafetyGovernorPanel({ state, limits, bodyTypeLabel }: SafetyGovernorPanelProps) {
  const effectiveDeg = effectiveMaxSpeedDeg(limits, state.speedCapPct);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Safety Governor</Text>
      <Text style={styles.subtitle}>{bodyTypeLabel}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Speed cap</Text>
        <Text style={styles.value}>{state.speedCapPct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${state.speedCapPct}%` }]} />
      </View>
      <Text style={styles.hint}>
        Max joint speed: {effectiveDeg.toFixed(0)}°/s (limit {limits.maxJointSpeedDegPerSec}°/s)
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Payload limit</Text>
        <Text style={styles.value}>{limits.maxPayloadGrams}g</Text>
      </View>

      <View style={styles.statusGrid}>
        <StatusChip label="BLE" ok={state.bleConnected} />
        <StatusChip label="E-STOP" ok={!state.estopActive} okLabel="Clear" failLabel="Active" />
        {state.geofenceEnabled && <StatusChip label="Geofence" ok={true} okLabel="On" />}
      </View>
    </View>
  );
}

function StatusChip({
  label,
  ok,
  okLabel = "OK",
  failLabel = "Fail",
}: {
  label: string;
  ok: boolean;
  okLabel?: string;
  failLabel?: string;
}) {
  return (
    <View style={[styles.chip, ok ? styles.chipOk : styles.chipFail]}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{ok ? okLabel : failLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMain,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
  value: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accentSoft,
    fontFamily: "monospace",
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSoft,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  hint: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipOk: {
    borderColor: "rgba(74,222,128,0.35)",
    backgroundColor: "rgba(74,222,128,0.08)",
  },
  chipFail: {
    borderColor: "rgba(239,68,68,0.35)",
    backgroundColor: "rgba(239,68,68,0.08)",
  },
  chipLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipValue: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMain,
  },
});
