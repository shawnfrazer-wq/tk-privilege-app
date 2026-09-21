import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '../theme';

type Props = { title: string; detail?: string | null; right: string; rightNote?: string | null; gold?: boolean; muted?: boolean; last?: boolean };

// .ledger: a line on Your Points, Visits and Refer a Friend
export function LedgerRow({ title, detail, right, rightNote, gold, muted, last }: Props) {
  return (
    <View style={[s.row, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        {!!detail && <Text style={s.detail}>{detail}</Text>}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[s.right, gold && { color: C.gold }, muted && { color: C.mute }]}>{right}</Text>
        {!!rightNote && <Text style={s.note}>{rightNote}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.hairSoft,
  },
  title: { fontFamily: F.reg, fontSize: 12.5, color: C.ink },
  detail: { fontFamily: F.reg, fontSize: 11, color: C.mute, marginTop: 2 },
  right: { fontFamily: F.reg, fontSize: 13, color: C.ink, textAlign: 'right' },
  note: { fontFamily: F.reg, fontSize: 10, color: C.mute, marginTop: 2 },
});
