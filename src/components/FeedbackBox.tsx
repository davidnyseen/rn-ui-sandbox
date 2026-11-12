import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { colors, fonts, textMuted } from '../theme';

// TEMPORARY tester tool (user, 2026-11-12): a plain "feedback on this question" box under every lesson step, so a
// native-speaker tester can flag a mistake right where she sees it. Each note is saved with exactly where it was
// written (lesson, step number, step id/type and a snapshot of the step's content) plus an "applies everywhere"
// flag for notes about a pattern rather than this one question. Read them with:
//   select * from content_feedback order by created_at desc;
// Set SHOW_FEEDBACK to false (or delete this component) before the public release.
export const SHOW_FEEDBACK = true;

export type FeedbackWhere = {
  lessonId: string;
  lessonTitle: string;
  stepIndex: number;
  step: { id?: string; type?: string } & Record<string, unknown>;
};

// onFocus: the lesson screen scrolls the box up above the keyboard (user, 2026-11-12: "keyboard is blocking the input").
export function FeedbackBox({ where, onFocus }: { where: FeedbackWhere; onFocus?: () => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [everywhere, setEverywhere] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // a new question starts with a closed, empty box
  useEffect(() => {
    setOpen(false);
    setNote('');
    setEverywhere(false);
    setStatus('idle');
  }, [where.lessonId, where.stepIndex]);

  if (!SHOW_FEEDBACK) return null;

  async function send() {
    if (!note.trim()) return;
    setStatus('sending');
    const snapshot = JSON.stringify(where.step).slice(0, 4000);
    const row = {
      lesson_id: where.lessonId,
      lesson_title: where.lessonTitle,
      step_index: where.stepIndex,
      step_id: where.step.id ?? null,
      step_type: where.step.type ?? null,
      step_snapshot: snapshot,
      applies_everywhere: everywhere,
      note: note.trim(),
      platform: Platform.OS,
    };
    if (!isSupabaseConfigured) {
      console.warn('[feedback] no backend configured', row);
      setStatus('error');
      return;
    }
    const { error } = await supabase.from('content_feedback').insert(row);
    if (error) {
      console.warn('[feedback] insert failed', error.message);
      setStatus('error');
      return;
    }
    // close the box so the "Feedback saved — thank you!" line shows; a tester needs to see it went through
    setStatus('sent');
    setNote('');
    setEverywhere(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Pressable id="feedback-open" onPress={() => setOpen(true)} style={styles.openLink}>
        <Text style={styles.openText}>
          {status === 'sent' ? 'Feedback saved — thank you! Add more' : '✎ Feedback on this question'}
        </Text>
      </Pressable>
    );
  }

  return (
    <View id="feedback-box" style={styles.box}>
      <Text style={styles.title}>Feedback on this question</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        onFocus={onFocus}
        autoFocus
        placeholder="What's wrong or confusing here?"
        placeholderTextColor={textMuted(0.4)}
        multiline
        style={styles.input}
      />
      <Pressable id="feedback-everywhere" onPress={() => setEverywhere((v) => !v)} style={styles.checkRow}>
        <View style={[styles.checkbox, everywhere && styles.checkboxOn]}>
          {everywhere ? <Text style={styles.tick}>✓</Text> : null}
        </View>
        <Text style={styles.checkText}>This applies everywhere, not just this question</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={() => setOpen(false)} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          id="feedback-send"
          onPress={send}
          disabled={!note.trim() || status === 'sending'}
          style={[styles.send, (!note.trim() || status === 'sending') && styles.sendDisabled]}
        >
          <Text style={styles.sendText}>{status === 'sending' ? 'Saving…' : 'Send'}</Text>
        </Pressable>
      </View>
      {status === 'error' ? <Text style={styles.error}>Couldn't save — check the connection and try again.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  openLink: { alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 12, marginTop: 8 },
  openText: { fontSize: 13, color: textMuted(0.5), textDecorationLine: 'underline' },
  // the bottom margin keeps the Send row clear of the keyboard edge
  box: { marginTop: 16, marginBottom: 24, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.neutral300, backgroundColor: colors.white, gap: 10 },
  title: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.text },
  input: {
    minHeight: 72, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 8, padding: 10,
    fontSize: 15, color: colors.text, textAlignVertical: 'top',
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.neutral300, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.text, borderColor: colors.text },
  tick: { color: colors.white, fontSize: 13, lineHeight: 15 },
  checkText: { flexShrink: 1, fontSize: 13, color: textMuted(0.7) },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancel: { paddingVertical: 8, paddingHorizontal: 12 },
  cancelText: { fontSize: 14, color: textMuted(0.6) },
  send: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, backgroundColor: colors.text },
  sendDisabled: { opacity: 0.35 },
  sendText: { fontSize: 14, color: colors.white, fontFamily: fonts.bodySemibold },
  error: { fontSize: 12, color: colors.danger600 },
});
