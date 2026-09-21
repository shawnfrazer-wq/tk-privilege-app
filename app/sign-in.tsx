import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { toE164 } from '../src/format';
import { getRemember, setRemember, supabase } from '../src/supabase';
import { C, F, ls } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Screen } from '../src/ui/Screen';
import { SwitchRow } from '../src/ui/Switch';
import { Copy, Disp, Small } from '../src/ui/T';

// 2 YOUR MOBILE NUMBER
export default function SignIn() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [keep, setKeep] = useState(true);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    getRemember().then(setKeep);
  }, []);

  const phone = toE164(mobile);

  async function send() {
    if (!phone || busy) return;
    setBusy(true);
    setProblem(null);
    try {
      await setRemember(keep);
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      router.push({ pathname: '/code', params: { phone } });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'The code could not be sent.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen back brand>
      <Gap size="l" />
      <Disp>Your Mobile Number</Disp>
      <Gap size="s" />
      <Copy>The number the salon has for you.</Copy>
      <View style={s.field}>
        <Text style={s.label}>Mobile</Text>
        <View style={s.phonefield}>
          <Text style={s.cc}>+44</Text>
          <TextInput
            style={s.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={send}
          />
        </View>
      </View>
      <View style={{ marginTop: 6 }}>
        <SwitchRow label="Keep me signed in for 90 days" on={keep} onChange={setKeep} last />
      </View>
      <Gap size="l" />
      <Btn label="Send me a code" onPress={send} disabled={!phone || busy} />
      {problem && (
        <>
          <Gap size="s" />
          <Small>{problem}</Small>
        </>
      )}
      <Gap />
      <Small>TK Privilege is for Tatiana Karelina clients. If your number is not recognised, ask at reception and the salon will add you.</Small>
    </Screen>
  );
}

const s = StyleSheet.create({
  field: { gap: 6, marginTop: 20 },
  label: { fontFamily: F.med, fontSize: 10, letterSpacing: ls(0.18, 10), textTransform: 'uppercase', color: C.mute },
  phonefield: { flexDirection: 'row', gap: 14, alignItems: 'flex-end' },
  cc: { fontFamily: F.reg, fontSize: 15, color: C.ink, borderBottomWidth: 1, borderBottomColor: C.hair, paddingVertical: 8 },
  input: {
    flex: 1,
    fontFamily: F.reg,
    fontSize: 15,
    color: C.ink,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});
