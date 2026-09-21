import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { C, F, ls } from '../theme';

// .field
export function Field({ label, blankLabel, children, hint }: { label: string; blankLabel?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <View style={s.field}>
      <Text style={[s.label, blankLabel && { opacity: 0 }]}>{label}</Text>
      {children}
      {!!hint && <Text style={s.fieldHint}>{hint}</Text>}
    </View>
  );
}

// .field input
export function Input(props: TextInputProps & { readOnly?: boolean }) {
  return (
    <TextInput
      placeholderTextColor={C.placeholder}
      editable={!props.readOnly}
      {...props}
      style={[s.input, props.readOnly && { color: C.mute }, props.style]}
    />
  );
}

// .field textarea
export function TextArea(props: TextInputProps & { rows?: number }) {
  const rows = props.rows ?? 3;
  return (
    <TextInput
      placeholderTextColor={C.placeholder}
      multiline
      textAlignVertical="top"
      {...props}
      style={[s.input, s.textarea, { minHeight: rows * 23 + 16 }, props.style]}
    />
  );
}

export type Option = { label: string; value: string };

// .field select. Native has no select control, so the choice opens in the same bottom sheet the tier chips use.
export function Select({ value, options, placeholder, onChange, accessibilityLabel }: { value: string | null; options: Option[]; placeholder?: string; onChange: (v: string) => void; accessibilityLabel: string }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={s.select}>
        <Text style={[s.selectText, !current && { color: C.placeholder }]}>{current ? current.label : placeholder ?? ''}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.sheet} onPress={() => setOpen(false)}>
          <Pressable style={s.inner} onPress={() => {}}>
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {options.map((o, i) => (
                <Pressable
                  key={o.value}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  style={[s.option, i === options.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <Text style={[s.optionText, o.value === value && { fontFamily: F.med }]}>{o.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  field: { gap: 6, marginTop: 20 },
  label: { fontFamily: F.med, fontSize: 10, letterSpacing: ls(0.18, 10), textTransform: 'uppercase', color: C.mute },
  fieldHint: { fontFamily: F.reg, fontSize: 11.5, color: C.mute, marginTop: 2 },
  input: {
    fontFamily: F.reg,
    fontSize: 15,
    color: C.ink,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  textarea: { lineHeight: 23 },
  select: { borderBottomWidth: 1, borderBottomColor: C.hair, paddingVertical: 8 },
  selectText: { fontFamily: F.reg, fontSize: 15, color: C.ink },
  sheet: { flex: 1, backgroundColor: 'rgba(20,20,19,0.4)', justifyContent: 'flex-end' },
  inner: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingTop: 10, paddingHorizontal: 26, paddingBottom: 34 },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  optionText: { fontFamily: F.reg, fontSize: 14, color: C.ink },
});
