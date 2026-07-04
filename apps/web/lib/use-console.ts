"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnswerMsg,
  ClientMsg,
  PoseMsg,
  ServerMsg,
  TaskType,
} from "@exobod/sdk";
import { consoleWsUrl } from "./api";

export interface LogEntry {
  id: number;
  kind: "stimulus" | "speech" | "intent" | "ack" | "system" | "error";
  text: string;
  danger?: boolean;
}

export interface ConsoleState {
  connected: boolean;
  linkLabel: string;
  personaName: string;
  availableProviders: string[];
  thinking: string[]; // minds currently lit up
  pose: { pan: number; tilt: number };
  estop: boolean;
  vbat: number | null;
  clampPulse: number; // increments on every clamped ack → UI flashes amber
  /** last executed gesture ack from the body ("wave", "point", "nod",
   * "shake") with a counter so repeats retrigger the animation */
  gesture: { name: string; n: number };
  /** last drive command the body accepted (already clamped by ReflexCore) */
  drive: { vx: number; wz: number };
  lastModel: string | null;
  lastLatencyMs: number | null;
  taskType: TaskType;
  log: LogEntry[];
  busy: boolean;
}

const initial: ConsoleState = {
  connected: false,
  linkLabel: "—",
  personaName: "Exo",
  availableProviders: [],
  thinking: [],
  pose: { pan: 0, tilt: 0 },
  estop: false,
  vbat: null,
  clampPulse: 0,
  gesture: { name: "", n: 0 },
  drive: { vx: 0, wz: 0 },
  lastModel: null,
  lastLatencyMs: null,
  taskType: "conversation",
  log: [],
  busy: false,
};

let logId = 0;

function describeIntent(a: AnswerMsg): LogEntry[] {
  const out: LogEntry[] = [];
  a.intents.forEach((it, i) => {
    const ack = a.body_acks[i];
    const params = JSON.stringify(it.params);
    let ackTxt = "no body link";
    let danger = false;
    if (ack) {
      const pose = ack.pose ? ` pose={pan:${ack.pose.pan},tilt:${ack.pose.tilt}}` : "";
      ackTxt = ack.executed
        ? `✓ ${ack.reason}${pose}`
        : `✗ ${ack.reason}`;
      danger =
        !ack.executed || ack.reason === "clamped" || Boolean(ack.estop);
    }
    out.push({
      id: ++logId,
      kind: "intent",
      text: `${it.action}${params} → ${ackTxt}`,
      danger,
    });
  });
  return out;
}

export function useConsole(sessionId: string, authed: boolean) {
  const [state, setState] = useState<ConsoleState>(initial);
  const wsRef = useRef<WebSocket | null>(null);
  const aliveRef = useRef(true);

  const push = useCallback((entries: LogEntry[]) => {
    setState((s) => ({ ...s, log: [...s.log.slice(-199), ...entries] }));
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    let retry = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function connect() {
      if (!aliveRef.current) return;
      const url = await consoleWsUrl(sessionId, authed);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 0;
      };

      ws.onmessage = (ev) => {
        let msg: ServerMsg;
        try {
          msg = JSON.parse(ev.data as string) as ServerMsg;
        } catch {
          return;
        }
        switch (msg.type) {
          case "hello":
            setState((s) => ({
              ...s,
              connected: true,
              linkLabel: msg.link,
              personaName: msg.persona,
              availableProviders: msg.providers,
              pose: msg.pose
                ? { pan: msg.pose.pan, tilt: msg.pose.tilt }
                : s.pose,
              estop: msg.pose?.estop ?? s.estop,
              vbat: msg.pose?.vbat ?? s.vbat,
            }));
            push([
              {
                id: ++logId,
                kind: "system",
                text: `link up · body=${msg.link} · persona=${msg.persona}`,
              },
            ]);
            break;
          case "thinking":
            setState((s) => ({ ...s, thinking: msg.providers, busy: true }));
            break;
          case "answer": {
            const a = msg;
            setState((s) => {
              const clamped = a.body_acks.some(
                (k) => k.reason === "clamped",
              );
              // gestures/drive come back as executed acks from ReflexCore —
              // the scene animates only what the body actually accepted
              const gestureAck = a.body_acks.find(
                (k) => k.executed && k.reason.startsWith("gesture:"),
              );
              const driveAck = a.body_acks.find(
                (k) => k.executed && k.reason === "driving" && k.drive,
              );
              return {
                ...s,
                thinking: [],
                busy: false,
                lastModel: a.model,
                lastLatencyMs: a.latency_ms,
                clampPulse: clamped ? s.clampPulse + 1 : s.clampPulse,
                gesture: gestureAck
                  ? {
                      name: gestureAck.reason.slice("gesture:".length),
                      n: s.gesture.n + 1,
                    }
                  : s.gesture,
                drive: driveAck?.drive ?? s.drive,
              };
            });
            const entries: LogEntry[] = [];
            if (a.speech)
              entries.push({ id: ++logId, kind: "speech", text: a.speech });
            entries.push(...describeIntent(a));
            push(entries);
            break;
          }
          case "pose": {
            const p: PoseMsg = msg;
            setState((s) => ({
              ...s,
              pose: { pan: p.pan, tilt: p.tilt },
              estop: p.estop,
              vbat: p.vbat ?? s.vbat,
            }));
            break;
          }
          case "task_set":
            setState((s) => ({ ...s, taskType: msg.task_type }));
            break;
          case "error":
            setState((s) => ({ ...s, busy: false, thinking: [] }));
            push([{ id: ++logId, kind: "error", text: msg.detail, danger: true }]);
            break;
        }
      };

      ws.onclose = () => {
        setState((s) => ({ ...s, connected: false }));
        if (aliveRef.current) {
          retry += 1;
          timer = setTimeout(connect, Math.min(1000 * 2 ** retry, 10_000));
        }
      };
    }

    void connect();
    return () => {
      aliveRef.current = false;
      if (timer) clearTimeout(timer);
      wsRef.current?.close();
    };
  }, [sessionId, authed, push]);

  const send = useCallback((msg: ClientMsg) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }, []);

  const sendStimulus = useCallback(
    (text: string, taskType?: TaskType) => {
      const t = text.trim();
      if (!t) return;
      push([{ id: ++logId, kind: "stimulus", text: t }]);
      send({ type: "stimulus", text: t, task_type: taskType });
    },
    [send, push],
  );

  const sendEstop = useCallback(() => {
    push([
      { id: ++logId, kind: "system", text: "ESTOP sent", danger: true },
    ]);
    send({ type: "estop" });
  }, [send, push]);

  const setTask = useCallback(
    (taskType: TaskType) => {
      setState((s) => ({ ...s, taskType }));
      send({ type: "set_task", task_type: taskType });
    },
    [send],
  );

  return { state, sendStimulus, sendEstop, setTask };
}
