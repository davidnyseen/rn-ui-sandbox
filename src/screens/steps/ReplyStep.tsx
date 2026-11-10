import { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';
import { Button } from '../../components/Button';
import { MaleIcon, FemaleIcon, PlayIcon } from '../../components/icons';
import { AnswerOption } from '../../components/AnswerOption';
import { ReplyContextLine } from '../../courseTypes';

const BUBBLE_RADIUS = 14;
const AVATAR_SIZE = 28;

const speakerColor = (speaker: 'M' | 'F') => (speaker === 'M' ? colors.maleSpeaker : colors.pink);
// ChatGPT's pass (2026-11-10): soft tinted bubbles with dark text, so the Thai stands out instead of white-on-colour.
const bubbleTint = (speaker: 'M' | 'F') => (speaker === 'M' ? '#dde9fc' : '#fce3ec');
const MUTED = 'rgba(32,30,29,0.6)';
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
      <Text style={styles.hint}>Tap a message to hear it, then answer as the {replySpeaker === 'M' ? 'man' : 'woman'}.</Text>
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
                      { backgroundColor: bubbleTint(line.speaker) },
                    ]}
                  >
                    <View style={styles.bubbleTop}>
                      <Text style={styles.bubbleRoman}>{line.roman}</Text>
                      <PlayIcon size={14} color={MUTED} />
                    </View>
                    <Text style={styles.bubbleThai}>{line.parts.join(' ')}</Text>
                    <Text style={styles.bubbleMeaning}>{line.english}</Text>
                  </View>
                </Pressable>
                {isRight && avatar}
              </View>
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
                        { backgroundColor: bubbleTint(replySpeaker) },
                      ]}
                    >
                      <View style={styles.bubbleTop}>
                        <Text style={[styles.promptText, styles.shrink]}>{english}</Text>
                        <View style={styles.noShrink}>
                          <PlayIcon size={14} color={MUTED} />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                  {isRight && avatar}
                </View>
                <Text style={[styles.translatePrompt, isRight ? styles.textRight : styles.textLeft]}>
                  How do you say this in Thai?
                </Text>
              </View>
            );
          })()}
          <View style={styles.options}>
            {options.map((o, i) => (
              // The shared answer card, with this chat's extras: the speaker badge, the romanization + sound icon above
              // the Thai, and the picked state tinted in the speaker's colour.
              <AnswerOption
                key={i}
                label={o.thai}
                big
                eyebrow={
                  <View style={styles.bubbleTop}>
                    <Text style={styles.bubbleRoman}>{o.roman}</Text>
                    <PlayIcon size={13} color={MUTED} />
                  </View>
                }
                leading={
                  <View style={[styles.avatar, { backgroundColor: speakerColor(replySpeaker) }]}>
                    <SpeakerIcon speaker={replySpeaker} size={15} />
                  </View>
                }
                pickedTint={{ bg: bubbleTint(replySpeaker), border: speakerColor(replySpeaker) }}
                selected={i === selected}
                answered={answered}
                correct={o.correct}
                onPress={() => { onSelect(i); onPlayOption(i); }}
              />
            ))}
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

  hint: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.accent700, marginBottom: 14 },
  context: { gap: 10, marginBottom: 20 }, // no caption lines under the bubbles any more
  bubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleCol: { maxWidth: '74%' },
  bubble: {
    borderRadius: BUBBLE_RADIUS, paddingVertical: 10, paddingHorizontal: 15, gap: 2,
  },
  noShrink: { flexShrink: 0 },
  shrink: { flexShrink: 1 }, // a long English line wraps instead of pushing its sound icon out of the bubble
  bubbleTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubbleMeaning: { fontSize: 12, color: MUTED, marginTop: 1 },
  bubbleRoman: { fontFamily: fonts.bodySemibold, fontSize: 13, color: MUTED },
  bubbleThai: { fontSize: 18, color: colors.text, fontFamily: fonts.bodySemibold },
  promptText: { fontSize: 16, color: colors.text, fontFamily: fonts.bodySemibold },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },

  translatePrompt: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, marginTop: 14, marginBottom: 14 },

  options: { gap: 8 },
});
