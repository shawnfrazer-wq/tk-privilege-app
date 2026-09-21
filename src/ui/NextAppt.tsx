import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F, ls } from '../theme';

type Props = { day: string; month: string; what: string; detail: string; included?: string };

// .next: the date block beside what is booked
export function NextAppt({ day, month, what, detail, included }: Props) {
  return (
    <View style={s.next}>
      <View style={s.date}>
        <Text style={s.day}>{day}</Text>
        <Text style={s.month}>{month}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.what}>{what}</Text>
        <Text style={s.detail}>{detail}</Text>
        {!!included && <Text style={s.incl}>{included}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  next: { flexDirection: 'row', gap: 18, alignItems: 'flex-start', paddingTop: 16, paddingBottom: 4 },
  date: { alignItems: 'center', minWidth: 54 },
  day: { fontFamily: F.serif, fontSize: 34, lineHeight: 36, color: C.ink },
  month: { fontFamily: F.med, fontSize: 10, letterSpacing: ls(0.16, 10), textTransform: 'uppercase', color: C.mute, marginTop: 6 },
  what: { fontFamily: F.reg, fontSize: 14, lineHeight: 19.6, color: C.ink },
  detail: { fontFamily: F.reg, fontSize: 12, lineHeight: 18.6, color: C.grey, marginTop: 4 },
  incl: { fontFamily: F.reg, fontSize: 11.5, color: C.gold, marginTop: 4, fontStyle: 'italic' },
});
