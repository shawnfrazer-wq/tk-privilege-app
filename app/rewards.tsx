import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { crm, PriceRow } from '../src/crm';
import { useData } from '../src/data';
import { num, pounds } from '../src/format';
import { C, F, ls } from '../src/theme';
import { TextLink } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Small } from '../src/ui/T';

type Mode = 'colour' | 'hair' | 'davines' | 'all';
const FILTERS: [Mode, string][] = [
  ['colour', 'Colour'],
  ['hair', 'Hair'],
  ['davines', 'Davines'],
  ['all', 'All'],
];
const ORDER: PriceRow['section'][] = ['colour', 'other', 'hair', 'davines'];
const SECTION: Record<PriceRow['section'], string> = { colour: 'Colour', other: 'For Your Hair', hair: 'Cuts, Styling and Treatments', davines: 'Davines' };

// 8 REWARDS. Only what she can have today with her TK Points, filtered to her hair. Opens on Colour.
export default function Rewards() {
  const router = useRouter();
  const { summary: s, failed, refreshing, refresh } = useData();
  const [rows, setRows] = useState<PriceRow[] | null>(null);
  const [listFailed, setListFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<Mode>('colour');

  useEffect(() => {
    setListFailed(false);
    crm.priceList()
      .then(setRows)
      .catch((e) => {
        console.error('app_price_list', e);
        setListFailed(true);
      });
  }, [attempt]);

  const fam = s?.family ?? null;
  const balance = s?.balance_points ?? 0;
  const shown = useMemo(() => {
    let mine = (rows ?? []).filter((r) => (r.family === 'all' || r.family === fam) && r.points <= balance);
    if (mode !== 'all') mine = mine.filter((r) => r.section === mode || (mode === 'hair' && r.section === 'other'));
    return ORDER.map((k) => ({ key: k, rows: mine.filter((r) => r.section === k) })).filter((g) => g.rows.length);
  }, [rows, fam, balance, mode]);

  const retry = () => {
    refresh();
    setAttempt((a) => a + 1);
  };
  const status = statusOf(s && rows, failed || listFailed);

  if (s && !balance) {
    return (
      <Screen tab="rewards" title="Rewards" status={status} refreshing={refreshing} onRefresh={retry}>
        <Gap />
        <Disp>Your Rewards</Disp>
        <Gap size="s" />
        <Copy>
          Nothing to spend yet. Your {s.has_had_maintenance === false ? 'first' : 'next'} maintenance earns TK Points, and everything you can have with them will show here.
        </Copy>
        <Gap size="s" />
        <TextLink label="How points work" onPress={() => router.push('/how-points-work')} />
      </Screen>
    );
  }

  const lead = s?.best_reward_name
    ? `${num(balance)} TK Points. That is a free ${s.best_reward_name} today, with ${pounds(s.best_reward_spare_pounds)} to spare.`
    : `${num(balance)} TK Points. Anything on the price list, at any visit.`;

  return (
    <Screen tab="rewards" title="Rewards" status={status} refreshing={refreshing} onRefresh={retry}>
      <Gap />
      <Disp>You Have {pounds(s?.balance_pounds)} to Spend</Disp>
      <Gap size="s" />
      <Copy>{lead}</Copy>
      <View style={r.filters}>
        {FILTERS.map(([m, label]) => {
          const on = m === mode;
          return (
            <Pressable key={m} onPress={() => setMode(m)} style={[r.filter, on && r.filterOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
              <Text style={[r.filterText, on && { color: '#fff' }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Gap size="s" />
      {shown.map((g) => (
        <View key={g.key}>
          {mode === 'all' && <Text style={r.famnote}>{SECTION[g.key]}</Text>}
          {g.rows.map((row, i) => (
            <View key={row.id} style={[r.reward, i === g.rows.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={r.name}>{row.name}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={r.pts}>{num(row.points)}</Text>
                <Text style={r.price}>{pounds(row.price)}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
      <Gap />
      <Small>Everything here is yours today with your TK Points, at any visit. Pay part in TK Points if you like, and at a maintenance the cash part still earns as normal.</Small>
    </Screen>
  );
}

const r = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8, marginTop: 16 },
  filter: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.hair, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 4, alignItems: 'center' },
  filterOn: { backgroundColor: C.ink, borderColor: C.ink },
  filterText: { fontFamily: F.reg, fontSize: 10.5, letterSpacing: ls(0.1, 10.5), textTransform: 'uppercase', color: C.ink },
  famnote: { fontFamily: F.semi, fontSize: 10.5, letterSpacing: ls(0.14, 10.5), textTransform: 'uppercase', color: C.mute, marginTop: 22, marginBottom: 2 },
  reward: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  name: { flex: 1, fontFamily: F.reg, fontSize: 13, color: C.ink },
  pts: { fontFamily: F.reg, fontSize: 12.5, color: C.ink, fontVariant: ['tabular-nums'] },
  price: { fontFamily: F.reg, fontSize: 11, color: C.mute, marginTop: 2, fontVariant: ['tabular-nums'] },
});
