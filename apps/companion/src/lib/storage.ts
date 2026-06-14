import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CompanionUnitProfile } from "./types";

const UNIT_KEY = "exobod:claimed-unit";
const BLE_KEY = "exobod:ble-paired";

export async function loadClaimedUnit(): Promise<CompanionUnitProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(UNIT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CompanionUnitProfile;
  } catch {
    return null;
  }
}

export async function saveClaimedUnit(unit: CompanionUnitProfile): Promise<void> {
  await AsyncStorage.setItem(UNIT_KEY, JSON.stringify(unit));
}

export async function clearClaimedUnit(): Promise<void> {
  await AsyncStorage.removeItem(UNIT_KEY);
  await AsyncStorage.removeItem(BLE_KEY);
}

export async function isBlePaired(): Promise<boolean> {
  const val = await AsyncStorage.getItem(BLE_KEY);
  return val === "true";
}

export async function setBlePaired(paired: boolean): Promise<void> {
  await AsyncStorage.setItem(BLE_KEY, paired ? "true" : "false");
}
