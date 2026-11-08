// expo-speech-recognition requires a custom dev client — it throws at
// import time in Expo Go (and has no effect on web, where it falls back to
// the Web Speech API automatically). Loading it defensively means the app
// never hard-crashes just because this one optional feature isn't
// available in the runtime it's opened in.
type SpeechRecognitionModuleType = typeof import('expo-speech-recognition').ExpoSpeechRecognitionModule;
type UseSpeechRecognitionEvent = typeof import('expo-speech-recognition').useSpeechRecognitionEvent;

let loaded: { module: SpeechRecognitionModuleType; useEvent: UseSpeechRecognitionEvent } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('expo-speech-recognition');
  loaded = { module: mod.ExpoSpeechRecognitionModule, useEvent: mod.useSpeechRecognitionEvent };
} catch {
  loaded = null;
}

export const isSpeechRecognitionAvailable = loaded !== null;
export const SpeechRecognitionModule = loaded?.module ?? null;

// Always a real hook (never conditionally called) — a no-op when the
// native module isn't available, so call sites don't need to branch.
export const useSpeechRecognitionEvent: UseSpeechRecognitionEvent = loaded?.useEvent ?? (() => {});
