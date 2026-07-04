"use client";

/** Minds (BYOK) — enable backends, paste keys (write-only, masked back),
 * pick model ids, test availability, and reorder routing per task type.
 * Routes written here are the routes the orchestrator actually walks. */

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from "lucide-react";
import { Badge, Button, Card, CardTitle, Input, cn } from "@exobod/ui";
import type { ProviderName, RoutesOut, TaskType } from "@exobod/sdk";
import { TASK_TYPES } from "@exobod/sdk";
import { api } from "@/lib/api";

export default function MindsPage() {
  const qc = useQueryClient();
  const providers = useQuery({
    queryKey: ["providers"],
    queryFn: () => api.providers(),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="display text-2xl">Minds</h1>
      <p className="mt-1 text-sm text-muted">
        Bring your own keys. Encrypted at rest, shown only masked, never
        logged. With zero keys the local + mock chain keeps the body alive.
      </p>

      <div className="mt-6 grid gap-3">
        {providers.data?.map((p) => (
          <ProviderRow
            key={p.provider}
            provider={p.provider}
            enabled={p.enabled}
            hasKey={p.has_key}
            masked={p.key_masked}
            modelId={p.model_id}
            needsKey={p.needs_key}
            onSaved={() => void qc.invalidateQueries({ queryKey: ["providers"] })}
          />
        ))}
      </div>

      <RoutingEditor />
    </div>
  );
}

function ProviderRow(props: {
  provider: ProviderName;
  enabled: boolean;
  hasKey: boolean;
  masked: string | null;
  modelId: string | null;
  needsKey: boolean;
  onSaved: () => void;
}) {
  const [key, setKey] = useState("");
  const [model, setModel] = useState(props.modelId ?? "");
  const [test, setTest] = useState<null | boolean>(null);

  const save = useMutation({
    mutationFn: (body: Parameters<typeof api.saveProvider>[0]) =>
      api.saveProvider(body),
    onSuccess: () => {
      setKey("");
      props.onSaved();
    },
  });

  async function runTest() {
    setTest(null);
    const r = await api.testProvider(props.provider);
    setTest(r.available);
  }

  return (
    <Card className="grid items-center gap-3 md:grid-cols-[110px_1fr_1fr_auto]">
      <div>
        <p className="display text-lg">{props.provider}</p>
        <Badge tone={props.enabled ? "signal" : "muted"} className="mt-1">
          {props.enabled ? "enabled" : "off"}
        </Badge>
      </div>

      <div>
        <CardTitle className="mb-1.5">
          {props.needsKey ? "API key (write-only)" : "no key needed"}
        </CardTitle>
        {props.needsKey ? (
          <Input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={props.hasKey ? (props.masked ?? "stored") : "paste key"}
            autoComplete="off"
          />
        ) : (
          <p className="telemetry text-[12px] text-muted">
            {props.provider === "ollama"
              ? "local — detected via OLLAMA_HOST on the API"
              : "deterministic offline mind"}
          </p>
        )}
      </div>

      <div>
        <CardTitle className="mb-1.5">model id</CardTitle>
        <Input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="provider default"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() =>
            save.mutate({
              provider: props.provider,
              enabled: true,
              ...(key ? { api_key: key } : {}),
              model_id: model || null,
            })
          }
          disabled={save.isPending}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            save.mutate({ provider: props.provider, enabled: !props.enabled })
          }
        >
          {props.enabled ? "Disable" : "Enable"}
        </Button>
        <Button size="sm" variant="ghost" onClick={runTest}>
          Test
        </Button>
        {test === true && <CheckCircle2 className="h-4 w-4 text-signal" />}
        {test === false && <XCircle className="h-4 w-4 text-danger" />}
      </div>
    </Card>
  );
}

function RoutingEditor() {
  const qc = useQueryClient();
  const routesQ = useQuery({
    queryKey: ["routes"],
    queryFn: () => api.routes(),
  });
  const [routes, setRoutes] = useState<RoutesOut["routes"] | null>(null);
  useEffect(() => {
    if (routesQ.data && !routes) setRoutes(routesQ.data.routes);
  }, [routesQ.data, routes]);

  const save = useMutation({
    mutationFn: (r: RoutesOut["routes"]) => api.saveRoutes(r),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["routes"] }),
  });

  if (!routes) return null;

  function move(task: TaskType, i: number, dir: -1 | 1) {
    setRoutes((prev) => {
      if (!prev) return prev;
      const chain = [...(prev[task] ?? [])];
      const j = i + dir;
      if (j < 0 || j >= chain.length) return prev;
      const a = chain[i]!;
      chain[i] = chain[j]!;
      chain[j] = a;
      return { ...prev, [task]: chain };
    });
  }

  return (
    <div className="mt-10">
      <h2 className="display text-xl">Routing</h2>
      <p className="mt-1 text-sm text-muted">
        Priority per task type — first available mind wins; consensus fans out
        to every listed mind and arbitrates.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {TASK_TYPES.map((task) => (
          <Card key={task}>
            <CardTitle>{task}</CardTitle>
            <ol className="mt-3 space-y-1.5">
              {(routes[task] ?? []).map((p, i) => (
                <li
                  key={p}
                  className="telemetry flex items-center justify-between rounded-md border border-line px-3 py-1.5 text-[12.5px]"
                >
                  <span
                    className={cn(i === 0 && task !== "consensus" && "text-signal")}
                  >
                    {i + 1}. {p}
                  </span>
                  <span className="flex gap-1">
                    <button
                      aria-label={`move ${p} up`}
                      onClick={() => move(task, i, -1)}
                      className="rounded p-1 text-muted hover:text-fg"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label={`move ${p} down`}
                      onClick={() => move(task, i, 1)}
                      className="rounded p-1 text-muted hover:text-fg"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
      <Button
        className="mt-4"
        onClick={() => save.mutate(routes)}
        disabled={save.isPending}
      >
        {save.isPending ? "writing routes…" : "Save routing"}
      </Button>
      {save.isSuccess && (
        <span className="telemetry ml-3 text-[12px] text-signal">
          routes live — next stimulus uses them
        </span>
      )}
    </div>
  );
}
