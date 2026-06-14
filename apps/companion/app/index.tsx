import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { colors } from "@/theme/colors";
import { isBlePaired, loadClaimedUnit } from "@/lib/storage";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const [hasUnit, setHasUnit] = useState(false);
  const [blePaired, setBlePaired] = useState(false);

  useEffect(() => {
    (async () => {
      const unit = await loadClaimedUnit();
      const paired = await isBlePaired();
      setHasUnit(!!unit);
      setBlePaired(paired);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!hasUnit) {
    return <Redirect href="/onboarding" />;
  }

  if (!blePaired) {
    return <Redirect href="/ble-pairing" />;
  }

  return <Redirect href="/face" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
