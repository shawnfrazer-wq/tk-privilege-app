import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

export const SUPABASE_URL = 'https://fqvwyerheoafulmezyfm.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_jWITKqsg98dIrBIw3Y0DCQ_K1NNBKc2';

const REMEMBER_KEY = 'tk_remember';
const SIGNED_IN_AT_KEY = 'tk_signed_in_at';
export const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// "Keep me signed in for 90 days". On by default.
// On: the session is kept on the phone and she needs a new code 90 days after the last one.
// Off: the session lives in memory only, so every time the app is opened she needs a new code.
let remember = true;
const memory = new Map<string, string>();
const ready = AsyncStorage.getItem(REMEMBER_KEY)
  .then((v) => {
    remember = v !== 'off';
  })
  .catch(() => {});

export async function getRemember(): Promise<boolean> {
  await ready;
  return remember;
}

export async function setRemember(on: boolean): Promise<void> {
  await ready;
  remember = on;
  await AsyncStorage.setItem(REMEMBER_KEY, on ? 'on' : 'off');
}

const storage = {
  getItem: async (key: string) => {
    await ready;
    return remember ? AsyncStorage.getItem(key) : memory.get(key) ?? null;
  },
  setItem: async (key: string, value: string) => {
    await ready;
    if (remember) await AsyncStorage.setItem(key, value);
    else memory.set(key, value);
  },
  removeItem: async (key: string) => {
    memory.delete(key);
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'salon' },
  auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

// Called once the code has been verified.
export async function markSignedIn(): Promise<void> {
  await AsyncStorage.setItem(SIGNED_IN_AT_KEY, String(Date.now()));
}

// Called when the app opens. True when she can go straight in.
export async function sessionStillGood(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  const at = Number(await AsyncStorage.getItem(SIGNED_IN_AT_KEY));
  if (!at || Date.now() - at > NINETY_DAYS_MS) {
    await signOut();
    return false;
  }
  return true;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SIGNED_IN_AT_KEY);
  await supabase.auth.signOut();
}
