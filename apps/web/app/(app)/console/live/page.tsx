"use client";

/**
 * Live Console — the hero of the product.
 * Left: stimulus input + task selector + persistent ESTOP.
 * Center: the 3D head mirroring REAL pose from ReflexCore acks.
 * Right: mono telemetry + streaming intent log + federation activity.
 */

import { useEffect, useRef, useState } from "react";
import { OctagonX, SendHorizonal } from "lucide-react";
import { Button, Card, CardTitle, Textarea, cn } from "@exobod/ui";
import { TASK_TYPES, type TaskType } from "@exobod/sdk";
import { useConsole } from "@/lib/use-console";
import { HeadScene } from "@/components/head-scene";
import {
  IntentLog,
  MindsRow,
  PoseReadout,
} from "@/components/console/telemetry";

function sessionIdFor(): string {
  // sticky per browser tab so reconnects reattach to the same body
  const key = "exobod-live-session";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `live-${Math.random().toString(36).slice(2, 12)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function LiveConsole() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => setSessionId(sessionIdFor()), []);
  if (!sessionId) return null;
  return <LiveInner sessionId={sessionId} />;
}

function LiveInner({ sessionId }: { sessionId: string }) {
  const { state, sendStimulus, sendEstop, setTask } = useConsole(
    sessionId,
    true,
  );
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // keyboard: Cmd/Ctrl+Enter sends, Esc = estop (always reachable)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        sendEstop();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sendEstop]);

  function submit() {
    if (!text.trim()) return;
    sendStimulus(text);
    setText("");
    inputRef.current?.focus();
  }

  return (
    <div className="grid h-[calc(100vh-3rem)] grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_320px]">
      {/* left — stimulus + task + ESTOP */}
      <div className="flex flex-col gap-4">
        <Card className="flex-1">
          <CardTitle>Stimulus</CardTitle>
          <label htmlFor="stimulus" className="sr-only">
            Say something to the body
          </label>
          <Textarea
            id="stimulus"
            ref={inputRef}
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={`speak to ${state.personaName} — "look left", "nod if you agree"…`}
            className="mt-3"
            disabled={!state.connected}
          />
          <Button
            className="mt-3 w-full"
            onClick={submit}
            disabled={!state.connected || !text.trim() || state.busy}
          >
            <SendHorizonal className="h-4 w-4" />
            {state.busy ? "federation thinking…" : "Send"}
          </Button>

          <CardTitle className="mt-6">Task type</CardTitle>
          <div className="mt-3 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Task type">
            {TASK_TYPES.map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={state.taskType === t}
                onClick={() => setTask(t as TaskType)}
                className={cn(
                  "telemetry rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                  state.taskType === t
                    ? "border-signal bg-signal-dim text-signal"
                    : "border-line text-muted hover:border-signal/50 hover:text-fg",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <button
          onClick={sendEstop}
          disabled={!state.connected}
          className="flex h-16 items-center justify-center gap-3 rounded-xl border-2 border-danger bg-danger-dim font-mono text-sm font-bold uppercase tracking-[0.2em] text-danger transition-all hover:bg-danger hover:text-bg hover:shadow-danger focus-visible:outline-danger disabled:opacity-40"
          aria-label="Emergency stop (Esc)"
        >
          <OctagonX className="h-6 w-6" />
          estop <span className="text-[10px] opacity-70">(esc)</span>
        </button>
      </div>

      {/* center — the body */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-surface",
          state.estop
            ? "border-danger/70 shadow-danger"
            : state.connected
              ? "border-signal/30"
              : "border-line",
        )}
      >
        <HeadScene
          pan={state.pose.pan}
          tilt={state.pose.tilt}
          estop={state.estop}
          clampPulse={state.clampPulse}
          thinking={state.busy}
          gesture={state.gesture}
          drive={state.drive}
          className="h-full min-h-[420px] w-full"
        />
        <div className="absolute left-4 top-4">
          <MindsRow
            available={state.availableProviders}
            thinking={state.thinking}
          />
        </div>
        {state.estop && (
          <div className="absolute inset-x-0 bottom-0 border-t border-danger/50 bg-danger-dim p-3 text-center">
            <p className="telemetry text-xs font-semibold uppercase tracking-widest text-danger">
              estop latched — motion locked · physical button hold to release
            </p>
          </div>
        )}
      </div>

      {/* right — telemetry */}
      <div className="flex min-h-0 flex-col gap-4">
        <Card>
          <CardTitle>Telemetry</CardTitle>
          <div className="mt-3">
            <PoseReadout state={state} />
          </div>
        </Card>
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardTitle>Intent stream</CardTitle>
          <IntentLog log={state.log} className="mt-3 flex-1" />
        </Card>
      </div>
    </div>
  );
}
