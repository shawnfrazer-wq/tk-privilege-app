import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tier, TierPerk } from '../src/crm';
import { useData } from '../src/data';
import { num, pounds } from '../src/format';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Know } from '../src/ui/Rows';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect, Small } from '../src/ui/T';

const TIERS: Tier[] = ['silver', 'gold', 'black'];
const NO = '✗';
const YES = '✓';

type Row = { label: string; cell: (p: TierPerk) => string };
const ROWS: Row[] = [
  { label: 'Points per £1', cell: (p) => String(p.earn_rate) },
  { label: 'Colour discount', cell: (p) => `${num(p.colour_discount_pct)}%` },
  { label: 'Davines discount', cell: (p) => `${num(p.davines_discount_pct)}%` },
  { label: 'Free colour', cell: (p) => (p.free_colour_pounds ? pounds(p.free_colour_pounds) : NO) },
  { label: 'Maintenance perk', cell: (p) => (p.maintenance_perk ? YES : NO) },
  { label: 'Birthday points', cell: (p) => (p.birthday_points ? num(p.birthday_points) : NO) },
  { label: 'Davines gift', cell: (p) => (p.davines_gift_pounds ? pounds(p.davines_gift_pounds) : NO) },
];

// 8 TIER PERKS. The table is app_tier_perks, her column highlighted.
export default function TierPerks() {
  const { summary: s, tierPerks, failed, refreshing, refresh } = useData();
  if (!s || !tierPerks) {
    return <Screen tab="card" back title="Tier Perks" refreshing={refreshing} onRefresh={refresh} status={statusOf(s && tierPerks, failed)}>{null}</Screen>;
  }
  const perk = (t: Tier) => tierPerks.find((p) => p.tier === t) ?? null;
  const mine = (t: Tier) => t === s.tier;

  return (
    <Screen tab="card" back title="Tier Perks" refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <Disp>Tier Perks</Disp>
      <Gap size="s" />
      <Copy>Every member gets: the booking bonus, the Care Card, refer a friend, review points and 50% off your first colour.</Copy>
      <Gap />
      <View style={p.table}>
        <View style={p.tr}>
          <View style={p.th} />
          {TIERS.map((t) => (
            <View key={t} style={[p.td, mine(t) && p.mineHead]}>
              <Text style={[p.head, mine(t) && { color: C.gold }]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </View>
          ))}
        </View>
        {ROWS.map((row) => (
          <View key={row.label} style={p.tr}>
            <View style={p.th}>
              <Text style={p.label}>{row.label}</Text>
            </View>
            {TIERS.map((t) => {
              const pk = perk(t);
              const v = pk ? row.cell(pk) : '';
              return (
                <View key={t} style={[p.td, mine(t) && p.mine]}>
                  <Text style={[p.cell, v === NO && { color: '#B9B4AD' }]}>{v}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <Gap size="s" />
      <Small>Your tier is highlighted.</Small>

      <Gap />
      <Sect>What Each Perk Means</Sect>
      <Gap size="s" />
      <Know title="Colour discount" body="Taken off any colour service at the till." />
      <Know title="Davines discount" body="Taken off any Davines product at the till." />
      <Know title="Free colour" body="An amount to spend on any colour service you choose, given each year you hold Gold or Black." />
      <Know title="Maintenance perk" body="A complimentary wash and blow dry with your maintenance: every second maintenance for Gold, every maintenance for Black." />
      <Know title="Birthday points" body="Added to your balance on your birthday." />
      <Know title="Davines gift" body="Davines products of your choice, given each year you hold Gold or Black." last />

      <Gap />
      <Copy>New to colour with us? Your first colour is half price.</Copy>
    </Screen>
  );
}

const p = StyleSheet.create({
  table: { marginTop: 4 },
  tr: { flexDirection: 'row' },
  th: { flex: 1.5, justifyContent: 'center', paddingVertical: 11, paddingRight: 6, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  td: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  mine: { backgroundColor: '#F6F1E8' },
  mineHead: { backgroundColor: '#F6F1E8', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  head: { fontFamily: F.serif, fontSize: 15, color: C.ink, paddingTop: 6 },
  label: { fontFamily: F.reg, fontSize: 12.5, color: C.grey },
  cell: { fontFamily: F.reg, fontSize: 12.5, color: C.ink },
});
