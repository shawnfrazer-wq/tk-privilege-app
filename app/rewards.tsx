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

// 8 REWARDS. The price list comes from app_price_list. Opens on Colour, with Hair, Davines and All one tap away.
export default function Rewards() {
  const { summary: s, failed, refreshing, refresh } = useData();
  const [rows, setRows] = useState<PriceRow[] | null>(null);
  const [listFailed, setListFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<Mode>('colour');
  const [every, setEvery] = useState(false);

  useEffect(() => {
    setListFailed(false);
    crm.priceList()
      .then(setRows)
      .catch((e) => {
        console.error('app_price_list', e);
        setListFailed(true);
      });
  }, [attempt]);

  // rows carry for_me once the CRM adds it (docs/crm-requests.md); until then every row suits her
  const hasFamily = useMemo(() => (rows ?? []).some((r) => r.for_me !== undefined && r.for_me !== null), [rows]);
  const shown = useMemo(() => {
    let mine = rows ?? [];
    if (hasFamily && !every) mine = mine.filter((r) => r.for_me);
    if (mode !== 'all') mine = mine.filter((r) => r.section === mode || (mode === 'hair' && r.section === 'other'));
    return ORDER.map((k) => ({ key: k, rows: mine.filter((r) => r.section === k) })).filter((g) => g.rows.length);
  }, [rows, hasFamily, every, mode]);

  const retry = () => {
    refresh();
    setAttempt((a) => a + 1);
  };

  return (
    <Screen tab="rewards" title="Rewards" status={statusOf(s && rows, failed || listFailed)} refreshing={refreshing} onRefresh={retry}>
      <Gap />
      <Disp>You Have {pounds(s?.balance_pounds)} to Spend</Disp>
      <Gap size="s" />
      <Copy>{s?.balance_points ? `${num(s.balance_points)} points. Anything on the price list, at any visit.` : '0 points. Your first care visit starts your balance.'}</Copy>
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
      {hasFamily && (
        <>
          <Gap size="s" />
          <TextLink label={every ? 'Show what suits my hair' : 'See everything on the price list'} onPress={() => setEvery((e) => !e)} />
        </>
      )}
      <Gap />
      <Small>Spend them on anything, at any visit, new sets and pieces included. Pay part in points if you like, and at a care visit the cash part still earns as normal.</Small>
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
