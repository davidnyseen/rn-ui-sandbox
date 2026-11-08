import { Image, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { GOALS } from '../data';
import { colors, fonts, textMuted } from '../theme';
import { Button } from '../components/Button';
import { CheckIcon } from '../components/icons';

export function SettingsScreen({
  goal,
  onSelectGoal,
  onSignIn,
  onSignOut,
}: {
  goal: number;
  onSelectGoal: (v: number) => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.kicker}>Settings</Text>
        <View style={styles.kickerRule} />
        <Text style={styles.title}>Your daily goal</Text>
        <Text style={styles.subtitle}>How long you want to practise each day. Change it any time.</Text>
        <View style={styles.grid}>
          {GOALS.map((g) => {
            const selected = goal === g.minutes;
            return (
              <Pressable
                key={g.minutes}
                onPress={() => onSelectGoal(g.minutes)}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <Text style={[styles.cardPace, selected && styles.cardPaceSelected]}>{g.pace}</Text>
                <Text style={[styles.cardNum, selected && styles.cardNumSelected]}>{g.minutes}</Text>
                <Text style={styles.cardUnit}>min / day</Text>
                <Image source={require('../../assets/redesign/lotus.png')} style={styles.cardLotus} resizeMode="contain" />
                {selected && (
                  <View style={styles.tick}><CheckIcon size={12} color={colors.white} strokeWidth={3.5} /></View>
                )}
              </Pressable>
            );
          })}
        </View>
        <Image source={require('../../assets/redesign/sheet-art.png')} style={styles.scene} resizeMode="contain" />
      </ScrollView>

      {onSignOut && (
        <Button variant="secondary" block onPress={onSignOut}>
          Sign out
        </Button>
      )}
      {onSignIn && (
        <Button variant="secondary" block onPress={onSignIn}>
          Sync progress · Sign in
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  kicker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.accent700, marginBottom: 10 },
  // a short gold bar under the label (ChatGPT's 'improve' pass, 2026-11-08)
  kickerRule: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: -4, marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 30, letterSpacing: -0.3, color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%', padding: 18, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  cardLotus: { position: 'absolute', right: 12, bottom: 12, width: 30, height: 20, opacity: 0.35 },
  tick: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 9999, backgroundColor: colors.accent600, alignItems: 'center', justifyContent: 'center' },
  scene: { width: '100%', height: 120, marginTop: 28, opacity: 0.5 },
  cardSelected: { borderColor: colors.accent, backgroundColor: colors.accent100 },
  cardPace: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: textMuted(0.5), marginBottom: 4 },
  cardPaceSelected: { color: colors.accent700 },
  cardNum: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  cardNumSelected: { color: colors.accent800 },
  cardUnit: { fontSize: 12, color: textMuted(0.7), marginTop: 2 },
});
