import type { ProductConfiguration } from "@/lib/catalog/types";

export interface SavedConfigPayload {
  configId: string;
  email: string;
  config: ProductConfiguration;
  summary: string;
  savedAt: string;
}

export interface SavedConfigRecord extends SavedConfigPayload {
  id: string;
}
