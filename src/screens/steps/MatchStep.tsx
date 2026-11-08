import { useMemo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Tile } from '../../data';
import { colors, fonts, radius, textMuted } from '../../theme';

// Deterministic-per-lesson shuffle (not Math.random on every render) so tile
// positions don't jump around as matched/selected state changes re-renders
// this component — only the `tiles` identity itself reshuffles the layout.
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function MatchStep({
  tiles,
  matchedPairs,
  matchSelected,
  matchWrong,
  onClickTile,
}: {
  tiles: Tile[];
  matchedPairs: number[];
  matchSelected: string[];
  matchWrong: string[];
  onClickTile: (tileKey: string, pairId: number) => void;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enTiles = useMemo(() => shuffle(tiles.filter((t) => t.kind === 'en')), [tiles]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const thTiles = useMemo(() => shuffle(tiles.filter((t) => t.kind === 'th')), [tiles]);

  const renderTile = (t: Tile) => {
    const matched = matchedPairs.includes(t.pairId);
    const pending = matchSelected.includes(t.tileKey);
    const wrong = matchWrong.includes(t.tileKey);
    let bg: string = colors.white;
    let border: string = colors.divider;
    let color: string = colors.text;
    let opacity = 1;
    if (matched) { bg = colors.neutral200; border = colors.neutral300; color = colors.neutral500; opacity = 1; }
    else if (wrong) { bg = colors.danger100; border = colors.danger600; color = colors.danger800; }
    else if (pending) { bg = colors.select100; border = colors.select; color = colors.text; }
    // Thai tiles lead with the romanization (readable to a beginner) and
    // show the Thai script underneath, smaller — most learners can't read
    // Thai script yet, so it shouldn't be the prominent text.
    const main = t.kind === 'th' && t.sub ? t.sub : t.label;
    const sub = t.kind === 'th' && t.sub ? t.label : undefined;
    return (
      <Pressable
        key={t.tileKey}
        disabled={matched}
        onPress={() => onClickTile(t.tileKey, t.pairId)}
        style={[styles.tile, { backgroundColor: bg, borderColor: border, opacity }]}
      >
        <Text style={[styles.tileText, { color }]}>{main}</Text>
        {sub && <Text style={[styles.tileSub, { color }]}>{sub}</Text>}
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.instruction}>Tap a Thai word, then its English match.</Text>
      <View style={styles.columns}>
        <View style={styles.column}>{enTiles.map(renderTile)}</View>
        <View style={styles.column}>{thTiles.map(renderTile)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 18 },
  columns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 10 },
  tile: {
    height: 72, paddingHorizontal: 10, borderWidth: 2, borderRadius: radius,
    alignItems: 'center', justifyContent: 'center',
  },
  tileText: { fontSize: 16, fontFamily: fonts.bodySemibold, textAlign: 'center' },
  tileSub: { fontSize: 12, opacity: 0.7, marginTop: 2, textAlign: 'center' },
});
