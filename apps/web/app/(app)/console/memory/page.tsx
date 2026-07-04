"use client";

/** Memory — browse the persona's real facts + episodes (core's sqlite,
 * read through the API), search, delete facts. */

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button, Card, CardTitle, Input, cn } from "@exobod/ui";
import { api } from "@/lib/api";

export default function MemoryPage() {
  const qc = useQueryClient();
  const personas = useQuery({
    queryKey: ["personas"],
    queryFn: () => api.personas(),
  });
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (personas.data?.length && !personaId) {
      const def = personas.data.find((p) => p.is_default) ?? personas.data[0]!;
      setPersonaId(def.id);
    }
  }, [personas.data, personaId]);

  const facts = useQuery({
    queryKey: ["facts", personaId, q],
    queryFn: () => api.facts(personaId!, q || undefined),
    enabled: Boolean(personaId),
  });
  const episodes = useQuery({
    queryKey: ["episodes", personaId, q],
    queryFn: () => api.episodes(personaId!, q || undefined),
    enabled: Boolean(personaId),
  });

  const deleteFact = useMutation({
    mutationFn: (key: string) => api.deleteFact(personaId!, key),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["facts"] }),
  });

  if (personas.data && personas.data.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="display text-2xl">Memory</h1>
        <Card className="mt-6">
          <p className="text-sm text-muted">
            Memory is per persona. Create a persona and talk to it in the Live
            Console — durable facts get extracted automatically and land here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-2xl">Memory</h1>
          <p className="mt-1 text-sm text-muted">
            One memory across every mind — facts extracted from episodes.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Persona"
            value={personaId ?? ""}
            onChange={(e) => setPersonaId(e.target.value)}
            className="h-10 rounded-lg border border-line bg-surface-2 px-3 text-sm"
          >
            {personas.data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search memory…"
            className="w-56"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Facts ({facts.data?.facts.length ?? "…"})</CardTitle>
          <div className="console-scroll mt-3 max-h-[420px] space-y-2 overflow-y-auto">
            {facts.data?.facts.length === 0 && (
              <p className="text-sm text-muted">
                nothing durable yet — tell it your name in the Live Console
              </p>
            )}
            {facts.data?.facts.map((f) => (
              <div
                key={f.key}
                className="flex items-start justify-between gap-3 rounded-md border border-line px-3 py-2"
              >
                <div className="telemetry min-w-0 text-[12.5px]">
                  <p className="truncate text-signal">{f.key}</p>
                  <p className="break-words text-fg">{f.value}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 text-danger"
                  onClick={() => deleteFact.mutate(f.key)}
                  aria-label={`forget ${f.key}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>
            Episodes ({episodes.data?.episodes.length ?? "…"})
          </CardTitle>
          <div className="console-scroll mt-3 max-h-[420px] space-y-2 overflow-y-auto">
            {episodes.data?.episodes.length === 0 && (
              <p className="text-sm text-muted">
                no conversations recorded for this persona yet
              </p>
            )}
            {episodes.data?.episodes.map((e, i) => (
              <div
                key={`${e.ts}-${i}`}
                className="rounded-md border border-line px-3 py-2"
              >
                <p className="telemetry text-[11px] text-muted">
                  {new Date(e.ts * 1000).toLocaleString()} ·{" "}
                  <span className={cn(e.model !== "mock" && "text-signal")}>
                    {e.model}
                  </span>
                </p>
                <p className="mt-1 text-[13px]">› {e.stimulus}</p>
                <p className="mt-0.5 break-words text-[13px] text-muted">
                  {e.response}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
