import { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { MaleIcon, FemaleIcon, PlayIcon } from '../../components/icons';
import { ReplyContextLine } from '../../courseTypes';

const BUBBLE_RADIUS = 18;
const TAIL_RADIUS = 4;
const AVATAR_SIZE = 24;
// your side of the chat — the same warm yellow as the conversation page's second speaker
const MINE_FILL = '#ffd84a';
const MINE_EDGE = '#f2c230';

const speakerColor = (speaker: 'M' | 'F') => (speaker === 'M' ? colors.maleSpeaker : colors.pink);
const SpeakerIcon = ({ speaker, size }: { speaker: 'M' | 'F'; size: number }) =>
  speaker === 'M' ? <MaleIcon size={size} color={colors.white} /> : <FemaleIcon size={size} color={colors.white} />;

export function ReplyStep({
  context,
  replySpeaker,
  english,
  options,
  selected,
  answered,
  onSelect,
  onCheck,
  onPlayLine,
  onPlayOption,
  onPlayEnglish,
}: {
  context: ReplyContextLine[];
  replySpeaker: 'M' | 'F';
  english: string;
  options: { thai: string; roman: string; correct: boolean }[];
  selected: number | null;
  answered: boolean;
  onSelect: (i: number) => void;
  onCheck: () => void;
  onPlayLine: (i: number, onDone?: () => void) => void;
  onPlayOption: (i: number) => void;
  onPlayEnglish: () => void;
}) {
  // Play the lead-in conversation out loud in order — line 0 finishes, then
  // line 1 starts, and so on — revealing each bubble exactly as its line
  // starts, like watching the conversation happen rather than a wall of
  // text dropped in at once. Each step also gets a watchdog timeout so the
  // conversation (and the reply options after it) always finishes even if
  // playback never calls back for some unforeseen reason.
  //
  // `introDone` is its own state, set only once playAndAdvance runs off the
  // end (i.e. the LAST context line's audio has actually finished/timed
  // out) — it must not be derived from visibleCount, which reaches its
  // final value one line early (revealing line N's bubble happens when line
  // N-1 finishes, not when line N itself finishes). Deriving introDone from
  // visibleCount fired the English auto-read (see below) while the last
  // Thai context line was still playing, racing the two audios.
  const [visibleCount, setVisibleCount] = useState(context.length > 0 ? 1 : 0);
  const [introDone, setIntroDone] = useState(context.length === 0);
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const playAndAdvance = (i: number) => {
      if (i >= context.length) {
        if (!cancelled) setIntroDone(true);
        return;
      }
      if (cancelled) return;
      let fired = false;
      const next = () => {
        if (fired || cancelled) return;
        fired = true;
        if (i + 1 < context.length) setVisibleCount(i + 2);
        playAndAdvance(i + 1);
      };
      // Safety net only — the real advance normally comes from onPlayLine's
      // own onDone (tied to actual audio duration). 5000ms comfortably
      // covers this file's longest context lines (7-8 words); too short a
      // fallback here is what caused the next line/English prompt to start
      // over the tail of a still-playing longer line.
      timers.push(setTimeout(next, 5000));
      onPlayLine(i, next);
    };
    playAndAdvance(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read the target English meaning aloud as soon as it's revealed — same
  // "read it the moment it appears" behavior as a wordIntro/speak card —
  // so the learner hears the phrase they need to translate, not just reads
  // it silently.
  useEffect(() => {
    if (introDone) onPlayEnglish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introDone]);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Read the chat — tap a message to hear it.</Text>
      <Text style={styles.scene}>Then answer as the {replySpeaker === 'M' ? 'man' : 'woman'}, in Thai.</Text>
      <View style={styles.sceneRule} />
      <View style={styles.context}>
        {context.slice(0, visibleCount).map((line, i) => {
          const isRight = line.speaker === 'M';
          const avatar = (
            <View style={[styles.avatar, { backgroundColor: speakerColor(line.speaker) }]}>
              <SpeakerIcon speaker={line.speaker} size={13} />
            </View>
          );
          return (
            <View key={i}>
              <View style={[styles.bubbleRow, isRight ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
                {!isRight && avatar}
                <Pressable onPress={() => onPlayLine(i)} style={styles.bubbleCol}>
                  <View
                    style={[
                      styles.bubble,
                      line.speaker === replySpeaker ? styles.fillMine : styles.fillTheirs,
                      isRight ? styles.bubbleTailRight : styles.bubbleTailLeft,
                    ]}
                  >
                    <View style={[styles.tail, isRight ? styles.tailRight : styles.tailLeft, line.speaker === replySpeaker ? styles.tailMine : styles.tailTheirs]} />
                    <View style={styles.bubbleTop}>
                      <Text style={styles.bubbleRoman}>{line.roman}</Text>
                      <PlayIcon size={14} color={colors.accent700} />
                    </View>
                    <Text style={styles.bubbleThai}>{line.parts.join(' ')}</Text>
                    <Text style={styles.bubbleMeaning}>{line.english}</Text>
                  </View>
                </Pressable>
                {isRight && avatar}
              </View>
              <Text
                style={[
                  styles.bubbleEnglish,
                  isRight ? styles.textRight : styles.textLeft,
                  isRight ? styles.captionInsetRight : styles.captionInsetLeft,
                ]}
              >
                {line.speaker === 'M' ? 'Said by a man' : 'Said by a woman'}
              </Text>
            </View>
          );
        })}
      </View>

      {introDone && (
        <>
          {(() => {
            // The line the learner needs to translate, shown as one more
            // bubble in the same conversation — in English, since they
            // haven't produced the Thai for it yet — rather than a
            // separate caption floating outside the chat.
            const isRight = replySpeaker === 'M';
            const avatar = (
              <View style={[styles.avatar, { backgroundColor: speakerColor(replySpeaker) }]}>
                <SpeakerIcon speaker={replySpeaker} size={13} />
              </View>
            );
            return (
              <View>
                <View style={[styles.bubbleRow, isRight ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
                  {!isRight && avatar}
                  <Pressable onPress={onPlayEnglish} style={styles.bubbleCol}>
                    <View
                      style={[
                        styles.bubble,
                        styles.fillMine,
                        isRight ? styles.bubbleTailRight : styles.bubbleTailLeft,
                      ]}
                    >
                      <View style={[styles.tail, isRight ? styles.tailRight : styles.tailLeft, styles.tailMine]} />
                      <View style={styles.bubbleTop}>
                        <Text style={styles.bubbleEnglishLine}>{english}</Text>
                        <PlayIcon size={14} color={colors.accent700} />
                      </View>
                    </View>
                  </Pressable>
                  {isRight && avatar}
                </View>
                <Text style={styles.translatePrompt}>How do you say this in Thai?</Text>
                <View style={styles.promptRule} />
              </View>
            );
          })()}
          <View style={styles.options}>
            {options.map((o, i) => {
              // Styled and positioned exactly like the speaker's own bubbles
              // above (same shape, same side) — unselected options read as
              // "draft" bubbles (outline only), and selecting one fills it
              // solid, the same way a sent bubble looks, so picking an
              // answer visually previews "this is what you'd send." Each
              // option also carries the replying speaker's avatar, same as
              // every context bubble above — the icon reflects who's
              // speaking here, so it stays put through select/correct/wrong
              // rather than only appearing once next to the label.
              const isRight = replySpeaker === 'M';
              const speakerFill = speakerColor(replySpeaker);
              const avatar = (
                <View style={[styles.avatar, { backgroundColor: speakerFill }]}>
                  <SpeakerIcon speaker={replySpeaker} size={13} />
                </View>
              );
              let bg: string = colors.white;
              let border: string = MINE_EDGE;
              let color: string = colors.text;
              let romanColor: string = textMuted(0.55);
              let opacity = 1;
              if (answered) {
                if (o.correct) {
                  bg = colors.success600; border = colors.success600; color = colors.white; romanColor = 'rgba(255,255,255,0.8)';
                } else if (i === selected) {
                  bg = colors.danger600; border = colors.danger600; color = colors.white; romanColor = 'rgba(255,255,255,0.8)';
                } else {
                  opacity = 0.35;
                }
              } else if (i === selected) {
                bg = MINE_FILL; border = MINE_EDGE; color = colors.text; romanColor = textMuted(0.65);
              }
              return (
                <View key={i} style={[styles.bubbleRow, isRight ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
                  {!isRight && avatar}
                  <Pressable
                    disabled={answered}
                    onPress={() => { onSelect(i); onPlayOption(i); }}
                    style={[
                      styles.bubbleCol,
                      styles.option,
                      isRight ? styles.optionTailRight : styles.optionTailLeft,
                      { backgroundColor: bg, borderColor: border, opacity },
                    ]}
                  >
                    <View style={styles.bubbleTop}>
                      <Text style={[styles.optionRoman, { color: romanColor }]}>{o.roman}</Text>
                      <PlayIcon size={13} color={romanColor} />
                    </View>
                    <Text style={[styles.optionThai, { color }]}>{o.thai}</Text>
                  </Pressable>
                  {isRight && avatar}
                </View>
              );
            })}
          </View>
        </>
      )}
      <View style={styles.spacer} />
      {introDone && !answered && (
        <Button variant={selected === null ? 'secondary' : 'primary'} block disabled={selected === null} onPress={onCheck}>
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },

  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  instruction: { fontSize: 14, color: textMuted(0.6), marginBottom: 2 },
  scene: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.accent700 },
  sceneRule: { width: '60%', height: 2, borderRadius: 1, backgroundColor: 'rgba(230,176,0,0.35)', marginTop: 8, marginBottom: 14 },
  context: { gap: 2, marginBottom: 12 },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleCol: { maxWidth: '74%' },
  bubble: {
    borderRadius: BUBBLE_RADIUS, paddingVertical: 8, paddingHorizontal: 16, gap: 1, alignItems: 'center',
  },
  // a small rotated square peeking out of the bubble's bottom corner, on the speaker's side
  tail: { position: 'absolute', bottom: -1, width: 12, height: 12, borderRadius: 2, transform: [{ rotate: '45deg' }] },
  tailRight: { right: -4 },
  tailLeft: { left: -4 },
  fillMine: { backgroundColor: MINE_FILL, borderWidth: 1.5, borderColor: MINE_EDGE },
  fillTheirs: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: 'rgba(32,30,29,0.14)',
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  tailMine: { backgroundColor: MINE_FILL },
  tailTheirs: { backgroundColor: colors.white },
  bubbleTailLeft: { borderBottomLeftRadius: TAIL_RADIUS },
  bubbleTailRight: { borderBottomRightRadius: TAIL_RADIUS },
  bubbleTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubbleMeaning: { fontSize: 12, color: textMuted(0.6), marginTop: 1 },
  bubbleRoman: { fontFamily: fonts.bodySemibold, fontSize: 12, color: textMuted(0.6) },
  bubbleThai: { fontSize: 18, color: colors.text, fontFamily: fonts.heading },
  bubbleEnglishLine: { fontSize: 16, color: colors.text, fontFamily: fonts.heading, paddingVertical: 2 },
  bubbleEnglish: { fontSize: 11, color: textMuted(0.5), marginTop: 2, marginBottom: 6 },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  // Keeps the caption under the bubble itself, not under the avatar beside
  // it — same width+gap as the avatar, on whichever side it sits.
  captionInsetLeft: { paddingLeft: AVATAR_SIZE + 8 },
  captionInsetRight: { paddingRight: AVATAR_SIZE + 8 },

  translatePrompt: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginTop: 14, marginBottom: 6, textAlign: 'center' },
  promptRule: { alignSelf: 'center', width: 36, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginBottom: 14 },

  options: { gap: 10 },
  option: {
    borderWidth: 1.5, borderRadius: BUBBLE_RADIUS, paddingVertical: 7, paddingHorizontal: 16, gap: 1, alignItems: 'center',
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 1,
  },
  optionTailRight: { borderBottomRightRadius: TAIL_RADIUS },
  optionTailLeft: { borderBottomLeftRadius: TAIL_RADIUS },
  optionRoman: { fontFamily: fonts.bodySemibold, fontSize: 12 },
  optionThai: { fontSize: 18, fontFamily: fonts.heading },
});
