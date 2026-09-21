import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tier } from '../src/crm';
import { useData } from '../src/data';
import { monthYear, num, pounds } from '../src/format';
import { C, F } from '../src/theme';
import { Btn, TextLink } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { PrivilegeCard, TierSurface } from '../src/ui/PrivilegeCard';
import { Screen } from '../src/ui/Screen';
import { Copy, Sect, Small } from '../src/ui/T';
import { TIER_INFO, tierName, track } from '../src/ui/tiers';
import { Waiting } from '../src/ui/Waiting';

const badgeApple = require('../assets/badge_apple.png');
const badgeGoogle = require('../assets/badge_google.png');
const TIERS: Tier[] = ['silver', 'gold', 'black'];

// 5 CARD
export default function Card() {
  const router = useRouter();
  const { summary: s, refreshing, refresh } = useData();
  const [sheet, setSheet] = useState<Tier | null>(null);

  if (!s) {
    return <Screen tab="card" title="Your Card" refreshing={refreshing} onRefresh={refresh}>{null}</Screen>;
  }
  const t = track(s);

  return (
    <Screen tab="card" title="Your Card" refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <PrivilegeCard
        tier={s.tier}
        name={[s.first_name, s.last_name].filter(Boolean).join(' ')}
        since={`Client since ${monthYear(s.client_since)}`}
        right={s.card_number ?? ''}
      />
      <Gap size="s" />
      <Small style={c.centre}>Reception will find you by name. Nothing to scan.</Small>

      {/* Wallet passes are stage 3. The badges are drawn as the wireframe shows them and are wired then. */}
      <View style={c.wallets}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add to Apple Wallet">
          <Image source={badgeApple} style={{ height: 44, width: 44 * (738 / 228) }} resizeMode="contain" />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Add to Google Wallet">
          <Image source={badgeGoogle} style={{ height: 44, width: 44 * (738 / 210) }} resizeMode="contain" />
        </Pressable>
      </View>
      <Gap size="s" />
      <Small style={c.centre}>Keep it with your other cards. It updates itself.</Small>

      <View style={c.balance}>
        <View style={c.balanceLeft}>
          <Text style={c.big}>{num(s.balance_points)}</Text>
          <Text style={c.unit}>points</Text>
        </View>
        <Text style={c.gbp}>{pounds(s.balance_pounds)}</Text>
      </View>
      <Copy>10 points is £1, off anything on our price list, at any visit.</Copy>
      <Gap size="s" />
      <TextLink label="How points work" onPress={() => router.push('/how-points-work')} />

      {!!s.pending_points && (
        <>
          <Gap />
          <Waiting summary={s} />
        </>
      )}

      <Gap size="l" />
      <Sect>You Are {tierName(s.tier)}</Sect>
      <View style={c.chips}>
        {TIERS.map((tier) => {
          const on = tier === s.tier;
          return (
            <Pressable key={tier} onPress={() => setSheet(tier)} style={[c.chipWrap, on && c.chipOn]} accessibilityRole="button">
              <TierSurface tier={tier} style={c.chip}>
                <Text style={[c.chipText, tier === 'silver' && { color: '#181818' }]}>{tierName(tier)}</Text>
              </TierSurface>
            </Pressable>
          );
        })}
      </View>
      <View style={c.track}>
        <Text style={c.trackLine}>{t.line}</Text>
        <Text style={c.trackSub}>{t.sub}</Text>
        <View style={c.bar}>
          <View style={[c.fill, { width: `${Math.round(t.fill * 100)}%` }]} />
        </View>
      </View>
      <Gap size="s" />
      <Small>Counted on care visits in a rolling 12 months, never on what you spend. Tap a tier to see what it gives.</Small>

      <Modal visible={!!sheet} transparent animationType="fade" onRequestClose={() => setSheet(null)}>
        <Pressable style={c.sheet} onPress={() => setSheet(null)}>
          <Pressable style={c.inner} onPress={() => {}}>
            {sheet && (
              <>
                <Text style={c.h4}>{tierName(sheet)}</Text>
                <Small style={{ marginBottom: 10 }}>{TIER_INFO[sheet].qual}</Small>
                {TIER_INFO[sheet].gives.map((g) => (
                  <View key={g} style={c.li}>
                    <Text style={c.liText}>{'•'}</Text>
                    <Text style={[c.liText, { flex: 1 }]}>{g}</Text>
                  </View>
                ))}
                <Gap size="s" />
                <Btn variant="line" label="Close" onPress={() => setSheet(null)} />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const c = StyleSheet.create({
  centre: { textAlign: 'center' },
  wallets: { flexDirection: 'row', gap: 12, marginTop: 18, justifyContent: 'center', alignItems: 'center' },
  balance: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, paddingTop: 18, paddingBottom: 4 },
  balanceLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  big: { fontFamily: F.serif, fontSize: 48, lineHeight: 50, color: C.ink },
  unit: { fontFamily: F.med, fontSize: 11, letterSpacing: 1.76, textTransform: 'uppercase', color: C.mute },
  gbp: { fontFamily: F.reg, fontSize: 15, color: C.gold },
  chips: { flexDirection: 'row', gap: 8, marginTop: 14 },
  chipWrap: { flex: 1, borderRadius: 10 },
  chipOn: {
    transform: [{ translateY: -9 }],
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 14 } },
      android: { elevation: 8 },
    }),
  },
  chip: { paddingVertical: 16, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center', overflow: 'hidden' },
  chipText: { fontFamily: F.serif, fontSize: 16, color: '#fff' },
  track: { marginTop: 20 },
  trackLine: { fontFamily: F.reg, fontSize: 13.5, color: C.ink },
  trackSub: { fontFamily: F.light, fontSize: 11.5, color: C.mute, marginTop: 3 },
  bar: { height: 4, borderRadius: 2, backgroundColor: C.hair, marginTop: 13, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.ink, borderRadius: 2 },
  sheet: { flex: 1, backgroundColor: 'rgba(20,20,19,0.4)', justifyContent: 'flex-end' },
  inner: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingTop: 26, paddingHorizontal: 26, paddingBottom: 34 },
  h4: { fontFamily: F.serif, fontSize: 20, color: C.ink, marginBottom: 10 },
  li: { flexDirection: 'row', gap: 8, paddingLeft: 8, marginBottom: 4 },
  liText: { fontFamily: F.light, fontSize: 12.5, lineHeight: 21, color: C.grey },
});
