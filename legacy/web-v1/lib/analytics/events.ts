export type AnalyticsEvent =
  | "config_started"
  | "option_changed"
  | "incompatible_blocked"
  | "form_submitted"
  | "config_saved"
  | "preset_applied"
  | "mode_changed"
  | "compare_saved"
  | "preview_3d_toggled";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;
