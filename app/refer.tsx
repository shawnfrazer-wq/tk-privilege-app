import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { crm, Referral } from '../src/crm';
import { useData } from '../src/data';
import { dayMonth, pounds, signedPoints } from '../src/format';
import { C, F, ls } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { CopyBtn } from '../src/ui/CopyBtn';
import { Gap } from '../src/ui/Gap';
import { LedgerRow } from '../src/ui/Ledger';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Eyebrow, Small } from '../src/ui/T';

// 12 REFER
export default function Refer() {
  const { summary: s, failed } = useData();
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
  const code = s?.referral_code ?? '';
  const message = `Come to Tatiana Karelina with my code ${code} and you will get 1,000 points, £100, to use on your first visit.`;

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
    <Screen tab="home" back title="Refer a Friend" status={statusOf(s && list, failed || listFailed)} refreshing={false} onRefresh={() => setAttempt((a) => a + 1)}>
      <Gap />
      <Disp>Refer a Friend</Disp>
      <Gap size="s" />
      <Copy>500 points, £50, for you when she books and pays. She gets 1,000 points, £100, to use on her first visit. No limit on how many friends you refer.</Copy>
      <View style={r.refbox}>
        <Text style={r.refcode}>{code}</Text>
        <CopyBtn label={copyLabel} onPress={copyCode} accessibilityLabel="Copy your code" style={r.refcopy} />
      </View>
      <Small style={r.centre}>She gives this at reception or in her own app</Small>

      <Gap size="l" />
      <Eyebrow>What she will see</Eyebrow>
      <Gap size="s" />
      <Text style={r.said}>{message}</Text>
      <Gap />
      <Btn label={shareLabel} onPress={share} />
      <Gap size="s" />
      <Small>Press the button and the message and code are copied. Send it by your preferred method.</Small>

      <Gap size="l" />
      <Eyebrow>Recently earned</Eyebrow>
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
      <Small>Only shows once someone gives your code at reception or puts it in their own app. We have no way of knowing who you sent it to.</Small>
    </Screen>
  );
}

const r = StyleSheet.create({
  refbox: { position: 'relative' },
  refcode: { fontFamily: F.serif, fontSize: 40, lineHeight: 42, letterSpacing: ls(0.06, 40), color: C.ink, textAlign: 'center', paddingTop: 28, paddingBottom: 6 },
  refcopy: { position: 'absolute', right: 0, top: '50%', marginTop: -12 },
  centre: { textAlign: 'center' },
  said: { backgroundColor: C.band, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 18, fontFamily: F.serif, fontSize: 15, lineHeight: 23, color: C.ink },
});
