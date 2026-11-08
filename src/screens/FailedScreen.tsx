import { Image, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../theme';
import { Button } from '../components/Button';
import { HeartIcon } from '../components/icons';

export function FailedScreen({
  onRetry,
  onExit,
}: {
  onRetry: () => void;
  onExit: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Image source={require('../../assets/redesign/failed-art.png')} style={styles.art} resizeMode="contain" />
        <View style={styles.hearts}>
          {[1, 2, 3].map((i) => (
            <HeartIcon key={i} size={32} color={colors.neutral300} filled={false} />
          ))}
        </View>
        <Text style={styles.title}>Out of hearts.</Text>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Image source={require('../../assets/redesign/lotus.png')} style={styles.dividerLotus} resizeMode="contain" />
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.subtitle}>Too many mistakes — restart the lesson from the beginning.</Text>
      </View>
      <Button variant="primary" block onPress={onRetry}>
        Try again
      </Button>
      <Button variant="ghost" onPress={onExit}>
        Back to path
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 24, backgroundColor: colors.white },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  art: { width: 220, height: 220, marginBottom: 16 },
  hearts: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  title: { fontFamily: fonts.heading, fontSize: 34, letterSpacing: -0.3, color: colors.text, marginBottom: 8, textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dividerLine: { width: 36, height: 2, borderRadius: 1, backgroundColor: colors.accent },
  dividerLotus: { width: 22, height: 15 },
  subtitle: { fontSize: 15, color: textMuted(0.6), textAlign: 'center', maxWidth: 280 },
});
