import type { VoiceIntent } from "./types";

const STUB_INTENTS: Record<string, string> = {
  "wave hello": "wave",
  "say hello": "wave",
  "nod yes": "nod",
  "stop now": "estop",
  "emergency stop": "estop",
  "start patrol": "patrol",
};

let intentCounter = 0;

export function parseVoiceTranscript(transcript: string): string {
  const lower = transcript.toLowerCase().trim();

  for (const [phrase, intent] of Object.entries(STUB_INTENTS)) {
    if (lower.includes(phrase) || lower === intent) {
      return intent;
    }
  }

  if (lower.includes("wave")) return "wave";
  if (lower.includes("nod")) return "nod";
  if (lower.includes("stop")) return "estop";
  if (lower.includes("patrol")) return "patrol";

  return "unknown";
}

export function createVoiceIntent(transcript: string): VoiceIntent {
  intentCounter += 1;
  return {
    id: `intent-${Date.now()}-${intentCounter}`,
    transcript,
    intent: parseVoiceTranscript(transcript),
    status: "queued",
    createdAt: new Date().toISOString(),
  };
}

/** Stub STT — returns canned phrase based on tap count for demo */
export function stubSpeechToText(tapIndex: number): string {
  const phrases = [
    "Wave hello",
    "Nod yes",
    "Start patrol",
    "Stop now",
  ];
  return phrases[tapIndex % phrases.length];
}
