import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, F } from '../theme';
import { GoIcon } from './Icons';

type Props = { Icon: (p: { color: string; size?: number }) => React.JSX.Element; title: string; sub: string; onPress: () => void; last?: boolean };

// .contact: an icon in a soft circle, a title and a line under it, a chevron. Used on Contact and Home.
export function RowLink({ Icon, title, sub, onPress, last }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.row, last && { borderBottomWidth: 0 }, pressed && { opacity: 0.6 }]}>
      <View style={s.ic}>
        <Icon color={C.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{sub}</Text>
      </View>
      <GoIcon color={C.ink} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  ic: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.band, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.reg, fontSize: 13.5, color: C.ink },
  sub: { fontFamily: F.reg, fontSize: 11.5, color: C.mute, marginTop: 2 },
});
