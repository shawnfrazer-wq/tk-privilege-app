import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';
import { crm, Referral } from '../src/crm';
import { useData } from '../src/data';
import { dayMonth, num, pounds, signedPoints } from '../src/format';
import { C, F, ls } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { CopyBtn } from '../src/ui/CopyBtn';
import { Gap } from '../src/ui/Gap';
import { LedgerRow } from '../src/ui/Ledger';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Eyebrow, Small } from '../src/ui/T';
import { figures } from '../src/ui/figures';

// 12 REFER
export default function Refer() {
  const router = useRouter();
  const { summary: s, settings, tierRules, failed } = useData();
  const f = figures(settings, tierRules, s);
  const [listFailed, setListFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [list, setList] = useState<Referral[] | null>(null);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [shareLabel, setShareLabel] = useState('Share your code');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setListFailed(false);
    crm.referrals()
      .then(setList)
      .catch((e) => {
        console.error('app_referrals', e);
        setListFailed(true);
      });
  }, [attempt]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const rows = list ?? [];
  // the code is app_summary referral_code with every space removed (SHAWN 36 is shown, copied and shared as SHAWN36);
  // the CRM makes it once from her first name at the time and keeps it
  const code = (s?.referral_code ?? '').replace(/\s+/g, '');
  // what is shared and copied. The What she will see panel shows the same words, with WhatsApp and email us as links.
  // the points are app_settings'; the pound values are the wireframe's until the CRM sends them (docs/crm-requests.md)
  const line1 = `Come to Tatiana Karelina with my code ${code} and you will get ${num(f.referred)} points, £100, to use on your first visit.`;
  const message = `${line1}\n\nMessage the salon on WhatsApp, call 020 3645 1761 or email us, and give them my code.`;
  const waLink = settings?.contact_whatsapp || 'https://wa.me/447714392999';
  const emailLink = settings?.contact_email || 'mailto:info@tatianakarelina.co.uk';
  const open = (url: string) => Linking.openURL(url).catch((e) => console.error('open link', url, e));

  async function copyCode() {
    await Clipboard.setStringAsync(code);
    setCopyLabel('Copied');
    timers.current.push(setTimeout(() => setCopyLabel('Copy'), 1600));
  }

  async function share() {
    await Clipboard.setStringAsync(message);
    setShareLabel('Copied, now pick an app');
    timers.current.push(setTimeout(() => setShareLabel('Share your code'), 1800));
    try {
      await Share.share({ message });
    } catch {}
  }

  return (
    <Screen tab="more" back onBack={() => router.navigate('/more')} title="Refer a Friend" status={statusOf(s && list, failed || listFailed)} refreshing={false} onRefresh={() => setAttempt((a) => a + 1)}>
      <Gap />
      <Disp>Refer a Friend</Disp>
      <Gap size="s" />
      <Copy>{`${num(f.referrer)} points, £50, for you when she books and pays. She gets ${num(f.referred)} points, £100, to use on her first visit. No limit on how many friends you refer.`}</Copy>
      <View style={r.refbox}>
        <Text style={r.refcode}>{code}</Text>
        <CopyBtn label={copyLabel} onPress={copyCode} accessibilityLabel="Copy your code" style={r.refcopy} />
      </View>
      <Small style={r.centre}>She gives this at reception or in her own app</Small>

      <Gap size="l" />
      <Eyebrow>What she will see</Eyebrow>
      <Gap size="s" />
      <Text style={r.said}>
        {line1}
        {'\n\n'}
        Message the salon on{' '}
        <Text style={r.ul} onPress={() => open(waLink)} accessibilityRole="link">
          WhatsApp
        </Text>
        , call 020 3645 1761 or{' '}
        <Text style={r.ul} onPress={() => open(emailLink)} accessibilityRole="link">
          email us
        </Text>
        , and give them my code.
      </Text>
      <Gap />
      <Btn label={shareLabel} onPress={share} />
      <Gap size="s" />
      <Small>Tap the button and choose WhatsApp, Messages, email or any app on your phone. The message and your code go with it. Your friend gives the code at reception, or puts it in her own app.</Small>

      <Gap size="l" />
      <Eyebrow>Referrals</Eyebrow>
      <Gap size="s" />
      {rows.length === 0 && list !== null && <LedgerRow title="Nobody yet" detail="Friends who use your code will show here" right="" last />}
      {rows.map((x, i) =>
        x.status === 'paid' ? (
          <LedgerRow
            key={i}
            title={x.friend}
            detail={`Used your code, booked and paid${x.happened_on ? `, ${dayMonth(x.happened_on)}` : ''}`}
            right={signedPoints(x.points)}
            rightNote={pounds(x.pounds)}
            last={i === rows.length - 1}
          />
        ) : (
          <LedgerRow key={i} title={x.friend} detail="Used your code, not been in yet" right="Waiting" muted last={i === rows.length - 1} />
        ),
      )}
      <Small>Only shows once someone gives your code at reception or puts it in their own app.</Small>
    </Screen>
  );
}

const r = StyleSheet.create({
  refbox: { position: 'relative' },
  refcode: { fontFamily: F.serif, fontSize: 40, lineHeight: 42, letterSpacing: ls(0.06, 40), color: C.ink, textAlign: 'center', paddingTop: 28, paddingBottom: 6 },
  refcopy: { position: 'absolute', right: 0, top: '50%', marginTop: -12 },
  centre: { textAlign: 'center' },
  said: { backgroundColor: C.band, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 18, fontFamily: F.serif, fontSize: 15, lineHeight: 23, color: C.ink },
  ul: { textDecorationLine: 'underline' },
});
