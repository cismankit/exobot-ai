"use client";

/**
 * The embedded live console — landing section 5 AND the read-only demo.
 * Talks to /ws/console on mock+sim with no auth. This is the proof that
 * the product is real: the visitor's words become intents, the body
 * clamps what it must, and estop latches.
 */

import { useId, useRef, useState } from "react";
import { Button, Input, cn } from "@exobod/ui";
import { OctagonX, SendHorizonal } from "lucide-react";
import { useConsole } from "@/lib/use-console";
import { HeadScene } from "@/components/head-scene";
import { IntentLog, MindsRow, PoseReadout } from "./telemetry";

const SUGGESTIONS = [
  "look left",
  "wave hello",
  "nod if you agree",
  "whip your head around fast",
  "emergency stop",
];

export function MiniConsole({ sessionId }: { sessionId: string }) {
  const { state, sendStimulus, sendEstop } = useConsole(sessionId, false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function submit(t: string) {
    if (t.trim().toLowerCase().includes("emergency stop")) {
      // still send it as a stimulus — the model emits the estop intent
      // and the BODY latches; that's the story.
    }
    sendStimulus(t);
    setText("");
    inputRef.current?.focus();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-surface",
          state.estop ? "border-danger/60 shadow-danger" : "border-line",
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
          className="h-[320px] w-full sm:h-[380px]"
        />
        <div className="absolute left-4 top-4">
          <MindsRow
            available={state.availableProviders}
            thinking={state.thinking}
          />
        </div>
        {state.estop && (
          <p className="telemetry absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-widest text-danger">
            estopped — only a physical button hold releases the body
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <PoseReadout state={state} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line bg-surface p-4">
          <IntentLog log={state.log} className="min-h-[120px] flex-1 sm:max-h-[190px]" />
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit(text);
            }}
          >
            <label htmlFor={inputId} className="sr-only">
              Say something to the body
            </label>
            <Input
              id={inputId}
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='try "look left"'
              disabled={!state.connected}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="md"
              disabled={!state.connected || !text.trim()}
              aria-label="Send"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={sendEstop}
              disabled={!state.connected}
              aria-label="Emergency stop"
              title="Emergency stop"
            >
              <OctagonX className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                disabled={!state.connected}
                className="telemetry rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
