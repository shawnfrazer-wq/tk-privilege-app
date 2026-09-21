import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { C, F, ls } from '../theme';

// h2.disp
export const Disp = (p: TextProps) => <Text {...p} style={[s.disp, p.style]} />;
// h3.sect
export const Sect = (p: TextProps) => <Text {...p} style={[s.sect, p.style]} />;
// p.copy
export const Copy = (p: TextProps) => <Text {...p} style={[s.copy, p.style]} />;
// .small
export const Small = (p: TextProps) => <Text {...p} style={[s.small, p.style]} />;
// .eyebrow
export const Eyebrow = (p: TextProps) => <Text {...p} style={[s.eyebrow, p.style]} />;
// .hint
export const Hint = (p: TextProps) => <Text {...p} style={[s.hint, p.style]} />;
// .stale
export const Stale = (p: TextProps) => <Text {...p} style={[s.stale, p.style]} />;

const s = StyleSheet.create({
  disp: { fontFamily: F.serif, fontSize: 28, lineHeight: 33, color: C.ink },
  sect: { fontFamily: F.serif, fontSize: 19, lineHeight: 24, color: C.ink },
  copy: { fontFamily: F.reg, fontSize: 14, lineHeight: 23.8, color: C.grey, textAlign: 'justify' },
  small: { fontFamily: F.reg, fontSize: 12.5, lineHeight: 20, color: C.mute, textAlign: 'justify' },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.mute },
  hint: { fontFamily: F.reg, fontSize: 11.5, lineHeight: 18.4, color: C.mute, marginTop: 8, textAlign: 'justify' },
  stale: { fontFamily: F.reg, fontSize: 10, color: C.mute, textAlign: 'center', paddingTop: 18 },
});
