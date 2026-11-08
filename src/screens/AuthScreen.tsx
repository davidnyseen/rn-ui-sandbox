import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as AppleAuthentication from 'expo-apple-authentication';
import { colors, fonts, radius, textMuted } from '../theme';
import { Button } from '../components/Button';
import { signInWithApple, signInWithGoogle } from '../lib/supabase';

// The official Google "G" mark — its four brand colors are part of Google's
// sign-in button guidelines, so unlike the app's other single-color icons
// this one is defined locally with its real palette rather than taking a
// `color` prop.
function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22 12.2c0-.7-.06-1.4-.2-2H12v3.8h5.7c-.25 1.3-1 2.4-2.1 3.2v2.6h3.4c2-1.8 3-4.5 3-7.6z" />
      <Path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.94.65-2.16 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.7 8 22 12 22z" />
      <Path fill="#FBBC05" d="M6.2 13.6A6 6 0 0 1 6.2 10.4V7.7H2.7a10 10 0 0 0 0 8.6l3.5-2.7z" />
      <Path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 12 2C8 2 4.4 4.3 2.7 7.7l3.5 2.7C7 7.8 9.3 5.4 12 5.4z" />
    </Svg>
  );
}

export function AuthScreen({ onClose }: { onClose?: () => void }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error: googleError } = await signInWithGoogle();
    // On web this never resolves before the browser navigates away; on
    // native it resolves once the in-app browser closes, success or not.
    setGoogleLoading(false);
    if (googleError) setError(googleError);
  };

  const submitApple = async () => {
    setError(null);
    const { error: appleError } = await signInWithApple();
    if (appleError) setError(appleError);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.kicker}>Thai · Beginner to intermediate</Text>
        <Text style={styles.title}>Start learning Thai.</Text>
        <Text style={styles.subtitle}>One step, whether you're new here or coming back.</Text>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={radius}
            style={styles.appleBtn}
            onPress={submitApple}
          />
        )}
        <Pressable style={styles.googleBtn} onPress={submitGoogle} disabled={googleLoading}>
          {googleLoading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <GoogleIcon />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.legal}>
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
      <View>
        {onClose && (
          <Button variant="ghost" onPress={onClose}>
            Not now
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 24, justifyContent: 'space-between' },
  body: {},
  kicker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.accent700, marginBottom: 10 },
  title: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 28 },
  appleBtn: { width: '100%', height: 44, marginBottom: 12 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', minHeight: 44, borderWidth: 2, borderColor: colors.divider, borderRadius: radius,
    backgroundColor: colors.white,
  },
  googleBtnText: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.text },
  error: { color: colors.accent700, fontSize: 13, marginTop: 10 },
  legal: { fontSize: 12, lineHeight: 18, color: textMuted(0.45), textAlign: 'center', marginTop: 14 },
});
