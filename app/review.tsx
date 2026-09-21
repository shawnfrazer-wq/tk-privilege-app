import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { crm } from '../src/crm';
import { useData } from '../src/data';
import { C, F, ls } from '../src/theme';
import { CopyBtn } from '../src/ui/CopyBtn';
import { TextArea } from '../src/ui/Field';
import { Gap } from '../src/ui/Gap';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Hint, Small } from '../src/ui/T';

const markGoogle = require('../assets/mark_google.png');
const markTrustpilot = require('../assets/mark_trustpilot.png');
const DRAFT_KEY = 'tk_review';
const LONG_ENOUGH = 60;

// 13 REVIEW. The draft is kept on the phone, so it survives leaving the app, backgrounding and a force quit.
export default function Review() {
  const router = useRouter();
  const { settings, failed, refreshing, refresh } = useData();
  const [text, setText] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(DRAFT_KEY)
      .then((v) => {
        if (v !== null) setText(v);
      })
      .catch(() => {});
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function change(v: string) {
    setText(v);
    AsyncStorage.setItem(DRAFT_KEY, v).catch(() => {});
  }

  async function copy() {
    await Clipboard.setStringAsync(text.trim());
    setCopyLabel('Copied');
    timer.current = setTimeout(() => setCopyLabel('Copy'), 1600);
  }

  // copies the review, records the tap for the desk's Review claims list, opens the site
  async function share(platform: 'google' | 'trustpilot', link: string) {
    await Clipboard.setStringAsync(text.trim());
    crm.reviewTap(platform).catch(() => {});
    Linking.openURL(link).catch(() => {});
    router.navigate('/home');
  }

  const n = text.trim().length;
  const short = n > 0 && n < LONG_ENOUGH;
  const google = settings?.google_review_link;
  const trustpilot = settings?.trustpilot_review_link;

  return (
    <Screen tab="home" back title="Review" status={statusOf(settings, failed)} refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <Disp>Tell Us How It Went</Disp>
      <Gap size="s" />
      <Copy>250 points for sharing it to one, 500 for both. Once every 6 months.</Copy>
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
