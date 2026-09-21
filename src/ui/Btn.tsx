import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { C, F, ls } from '../theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'line' | 'gold' | 'light';
  disabled?: boolean;
  style?: ViewStyle;
};

// .btn.solid, .btn.line, .btn.gold and the opening screen's .btn.light
export function Btn({ label, onPress, variant = 'solid', disabled, style }: Props) {
  const light = variant === 'light';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.btn,
        variant === 'solid' && s.solid,
        variant === 'line' && s.line,
        variant === 'gold' && s.gold,
        light && s.light,
        disabled && { opacity: 0.35 },
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[s.label, variant === 'line' && { color: C.ink }, light && s.lightLabel]}>{label}</Text>
    </Pressable>
  );
}

// .textlink
export function TextLink({ label, onPress, style }: { label: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={[{ alignSelf: 'flex-start' }, style]} hitSlop={8}>
      <Text style={s.textlink}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, width: '100%' },
  solid: { backgroundColor: C.ink },
  line: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.ink },
  gold: { backgroundColor: C.gold },
  light: { backgroundColor: '#fff', width: undefined, alignSelf: 'center', height: 44, paddingHorizontal: 42 },
  label: { fontFamily: F.med, fontSize: 11.5, letterSpacing: ls(0.18, 11.5), textTransform: 'uppercase', color: '#fff' },
  lightLabel: { color: C.ink, fontSize: 10.5, letterSpacing: ls(0.2, 10.5) },
  textlink: {
    fontFamily: F.reg,
    fontSize: 12,
    color: C.ink,
    textDecorationLine: 'underline',
  },
});
