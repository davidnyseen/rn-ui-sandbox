#!/usr/bin/env bash
# Levels every voice clip to the same loudness (-16 LUFS) so the Thai female, Thai male and English voices all sound
# equally loud (user, 2026-11-10: "the voice strength seems different in different places"). Measures each clip, then
# applies one fixed gain (loudnorm's own mode drifts on clips this short), with a limiter so nothing clips.
# Run after any generate*Audio.js script. Rewrites the mp3s in place; running it twice changes nothing audible.
# With file arguments (paths under assets/audio) it levels only those, e.g. just the clips a generate run added.
cd "$(dirname "$0")/../assets/audio" || exit 1
norm() {
  f="$1"
  i=$(ffmpeg -hide_banner -nostats -i "$f" -af ebur128 -f null - 2>&1 | grep " I:" | tail -1 | awk '{print $2}')
  [ -z "$i" ] && return
  g=$(awk -v i="$i" 'BEGIN{printf "%.2f", -16 - i}')
  ffmpeg -hide_banner -loglevel error -y -i "$f" -af "volume=${g}dB,alimiter=limit=0.84:level=false" -ar 24000 -ac 1 -b:a 64k "$f.tmp.mp3" && mv "$f.tmp.mp3" "$f"
}
export -f norm
if [ $# -gt 0 ]; then printf '%s
' "$@"; else ls thai/*.mp3 thai-male/*.mp3 english/*.mp3; fi | xargs -P 8 -I{} bash -c 'norm "{}"'
echo "levelled $(ls thai/*.mp3 thai-male/*.mp3 english/*.mp3 | wc -l) clips"
