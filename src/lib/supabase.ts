import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as aesjs from 'aes-js';
import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// SecureStore entries are capped at ~2KB, too small for a Supabase session
// blob — so the session is AES-encrypted with a small random key, the key
// lives in SecureStore, and only the (larger) ciphertext lives in
// AsyncStorage. This is Supabase's documented pattern for Expo apps.
class LargeSecureStore {
  private async encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async decrypt(key: string, value: string): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;
    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this.encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}

// createClient throws immediately on an empty/invalid URL, and the app must
// keep working with no backend configured at all — so an unconfigured setup
// gets a harmless placeholder URL. isSupabaseConfigured gates every real
// call, so this client is simply never used in that case.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: Platform.OS === 'web' ? undefined : new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
    // localtunnel (loca.lt) serves an HTML click-through interstitial to
    // real browser requests instead of proxying them — this header tells
    // it to skip that page. Harmless no-op against any other host.
    global: {
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
    },
  }
);

// Starts the Google OAuth (PKCE) flow. Web hands the whole tab off to
// Google and comes back with `?code=` in the URL — see
// completeWebOAuthRedirect below. Native opens the consent screen in an
// in-app browser and gets the redirect URL back directly from the promise,
// so it can exchange the code right here without a separate listener.
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: 'Not configured.' };
  const redirectTo = Platform.OS === 'web' ? window.location.origin : Linking.createURL('/');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) return { error: error?.message ?? 'Could not start Google sign-in.' };

  if (Platform.OS === 'web') {
    window.location.href = data.url;
    return { error: null };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return { error: null }; // user backed out — not a failure to report
  const code = new URL(result.url).searchParams.get('code');
  if (!code) return { error: 'Sign-in failed. Please try again.' };
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  return { error: exchangeError?.message ?? null };
}

// Sign in with Apple — iOS/tvOS only (there's no Android or web equivalent).
// Unlike Google, this never leaves the app: the OS shows its own native
// consent sheet and hands back a signed identity token directly, which
// Supabase verifies itself against Apple's public keys.
export async function signInWithApple(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: 'Not configured.' };
  if (Platform.OS !== 'ios') return { error: 'Sign in with Apple is only available on iOS.' };
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) return { error: 'Sign-in failed. Please try again.' };
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    return { error: error?.message ?? null };
  } catch (e: any) {
    if (e?.code === 'ERR_REQUEST_CANCELED') return { error: null }; // user backed out
    return { error: 'Sign-in failed. Please try again.' };
  }
}

// Extracts a Supabase PKCE `code` from a redirect URL (magic link or OAuth)
// and exchanges it for a session — shared by the web and native
// redirect-completion paths below.
async function exchangeCodeFromUrl(url: string): Promise<void> {
  const code = new URL(url).searchParams.get('code');
  if (code) await supabase.auth.exchangeCodeForSession(code);
}

// Call once on app mount (web only — see subscribeToNativeAuthRedirect for
// native) to finish a Google sign-in or magic-link sign-in the browser just
// redirected back from.
export async function completeWebOAuthRedirect(): Promise<void> {
  if (Platform.OS !== 'web') return;
  await exchangeCodeFromUrl(window.location.href);
  const url = new URL(window.location.href);
  if (url.searchParams.has('code')) {
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
  }
}

// Native equivalent of completeWebOAuthRedirect, for the one redirect
// signInWithGoogle can't hand back directly: a magic-link email opened from
// outside the app (the Mail app, not the in-app browser session) arrives as
// a deep link rather than a promise resolving in place — so it needs its
// own listener, plus a cold-start check for the case where tapping the link
// is what launched the app. Call once on mount; call the returned cleanup
// on unmount.
export function subscribeToNativeAuthRedirect(): () => void {
  if (Platform.OS === 'web') return () => {};
  Linking.getInitialURL().then((url) => {
    if (url) exchangeCodeFromUrl(url);
  });
  const sub = Linking.addEventListener('url', ({ url }) => {
    exchangeCodeFromUrl(url);
  });
  return () => sub.remove();
}
