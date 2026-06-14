import type { ProductConfiguration } from "@/lib/catalog/types";

export type UseCasePreset = {
  id: string;
  label: string;
  description: string;
  config: Partial<ProductConfiguration>;
};

export const useCasePresets: UseCasePreset[] = [
  {
    id: "stem-classroom",
    label: "STEM Classroom",
    description: "Desk base, education pack, sensor mount — curriculum-safe defaults.",
    config: {
      phoneModelId: "phone-universal-v1",
      bodyArchetypeId: "body-desk-assistant",
      finishId: "finish-white-studio",
      skillPackId: "pack-education",
      accessoryId: "acc-sensor-mount",
      tierId: "tier-prototype-shell",
    },
  },
  {
    id: "creator-studio",
    label: "Creator Studio",
    description: "Desk assistant with creator pack and camera rig for repeatable shots.",
    config: {
      phoneModelId: "phone-iphone-15-pro",
      bodyArchetypeId: "body-desk-assistant",
      finishId: "finish-stealth-black",
      skillPackId: "pack-creator",
      accessoryId: "acc-camera-rig",
      tierId: "tier-prototype-shell",
    },
  },
  {
    id: "lab-walker",
    label: "Lab Walker",
    description: "Walker chassis with utility pack for lab gait and payload experiments.",
    config: {
      phoneModelId: "phone-android-generic",
      bodyArchetypeId: "body-walker",
      finishId: "finish-silver-lab",
      skillPackId: "pack-utility",
      accessoryId: "acc-tray-hand",
      tierId: "tier-moving-prototype",
    },
  },
];
