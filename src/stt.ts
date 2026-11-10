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

// iPhone: while the mic is on, iOS puts audio in "play and record" mode, and the speech library's default
// "measurement" mode plays everything noticeably quieter — which then stuck for the rest of the lesson (user,
// 2026-11-10: "once I hit the voice recording question the voice volume changes"). Record in the normal mode with
// the loudspeaker, and hand the session back to plain playback as soon as recording ends.
type SetCategoryOptions = Parameters<SpeechRecognitionModuleType['setCategoryIOS']>[0];
export const RECORDING_SESSION_IOS: SetCategoryOptions = {
  category: 'playAndRecord',
  categoryOptions: ['defaultToSpeaker', 'allowBluetooth'],
  mode: 'default',
};

export function restorePlaybackAudio() {
  if (!loaded) return;
  try {
    loaded.module.setCategoryIOS({ category: 'playback', categoryOptions: [], mode: 'default' });
  } catch {
    // not iOS, or the session is busy — playback still works, just possibly quieter
  }
}
