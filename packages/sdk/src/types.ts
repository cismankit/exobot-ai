/** Wire types for the Exobod API.
 *
 * REST bodies mirror apps/api pydantic models; WS messages mirror
 * apps/api/ws.py. `AnswerMsg` is Orchestrator.handle() verbatim —
 * safety fields are never reshaped between python and here.
 * Regenerate the raw OpenAPI schema with `pnpm --filter @exobod/sdk generate`.
 */

export type TaskType =
  | "conversation"
  | "reasoning"
  | "planning"
  | "code"
  | "perception"
  | "consensus";

export const TASK_TYPES: TaskType[] = [
  "conversation",
  "reasoning",
  "planning",
  "code",
  "perception",
  "consensus",
];

export type ProviderName =
  | "claude"
  | "openai"
  | "glm"
  | "deepseek"
  | "ollama"
  | "mock";

// ---- core result shapes (verbatim from packages/core) ------------------- //

export interface IntentWire {
  action: string;
  params: Record<string, unknown>;
  src: string;
  conf: number;
}

export interface BodyAck {
  t?: "ack";
  executed: boolean;
  reason: string;
  pose?: { pan: number; tilt: number };
  drive?: { vx: number; wz: number };
  vbat?: number;
  estop?: boolean;
  seq?: number;
}

export interface HandleResult {
  model: string;
  latency_ms: number;
  speech: string;
  intents: IntentWire[];
  body_acks: BodyAck[];
}

// ---- WS protocol --------------------------------------------------------- //

export interface HelloMsg {
  type: "hello";
  session_id: string;
  link: "sim" | "device";
  persona: string;
  providers: string[];
  pose: PoseMsg | null;
}

export interface ThinkingMsg {
  type: "thinking";
  task_type: TaskType;
  providers: string[];
}

export interface AnswerMsg extends HandleResult {
  type: "answer";
}

export interface PoseMsg {
  type: "pose";
  pan: number;
  tilt: number;
  estop: boolean;
  vbat: number | null;
}

export interface ErrorMsg {
  type: "error";
  detail: string;
}

export interface TaskSetMsg {
  type: "task_set";
  task_type: TaskType;
}

export type ServerMsg =
  | HelloMsg
  | ThinkingMsg
  | AnswerMsg
  | PoseMsg
  | ErrorMsg
  | TaskSetMsg;

export type ClientMsg =
  | { type: "stimulus"; text: string; task_type?: TaskType }
  | { type: "estop" }
  | { type: "set_task"; task_type: TaskType };

// ---- REST ---------------------------------------------------------------- //

export interface WaitlistOut {
  position: number;
  already_joined: boolean;
}

export interface CheckoutOut {
  checkout_url: string;
  order_id: string;
}

export interface MeOut {
  id: string;
  email: string;
  persona_count: number;
  device_count: number;
  orders: { id: string; status: string; tier: string; created_at: string }[];
}

export interface ProviderOut {
  provider: ProviderName;
  enabled: boolean;
  has_key: boolean;
  key_masked: string | null;
  model_id: string | null;
  needs_key: boolean;
}

export interface Identity {
  name: string;
  disposition: string;
  values: string[];
  voice: string;
  hard_rules: string[];
  boot_greeting: string;
  version: string;
}

export interface PersonaOut {
  id: string;
  name: string;
  identity: Identity;
  is_default: boolean;
}

export interface DeviceOut {
  id: string;
  name: string;
  pairing_code: string;
  status: "pairing" | "online" | "offline";
  fw_version: string | null;
  last_pose: { pan: number; tilt: number } | null;
  last_vbat: number | null;
  estopped: boolean;
  last_seen_at: string | null;
  online: boolean;
}

export interface FactRow {
  key: string;
  value: string;
  updated: number;
}

export interface EpisodeRow {
  ts: number;
  stimulus: string;
  response: string;
  model: string;
}

export interface RoutesOut {
  routes: Record<TaskType, ProviderName[]>;
}
