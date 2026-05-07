"use client";

import type { BodyTypeSlug } from "@/lib/content";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type EmbodimentCtx = {
  body: BodyTypeSlug;
  setBody: (slug: BodyTypeSlug) => void;
};

const EmbodimentContext = createContext<EmbodimentCtx | null>(null);

export function EmbodimentProvider({ children }: { children: ReactNode }) {
  const [body, setBody] = useState<BodyTypeSlug>("walker");
  const value = useMemo(() => ({ body, setBody }), [body]);
  return <EmbodimentContext.Provider value={value}>{children}</EmbodimentContext.Provider>;
}

export function useEmbodiment(): EmbodimentCtx {
  const ctx = useContext(EmbodimentContext);
  if (!ctx) {
    throw new Error("useEmbodiment must be used within EmbodimentProvider");
  }
  return ctx;
}

/** For visuals that may render outside provider (defaults to walker). */
export function useEmbodimentBody(): BodyTypeSlug {
  return useContext(EmbodimentContext)?.body ?? "walker";
}
