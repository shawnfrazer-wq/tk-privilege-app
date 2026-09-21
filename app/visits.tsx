import React, { useEffect } from 'react';
import { useData } from '../src/data';
import { dayMonthYear, num } from '../src/format';
import { Gap } from '../src/ui/Gap';
import { LedgerRow } from '../src/ui/Ledger';
import { Screen, statusOf } from '../src/ui/Screen';
import { Disp } from '../src/ui/T';

const RECENT = 5;

// 10 YOUR RECENT VISITS: her last 5, newest first. A top up says so. A visit from before the scheme
// shows the service, date and stylist only, with no points column.
export default function VisitsScreen() {
  const { visits: v, visitsFailed, loadVisits, refreshing, refresh } = useData();
  useEffect(() => {
    if (!v) loadVisits();
  }, [v, loadVisits]);
  const retry = () => {
    refresh();
    if (!v) loadVisits();
  };
  const list = (v?.visits ?? []).slice(0, RECENT);

  return (
    <Screen tab="visits" title="Your Recent Visits" refreshing={refreshing} onRefresh={retry} status={statusOf(v, visitsFailed)}>
      <Gap />
      <Disp>Your Recent Visits</Disp>
      <Gap size="s" />
      {list.map((x, i) => {
        const last = i === list.length - 1;
        const topUp = x.counted === false && !x.new_set && x.points != null;
        const detail = [dayMonthYear(x.d), x.stylists].filter(Boolean).join(', ') + (topUp ? '. Top up. Points added to your next maintenance.' : '');
        if (x.points == null) return <LedgerRow key={i} title={x.title ?? ''} detail={detail} right="" last={last} />;
        return <LedgerRow key={i} title={x.title ?? ''} detail={detail} right={num(x.points)} rightNote={x.status} last={last} />;
      })}
    </Screen>
  );
}
