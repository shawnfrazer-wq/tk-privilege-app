import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '../theme';

// .note: the soft grey box
export function Note({ title, body }: { title: string; body: string }) {
  return (
    <View style={s.note}>
      <Text style={s.b}>{title}</Text>
      <Text style={s.span}>{body}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  note: { backgroundColor: C.band, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 18, gap: 5 },
  b: { fontFamily: F.reg, fontSize: 13, color: C.ink },
  span: { fontFamily: F.light, fontSize: 11.5, lineHeight: 19, color: C.grey, textAlign: 'justify' },
});
