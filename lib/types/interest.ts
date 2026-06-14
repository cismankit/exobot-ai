export type InterestBodyType =
  | "Walker"
  | "Desk Assistant"
  | "Rover"
  | "Utility Helper"
  | "Not Sure";

export type InterestUseCase =
  | "Personal"
  | "Education"
  | "Creator"
  | "Business Demo"
  | "Research"
  | "Accessibility"
  | "Other";

export type InterestBudget =
  | "Under $250"
  | "$250-$500"
  | "$500-$1000"
  | "$1000+"
  | "Not Sure";

export interface InterestPayload {
  name: string;
  email: string;
  phone?: string;
  bodyType: InterestBodyType;
  useCase: InterestUseCase;
  budget: InterestBudget;
  message?: string;
  /** Present when submitted from the configurator summary */
  configurationSummary?: string;
  configurationId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  affiliateRef?: string;
  referrer?: string;
  sourcePage?: string;
}

