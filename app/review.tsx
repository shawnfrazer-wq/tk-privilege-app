import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { crm } from '../src/crm';
import { useData } from '../src/data';
import { openOutside } from '../src/links';
import { draftKey } from '../src/supabase';
import { C, F, ls } from '../src/theme';
import { CopyBtn } from '../src/ui/CopyBtn';
import { TextArea } from '../src/ui/Field';
import { Gap } from '../src/ui/Gap';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Hint, Small } from '../src/ui/T';
import { figures } from '../src/ui/figures';
import { num } from '../src/format';

const markGoogle = require('../assets/mark_google.png');
const markTrustpilot = require('../assets/mark_trustpilot.png');
const GOOGLE_FALLBACK = 'https://g.page/r/CWVX24-xJAz7EBM/review';
const LONG_ENOUGH = 60;

// 13 REVIEW. The draft is kept on the phone under the signed in client's own key, so it survives leaving the app,
// backgrounding and a force quit, is cleared on sign out, and is never shown to another account.
export default function Review() {
  const router = useRouter();
  const { settings, tierRules, summary, failed, refreshing, refresh } = useData();
  const f = figures(settings, tierRules, summary);
  const [text, setText] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = useRef<string | null>(null);

  useEffect(() => {
    draftKey()
      .then(async (k) => {
        key.current = k;
        const v = k ? await AsyncStorage.getItem(k) : null;
        if (v !== null) setText(v);
      })
      .catch(() => {});
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function change(v: string) {
    setText(v);
    if (key.current) AsyncStorage.setItem(key.current, v).catch(() => {});
  }

  async function copy() {
    await Clipboard.setStringAsync(text.trim());
    setCopyLabel('Copied');
    timer.current = setTimeout(() => setCopyLabel('Copy'), 1600);
  }

  // copies the review and records the tap for the desk's Review claims list, then opens the site.
  // Google goes to Safari or the Google app (the in-app browser would not open it), with the g.page link
  // as the fallback if the CRM's link cannot be opened. Trustpilot opens in the in-app browser, so Done
  // brings her straight back here. The links are whatever app_settings returns.
  async function share(platform: 'google' | 'trustpilot', link: string) {
    await Clipboard.setStringAsync(text.trim());
    try {
      await crm.reviewTap(platform);
    } catch (e) {
      console.error('app_review_tap', e);
    }
    if (platform === 'google') {
      try {
        await Linking.openURL(link);
      } catch (e) {
        console.error('google review link', link, e);
        await Linking.openURL(GOOGLE_FALLBACK).catch((e2) => console.error('google review fallback', e2));
      }
      return;
    }
    await openOutside(link);
  }

  const n = text.trim().length;
  const short = n > 0 && n < LONG_ENOUGH;
  const google = settings?.google_review_link;
  const trustpilot = settings?.trustpilot_review_link;

  return (
    <Screen tab="more" back onBack={() => router.navigate('/more')} title="Review" status={statusOf(settings, failed)} refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <Disp>Tell Us How It Went</Disp>
      <Gap size="s" />
      <Copy>{`${num(f.review)} points for sharing it to one, ${num(f.reviewBoth)} for both. Once every ${num(f.reviewMonths)} months.`}</Copy>
      <View style={v.field}>
        <View style={v.labrow}>
          <Text style={v.label}>Your review</Text>
          <CopyBtn label={copyLabel} onPress={copy} accessibilityLabel="Copy your review" />
        </View>
        <TextArea value={text} onChangeText={change} rows={5} placeholder="What you had done, how it turned out, and how it has lasted." />
        <Hint style={short ? { color: C.gold } : undefined}>
          {short ? 'A little more detail helps, another sentence or two.' : 'The reviews people find most useful say what was done and how it has held up.'}
        </Hint>
        <Hint>Tapping below copies this and opens the site. It is kept here either way, so you can come back and post it to the other one.</Hint>
      </View>
      <Gap size="l" />
      {!!google && (
        <Pressable onPress={() => share('google', google)} style={v.brand} accessibilityRole="button" accessibilityLabel="Google Reviews">
          <Image source={markGoogle} style={{ height: 26, width: 26 * (560 / 225) }} resizeMode="contain" />
        </Pressable>
      )}
      {!!google && !!trustpilot && <Gap size="s" />}
      {!!trustpilot && (
        <Pressable onPress={() => share('trustpilot', trustpilot)} style={v.brand} accessibilityRole="button" accessibilityLabel="Trustpilot">
          <Image source={markTrustpilot} style={{ height: 36, width: 36 * (640 / 299) }} resizeMode="contain" />
        </Pressable>
      )}
      <Gap />
      <Gap />
      <Small>We never ask for a particular rating and the points do not depend on what you write.</Small>
    </Screen>
  );
}

const v = StyleSheet.create({
  field: { gap: 6, marginTop: 20 },
  labrow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontFamily: F.med, fontSize: 10, letterSpacing: ls(0.18, 10), textTransform: 'uppercase', color: C.mute },
  brand: { height: 52, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: C.hair, alignItems: 'center', justifyContent: 'center' },
});
