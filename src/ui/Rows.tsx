import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, F } from '../theme';
import { GoIcon } from './Icons';

// .rowbtn: a title, a line under it and a chevron (Home, More, How Points Work)
export function RowBtn({ title, sub, onPress, last }: { title: string; sub: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [r.rowbtn, last && { borderBottomWidth: 0 }, pressed && { opacity: 0.6 }]}>
      <View style={{ flex: 1 }}>
        <Text style={r.title}>{title}</Text>
        <Text style={r.sub}>{sub}</Text>
      </View>
      <GoIcon color={C.ink} />
    </Pressable>
  );
}

// .srow: a label with a figure on the right, and an optional gold note under the figure
export function SRow({ left, right, note, gold, last }: { left: string; right: string; note?: string; gold?: boolean; last?: boolean }) {
  return (
    <View style={[r.srow, gold && r.srowGold, last && { borderBottomWidth: 0 }]}>
      <Text style={r.srowLeft}>{left}</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={r.srowRight}>{right}</Text>
        {!!note && <Text style={r.srowNote}>{note}</Text>}
      </View>
    </View>
  );
}

// .know: a bold line with a paragraph under it
export function Know({ title, body, last }: { title: string; body: string; last?: boolean }) {
  return (
    <View style={[r.know, last && { borderBottomWidth: 0 }]}>
      <Text style={r.knowTitle}>{title}</Text>
      <Text style={r.knowBody}>{body}</Text>
    </View>
  );
}

// .bar with its fill
export function Bar({ fill, style }: { fill: number; style?: object }) {
  return (
    <View style={[r.bar, style]}>
      <View style={[r.fill, { width: `${Math.round(Math.min(1, Math.max(0, fill)) * 100)}%` }]} />
    </View>
  );
}

const r = StyleSheet.create({
  rowbtn: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  title: { fontFamily: F.reg, fontSize: 13.5, color: C.ink, marginBottom: 3 },
  sub: { fontFamily: F.reg, fontSize: 11.5, lineHeight: 17, color: C.mute },
  srow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  srowGold: { borderBottomColor: 'rgba(169,131,81,0.22)' },
  srowLeft: { flex: 1, fontFamily: F.reg, fontSize: 12.5, lineHeight: 18.75, color: C.grey },
  srowRight: { fontFamily: F.reg, fontSize: 12.5, lineHeight: 18.75, color: C.ink, textAlign: 'right' },
  srowNote: { fontFamily: F.reg, fontSize: 10.5, color: C.gold, marginTop: 3, textAlign: 'right' },
  know: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  knowTitle: { fontFamily: F.reg, fontSize: 13, color: C.ink, marginBottom: 4 },
  knowBody: { fontFamily: F.reg, fontSize: 13, lineHeight: 21.5, color: C.grey, textAlign: 'justify' },
  bar: { height: 4, borderRadius: 2, backgroundColor: C.hair, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.ink, borderRadius: 2 },
});
