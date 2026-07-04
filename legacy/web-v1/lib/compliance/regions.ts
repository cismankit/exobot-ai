/** Regional compliance targets — phased certification matrix (stub). */

export type ComplianceRegion = "US" | "EU" | "UK";

export type CertificationTarget =
  | "FCC Part 15"
  | "CE marking (EMC/LVD)"
  | "UKCA"
  | "RoHS"
  | "WEEE"
  | "UK WEEE"
  | "GDPR"
  | "UK GDPR";

export type CompliancePhase = "planned" | "in_review" | "certified" | "not_applicable";

export interface RegionalComplianceProfile {
  region: ComplianceRegion;
  label: string;
  shippingCountries: string[];
  certificationTargets: {
    target: CertificationTarget;
    phase: CompliancePhase;
    notes?: string;
  }[];
  voiceDataResidency: "local_first_default" | "cloud_optional";
  minSupervisionDefault: "adult_required" | "lab_supervised" | "institutional";
}

export const REGIONAL_COMPLIANCE: Record<ComplianceRegion, RegionalComplianceProfile> = {
  US: {
    region: "US",
    label: "United States",
    shippingCountries: ["US", "PR"],
    certificationTargets: [
      { target: "FCC Part 15", phase: "planned", notes: "Intentional radiator review for BLE/Wi‑Fi modules." },
      { target: "RoHS", phase: "not_applicable", notes: "US RoHS varies by state; BOM tracked separately." },
    ],
    voiceDataResidency: "local_first_default",
    minSupervisionDefault: "lab_supervised",
  },
  EU: {
    region: "EU",
    label: "European Union",
    shippingCountries: [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
    ],
    certificationTargets: [
      { target: "CE marking (EMC/LVD)", phase: "planned" },
      { target: "RoHS", phase: "in_review" },
      { target: "WEEE", phase: "planned" },
      { target: "GDPR", phase: "in_review", notes: "Voice/camera local-first defaults documented in privacy policy." },
    ],
    voiceDataResidency: "local_first_default",
    minSupervisionDefault: "institutional",
  },
  UK: {
    region: "UK",
    label: "United Kingdom",
    shippingCountries: ["GB", "IM", "JE", "GG"],
    certificationTargets: [
      { target: "UKCA", phase: "planned", notes: "Post-Brexit conformity assessment path TBD per SKU." },
      { target: "RoHS", phase: "in_review" },
      { target: "UK WEEE", phase: "planned" },
      { target: "UK GDPR", phase: "in_review" },
    ],
    voiceDataResidency: "local_first_default",
    minSupervisionDefault: "institutional",
  },
};

const COUNTRY_TO_REGION = new Map<string, ComplianceRegion>();
for (const profile of Object.values(REGIONAL_COMPLIANCE)) {
  for (const code of profile.shippingCountries) {
    COUNTRY_TO_REGION.set(code.toUpperCase(), profile.region);
  }
}

export function resolveRegionForCountry(countryCode: string): ComplianceRegion | null {
  return COUNTRY_TO_REGION.get(countryCode.trim().toUpperCase()) ?? null;
}

export function getRegionalProfile(region: ComplianceRegion): RegionalComplianceProfile {
  return REGIONAL_COMPLIANCE[region];
}

export function listComplianceRegions(): RegionalComplianceProfile[] {
  return Object.values(REGIONAL_COMPLIANCE);
}
