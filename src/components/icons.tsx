import { Text } from 'react-native';
import Svg, { Path, Rect, Line, Polygon, Polyline, Circle } from 'react-native-svg';

export type IconProps = { size?: number; color?: string; strokeWidth?: number };

export function CheckIcon({ size = 18, color = 'currentColor', strokeWidth = 3 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

// Classic Mars/Venus glyphs — used as the speaker avatar in reply() chat
// steps so "who's talking" reads at a glance instead of needing a letter.
export function MaleIcon({ size = 16, color = 'currentColor', strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={10} cy={14} r={6} />
      <Path d="M18.5 5.5 14.3 9.7" />
      <Path d="M12.5 5.5h6v6" />
    </Svg>
  );
}

export function FemaleIcon({ size = 16, color = 'currentColor', strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={9} r={6} />
      <Path d="M12 15v7" />
      <Path d="M8.5 19h7" />
    </Svg>
  );
}

export function XIcon({ size = 16, color = 'currentColor', strokeWidth = 3 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18" />
      <Path d="M6 6l12 12" />
    </Svg>
  );
}

export function LockIcon({ size = 15, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={11} width={18} height={11} rx={2} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5" />
      <Path d="m12 19-7-7 7-7" />
    </Svg>
  );
}

export function FlameIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

export function PlayIcon({ size = 26, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Svg>
  );
}

export function MicIcon({ size = 26, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={9} y={2} width={6} height={11} rx={3} />
      <Path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <Line x1={12} y1={19} x2={12} y2={22} />
      <Line x1={8} y1={22} x2={16} y2={22} />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = 'currentColor', filled = true }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2.5l2.9 6.4 6.98.6-5.29 4.62 1.6 6.84L12 17.6l-6.19 3.36 1.6-6.84L2.12 9.5l6.98-.6L12 2.5z" />
    </Svg>
  );
}

export function HeartIcon({ size = 16, color = 'currentColor', filled = true }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </Svg>
  );
}

export function CloseIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18" />
      <Path d="M6 6l12 12" />
    </Svg>
  );
}

// Topic icons for the path map — one per unit, so the map reads at a
// glance instead of relying on a bare number.
export function BookIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  );
}

export function ChatIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="13" rx="4" />
      <Path d="M8 17v4l4.5-4" />
      <Line x1="7.5" y1="9" x2="16.5" y2="9" />
      <Line x1="7.5" y1="12.5" x2="13" y2="12.5" />
    </Svg>
  );
}

export function UsersIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

// A smiling speech bubble — the Hello & Everyday Phrases unit (ChatGPT's map pass, 2026-11-08).
export function HelloIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3c5 0 9 3.4 9 7.6s-4 7.6-9 7.6c-1 0-2-.1-2.9-.4L4 20l1.4-4C3.9 14.6 3 12.7 3 10.6 3 6.4 7 3 12 3z" />
      <Line x1="9" y1="9" x2="9" y2="9.5" />
      <Line x1="15" y1="9" x2="15" y2="9.5" />
      <Path d="M8.8 12.6c1.7 1.6 4.7 1.6 6.4 0" />
    </Svg>
  );
}

// A name badge — the Names, Small Talk & Goodbyes unit.
export function NameTagIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="5" width="18" height="14" rx="3" />
      <Circle cx="9" cy="11" r="2" />
      <Path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" />
      <Line x1="14.5" y1="10" x2="18" y2="10" />
      <Line x1="14.5" y1="13.5" x2="17" y2="13.5" />
    </Svg>
  );
}

// Two overlapping bubbles — a unit's Conversation lesson, kept distinct from every unit's own icon.
export function ConversationIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h8A2.5 2.5 0 0 1 16 5.5v5a2.5 2.5 0 0 1-2.5 2.5H8l-3.5 3v-3.2A2.5 2.5 0 0 1 3 10.5z" />
      <Path d="M19 9h.5A2.5 2.5 0 0 1 22 11.5v5a2.5 2.5 0 0 1-1.5 2.3V21l-3-2.5H13a2.5 2.5 0 0 1-2.5-2.5V16" />
    </Svg>
  );
}

export function HashIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="4" y1="9" x2="20" y2="9" />
      <Line x1="4" y1="15" x2="20" y2="15" />
      <Line x1="10" y1="3" x2="8" y2="21" />
      <Line x1="16" y1="3" x2="14" y2="21" />
    </Svg>
  );
}

// A literal "123" glyph — the Numbers unit's node icon per the design source
// (a numeral reads better at a glance there than an abstract hash mark).
export function NumbersIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Text style={{ fontFamily: 'Archivo_800ExtraBold', fontSize: size * 0.86, letterSpacing: -0.5, color }}>123</Text>
  );
}

export function UtensilsIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="6" y1="2" x2="6" y2="9" />
      <Line x1="10" y1="2" x2="10" y2="9" />
      <Path d="M6 9a4 4 0 0 0 4 0" />
      <Line x1="8" y1="9" x2="8" y2="22" />
      <Path d="M17 2c-2 0-3.5 2-3.5 5.5S15 13 17 13" />
      <Line x1="17" y1="13" x2="17" y2="22" />
    </Svg>
  );
}

export function PlaneIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 2 11 13" />
      <Path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </Svg>
  );
}

export function GraduationCapIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 10 12 5 2 10l10 5 10-5z" />
      <Path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
      <Line x1="22" y1="10" x2="22" y2="17" />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="7" width="20" height="14" rx="2.5" />
      <Path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
      <Line x1="2" y1="13" x2="22" y2="13" />
    </Svg>
  );
}

export function MusicIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18V5l11-2v13" />
      <Circle cx="6" cy="18" r="3" />
      <Circle cx="17" cy="16" r="3" />
    </Svg>
  );
}

export function DotsIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Circle cx="5" cy="12" r="2" />
      <Circle cx="12" cy="12" r="2" />
      <Circle cx="19" cy="12" r="2" />
    </Svg>
  );
}

export function SettingsIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function PracticeIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="17 1 21 5 17 9" />
      <Path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <Polyline points="7 23 3 19 7 15" />
      <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Svg>
  );
}

export function QuizIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="8" y="2" width="8" height="4" rx="1" />
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <Path d="m9 14 2 2 4-4" />
    </Svg>
  );
}

export function PathIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <Line x1="8" y1="2" x2="8" y2="18" />
      <Line x1="16" y1="6" x2="16" y2="22" />
    </Svg>
  );
}
