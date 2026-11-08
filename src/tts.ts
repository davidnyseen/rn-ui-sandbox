import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import thaiAudioMap from './generated/thaiAudioMap';
import thaiAudioMapMale from './generated/thaiAudioMapMale';

// Pregenerated Google Cloud Neural2 audio (see scripts/generateThaiAudio.js)
// sounds far more natural than the on-device TTS voice, and is used whenever
// available. Falls back to the on-device voice for any text not covered by
// the pregenerated set (e.g. content added since the last generation run).
let currentPlayer: AudioPlayer | null = null;
// Cancels whatever `onDone` machinery (listener + fallback timer) belongs to
// currentPlayer — see stopCurrentPlayer below.
let currentCleanup: (() => void) | null = null;

// On web (Safari especially), <audio>.play() is silently blocked unless
// it's the direct result of a trusted user gesture — which the first
// auto-played word of a lesson isn't, since it fires from a useEffect after
// the "Continue" tap has already finished. Playing (and immediately
// stopping) a real audio element from the very first tap anywhere in the
// app satisfies that requirement once, after which the browser allows
// programmatic playback for the rest of the page's lifetime. Native
// platforms have no such restriction.
let audioUnlocked = Platform.OS !== 'web';
// window.speechSynthesis (what expo-speech's Speech.speak wraps on web) has
// its own, separate gesture requirement from <audio>/expo-audio — muting the
// tap.wav trick above doesn't prime it. Without this, any auto-played
// English (speakEnglish, e.g. ReplyStep's translate prompt) or fallback Thai
// (Speech.speak for text with no pregenerated audio clip) silently does
// nothing the first time it's triggered from a useEffect instead of a tap.
let speechUnlocked = Platform.OS !== 'web';
function unlockAudioOnFirstInteraction() {
  if ((audioUnlocked && speechUnlocked) || typeof document === 'undefined') return;
  const unlock = () => {
    if (audioUnlocked && speechUnlocked) return;
    if (!audioUnlocked) {
      audioUnlocked = true;
      try {
        const player = createAudioPlayer(require('../assets/audio/tap.wav'));
        player.volume = 0;
        player.play();
        setTimeout(() => {
          try {
            player.remove();
          } catch {
            // ignore
          }
        }, 200);
      } catch {
        // ignore
      }
    }
    if (!speechUnlocked) {
      speechUnlocked = true;
      try {
        Speech.speak(' ', { volume: 0 });
      } catch {
        // ignore
      }
    }
    document.removeEventListener('pointerdown', unlock);
  };
  document.addEventListener('pointerdown', unlock);
}
unlockAudioOnFirstInteraction();

// Callers advancing to a new step should call this before that step's own
// audio (e.g. a wordIntro/speak/reply auto-play useEffect) starts — leaving
// it to the next speakThai/speakEnglish call to self-cancel the previous one
// still leaves a window, between the old step unmounting and the new one's
// effect firing, where the old clip keeps playing at full volume. If the new
// step's first line happens to be spoken in a different voice (e.g. a
// female-voiced word right after a male-voiced dialogue line), that window
// is audible as two voices overlapping.
export function stopSpeech() {
  Speech.stop();
  stopCurrentPlayer();
}

function stopCurrentPlayer() {
  currentCleanup?.();
  currentCleanup = null;
  if (currentPlayer) {
    try {
      currentPlayer.remove();
    } catch {
      // ignore
    }
    currentPlayer = null;
  }
}

// `speaker` picks a male voice for reply()-step lines said by 'M' (see
// scripts/generateThaiAudioMale.js) — everything else (including 'F' lines,
// which already sound right) keeps using the single bundled female voice.
export function speakThai(text: string, onDone?: () => void, speaker?: 'M' | 'F') {
  Speech.stop();
  stopCurrentPlayer();

  const source = speaker === 'M' ? (thaiAudioMapMale[text] ?? thaiAudioMap[text]) : thaiAudioMap[text];
  if (source !== undefined) {
    const player = createAudioPlayer(source);
    currentPlayer = player;
    let done = false;
    let durationTimer: ReturnType<typeof setTimeout> | null = null;
    const finish = () => {
      if (done) return;
      done = true;
      if (durationTimer) clearTimeout(durationTimer);
      listener.remove();
      try {
        player.remove();
      } catch {
        // ignore
      }
      if (currentPlayer === player) currentPlayer = null;
      if (currentCleanup === cleanup) currentCleanup = null;
      onDone?.();
    };
    const cleanup = () => {
      done = true; // suppress finish()'s own work — the caller (stopCurrentPlayer) already removes the player
      if (durationTimer) clearTimeout(durationTimer);
      listener.remove();
    };
    // expo-audio's web player doesn't reliably emit a "finished" status
    // update on web (its `media.onended` handler never emits one — see
    // node_modules/expo-audio/src/AudioModule.web.ts), so `didJustFinish`
    // alone can never fire there. Once we learn the clip's duration (from
    // any status update after it loads), schedule onDone as a fallback timer
    // too — whichever signal arrives first wins, real event or timeout.
    const listener = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        finish();
        return;
      }
      // Reschedule on every update (not just the first) so the fallback
      // tracks actual playback position — a network stall between the first
      // status update and the clip actually finishing loading/buffering
      // would otherwise leave the timer counting down against wall-clock
      // time while the audio itself lags behind, cutting the end of the
      // clip off early. Later updates correct the deadline to match where
      // the clip really is.
      if (status.duration > 0) {
        if (durationTimer) clearTimeout(durationTimer);
        const remainingMs = Math.max(0, (status.duration - status.currentTime) * 1000) + 150;
        durationTimer = setTimeout(finish, remainingMs);
      }
    });
    currentCleanup = cleanup;
    player.play();
    return;
  }

  Speech.speak(text, {
    language: 'th-TH',
    pitch: 1.0,
    rate: 0.85,
    onDone,
    onStopped: onDone,
    onError: onDone,
  });
}

// For English prose (e.g. a rule step's grammar explanation) — speakThai
// would otherwise read it aloud with a Thai voice/accent, which is wrong for
// text that's mostly English with a few romanized Thai words embedded.
export function speakEnglish(text: string, onDone?: () => void) {
  Speech.stop();
  stopCurrentPlayer();
  Speech.speak(text, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.95,
    onDone,
    onStopped: onDone,
    onError: onDone,
  });
}
