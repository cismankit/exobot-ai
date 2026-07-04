"use client";

/** Persona editor — the identity schema from core's persona_state.py,
 * with a live voice preview that runs a REAL orchestrator turn. */

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardTitle, Input, Textarea, cn } from "@exobod/ui";
import type { Identity, PersonaOut } from "@exobod/sdk";
import { api } from "@/lib/api";

const BLANK: Identity = {
  name: "Exo",
  disposition:
    "Warm, observant, quietly playful. A phone that finally has a body.",
  values: ["honesty over flattery", "curiosity about the physical world"],
  voice: "Concise, grounded, occasionally wry.",
  hard_rules: [
    "Never claim to be a specific AI model.",
    "Never emit motor commands directly — only intents.",
  ],
  boot_greeting: "Body link up. Feels good to have joints.",
  version: "1.0",
};

export default function PersonaPage() {
  const qc = useQueryClient();
  const personas = useQuery({
    queryKey: ["personas"],
    queryFn: () => api.personas(),
  });
  const [selected, setSelected] = useState<PersonaOut | "new" | null>(null);
  const [draft, setDraft] = useState<Identity>(BLANK);
  const [isDefault, setIsDefault] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewBusy, setPreviewBusy] = useState(false);

  useEffect(() => {
    if (personas.data && selected === null) {
      const def =
        personas.data.find((p) => p.is_default) ?? personas.data[0] ?? "new";
      setSelected(def);
    }
  }, [personas.data, selected]);

  useEffect(() => {
    if (selected && selected !== "new") {
      setDraft(selected.identity);
      setIsDefault(selected.is_default);
    } else if (selected === "new") {
      setDraft(BLANK);
      setIsDefault(!personas.data?.length);
    }
    setPreview(null);
  }, [selected, personas.data]);

  const save = useMutation({
    mutationFn: async () => {
      const body = { name: draft.name, identity: draft, is_default: isDefault };
      if (selected && selected !== "new")
        return api.updatePersona(selected.id, body);
      return api.createPersona(body);
    },
    onSuccess: (p) => {
      void qc.invalidateQueries({ queryKey: ["personas"] });
      setSelected(p);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deletePersona(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["personas"] });
      setSelected("new");
    },
  });

  async function runPreview() {
    setPreviewBusy(true);
    setPreview(null);
    try {
      const r = await api.previewPersona(
        draft,
        "Someone just walked into the room. Say hello.",
      );
      setPreview(
        `${r.speech || "(no speech)"}\n— answered by ${r.model} in ${r.latency_ms}ms` +
          (r.intents.length
            ? `\nintents: ${r.intents.map((i) => i.action).join(", ")}`
            : ""),
      );
    } catch (e) {
      setPreview(`preview failed: ${e instanceof Error ? e.message : e}`);
    } finally {
      setPreviewBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[220px_1fr]">
      <div>
        <h1 className="display text-2xl">Persona</h1>
        <div className="mt-4 space-y-1.5">
          {personas.data?.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                selected !== "new" && selected?.id === p.id
                  ? "border-signal bg-signal-dim text-signal"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              {p.name}
              {p.is_default && <Badge tone="signal">default</Badge>}
            </button>
          ))}
          <button
            onClick={() => setSelected("new")}
            className={cn(
              "flex w-full items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm",
              selected === "new"
                ? "border-signal text-signal"
                : "border-line text-muted hover:text-fg",
            )}
          >
            <Plus className="h-4 w-4" /> New persona
          </button>
        </div>
      </div>

      <Card>
        <div className="grid gap-4">
          <Field label="Name">
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="Disposition">
            <Textarea
              rows={2}
              value={draft.disposition}
              onChange={(e) =>
                setDraft({ ...draft, disposition: e.target.value })
              }
            />
          </Field>
          <Field label="Values (one per line)">
            <Textarea
              rows={3}
              value={draft.values.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  values: e.target.value.split("\n").filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Voice">
            <Textarea
              rows={2}
              value={draft.voice}
              onChange={(e) => setDraft({ ...draft, voice: e.target.value })}
            />
          </Field>
          <Field label="Hard rules (one per line)">
            <Textarea
              rows={3}
              value={draft.hard_rules.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hard_rules: e.target.value.split("\n").filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Boot greeting">
            <Input
              value={draft.boot_greeting}
              onChange={(e) =>
                setDraft({ ...draft, boot_greeting: e.target.value })
              }
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-[#3df5a0]"
            />
            Default persona (drives new console sessions)
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => save.mutate()} disabled={save.isPending || !draft.name.trim()}>
              {save.isPending
                ? "saving…"
                : selected === "new"
                  ? "Create persona"
                  : "Save changes"}
            </Button>
            <Button
              variant="outline"
              onClick={runPreview}
              disabled={previewBusy}
            >
              {previewBusy ? "asking…" : "Voice preview"}
            </Button>
            {selected && selected !== "new" && (
              <Button
                variant="ghost"
                className="text-danger"
                onClick={() => remove.mutate(selected.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          {save.isError && (
            <p className="text-sm text-danger">
              save failed: {(save.error as Error).message}
            </p>
          )}
          {preview && (
            <div className="rounded-lg border border-signal/40 bg-signal-dim p-4">
              <p className="telemetry whitespace-pre-wrap text-[13px] text-fg">
                {preview}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <CardTitle className="mb-2">{label}</CardTitle>
      {children}
    </div>
  );
}
