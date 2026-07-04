"""
Voice pipeline — wake word -> STT -> orchestrator -> TTS.

All three stages are optional and independently detected at runtime:
  wake : openwakeword  ("hey jarvis" model ships with the package)
  stt  : faster-whisper (tiny/base int8 — realtime on Pi5/phone-class CPU)
  tts  : piper-tts      (local neural voices, ~50MB)

Install on the device:
  pip install openwakeword faster-whisper piper-tts sounddevice numpy

If a stage is missing the pipeline degrades: no wake word -> push-to-talk;
no STT -> typed input; no TTS -> printed speech. The system always runs.
"""

import asyncio
import queue
import sys


class Capability:
    def __init__(self):
        self.wake = self._try("openwakeword")
        self.stt = self._try("faster_whisper")
        self.tts = self._try("piper")
        self.audio = self._try("sounddevice")

    @staticmethod
    def _try(mod: str) -> bool:
        try:
            __import__(mod)
            return True
        except ImportError:
            return False

    def summary(self) -> str:
        f = lambda b: "yes" if b else "no "  # noqa: E731
        return (f"voice caps  wake:{f(self.wake)} stt:{f(self.stt)} "
                f"tts:{f(self.tts)} audio:{f(self.audio)}")


class VoicePipeline:
    SAMPLE_RATE = 16000

    def __init__(self):
        self.caps = Capability()
        self._stt_model = None
        self._piper_voice = None

    # ---------------- STT ------------------------------------------------
    def _load_stt(self):
        if self._stt_model is None:
            from faster_whisper import WhisperModel
            self._stt_model = WhisperModel("base.en", device="cpu",
                                           compute_type="int8")
        return self._stt_model

    async def transcribe(self, wav_f32_mono) -> str:
        model = await asyncio.to_thread(self._load_stt)
        segments, _ = await asyncio.to_thread(
            model.transcribe, wav_f32_mono, beam_size=1, language="en")
        return " ".join(s.text.strip() for s in segments).strip()

    # ---------------- TTS ------------------------------------------------
    def _load_tts(self):
        if self._piper_voice is None:
            from piper import PiperVoice
            self._piper_voice = PiperVoice.load("en_US-lessac-medium")
        return self._piper_voice

    async def say(self, text: str):
        if not text:
            return
        if not (self.caps.tts and self.caps.audio):
            print(f"🗣  {text}")
            return
        import numpy as np
        import sounddevice as sd
        voice = await asyncio.to_thread(self._load_tts)
        chunks = [np.frombuffer(c, dtype=np.int16)
                  for c in voice.synthesize_stream_raw(text)]
        audio = np.concatenate(chunks) if chunks else np.zeros(1, np.int16)
        await asyncio.to_thread(sd.play, audio, voice.config.sample_rate,
                                blocking=True)

    # ---------------- listen loop ----------------------------------------
    async def listen_utterance(self, seconds: float = 5.0):
        """Record one utterance from the default mic; returns float32 mono."""
        import numpy as np
        import sounddevice as sd
        frames = int(self.SAMPLE_RATE * seconds)
        buf = await asyncio.to_thread(
            sd.rec, frames, self.SAMPLE_RATE, 1, "float32", blocking=True)
        return np.squeeze(buf)

    async def wait_for_wake(self):
        """Block until wake word. Falls back to Enter-key push-to-talk."""
        if not (self.caps.wake and self.caps.audio):
            await asyncio.to_thread(input, "[push-to-talk: press Enter] ")
            return
        import numpy as np
        import sounddevice as sd
        from openwakeword.model import Model
        oww = Model(inference_framework="onnx")
        q: queue.Queue = queue.Queue()

        def cb(indata, frames, t, status):
            q.put(bytes(indata))

        with sd.RawInputStream(samplerate=self.SAMPLE_RATE, blocksize=1280,
                               dtype="int16", channels=1, callback=cb):
            while True:
                chunk = np.frombuffer(await asyncio.to_thread(q.get),
                                      dtype=np.int16)
                scores = oww.predict(chunk)
                if any(v > 0.6 for v in scores.values()):
                    return
