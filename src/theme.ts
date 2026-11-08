// Design tokens ported from the "Modernist" design system (Archivo, sharp
// corners, warm red accent). Source of truth: the Claude Design project.

export const colors = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  text: '#201e1d',
  // "Bumble yellow" — bright and saturated, unlike the darker ambers this
  // replaced, so anything sitting ON TOP of it needs dark text/icons, not
  // light ones (see onAccent below).
  accent: '#ffc629',
  divider: 'rgba(32,30,29,0.4)',

  neutral100: '#f8f4f4',
  neutral200: '#eae7e7',
  neutral300: '#d7d3d3',
  neutral500: '#9b9797',
  neutral600: '#7d7979',
  neutral800: '#444141',

  accent100: '#fff7d6',
  accent600: '#e6b000',
  accent700: '#a67c00',
  accent800: '#7a5c00',
  // The readable color for text/icons drawn on top of an accent-colored
  // surface (buttons, badges, filled chips) — dark here since accent is a
  // bright yellow, unlike a darker accent where white would read fine.
  onAccent: '#201e1d',

  success: '#1f9d55',
  success100: '#eaf7ee',
  success600: '#1f9d55',
  success700: '#15803d',
  success800: '#0f5c2c',

  danger: '#dc2626',
  danger100: '#fdeceb',
  danger600: '#dc2626',
  danger700: '#b91c1c',
  danger800: '#7f1414',

  // "You picked this, not checked yet" indicator — border + tint only (the
  // option's own text/label stays colors.text/black; select itself is too
  // low-contrast to double as a text color on the light select100 tint).
  select: '#a67c00',
  select100: '#fff7d6',

  // Speaker colors for reply() chat steps — blue for male, pink for female.
  // A fixed blue independent of `select` above, since reply() options also
  // use `select` for their own "picked, not checked yet" state and the two
  // meanings need to stay visually distinct within the same screen.
  maleSpeaker: '#2f6fed',
  pink: '#db2777',
  pink100: '#fdf2f8',

  white: '#ffffff',
};

export const textMuted = (opacity: number) => `rgba(32,30,29,${opacity})`;

// One color per course subject, cycled by index — gives the path map a
// distinct identity per subject instead of one flat accent color end to
// end. Ported 1:1 from the design's PATH_PALETTE.
// onBase is the readable color for text/icons drawn directly on `base` —
// white for every entry dark enough to carry it, except the bright yellow
// first entry, which needs dark text/icons instead (see colors.onAccent).
export const PATH_PALETTE = [
  { base: '#ffc629', dark: '#a67c00', tint: '#fff7d6', shadow: 'rgba(255,198,41,0.45)', onBase: '#201e1d' },
  { base: '#2f6fed', dark: '#1d4ed8', tint: '#eef3fe', shadow: 'rgba(47,111,237,0.38)', onBase: '#ffffff' },
  { base: '#1f9d55', dark: '#0f5c2c', tint: '#eaf7ee', shadow: 'rgba(31,157,85,0.35)', onBase: '#ffffff' },
  { base: '#ca8a04', dark: '#854d0e', tint: '#fef9c3', shadow: 'rgba(202,138,4,0.38)', onBase: '#ffffff' },
  { base: '#7c3aed', dark: '#5b21b6', tint: '#f3edfe', shadow: 'rgba(124,58,237,0.35)', onBase: '#ffffff' },
  { base: '#0d9488', dark: '#0f766e', tint: '#e6f7f5', shadow: 'rgba(13,148,136,0.35)', onBase: '#ffffff' },
] as const;

export const fonts = {
  heading: 'Archivo_800ExtraBold',
  body: 'Archivo_400Regular',
  bodySemibold: 'Archivo_600SemiBold',
};

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 };

// A bit of a circle, not a sharp square — the standard corner rounding for
// buttons, options, chips, and tiles throughout the app.
export const radius = 12;
