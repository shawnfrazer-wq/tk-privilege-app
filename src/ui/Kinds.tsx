import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F, ls } from '../theme';

// .kinds: the 2 boxes, TK Points and Tier Points. With figures on the Card screen, as explainers elsewhere.
export function Kinds({ children }: { children: React.ReactNode }) {
  return <View style={k.kinds}>{children}</View>;
}

export function Kind({ label, big, sub, text }: { label: string; big?: string; sub?: string; text?: string }) {
  return (
    <View style={k.kind}>
      <Text style={k.eyebrow}>{label}</Text>
      {big !== undefined && <Text style={k.big}>{big}</Text>}
      {!!sub && <Text style={k.sub}>{sub}</Text>}
      {!!text && <Text style={k.p}>{text}</Text>}
    </View>
  );
}

const k = StyleSheet.create({
  kinds: { flexDirection: 'row', gap: 10 },
  kind: { flex: 1, backgroundColor: C.band, borderRadius: 12, paddingTop: 14, paddingHorizontal: 14, paddingBottom: 13, gap: 4 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.gold },
  big: { fontFamily: F.serif, fontSize: 28, lineHeight: 31, color: C.ink },
  sub: { fontFamily: F.reg, fontSize: 11.5, color: C.mute },
  p: { fontFamily: F.reg, fontSize: 11, lineHeight: 17, color: C.grey, textAlign: 'justify' },
});
