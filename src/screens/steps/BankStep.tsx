import { Pressable, Text, View, StyleSheet } from 'react-native';
import { VocabLesson } from '../../data';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';

export function BankStep({
  bank,
  built,
  checked,
  onAdd,
  onRemove,
  onCheck,
}: {
  bank: VocabLesson['bank'];
  built: string[];
  checked: boolean;
  onAdd: (key: string) => void;
  onRemove: (key: string) => void;
  onCheck: () => void;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Build the Thai translation:</Text>
      <Text style={styles.prompt}>“{bank.prompt}”</Text>
      <View style={styles.built}>
        {bank.correctOrder.map((expectedKey, i) => {
          const key = built[i];
          if (!key) return <View key={`empty${i}`} style={styles.emptySlot} />;
          // Compare resolved Thai text, not the tile key — a sentence that
          // repeats a word (e.g. two "khráp" tiles) has two different keys
          // for visually-identical tiles, so a key match/mismatch alone
          // would misjudge which physical tile the learner used.
          const tileMatches = bank.words[key]?.thai === bank.words[expectedKey]?.thai;
          const tileCorrect = checked && tileMatches;
          const tileWrong = checked && !tileMatches;
          const tileStyle = tileCorrect
            ? [styles.chip, styles.chipCorrect]
            : tileWrong
              ? [styles.chip, styles.chipWrong]
              : styles.chip;
          const tileTextStyle = tileCorrect
            ? [styles.chipText, styles.chipTextCorrect]
            : tileWrong
              ? [styles.chipText, styles.chipTextWrong]
              : styles.chipText;
          return (
            <Pressable
              key={key}
              disabled={checked}
              onPress={() => onRemove(key)}
              style={tileStyle}
            >
              <Text style={tileTextStyle}>{bank.words[key].roman}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.spacer} />
      <View style={styles.pool}>
        {bank.poolOrder.map((k) => {
          // A picked tile stays in its original spot as an empty outline
          // (same size, invisible text) instead of being removed from the
          // pool — removing it would reflow every tile after it into a new
          // arrangement each time one is picked, which makes the remaining
          // pool a moving target instead of a stable layout to scan.
          if (built.includes(k)) {
            return (
              <View key={k} style={styles.poolChipUsed}>
                <Text style={[styles.poolChipText, styles.poolChipTextUsed]}>{bank.words[k].roman}</Text>
              </View>
            );
          }
          return (
            <Pressable key={k} onPress={() => onAdd(k)} style={styles.poolChip}>
              <Text style={styles.poolChipText}>{bank.words[k].roman}</Text>
            </Pressable>
          );
        })}
      </View>
      {!checked && (
        <Button
          variant={built.length < bank.correctOrder.length ? 'secondary' : 'primary'}
          block
          disabled={built.length < bank.correctOrder.length}
          onPress={onCheck}
          style={styles.checkBtn}
        >
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 6 },
  prompt: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 20 },
  built: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, minHeight: 52 },
  divider: { height: 1, backgroundColor: 'rgba(32,30,29,0.12)', marginTop: 18 },
  emptySlot: { width: 76, height: 48, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(230,176,0,0.55)', backgroundColor: '#fffbf2', borderRadius: 14 },
  chip: { paddingVertical: 12, paddingHorizontal: 18, backgroundColor: colors.select100, borderWidth: 1.5, borderColor: colors.select, borderRadius: 14 },
  chipText: { fontFamily: fonts.bodySemibold, fontSize: 17, color: colors.text },
  chipCorrect: { backgroundColor: colors.success100, borderColor: colors.success600 },
  chipTextCorrect: { color: colors.success800 },
  chipWrong: { backgroundColor: colors.danger100, borderColor: colors.danger600 },
  chipTextWrong: { color: colors.danger800 },
  pool: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  poolChip: {
    paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#fffbf2', borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.45)', borderRadius: 14,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 1,
  },
  poolChipText: { fontFamily: fonts.bodySemibold, fontSize: 17, color: colors.text },
  // Same padding/border/radius as poolChip so the footprint matches exactly
  // — only the fill, border color, and (invisible) text color differ.
  poolChipUsed: {
    paddingVertical: 12, paddingHorizontal: 18, backgroundColor: colors.white,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.neutral300, borderRadius: 14,
  },
  poolChipTextUsed: { color: 'transparent' },
  checkBtn: { marginTop: 20 },
});
