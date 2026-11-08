import { useMemo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

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
    () => shuffle(pairs.map((p, i) => ({ tileKey: `th-${i}`, pairId: i, kind: 'th' as const, main: p.roman, sub: p.thai }))),
    [pairs]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enTiles = useMemo<Tile[]>(
    () => shuffle(pairs.map((p, i) => ({ tileKey: `en-${i}`, pairId: i, kind: 'en' as const, main: p.english }))),
    [pairs]
  );

  const renderTile = (t: Tile) => {
    const matched = matchedPairs.includes(t.pairId);
    const justMatched = matchJustMatched.includes(t.pairId);
    const pending = matchSelected.includes(t.tileKey);
    const wrong = matchWrong.includes(t.tileKey);
    let bg: string = '#fffbf2';
    let border: string = 'rgba(230,176,0,0.45)';
    let color: string = colors.text;
    let opacity = 1;
    if (justMatched) { bg = colors.success100; border = colors.success600; color = colors.success800; }
    else if (matched) { bg = colors.neutral200; border = colors.neutral300; color = colors.neutral500; }
    else if (wrong) { bg = colors.danger100; border = colors.danger600; color = colors.danger800; }
    else if (pending) { bg = colors.select100; border = colors.select; color = colors.text; }
    return (
      <Pressable
        key={t.tileKey}
        disabled={matched}
        onPress={() => onClickTile(t.tileKey, t.pairId)}
        style={[styles.tile, { backgroundColor: bg, borderColor: border, opacity }]}
      >
        <Text style={[styles.tileText, { color }]}>{t.main}</Text>
        {t.sub && <Text style={[styles.tileSub, { color }]}>{t.sub}</Text>}
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.instruction}>Tap a Thai word, then its English match.</Text>
      <View style={styles.columns}>
        <View style={styles.column}>{thTiles.map(renderTile)}</View>
        <View style={styles.column}>{enTiles.map(renderTile)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  instruction: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.text, marginBottom: 18 },
  columns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 10 },
  tile: {
    minHeight: 76, paddingHorizontal: 10, paddingVertical: 10, borderWidth: 1.5, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  tileText: { fontSize: 17, fontFamily: fonts.bodySemibold, textAlign: 'center' },
  tileSub: { fontSize: 12, opacity: 0.7, marginTop: 2, textAlign: 'center' },
});
