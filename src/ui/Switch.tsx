import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, F } from '../theme';

// .switch
export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      onPress={() => onChange(!on)}
      style={[s.track, on && { backgroundColor: C.ink }]}
      hitSlop={6}
    >
      <View style={[s.knob, on && { transform: [{ translateX: 18 }] }]} />
    </Pressable>
  );
}

// .switchrow
export function SwitchRow({ label, on, onChange, last }: { label: string; on: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View style={[s.row, last && { borderBottomWidth: 0 }]}>
      <Text style={s.label}>{label}</Text>
      <Switch on={on} onChange={onChange} label={label} />
    </View>
  );
}

const s = StyleSheet.create({
  track: { width: 46, height: 28, borderRadius: 14, backgroundColor: C.switchOff, justifyContent: 'center' },
  knob: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.hairSoft,
  },
  label: { fontFamily: F.reg, fontSize: 13, color: C.ink, flex: 1 },
});
