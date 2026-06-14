"use client";

import dynamic from "next/dynamic";
import { ConfigSaveForm } from "@/components/config-save-form";
import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { trackEvent } from "@/lib/analytics";
import {
  getOutOfScopeWarnings,
  validateConfiguration,
} from "@/lib/catalog/compatibility";
import { calculateLeadTimeBand } from "@/lib/catalog/lead-time";
import { calculatePriceBand } from "@/lib/catalog/pricing";
import {
  defaultConfigurationIds,
  getBodyArchetypeBySlug,
  getConfiguratorCatalog,
} from "@/lib/catalog/products";
import type { BodyArchetypeSlug, ProductConfiguration } from "@/lib/catalog/types";
import { generateConfigId } from "@/lib/config/id";
import { useCasePresets } from "@/lib/config/presets";
import {
  bodyArchetypeIdToInterestSlug,
  buildSummary,
  configFromSearchParams,
  configToSearchParams,
  loadConfigFromLocalStorage,
  saveConfigToLocalStorage,
} from "@/lib/config/state";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Configurator3D = dynamic(
  () => import("@/components/configurator-3d").then((m) => ({ default: m.Configurator3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-line/60 bg-background/50 text-xs text-text-muted">
        Loading 3D preview…
      </div>
    ),
  },
);

const catalog = getConfiguratorCatalog();

type UiMode = "expert" | "wizard";
type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

const WIZARD_SETTERS = [
  "phoneModelId",
  "bodyArchetypeId",
  "finishId",
  "skillPackId",
  "accessoryId",
  "tierId",
] as const satisfies readonly (keyof ProductConfiguration)[];

const WIZARD_LABELS = [
  "Handset model",
  "Body architecture",
  "Finish / color system",
  "Skill pack",
  "Accessory",
  "Prototype tier",
] as const;

function initialBodyArchetypeId(searchType: string | null): string {
  if (searchType) {
    const body = getBodyArchetypeBySlug(searchType as BodyArchetypeSlug);
    if (body) return body.id;
  }
  return defaultConfigurationIds.bodyArchetypeId;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function Configurator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const startedRef = useRef(false);

  const bodyOverrideId = typeParam
    ? getBodyArchetypeBySlug(typeParam as BodyArchetypeSlug)?.id ?? null
    : null;

  const [phoneModelId, setPhoneModelId] = useState(defaultConfigurationIds.phoneModelId);
  const [bodyArchetypeId, setBodyArchetypeId] = useState(() =>
    initialBodyArchetypeId(typeParam),
  );
  const [finishId, setFinishId] = useState(defaultConfigurationIds.finishId);
  const [skillPackId, setSkillPackId] = useState(defaultConfigurationIds.skillPackId);
  const [accessoryId, setAccessoryId] = useState(defaultConfigurationIds.accessoryId);
  const [tierId, setTierId] = useState(defaultConfigurationIds.tierId);

  const [configId, setConfigId] = useState<string | null>(() =>
    configFromSearchParams(new URLSearchParams(searchParams.toString())).configId,
  );
  const [uiMode, setUiMode] = useState<UiMode>("expert");
  const [wizardStep, setWizardStep] = useState<WizardStep>(0);
  const [compareA, setCompareA] = useState<ProductConfiguration | null>(null);
  const [compareB, setCompareB] = useState<ProductConfiguration | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [show3DPreview, setShow3DPreview] = useState(false);

  const config = useMemo(
    (): ProductConfiguration => ({
      phoneModelId,
      bodyArchetypeId,
      finishId,
      skillPackId,
      accessoryId,
      tierId,
    }),
    [phoneModelId, bodyArchetypeId, finishId, skillPackId, accessoryId, tierId],
  );

  useEffect(() => {
    const { config: fromUrl, configId: urlCfg } = configFromSearchParams(
      new URLSearchParams(searchParams.toString()),
      bodyOverrideId,
    );
    setPhoneModelId(fromUrl.phoneModelId);
    setBodyArchetypeId(fromUrl.bodyArchetypeId);
    setFinishId(fromUrl.finishId);
    setSkillPackId(fromUrl.skillPackId);
    setAccessoryId(fromUrl.accessoryId);
    setTierId(fromUrl.tierId);
    if (urlCfg) setConfigId(urlCfg);
  }, [searchParams, bodyOverrideId]);

  // localStorage fallback when URL has no config params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const hasConfigParams = ["phone", "body", "style", "pack", "accessory", "tier"].some(
      (k) => params.has(k),
    );
    if (hasConfigParams) return;
    const stored = loadConfigFromLocalStorage();
    if (!stored) return;
    const c = bodyOverrideId
      ? { ...stored.config, bodyArchetypeId: bodyOverrideId }
      : stored.config;
    setPhoneModelId(c.phoneModelId);
    setBodyArchetypeId(c.bodyArchetypeId);
    setFinishId(c.finishId);
    setSkillPackId(c.skillPackId);
    setAccessoryId(c.accessoryId);
    setTierId(c.tierId);
    if (stored.configId) setConfigId(stored.configId);
  }, [searchParams, bodyOverrideId]);

  // Sync body when ?type= changes
  useEffect(() => {
    if (bodyOverrideId) setBodyArchetypeId(bodyOverrideId);
  }, [bodyOverrideId]);

  // URL + localStorage persistence
  useEffect(() => {
    const params = configToSearchParams(config, configId);
    if (typeParam) params.delete("body");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    saveConfigToLocalStorage(config, configId);
  }, [config, configId, pathname, router, typeParam]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("config_started", {
      configId: configId ?? undefined,
      source: typeParam ? `type:${typeParam}` : "direct",
    });
  }, [configId, typeParam]);

  const validation = useMemo(() => validateConfiguration(config), [config]);
  const outOfScope = useMemo(
    () => getOutOfScopeWarnings(bodyArchetypeId),
    [bodyArchetypeId],
  );
  const priceBand = useMemo(() => calculatePriceBand(config), [config]);
  const leadTime = useMemo(() => calculateLeadTimeBand(config), [config]);

  const summary = useMemo(
    () =>
      buildSummary(config, configId, {
        priceLabel: `${formatUsd(priceBand.lowUsd)} – ${formatUsd(priceBand.highUsd)}`,
        leadLabel: leadTime.label,
      }),
    [config, configId, priceBand, leadTime],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = configToSearchParams(config, configId);
    return `${window.location.origin}${pathname}?${params.toString()}`;
  }, [config, configId, pathname]);

  const ensureConfigId = useCallback(() => {
    if (configId) return configId;
    const id = generateConfigId();
    setConfigId(id);
    return id;
  }, [configId]);

  const applyField = useCallback(
    (field: keyof ProductConfiguration, value: string) => {
      setBlockedMessage(null);
      const next = { ...config, [field]: value };
      const test = validateConfiguration(next);

      if (test.blockedReasons.length > 0) {
        setBlockedMessage(test.blockedReasons[0]!);
        trackEvent("incompatible_blocked", {
          field,
          value,
          configId: configId ?? undefined,
        });
        return;
      }

      if (!configId) setConfigId(generateConfigId());

      switch (field) {
        case "phoneModelId":
          setPhoneModelId(value);
          break;
        case "bodyArchetypeId":
          setBodyArchetypeId(value);
          break;
        case "finishId":
          setFinishId(value);
          break;
        case "skillPackId":
          setSkillPackId(value);
          break;
        case "accessoryId":
          setAccessoryId(value);
          break;
        case "tierId":
          setTierId(value);
          break;
      }

      trackEvent("option_changed", { field, value, configId: configId ?? undefined });
    },
    [config, configId],
  );

  function applyPreset(presetId: string) {
    const preset = useCasePresets.find((p) => p.id === presetId);
    if (!preset) return;
    const next = { ...config, ...preset.config };
    const test = validateConfiguration(next);
    if (test.blockedReasons.length > 0) {
      setBlockedMessage(test.blockedReasons[0]!);
    }
    if (!configId) setConfigId(generateConfigId());
    setPhoneModelId(next.phoneModelId);
    setBodyArchetypeId(next.bodyArchetypeId);
    setFinishId(next.finishId);
    setSkillPackId(next.skillPackId);
    setAccessoryId(next.accessoryId);
    setTierId(next.tierId);
    trackEvent("preset_applied", { presetId, configId: configId ?? undefined });
  }

  function toggleMode(mode: UiMode) {
    setUiMode(mode);
    setWizardStep(0);
    trackEvent("mode_changed", { mode });
  }

  function saveCompareSlot(slot: "A" | "B") {
    if (slot === "A") setCompareA({ ...config });
    else setCompareB({ ...config });
    trackEvent("compare_saved", { slot });
    setShowCompare(true);
  }

  function loadCompareSlot(slot: "A" | "B") {
    const source = slot === "A" ? compareA : compareB;
    if (!source) return;
    if (!configId) setConfigId(generateConfigId());
    setPhoneModelId(source.phoneModelId);
    setBodyArchetypeId(source.bodyArchetypeId);
    setFinishId(source.finishId);
    setSkillPackId(source.skillPackId);
    setAccessoryId(source.accessoryId);
    setTierId(source.tierId);
  }

  async function downloadSpecSheet() {
    const id = ensureConfigId();
    const res = await fetch("/api/config/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configId: id, config, summary }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exobod-${id.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // ignore
    }
  }

  const defaultBodySlug = bodyArchetypeIdToInterestSlug(bodyArchetypeId);
  const showWizardPanel = uiMode === "wizard";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line/60 bg-surface/50 px-4 py-3">
        <div className="flex rounded-lg border border-line/70 p-0.5">
          <ModeToggle active={uiMode === "wizard"} onClick={() => toggleMode("wizard")}>
            Wizard
          </ModeToggle>
          <ModeToggle active={uiMode === "expert"} onClick={() => toggleMode("expert")}>
            Expert
          </ModeToggle>
        </div>
        <div className="hidden h-5 w-px bg-line/60 sm:block" />
        <div className="flex flex-wrap gap-2">
          {useCasePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="rounded-lg border border-line/70 bg-background/50 px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:border-accent/35 hover:text-text-main"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveCompareSlot("A")}
            className="rounded-lg border border-line/70 px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:border-accent/35 hover:text-text-main"
          >
            Save as A
          </button>
          <button
            type="button"
            onClick={() => saveCompareSlot("B")}
            className="rounded-lg border border-line/70 px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:border-accent/35 hover:text-text-main"
          >
            Save as B
          </button>
          {(compareA || compareB) && (
            <button
              type="button"
              onClick={() => setShowCompare((v) => !v)}
              className="rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-text-main"
            >
              {showCompare ? "Hide compare" : "Compare A/B"}
            </button>
          )}
        </div>
      </div>

      {showCompare && (compareA || compareB) ? (
        <ComparePanel compareA={compareA} compareB={compareB} onLoad={loadCompareSlot} />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <MotionReveal>
          <div className="space-y-5 rounded-2xl border border-line/70 bg-surface/75 p-5 shadow-panel backdrop-blur sm:p-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                Build desk
              </p>
              <h2 className="mt-2 text-xl font-semibold text-text-main sm:text-2xl">
                Lock the options we quote against
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Catalog v{catalog.version.version} — choices sync to the URL for shareable links and
                persist locally as backup. Tiers map to render studies, printed shells, articulated
                prototypes, or a scoped engineering consult.
              </p>
            </div>

            {blockedMessage ? (
              <p className="rounded-xl border border-warning/40 bg-warning/8 px-3 py-2 text-sm text-warning">
                {blockedMessage}
              </p>
            ) : null}

            <CompatibilityAlerts
              blockedReasons={validation.blockedReasons}
              errors={validation.errors}
              warnings={validation.warnings}
            />

            {outOfScope.length > 0 && <OutOfScopePanel warnings={outOfScope} />}

            <div className="space-y-4">
              {(!showWizardPanel || wizardStep === 0) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[0]}
                  options={catalog.phoneModels.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={phoneModelId}
                  onSelect={(id) => applyField("phoneModelId", id)}
                  isBlocked={(id) => isBlockedForField("phoneModelId", id, config)}
                />
              )}
              {(!showWizardPanel || wizardStep === 1) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[1]}
                  options={catalog.bodyArchetypes.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={bodyArchetypeId}
                  onSelect={(id) => applyField("bodyArchetypeId", id)}
                  isBlocked={(id) => isBlockedForField("bodyArchetypeId", id, config)}
                />
              )}
              {(!showWizardPanel || wizardStep === 2) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[2]}
                  options={catalog.finishes.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={finishId}
                  onSelect={(id) => applyField("finishId", id)}
                  isBlocked={(id) => isBlockedForField("finishId", id, config)}
                />
              )}
              {(!showWizardPanel || wizardStep === 3) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[3]}
                  options={catalog.skillPacks.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={skillPackId}
                  onSelect={(id) => applyField("skillPackId", id)}
                  isBlocked={(id) => isBlockedForField("skillPackId", id, config)}
                />
              )}
              {(!showWizardPanel || wizardStep === 4) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[4]}
                  options={catalog.accessories.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={accessoryId}
                  onSelect={(id) => applyField("accessoryId", id)}
                  isBlocked={(id) => isBlockedForField("accessoryId", id, config)}
                />
              )}
              {(!showWizardPanel || wizardStep === 5) && (
                <OptionFieldset
                  legend={WIZARD_LABELS[5]}
                  options={catalog.buildTiers.map((o) => ({ id: o.id, label: o.name }))}
                  activeId={tierId}
                  onSelect={(id) => applyField("tierId", id)}
                  isBlocked={(id) => isBlockedForField("tierId", id, config)}
                />
              )}
            </div>

            {showWizardPanel ? (
              <div className="flex items-center justify-between border-t border-line/60 pt-4">
                <button
                  type="button"
                  disabled={wizardStep === 0}
                  onClick={() => setWizardStep((s) => Math.max(0, s - 1) as WizardStep)}
                  className="rounded-lg border border-line/70 px-3 py-2 text-xs font-semibold text-text-muted disabled:opacity-40"
                >
                  Back
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Step {wizardStep + 1} / {WIZARD_SETTERS.length}
                </span>
                <button
                  type="button"
                  disabled={wizardStep >= WIZARD_SETTERS.length - 1}
                  onClick={() =>
                    setWizardStep(
                      (s) => Math.min(WIZARD_SETTERS.length - 1, s + 1) as WizardStep,
                    )
                  }
                  className="rounded-lg bg-accent/90 px-3 py-2 text-xs font-semibold text-background disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.04}>
          <div className="space-y-5 rounded-2xl border border-line/70 bg-surface-soft/70 p-5 shadow-panel backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  Live summary
                </p>
                <h3 className="mt-2 text-lg font-semibold text-text-main sm:text-xl">
                  Your Exobod configuration
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShow3DPreview((v) => {
                      const next = !v;
                      trackEvent("preview_3d_toggled", { enabled: next });
                      return next;
                    });
                  }}
                  className={[
                    "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                    show3DPreview
                      ? "border-accent/50 bg-accent/15 text-text-main"
                      : "border-line/70 text-text-muted hover:border-accent/35 hover:text-text-main",
                  ].join(" ")}
                  aria-pressed={show3DPreview}
                >
                  3D preview
                </button>
                {configId ? (
                  <span className="rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-accent-soft">
                    {configId}
                  </span>
                ) : (
                  <span className="rounded-md border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Select to assign ID
                  </span>
                )}
              </div>
            </div>

            {show3DPreview ? (
              <Configurator3D
                bodyArchetypeId={bodyArchetypeId}
                finishId={finishId}
                accessoryId={accessoryId}
                phoneModelId={phoneModelId}
              />
            ) : null}

            <div className="rounded-xl border border-line/60 bg-background/70 p-4 text-xs text-text-muted">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-accent">
                Indicative estimate
              </p>
              <p className="mt-1 text-lg font-semibold text-text-main">
                {formatUsd(priceBand.lowUsd)} – {formatUsd(priceBand.highUsd)}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed">{priceBand.disclaimer}</p>
              <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wide text-accent">
                Lead time band
              </p>
              <p className="mt-1 text-sm font-semibold text-text-main">{leadTime.label}</p>
              <p className="mt-1 text-[11px] leading-relaxed">{leadTime.disclaimer}</p>
            </div>

            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-line/60 bg-background/70 p-4 font-mono text-[11px] leading-relaxed text-text-muted sm:text-xs">
              {summary}
            </pre>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-lg border border-line/70 px-3 py-2 text-xs font-semibold text-text-muted hover:border-accent/35 hover:text-text-main"
              >
                {copyFeedback ? "Copied!" : "Copy share link"}
              </button>
              <button
                type="button"
                onClick={downloadSpecSheet}
                className="rounded-lg border border-line/70 px-3 py-2 text-xs font-semibold text-text-muted hover:border-accent/35 hover:text-text-main"
              >
                Download spec (.txt)
              </button>
              {configId ? (
                <a
                  href={`/customize/summary/${configId}`}
                  className="rounded-lg border border-line/70 px-3 py-2 text-xs font-semibold text-text-muted hover:border-accent/35 hover:text-text-main"
                >
                  Print summary
                </a>
              ) : null}
            </div>

            {configId ? (
              <ConfigSaveForm configId={configId} config={config} summary={summary} />
            ) : null}

            <div className="space-y-3 border-t border-line/60 pt-4">
              <p className="text-sm leading-relaxed text-text-muted">
                Submitting attaches this summary and configuration ID to your contact record so
                estimators can respond with clarifying questions or decline politely if the load case
                is out of scope.
              </p>
              <InterestForm
                defaultBodyType={defaultBodySlug}
                configurationSummary={summary}
                configurationId={configId}
                submitLabel="Send build request"
              />
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
}

function isBlockedForField(
  field: keyof ProductConfiguration,
  value: string,
  config: ProductConfiguration,
) {
  const test = validateConfiguration({ ...config, [field]: value });
  return test.blockedReasons.length > 0 && value !== config[field];
}

function OptionFieldset({
  legend,
  options,
  activeId,
  onSelect,
  isBlocked,
}: {
  legend: string;
  options: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  isBlocked: (id: string) => boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-text-main">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ChoiceChip
            key={option.id}
            active={activeId === option.id}
            disabled={isBlocked(option.id)}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </ChoiceChip>
        ))}
      </div>
    </fieldset>
  );
}

function ModeToggle({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md px-3 py-1.5 text-xs font-semibold transition",
        active ? "bg-accent/15 text-text-main" : "text-text-muted hover:text-text-main",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ComparePanel({
  compareA,
  compareB,
  onLoad,
}: {
  compareA: ProductConfiguration | null;
  compareB: ProductConfiguration | null;
  onLoad: (slot: "A" | "B") => void;
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-line/70 bg-surface/60 p-4 sm:grid-cols-2">
      <CompareSlot label="Config A" config={compareA} onLoad={() => onLoad("A")} />
      <CompareSlot label="Config B" config={compareB} onLoad={() => onLoad("B")} />
    </div>
  );
}

function CompareSlot({
  label,
  config,
  onLoad,
}: {
  label: string;
  config: ProductConfiguration | null;
  onLoad: () => void;
}) {
  if (!config) {
    return (
      <div className="rounded-xl border border-dashed border-line/60 p-4 text-sm text-text-muted">
        {label} — not saved yet
      </div>
    );
  }
  const text = buildSummary(config);
  return (
    <div className="space-y-2 rounded-xl border border-line/60 bg-background/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
        <button
          type="button"
          onClick={onLoad}
          className="text-xs font-semibold text-accent-soft hover:underline"
        >
          Load
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-text-muted">
        {text}
      </pre>
    </div>
  );
}

function CompatibilityAlerts({
  blockedReasons,
  errors,
  warnings,
}: {
  blockedReasons: string[];
  errors: string[];
  warnings: string[];
}) {
  if (blockedReasons.length === 0 && errors.length === 0 && warnings.length === 0) {
    return null;
  }
  return (
    <div className="space-y-2">
      {blockedReasons.map((msg) => (
        <Alert key={msg} tone="blocked" message={msg} />
      ))}
      {errors.map((msg) => (
        <Alert key={msg} tone="error" message={msg} />
      ))}
      {warnings.map((msg) => (
        <Alert key={msg} tone="warning" message={msg} />
      ))}
    </div>
  );
}

function OutOfScopePanel({ warnings }: { warnings: string[] }) {
  return (
    <div className="rounded-xl border border-line/60 bg-background/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        Out of scope for this body
      </p>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-text-muted">
        {warnings.map((w) => (
          <li key={w} className="flex gap-2">
            <span className="text-accent" aria-hidden>
              ·
            </span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Alert({
  tone,
  message,
}: {
  tone: "blocked" | "error" | "warning";
  message: string;
}) {
  const styles = {
    blocked: "border-red-500/50 bg-red-500/10 text-red-200",
    error: "border-red-400/40 bg-red-400/8 text-red-100",
    warning: "border-amber-500/50 bg-amber-500/10 text-amber-100",
  };
  const labels = { blocked: "Blocked", error: "Error", warning: "Warning" };
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3 py-2 text-sm leading-relaxed ${styles[tone]}`}
    >
      <span className="mr-2 font-mono text-[10px] font-semibold uppercase tracking-wide">
        {labels[tone]}
      </span>
      {message}
    </div>
  );
}

function ChoiceChip({
  children,
  active,
  disabled,
  onClick,
}: {
  children: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cnChip(active, disabled)}
    >
      {children}
    </button>
  );
}

function cnChip(active: boolean, disabled?: boolean) {
  return [
    "rounded-lg border px-3 py-2 text-left text-xs font-semibold transition sm:text-sm",
    disabled
      ? "cursor-not-allowed border-line/40 bg-background/30 text-text-muted/50 line-through"
      : active
        ? "border-accent/70 bg-accent/12 text-text-main shadow-[0_0_0_1px_rgba(255,122,26,0.15)]"
        : "border-line/70 bg-background/50 text-text-muted hover:border-accent/35 hover:text-text-main",
  ].join(" ");
}
