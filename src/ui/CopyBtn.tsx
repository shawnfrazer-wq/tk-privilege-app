import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { C, F, ls } from '../theme';

// .copybtn: the small gold Copy control
export function CopyBtn({ label, onPress, accessibilityLabel, style }: { label: string; onPress: () => void; accessibilityLabel: string; style?: object }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={[s.btn, style]} hitSlop={8}>
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <Rect x="9" y="9" width="11" height="11" rx="2" />
        <Path d="M5 15V5a2 2 0 0 1 2-2h8" />
      </Svg>
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingLeft: 8 },
  label: { fontFamily: F.semi, fontSize: 10, letterSpacing: ls(0.16, 10), textTransform: 'uppercase', color: C.gold },
});
