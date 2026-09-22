import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tier } from '../src/crm';
import { useData } from '../src/data';
import { fullDate, monthYear, num, pounds } from '../src/format';
import { C, F, ls } from '../src/theme';
import { TextLink } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Kind, Kinds } from '../src/ui/Kinds';
import { PrivilegeCard, TierSurface } from '../src/ui/PrivilegeCard';
import { Bar } from '../src/ui/Rows';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Sect, Small } from '../src/ui/T';
import { cardNeeded, counter, tierName, track } from '../src/ui/tiers';
import { Waiting } from '../src/ui/Waiting';

const badgeApple = require('../assets/badge_apple.png');
const badgeGoogle = require('../assets/badge_google.png');
const TIERS: Tier[] = ['silver', 'gold', 'black'];

// 5 CARD
export default function Card() {
  const router = useRouter();
  const { summary: s, tierRules, failed, refreshing, refresh } = useData();
  // tapping a tier above hers shows her Tier Points against that tier; her own or one below puts it back
  const [chip, setChip] = useState<Tier | null>(null);

  if (!s) {
    return <Screen tab="card" title="Your Card" refreshing={refreshing} onRefresh={refresh} status={statusOf(s, failed)}>{null}</Screen>;
  }
  const normal = track(s);
  const ct = counter(s, tierRules, chip);

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

      {/* Wallet passes are stage 3. The badges are drawn as the wireframe shows them and are wired then. Once the
          card is in Apple Wallet or Google Wallet on this phone, that button is hidden (docs/build-and-release-plan.md). */}
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

      <Gap />
      <Kinds>
        <Kind label="TK Points" big={num(s.balance_points)} sub={`${pounds(s.balance_pounds)} to spend`} />
        <Kind label="Tier Points" big={num(s.tier_points)} sub={normal.sub} />
      </Kinds>
      <Gap size="s" />
      <Copy>10 TK Points is £1, off anything on our price list, at any visit. Tier Points move you up a tier and are not for spending.</Copy>
      <Gap size="s" />
      <TextLink label="How points work" onPress={() => router.push('/how-points-work')} />
      <Gap size="s" />
      <TextLink label="See every line" onPress={() => router.push('/points')} />

      <Gap />
      <Waiting summary={s} />

      <Gap size="l" />
      <Sect>You Are {tierName(s.tier)}</Sect>
      {s.tier !== 'silver' && !!s.tier_until && <Small style={{ marginTop: 6 }}>{`${tierName(s.tier)} until ${fullDate(s.tier_until)}`}</Small>}
      <View style={c.chips}>
        {TIERS.map((tier) => {
          const on = tier === s.tier;
          return (
            <Pressable key={tier} onPress={() => setChip(tier)} style={[c.chipWrap, on && c.chipOn]} accessibilityRole="button" accessibilityLabel={tierName(tier)}>
              <TierSurface tier={tier} style={c.chip}>
                <Text style={[c.chipText, tier === 'silver' && { color: '#181818' }]}>{tierName(tier)}</Text>
              </TierSurface>
            </Pressable>
          );
        })}
      </View>
      <View style={c.track}>
        <Text style={c.label}>{ct.label}</Text>
        <View style={c.count}>
          <Text style={c.have}>{ct.have}</Text>
          <Text style={c.need}>{ct.need}</Text>
        </View>
        <Bar fill={ct.fill} style={{ marginTop: 13 }} />
        {cardNeeded(s) && <Text style={c.trackSub}>{normal.card}</Text>}
        {!!ct.note && <Text style={c.note}>{ct.note}</Text>}
      </View>
      <Gap size="s" />
      <Small>Tier Points: 1 for every £1 you spend with us, on anything. Tap a tier to see the Tier Points it needs.</Small>
    </Screen>
  );
}

const c = StyleSheet.create({
  centre: { textAlign: 'center' },
  wallets: { flexDirection: 'row', gap: 12, marginTop: 18, justifyContent: 'center', alignItems: 'center' },
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
  label: { fontFamily: F.med, fontSize: 10, letterSpacing: ls(0.2, 10), textTransform: 'uppercase', color: C.gold },
  count: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  have: { fontFamily: F.serif, fontSize: 28, lineHeight: 30, color: C.ink },
  need: { fontFamily: F.reg, fontSize: 12.5, color: C.grey, flexShrink: 1 },
  trackSub: { fontFamily: F.reg, fontSize: 11.5, color: C.mute, marginTop: 3 },
  note: { fontFamily: F.reg, fontSize: 11.5, color: C.mute, marginTop: 8 },
});
