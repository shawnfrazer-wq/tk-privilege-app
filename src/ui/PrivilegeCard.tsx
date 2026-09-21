import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Tier } from '../crm';
import { F, ls } from '../theme';

const logoWhite = require('../../assets/logo_white.png');
const logoBlack = require('../../assets/logo_black.png');

// .phone[data-tier] .card backgrounds, carried from v9 unchanged
export const TIER_GRADIENT: Record<Tier, { colors: [string, string, ...string[]]; locations: [number, number, ...number[]] }> = {
  gold: { colors: ['#A6884F', '#7D6236', '#4A371A', '#2C1F0C'], locations: [0, 0.38, 0.72, 1] },
  black: { colors: ['#3E3E41', '#171719', '#000000', '#0C0C0E', '#000000'], locations: [0, 0.26, 0.54, 0.76, 1] },
  silver: {
    colors: ['#FDFDFE', '#E2E6EA', '#BCC2C9', '#EFF1F4', '#C5CBD2', '#A6ADB5', '#C8CDD3'],
    locations: [0, 0.17, 0.33, 0.49, 0.65, 0.83, 1],
  },
};

// the ::before highlight: a soft light from the top left corner, then a faint diagonal sheen
export function TierSurface({ tier, style, children }: { tier: Tier; style?: object; children?: React.ReactNode }) {
  const g = TIER_GRADIENT[tier];
  return (
    <LinearGradient colors={g.colors} locations={g.locations} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={style}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
        locations={[0, 0.52]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
        locations={[0, 0.4, 0.5, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.47 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </LinearGradient>
  );
}

type Props = { tier: Tier; name: string; since: string; right: string };

// .card
export function PrivilegeCard({ tier, name, since, right }: Props) {
  const dark = tier !== 'silver';
  const text = dark ? '#fff' : '#161616';
  return (
    <View style={[s.shadow, tier === 'gold' && s.shadowGold, tier === 'black' && s.shadowBlack, tier === 'silver' && s.shadowSilver]}>
      <TierSurface tier={tier} style={s.card}>
        <View style={s.row}>
          <Image source={dark ? logoWhite : logoBlack} style={dark ? s.logoW : s.logoK} resizeMode="contain" />
        </View>
        <View>
          <Text style={[s.word, { color: text }]}>Privilege</Text>
          <View style={s.who}>
            <View>
              <Text style={[s.name, { color: text }]}>{name}</Text>
              <Text style={[s.since, { color: text }]}>{since}</Text>
            </View>
            <Text style={[s.no, { color: text }]}>{right}</Text>
          </View>
        </View>
      </TierSurface>
    </View>
  );
}

const s = StyleSheet.create({
  shadow: {
    borderRadius: 14,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 14 }, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  shadowGold: { shadowColor: 'rgb(70,50,20)', shadowOpacity: 0.55 },
  shadowBlack: { shadowColor: '#000', shadowOpacity: 0.6 },
  shadowSilver: { shadowColor: '#000', shadowOpacity: 0.35 },
  card: {
    aspectRatio: 1.586,
    width: '100%',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 24,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logoW: { width: 96, height: 96 * (130 / 520) },
  logoK: { width: 96, height: 96 * (113 / 428) },
  word: { fontFamily: F.serif, fontSize: 30, lineHeight: 30 },
  who: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 },
  name: { fontFamily: F.reg, fontSize: 13, letterSpacing: ls(0.02, 13) },
  since: { fontFamily: F.reg, fontSize: 10, letterSpacing: ls(0.06, 10), opacity: 0.78, marginTop: 3 },
  no: { fontFamily: F.reg, fontSize: 10, letterSpacing: ls(0.16, 10), opacity: 0.78 },
});
