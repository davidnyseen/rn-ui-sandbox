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

// A floating, rounded cream bar with the current tab in a soft yellow pill (ChatGPT's redraw, 2026-11-07) —
// replaces the flat white slab with a grey rule, which looked out of place on the painted map. The icons are
// ChatGPT's painted gold-and-lotus set (2026-11-08); the tabs you're not on are faded so the current one stands out.
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
              <Image source={icon} style={[styles.icon, !isActive && styles.iconIdle]} resizeMode="contain" />
              <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
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
    backgroundColor: 'rgba(255,250,238,0.96)',
    borderRadius: 30,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(166,124,0,0.12)',
    shadowColor: '#7a5c00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  tab: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 24 },
  tabActive: { backgroundColor: colors.accent100 },
  icon: { width: 36, height: 30 },
  iconIdle: { opacity: 0.75 },
  label: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.2, color: colors.accent700 },
  labelActive: { color: colors.accent800, fontWeight: '800' },
});
