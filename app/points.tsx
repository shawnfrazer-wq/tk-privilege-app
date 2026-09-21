import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LedgerLine } from '../src/crm';
import { useData } from '../src/data';
import { num, pounds, signedPoints } from '../src/format';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { LedgerRow } from '../src/ui/Ledger';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';
import { Waiting } from '../src/ui/Waiting';

function line(l: LedgerLine, last: boolean) {
  if (l.status === 'pending') {
    return <LedgerRow title={l.title} detail={l.detail} right={num(l.points)} rightNote="pending" gold last={last} />;
  }
  if (l.status === 'lapsed') {
    return <LedgerRow title={l.title} detail={l.detail} right="0" last={last} />;
  }
  return <LedgerRow title={l.title} detail={l.detail} right={signedPoints(l.points)} rightNote={pounds(l.pounds)} last={last} />;
}

// 7 HER POINTS
export default function Points() {
  const { summary: s, ledger, failed, ledgerFailed, loadLedger, refreshing, refresh } = useData();
  useEffect(() => {
    if (!ledger) loadLedger();
  }, [ledger, loadLedger]);
  const status = statusOf(s && ledger, failed || ledgerFailed);
  const retry = () => {
    refresh();
    if (!ledger) loadLedger();
  };

  return (
    <Screen tab="card" back title="Your TK Points" refreshing={refreshing} onRefresh={retry} status={status}>
      <Gap />
      <Disp>Your TK Points</Disp>
      <Gap size="s" />
      {s && (
        <>
          <View style={p.balance}>
            <View style={p.left}>
              <Text style={p.big}>{num(s.balance_points)}</Text>
              <Text style={p.unit}>TK Points</Text>
            </View>
            <Text style={p.gbp}>{pounds(s.balance_pounds)}</Text>
          </View>
          <Copy>Yours to spend on anything, at any visit. 10 TK Points is £1.</Copy>
          <Gap />
          <Waiting summary={s} />
        </>
      )}

      <Gap size="l" />
      <Sect>Every Line</Sect>
      <Gap size="s" />
      {(ledger ?? []).map((l, i, all) => (
        <React.Fragment key={`${l.line_date}-${i}`}>{line(l, i === all.length - 1)}</React.Fragment>
      ))}
    </Screen>
  );
}

const p = StyleSheet.create({
  balance: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, paddingTop: 18, paddingBottom: 4 },
  left: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  big: { fontFamily: F.serif, fontSize: 48, lineHeight: 50, color: C.ink },
  unit: { fontFamily: F.med, fontSize: 11, letterSpacing: 1.76, textTransform: 'uppercase', color: C.mute },
  gbp: { fontFamily: F.reg, fontSize: 15, color: C.gold },
});
