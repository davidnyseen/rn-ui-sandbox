import { useMemo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { CheckIcon } from '../../components/icons';

type Tile = { tileKey: string; pairId: number; kind: 'th' | 'en'; main: string; sub?: string };

// Deterministic-per-lesson shuffle (not Math.random on every render) so tile
// positions don't jump around as matched/selected state changes re-renders
// this component — only the `pairs` identity itself reshuffles the layout.
// Same approach as the legacy MatchStep (src/screens/steps/MatchStep.tsx).
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function MatchGameStep({
  pairs,
  matchedPairs,
  matchJustMatched,
  matchSelected,
  matchWrong,
  onClickTile,
}: {
  pairs: { thai: string; roman: string; english: string }[];
  matchedPairs: number[];
  matchJustMatched: number[];
  matchSelected: string[];
  matchWrong: string[];
  onClickTile: (tileKey: string, pairId: number) => void;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const thTiles = useMemo<Tile[]>(
    () => shuffle(pairs.map((p, i) => ({ tileKey: `th-${i}`, pairId: i, kind: 'th' as const, main: p.thai, sub: p.roman }))),
    [pairs]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enTiles = useMemo<Tile[]>(
    () => shuffle(pairs.map((p, i) => ({ tileKey: `en-${i}`, pairId: i, kind: 'en' as const, main: p.english }))),
    [pairs]
  );

  // ChatGPT's pass (2026-11-10): a title, Thai / English column heads, rows lined up across both columns with tight
  // even spacing, cream Thai cards (Thai script big, romanization small), grey-white English cards, and matched pairs
  // staying green with a tick, plus an "x of 6 matched" count.
  const renderTile = (t: Tile) => {
    const matched = matchedPairs.includes(t.pairId) || matchJustMatched.includes(t.pairId);
    const pending = matchSelected.includes(t.tileKey);
    const wrong = matchWrong.includes(t.tileKey);
    let bg: string = t.kind === 'th' ? '#fff6e0' : '#f6f5f2';
    let border: string = 'rgba(230,176,0,0.45)';
    let color: string = colors.text;
    if (matched) { bg = colors.success100; border = colors.success600; color = colors.success800; }
    else if (wrong) { bg = colors.danger100; border = colors.danger600; color = colors.danger800; }
    else if (pending) { bg = colors.select100; border = colors.select; }
    return (
      <Pressable
        key={t.tileKey}
        onPress={() => onClickTile(t.tileKey, t.pairId)}
        style={[styles.tile, { backgroundColor: bg, borderColor: border }, pending && !matched && styles.tilePicked]}
      >
        <Text style={[t.kind === 'th' ? styles.thaiText : styles.englishText, { color }]}>{t.main}</Text>
        {t.sub && <Text style={[styles.tileSub, { color: matched ? color : textMuted(0.6) }]}>{t.sub}</Text>}
        {matched && (
          <View style={styles.tick}>
            <CheckIcon size={10} color={colors.white} strokeWidth={3.5} />
          </View>
        )}
      </Pressable>
    );
  };

  const matchedCount = new Set([...matchedPairs, ...matchJustMatched]).size;
  return (
    <View id="match-step">
      <Text style={styles.title}>Match the words</Text>
      <Text style={styles.instruction}>Tap a Thai word, then its English match.</Text>
      <View style={styles.row}>
        <Text style={styles.colHead}>Thai</Text>
        <Text style={styles.colHead}>English</Text>
      </View>
      <View style={styles.rows}>
        {thTiles.map((th, i) => (
          <View key={th.tileKey} style={styles.row}>
            {renderTile(th)}
            {enTiles[i] && renderTile(enTiles[i])}
          </View>
        ))}
      </View>
      <Text style={styles.count}>{matchedCount} of {pairs.length} matched</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 2 },
  instruction: { fontSize: 14, color: textMuted(0.7), marginBottom: 14 },
  colHead: { flex: 1, textAlign: 'center', fontFamily: fonts.bodySemibold, fontSize: 12, color: textMuted(0.55), marginBottom: 6 },
  rows: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1, minHeight: 58, paddingHorizontal: 8, paddingVertical: 8, borderWidth: 1.5, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  tilePicked: { borderWidth: 2 },
  thaiText: { fontSize: 19, fontFamily: fonts.bodySemibold, textAlign: 'center' },
  englishText: { fontSize: 14, fontFamily: fonts.bodySemibold, textAlign: 'center' },
  tileSub: { fontSize: 11, marginTop: 1, textAlign: 'center' },
  tick: {
    position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 9999,
    backgroundColor: colors.success600, alignItems: 'center', justifyContent: 'center',
  },
  count: { textAlign: 'center', fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.accent700, marginTop: 14 },
});
