import { Image, ImageSourcePropType, Pressable, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Screen } from '../state';

type Tab = { key: Screen; label: string; icon: ImageSourcePropType };

const TABS: Tab[] = [
  { key: 'home', label: 'Path', icon: require('../../assets/redesign/tabs/path.png') },
  { key: 'words', label: 'Words', icon: require('../../assets/redesign/tabs/words.png') },
  { key: 'progress', label: 'Progress', icon: require('../../assets/redesign/tabs/progress.png') },
  { key: 'settings', label: 'Settings', icon: require('../../assets/redesign/tabs/settings.png') },
];

export const TAB_SCREENS: Screen[] = TABS.map((t) => t.key);

// A floating, rounded white bar with the current tab in a solid yellow pill, bold black labels and flat gold icons with
// dark outlines (ChatGPT's nav pass the user shared, 2026-11-08) — the earlier painted icons were too soft to read.
// `backdrop` is the colour behind the bar (the map's cream on the Path tab), and the bar overlaps the screen above a little.
export function BottomTabBar({ active, onSelect, backdrop = colors.white }: { active: Screen; onSelect: (screen: Screen) => void; backdrop?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { backgroundColor: backdrop, paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {TABS.map(({ key, label, icon }) => {
          const isActive = active === key;
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityLabel={label}
            >
              <Image source={icon} style={styles.icon} resizeMode="contain" />
              <Text style={styles.label}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 14, paddingTop: 6, marginTop: -22 },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.neutral300,
    shadowColor: '#7a5c00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  tab: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 24 },
  tabActive: { backgroundColor: colors.accent },
  icon: { width: 34, height: 30 },
  label: { fontFamily: fonts.heading, fontSize: 12, letterSpacing: 0.2, color: colors.text }, // bold black (user, 2026-11-08)
});
