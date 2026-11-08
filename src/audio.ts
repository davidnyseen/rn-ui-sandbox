import { AudioPlayer, createAudioPlayer } from 'expo-audio';

const correctPlayer = createAudioPlayer(require('../assets/audio/correct.wav'));
const wrongPlayer = createAudioPlayer(require('../assets/audio/wrong.wav'));
const completePlayer = createAudioPlayer(require('../assets/audio/complete.wav'));

// Sound effects are non-critical polish — never let a playback hiccup
// (e.g. no audio output device) break the lesson flow.
function replay(player: AudioPlayer) {
  try {
    player.seekTo(0).finally(() => player.play());
  } catch {
    // ignore
  }
}

export const playCorrectSound = () => replay(correctPlayer);
export const playWrongSound = () => replay(wrongPlayer);
export const playCompleteSound = () => replay(completePlayer);
