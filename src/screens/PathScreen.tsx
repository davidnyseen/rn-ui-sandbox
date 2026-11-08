import { ComponentType, useState } from 'react';
import { Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, RadialGradient, Stop, Circle, Rect, Path } from 'react-native-svg';
import { UNITS } from '../data';
import { CourseSubject } from '../courseTypes';
import { colors, fonts, radius, textMuted, PATH_PALETTE } from '../theme';
import { BookIcon, CheckIcon, FlameIcon, IconProps, LockIcon, StarIcon, UtensilsIcon } from '../components/icons';
import { PulseRing } from '../components/PulseRing';
import { BounceNode } from '../components/BounceNode';
import { COURSE_ICONS } from '../components/courseIcons';
import { lessonDisplayInfo } from '../lib/lessonDisplay';

// TESTING ONLY: unlocks every unit and course subject regardless of
// progress, for phone testing. Flip back to false to restore normal
// sequential gating.
const TESTING_UNLOCK_ALL = false;

// One node per LESSON (not per subject) — each course subject contributes
// a section header followed by one node per lesson, so the map mirrors
// Duolingo's layout: every lesson is its own tappable stop on the path.
interface PathNode {
  key: string;
  title: string;
  Icon: ComponentType<IconProps>;
  status: 'done' | 'current' | 'locked';
  stars?: number;
  paletteIndex?: number;
  onPress: () => void;
  // Which section this node belongs to — the connector trail only links
  // two consecutive nodes when they share one (see pathSegments below), so
  // it never cuts across a section header into an unrelated subject.
  groupKey: string;
  // 1-based position within its section, shown in the name pill ("2. Introductions")
  number: number;
}

interface SectionInfo {
  title: string;
  roman: string;
  unitLabel: string;
  Icon: ComponentType<IconProps>;
  paletteIndex: number;
  isDone: boolean;
}

interface PathItem {
  kind: 'header' | 'node';
  header?: SectionInfo;
  node?: PathNode;
}

// One topic icon per unit so the map reads at a glance — shown in every
// node (done/current/locked alike), with a small badge layered on top to
// carry the status instead of replacing the icon.
const UNIT_ICONS: Record<string, typeof BookIcon> = {
  Restaurant: UtensilsIcon,
};

const NODE_SIZE = 64;
const ROW_GAP = 132; // was 176: more stops on screen at once (user, 2026-11-08)
// The divider card's own rendered height, plus the clear space below it
// before the first node's top edge (measured at the larger "current" node
// size, since that's whichever section is still in progress) — kept as two
// separate constants so the card doesn't have to grow just to buy more gap.
const HEADER_CARD_HEIGHT = 60;
const HEADER_GAP = 32;
const HEADER_HEIGHT = HEADER_CARD_HEIGHT + HEADER_GAP + (NODE_SIZE + 8) / 2;
// The very first section header is a special case: it's active (and so
// rendered as the sticky banner, not in-place — see the `headerIdx <=
// activeSectionIndex` check below) from the moment the screen mounts, at
// scroll position 0, before the learner has scrolled at all. Its in-track
// card literally never appears, so reserving HEADER_CARD_HEIGHT of track
// space for it leaves a permanent dead gap above the first node. Every
// other header only goes sticky once scrolled past, so it needs the full
// height to hold its own card until then.
const FIRST_HEADER_HEIGHT = 8 + (NODE_SIZE + 8) / 2; // trimmed 2026-11-08: more stops per screen
const WRAP_WIDTH = 140;
const TOP_PADDING = 16;
const BOTTOM_PADDING = 56;
const DOT_SIZE = 18;
// Connector stroke between consecutive nodes — thick enough to read as a
// path (not a hairline rule), rounded so both the solid "walked" segments
// and the dotted "not unlocked yet" segments read as a trail rather than a
// technical diagram line.
const PATH_STROKE_WIDTH = 5;
// Gap from a section's last node down to the next section's header —
// tighter than ROW_GAP since there's no connector line filling that space.
const SECTION_END_GAP = 96;
// A section is considered "active" for the sticky banner once its header
// has scrolled to within this many px of the top of the track — switching
// a little before the header actually reaches the very top reads as more
// responsive than waiting for an exact pixel match.
const STICKY_SWITCH_OFFSET = 40;

// A gentle left-right-left wave (period 4) rather than a straight list —
// amplitude is derived from the measured track width so it never clips.
// Phase resets at the start of every section so each subject's run of
// lessons starts the wave fresh rather than carrying an odd offset over
// from wherever the previous subject's lesson count left off.
// Left, right, left… from a section's first stop (user, 2026-11-08: "why not start from left").
function waveOffset(index: number, amplitude: number): number {
  return (index % 2 === 0 ? -1 : 1) * amplitude;
}

// Text/icon/overlay colors for a section header rendered on its bold
// (bright, not-yet-done) background — mirrors pal.onBase rather than
// assuming white always reads, since the bright-yellow palette entry needs
// dark text/icons there instead (see onAccent in theme.ts). The icon badge
// and subtitle need to invert the same way, not just the title.
function boldHeaderColors(pal: (typeof PATH_PALETTE)[number]) {
  const light = pal.onBase === colors.white;
  return {
    fg: pal.onBase,
    icon: pal.onBase,
    badgeBg: light ? 'rgba(255,255,255,0.22)' : 'rgba(32,30,29,0.12)',
    subtitle: light ? 'rgba(255,255,255,0.75)' : 'rgba(32,30,29,0.6)',
  };
}

export function PathScreen({
  streak,
  xp,
  currentUnitIndex,
  currentLessonIndex,
  unitStars,
  onOpenUnit,
  courseSubjects = [],
  courseProgress = {},
  onOpenCourseLesson,
}: {
  streak: number;
  xp: number;
  currentUnitIndex: number;
  currentLessonIndex: number;
  unitStars: Record<number, number>;
  onOpenUnit: (unitId: number) => void;
  // DB-backed course subjects (src/courseTypes.ts) appended after the
  // static UNITS path — a separate, always-unlocked-at-index-0 progress
  // track, so real-textbook content never gets gated behind finishing the
  // hand-authored demo units first.
  courseSubjects?: CourseSubject[];
  courseProgress?: Record<string, { unlockedLessonIndex: number; stars: Record<number, number> }>;
  onOpenCourseLesson?: (subjectId: string, lessonIndex: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackOffsetY, setTrackOffsetY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
    setTrackOffsetY(e.nativeEvent.layout.y);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setScrollY(e.nativeEvent.contentOffset.y);

  const unitItems: PathItem[] = UNITS.map((u, i) => {
    const status: PathNode['status'] =
      i < currentUnitIndex ? 'done' : i === currentUnitIndex || TESTING_UNLOCK_ALL ? 'current' : 'locked';
    return {
      kind: 'node',
      node: {
        key: `unit-${u.id}`,
        title: u.title,
        Icon: UNIT_ICONS[u.title] ?? BookIcon,
        status,
        stars: status === 'done' ? unitStars[u.id] : undefined,
        onPress: () => onOpenUnit(u.id),
        groupKey: 'legacy-units',
        number: i + 1,
      },
    };
  });

  // Subjects unlock independently of each other — finishing every lesson in
  // Restaurant is not required before starting Greetings lesson 1. Within a
  // single subject, lessons stay strictly sequential: lesson N+1 stays
  // locked until lesson N is cleared. Each subject also gets its own color
  // from PATH_PALETTE (cycled by position) so the map reads as a set of
  // distinct subjects rather than one long undifferentiated track.
  const courseItems: PathItem[] = [];
  courseSubjects.forEach((s, si) => {
    const paletteIndex = si % PATH_PALETTE.length;
    const progress = courseProgress[s.id];
    const unlocked = progress?.unlockedLessonIndex ?? 0;
    const isSubjectDone = unlocked >= s.lessons.length;
    courseItems.push({
      kind: 'header',
      header: {
        title: s.title,
        roman: s.roman,
        unitLabel: `Unit ${si + 1} · ${s.roman}`,
        Icon: COURSE_ICONS[s.id] ?? BookIcon,
        paletteIndex,
        isDone: isSubjectDone,
      },
    });
    for (let li = 0; li < s.lessons.length; li++) {
      const isDone = li < unlocked;
      const isLocked = !TESTING_UNLOCK_ALL && li > unlocked;
      const status: PathNode['status'] = isDone ? 'done' : isLocked ? 'locked' : 'current';
      const { title, Icon } = lessonDisplayInfo(s, li);
      courseItems.push({
        kind: 'node',
        node: {
          key: `course-${s.id}-${li}`,
          title,
          Icon,
          status,
          stars: isDone ? progress?.stars?.[li] : undefined,
          paletteIndex,
          onPress: () => onOpenCourseLesson?.(s.id, li),
          groupKey: s.id,
          number: li + 1,
        },
      });
    }
  });

  const items = [...unitItems, ...courseItems];

  const centerX = trackWidth / 2;
  const amplitude = Math.max(0, Math.min(centerX - (WRAP_WIDTH + 40) / 2 - 12, centerX * 0.45));

  let cursorY = TOP_PADDING;
  let waveIndex = 0;
  const laidOut = items.map((item, idx) => {
    if (item.kind === 'header') {
      const y = cursorY;
      cursorY += idx === 0 ? FIRST_HEADER_HEIGHT : HEADER_HEIGHT;
      waveIndex = 0;
      return { item, x: centerX, y };
    }
    const x = centerX + waveOffset(waveIndex, amplitude);
    const y = cursorY;
    // A section's last node has no connector line leading out of it (see
    // pathSegments — it never crosses into the next section), so the usual
    // ROW_GAP reads as dead empty space there instead of a filled path.
    // Tighten it to SECTION_END_GAP in that one spot.
    cursorY += items[idx + 1]?.kind === 'header' ? SECTION_END_GAP : ROW_GAP;
    waveIndex += 1;
    return { item, x, y };
  });
  const trackHeight = laidOut.length ? cursorY - ROW_GAP + NODE_SIZE / 2 + BOTTOM_PADDING : 0;

  const nodePoints = laidOut.filter((l) => l.item.kind === 'node');
  const currentGlows = nodePoints.filter((l) => l.item.node!.status === 'current');

  // The trail connecting each node to the next — a smooth curve through the
  // wave rather than a straight diagonal, colored by whichever subject it's
  // leading into. Solid up through the current node (that stretch is walkable
  // right now); the moment a segment leads into a still-locked node it turns
  // into a dotted "not open yet" trail instead, so the map reads at a glance
  // as "here's how far you can go." Only draws within a single section
  // (matching groupKey) — otherwise it'd cut straight through the section
  // header(s) between e.g. the last Greetings lesson and the first
  // Restaurant one, implying a connection that isn't there.
  const pathSegments = nodePoints.slice(1).flatMap(({ item, x, y }, i) => {
    const prev = nodePoints[i];
    const prevNode = prev.item.node!;
    const node = item.node!;
    if (prevNode.groupKey !== node.groupKey) return [];
    const pal = PATH_PALETTE[node.paletteIndex ?? 0];
    const locked = node.status === 'locked';
    // A done node's star row sits just below it — start the curve past that
    // row instead of at the node's own center, so it never shows through
    // the gaps between the stars.
    // Leave from the side of this stop that faces the next one, sweep across, and land on the top of the next circle
    // (the current stop is drawn 8px bigger) — clear of the name pill under the stop, and never into a circle's side.
    const prevR = (prevNode.status === 'current' ? NODE_SIZE + 8 : NODE_SIZE) / 2;
    const startX = prev.x + Math.sign(x - prev.x) * prevR;
    const startY = prev.y;
    const endY = y - (node.status === 'current' ? NODE_SIZE + 8 : NODE_SIZE) / 2;
    return [{
      key: `path-${node.key}`,
      d: `M ${startX} ${startY} C ${x} ${startY}, ${x} ${startY}, ${x} ${endY}`,
      stroke: locked ? '#b88a3a' : pal.base, // locked: a warm gold-brown trail that still reads on white
      dashed: locked,
    }];
  });

  // Sticky "which section am I looking at" banner — driven purely by scroll
  // position (not progress), so it always names whatever subject's lessons
  // are currently on screen, the way a contacts list's floating letter
  // updates as you scroll through the alphabet.
  const sectionHeaders = laidOut.filter((l) => l.item.kind === 'header');
  const localScrollY = scrollY - trackOffsetY;
  let activeSectionIndex = 0;
  for (let i = 0; i < sectionHeaders.length; i++) {
    if (sectionHeaders[i].y <= localScrollY + STICKY_SWITCH_OFFSET) activeSectionIndex = i;
  }
  const activeSection = sectionHeaders[activeSectionIndex]?.item.header ?? null;

  return (
    <View style={styles.screen}>
      {/* faint temple and frangipani in the bottom corners, behind the map (ChatGPT's map, 2026-11-08) */}
      <Image source={require('../../assets/redesign/corner-temple.png')} style={styles.cornerTemple} resizeMode="contain" />
      <Image source={require('../../assets/redesign/corner-flowers.png')} style={styles.cornerFlowers} resizeMode="contain" />
      <View style={styles.headerRow}>
        <View style={styles.streak}>
          <FlameIcon size={18} color={colors.accent700} />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{xp} XP</Text>
        </View>
      </View>
      <View style={styles.brand}>
        <Image source={require('../../assets/redesign/lotus.png')} style={styles.lotus} resizeMode="contain" />
        <Text style={styles.brandText}>Thai Path</Text>
      </View>

      {activeSection && (() => {
        const pal = PATH_PALETTE[activeSection.paletteIndex];
        const bold = !activeSection.isDone;
        const bg = bold ? pal.base : pal.tint;
        const boldColors = bold ? boldHeaderColors(pal) : null;
        const fg = bold ? boldColors!.fg : pal.dark;
        const BannerIcon = activeSection.Icon;
        return (
          <View id="unit-card-wrap">
          {/* the elephant mascot peeking over the unit card — drawn first, so the card hides its lower half */}
          <Image source={require('../../assets/redesign/elephant-logo.png')} style={styles.mascot} resizeMode="contain" />
          <View style={[styles.stickyHeader, { backgroundColor: bg }]}>
            <View style={[styles.sectionIconWrap, { backgroundColor: bold ? boldColors!.badgeBg : colors.white }]}>
              <BannerIcon size={18} color={bold ? boldColors!.icon : pal.base} />
            </View>
            <View style={styles.sectionText}>
              <Text style={[styles.sectionTitle, { color: fg }]} numberOfLines={1}>{activeSection.title}</Text>
              <Text style={[styles.sectionRoman, { color: bold ? boldColors!.subtitle : textMuted(0.5) }]} numberOfLines={1}>{activeSection.unitLabel}</Text>
            </View>
            {activeSection.isDone && <CheckIcon size={16} color={fg} strokeWidth={2.5} />}
          </View>
          </View>
        );
      })()}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.track, { height: trackHeight }]} onLayout={onTrackLayout}>
          {trackWidth > 0 && (
            <Svg width={trackWidth} height={trackHeight} style={StyleSheet.absoluteFill}>
              <Defs>
                <Pattern id="path-dots" patternUnits="userSpaceOnUse" width={DOT_SIZE} height={DOT_SIZE}>
                  <Circle cx={DOT_SIZE / 2} cy={DOT_SIZE / 2} r={1.5} fill="rgba(32,30,29,0.07)" />
                </Pattern>
                {currentGlows.map(({ item }) => {
                  const pal = PATH_PALETTE[item.node!.paletteIndex ?? 0];
                  return (
                    <RadialGradient key={`grad-${item.node!.key}`} id={`glow-${item.node!.key}`} cx="50%" cy="50%" r="50%">
                      <Stop offset="0%" stopColor={pal.shadow} />
                      <Stop offset="68%" stopColor={pal.shadow} stopOpacity={0} />
                    </RadialGradient>
                  );
                })}
              </Defs>
              {/* plain white map (user, 2026-11-08): no dot grid, no painted background */}
              {pathSegments.map((seg) => (
                <Path
                  key={seg.key}
                  d={seg.d}
                  stroke={seg.stroke}
                  strokeWidth={PATH_STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeDasharray={seg.dashed ? `${PATH_STROKE_WIDTH * 1.8} ${PATH_STROKE_WIDTH * 2}` : undefined}
                  fill="none"
                />
              ))}
              {currentGlows.map(({ item, x, y }) => (
                <Circle key={`glow-circle-${item.node!.key}`} cx={x} cy={y} r={NODE_SIZE} fill={`url(#glow-${item.node!.key})`} />
              ))}
            </Svg>
          )}
          {trackWidth > 0 && laidOut.map(({ item, x, y }, i) => {
            if (item.kind === 'header') {
              // Once a section's header has scrolled up into the sticky
              // slot above (or past it), don't also render it in place —
              // the sticky banner is that same title now, not a second one.
              const headerIdx = sectionHeaders.findIndex((sh) => sh.y === y);
              if (headerIdx !== -1 && headerIdx <= activeSectionIndex) return null;
              const h = item.header!;
              const pal = PATH_PALETTE[h.paletteIndex];
              const bold = !h.isDone;
              const bg = bold ? pal.base : pal.tint;
              const boldColors = bold ? boldHeaderColors(pal) : null;
              const fg = bold ? boldColors!.fg : pal.dark;
              const HeaderIcon = h.Icon;
              return (
                <View key={`header-${i}`} style={[styles.sectionHeader, { top: y, backgroundColor: bg }]}>
                  <View style={[styles.sectionIconWrap, { backgroundColor: bold ? boldColors!.badgeBg : colors.white }]}>
                    <HeaderIcon size={18} color={bold ? boldColors!.icon : pal.base} />
                  </View>
                  <View style={styles.sectionText}>
                    <Text style={[styles.sectionTitle, { color: fg }]} numberOfLines={1}>{h.title}</Text>
                    <Text style={[styles.sectionRoman, { color: bold ? boldColors!.subtitle : textMuted(0.5) }]} numberOfLines={1}>{h.unitLabel}</Text>
                  </View>
                  {h.isDone && <CheckIcon size={16} color={fg} strokeWidth={2.5} />}
                </View>
              );
            }
            const node = item.node!;
            const isDone = node.status === 'done';
            const isCurrent = node.status === 'current';
            const isLocked = node.status === 'locked';
            const pal = PATH_PALETTE[node.paletteIndex ?? 0];
            // Icons are dark on every node so they read clearly (user, 2026-11-08: button contrast) — white on yellow
            // and yellow on pale yellow were too faint.
            let nodeBg: string = colors.neutral200;
            let nodeColor: string = colors.neutral800;
            let nodeShadow = styles.nodeShadowNone;
            let nodeBorder: string = colors.neutral500; // locked stops: outlined, not faded
            let groundColor = 'rgba(32,30,29,0.06)';
            if (isDone) { nodeBorder = colors.white; nodeBg = pal.tint; nodeColor = pal.dark; nodeShadow = styles.nodeShadowDone; groundColor = 'rgba(32,30,29,0.08)'; }
            if (isCurrent) { nodeBorder = colors.white; nodeBg = pal.base; nodeColor = pal.onBase; nodeShadow = { shadowColor: pal.base, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 6 }; groundColor = pal.shadow; }
            const size = isCurrent ? NODE_SIZE + 8 : NODE_SIZE;
            const TopicIcon = node.Icon;
            const nodeCore = (
              <Pressable
                disabled={isLocked}
                onPress={node.onPress}
                style={[styles.node, nodeShadow, { width: size, height: size, backgroundColor: nodeBg, borderColor: nodeBorder }]}
              >
                {isCurrent && <PulseRing color={pal.base} />}
                <TopicIcon size={27} color={nodeColor} />
                {isLocked && (
                  <View style={styles.lockBadge}>
                    <LockIcon size={11} color={colors.white} />
                  </View>
                )}
              </Pressable>
            );
            return (
              <View key={node.key} style={[styles.nodeWrap, { left: x - WRAP_WIDTH / 2, top: y - size / 2 }]}>
                {/* The current node already reads as "here" via its glow ring
                    and pulse — a ground shadow under it too was redundant
                    (and, being the boldest shadow of the three states, drew
                    the eye as if it were a separate element). */}
                {!isCurrent && (
                  <View style={[styles.ground, { width: size * 0.7, left: WRAP_WIDTH / 2 - size * 0.35, top: size - 6, backgroundColor: groundColor }]} />
                )}
                {isCurrent ? <BounceNode>{nodeCore}</BounceNode> : nodeCore}
                {isDone && (
                  <View style={styles.doneStars}>
                    {[1, 2, 3].map((n) => (
                      <StarIcon key={n} size={13} color={pal.base} filled={n <= (node.stars ?? 0)} />
                    ))}
                  </View>
                )}
                {/* Every stop is named, so the map reads as words first (user: "the text is the main thing") */}
                <View style={[styles.pill, isCurrent && { borderColor: pal.base, backgroundColor: pal.tint }]}>
                  <Text style={[styles.pillText, isLocked && styles.pillTextLocked]} numberOfLines={2}>
                    {node.number}. {node.title}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  cornerTemple: { position: 'absolute', pointerEvents: 'none', left: 0, bottom: 0, width: 170, height: 104, opacity: 0.55 },
  cornerFlowers: { position: 'absolute', pointerEvents: 'none', right: 0, bottom: 0, width: 130, height: 103, opacity: 0.6 },
  mascot: { position: 'absolute', pointerEvents: 'none', right: 72, top: -50, width: 78, height: 84 }, // left of the XP count
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 2,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginTop: 6 },
  lotus: { width: 42, height: 28 },
  brandText: { fontFamily: fonts.heading, fontSize: 30, letterSpacing: -0.4, color: colors.text },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { fontFamily: fonts.heading, fontSize: 15, color: colors.accent700 },
  tag: { backgroundColor: 'rgba(255,255,255,0.75)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 9999 },
  tagText: { fontFamily: fonts.heading, fontSize: 12, color: colors.accent800 },
  // The active section's own card, pinned outside the ScrollView so it
  // stays put while the map scrolls underneath — same exact look as the
  // in-track version below (sectionHeader), just fixed in place. Its
  // in-track counterpart hides itself once it reaches this slot, so this
  // reads as one card sticking, not a second title appearing.
  stickyHeader: {
    height: HEADER_CARD_HEIGHT,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, paddingHorizontal: 16, borderRadius: radius,
    marginTop: 10, marginBottom: 4,
  },
  track: { position: 'relative', width: '100%', marginTop: 18 },
  sectionHeader: {
    position: 'absolute', left: 0, right: 0, height: HEADER_CARD_HEIGHT,
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, borderRadius: radius,
  },
  sectionIconWrap: { width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  sectionText: { flex: 1, minWidth: 0 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 15 },
  sectionRoman: { fontSize: 11.5, marginTop: 1 },
  nodeWrap: { position: 'absolute', width: WRAP_WIDTH, alignItems: 'center' },
  ground: { position: 'absolute', height: 10, borderRadius: 9999 },
  node: { borderRadius: 9999, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  nodeShadowNone: {},
  nodeShadowDone: { shadowColor: '#7c1405', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 4 },
  caption: { marginTop: 8, alignItems: 'center' },
  unitTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.text, textAlign: 'center' },
  doneStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
  pill: {
    marginTop: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14, maxWidth: WRAP_WIDTH + 40,
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: 'rgba(166,124,0,0.5)',
  },
  pillText: { fontFamily: fonts.heading, fontSize: 13, color: colors.text, textAlign: 'center' },
  pillTextLocked: { color: colors.text },
  lockBadge: {
    position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 9999,
    backgroundColor: colors.neutral600, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center',
  },
  captionLocked: { opacity: 0.45 },
});
