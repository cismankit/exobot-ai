import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { CompanionSkillPack } from "@/lib/types";

interface SkillPackDisplayProps {
  packs: CompanionSkillPack[];
  firmwareVersion: string;
  serial: string;
}

export function SkillPackDisplay({ packs, firmwareVersion, serial }: SkillPackDisplayProps) {
  const unlocked = packs.filter((p) => p.unlocked);
  const locked = packs.filter((p) => !p.unlocked);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Skill Packs</Text>
      <Text style={styles.meta}>
        {serial} · fw {firmwareVersion}
      </Text>

      {unlocked.length === 0 ? (
        <Text style={styles.empty}>No skill packs unlocked for this tier.</Text>
      ) : (
        unlocked.map((pack) => (
          <View key={pack.id} style={[styles.packRow, styles.packUnlocked]}>
            <Text style={styles.packName}>{pack.name}</Text>
            <Text style={styles.packSkills}>{pack.skills.join(" · ")}</Text>
          </View>
        ))
      )}

      {locked.length > 0 && (
        <>
          <Text style={styles.lockedHeader}>Available upgrades</Text>
          {locked.map((pack) => (
            <View key={pack.id} style={[styles.packRow, styles.packLocked]}>
              <Text style={styles.packNameLocked}>{pack.name}</Text>
              <Text style={styles.lockBadge}>LOCKED</Text>
            </View>
          ))}
        </>
      )}
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
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMain,
  },
  meta: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  empty: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  packRow: {
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  },
  packUnlocked: {
    borderColor: "rgba(255,122,26,0.35)",
    backgroundColor: "rgba(255,122,26,0.06)",
  },
  packLocked: {
    borderColor: colors.line,
    backgroundColor: colors.surfaceSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accentSoft,
  },
  packSkills: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  lockedHeader: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  packNameLocked: {
    fontSize: 12,
    color: colors.textMuted,
  },
  lockBadge: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1,
  },
});
