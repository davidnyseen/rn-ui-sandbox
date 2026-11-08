import { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { MaleIcon, FemaleIcon } from '../../components/icons';
import { ReplyContextLine } from '../../courseTypes';

const BUBBLE_RADIUS = 18;
const TAIL_RADIUS = 4;
const AVATAR_SIZE = 28;

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
      <View style={styles.context}>
        {context.slice(0, visibleCount).map((line, i) => {
          const isRight = line.speaker === 'M';
          const avatar = (
            <View style={[styles.avatar, { backgroundColor: speakerColor(line.speaker) }]}>
              <SpeakerIcon speaker={line.speaker} size={15} />
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
                      { backgroundColor: speakerColor(line.speaker) },
                      isRight ? styles.bubbleTailRight : styles.bubbleTailLeft,
                    ]}
                  >
                    <Text style={styles.bubbleRoman}>{line.roman}</Text>
                    <Text style={styles.bubbleThai}>{line.parts.join(' ')}</Text>
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
                <SpeakerIcon speaker={replySpeaker} size={15} />
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
                        { backgroundColor: speakerColor(replySpeaker) },
                        isRight ? styles.bubbleTailRight : styles.bubbleTailLeft,
                      ]}
                    >
                      <Text style={styles.bubbleThai}>{english}</Text>
                    </View>
                  </Pressable>
                  {isRight && avatar}
                </View>
                <Text style={[styles.translatePrompt, isRight ? styles.textRight : styles.textLeft]}>
                  How do you say this in Thai?
                </Text>
                <View style={[styles.promptRule, isRight && styles.promptRuleRight]} />
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
                  <SpeakerIcon speaker={replySpeaker} size={15} />
                </View>
              );
              let bg: string = replySpeaker === 'M' ? '#f4f7fe' : '#fff5f9';
              let border: string = speakerFill;
              let color: string = speakerFill;
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
                bg = speakerFill; border = speakerFill; color = colors.white; romanColor = 'rgba(255,255,255,0.8)';
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
                    <Text style={[styles.optionRoman, { color: romanColor }]}>{o.roman}</Text>
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

  context: { gap: 4, marginBottom: 20 },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleCol: { maxWidth: '74%' },
  bubble: {
    borderRadius: BUBBLE_RADIUS, paddingVertical: 10, paddingHorizontal: 15, gap: 2,
  },
  bubbleTailLeft: { borderBottomLeftRadius: TAIL_RADIUS },
  bubbleTailRight: { borderBottomRightRadius: TAIL_RADIUS },
  bubbleRoman: { fontFamily: fonts.bodySemibold, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  bubbleThai: { fontSize: 17, color: colors.white, fontFamily: fonts.bodySemibold },
  bubbleEnglish: { fontSize: 12, color: textMuted(0.5), marginBottom: 8 },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  // Keeps the caption under the bubble itself, not under the avatar beside
  // it — same width+gap as the avatar, on whichever side it sits.
  captionInsetLeft: { paddingLeft: AVATAR_SIZE + 8 },
  captionInsetRight: { paddingRight: AVATAR_SIZE + 8 },

  translatePrompt: { fontFamily: fonts.heading, fontSize: 18, color: colors.text, marginTop: 16, marginBottom: 6 },
  promptRule: { width: 36, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginBottom: 16 },
  promptRuleRight: { alignSelf: 'flex-end' },

  options: { gap: 8 },
  option: {
    borderWidth: 1.5, borderRadius: BUBBLE_RADIUS, paddingVertical: 10, paddingHorizontal: 15, gap: 2,
  },
  optionTailRight: { borderBottomRightRadius: TAIL_RADIUS },
  optionTailLeft: { borderBottomLeftRadius: TAIL_RADIUS },
  optionRoman: { fontFamily: fonts.bodySemibold, fontSize: 13 },
  optionThai: { fontSize: 17, fontFamily: fonts.bodySemibold },
});
