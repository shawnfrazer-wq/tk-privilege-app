import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { crm } from '../src/crm';
import { useAuth } from '../src/data';
import { displayMobile } from '../src/format';
import { markSignedIn, signOut, supabase } from '../src/supabase';
import { C, F } from '../src/theme';
import { Btn, TextLink } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Small } from '../src/ui/T';

// the wording docs/crm-api.md asks for
const NOT_RECOGNISED = 'If your number is not recognised, ask at reception and the salon will add you.';

// 3 CODE
export default function Code() {
  const { setSignedIn } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const input = useRef<TextInput>(null);

  const digits = code.replace(/\D/g, '').slice(0, 6);
  const complete = digits.length === 6;

  async function open() {
    if (!complete || busy || !phone) return;
    setBusy(true);
    setProblem(null);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: digits, type: 'sms' });
      if (error) throw error;
      const link = await crm.link();
      if (link.status !== 'linked') {
        await signOut();
        setProblem(NOT_RECOGNISED);
        return;
      }
      await markSignedIn();
      // Stage 2 adds Your Details here: if link.complete is false she goes there first and cannot go further.
      // the signed in routes open once the guard in app/_layout.tsx flips, Home first
      setSignedIn(true);
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'That code did not work.');
    } finally {
      setBusy(false);
    }
  }

  async function again() {
    if (!phone || busy) return;
    setProblem(null);
    setCode('');
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) setProblem(error.message);
  }

  return (
    <Screen back>
      <Gap />
      <Disp>Your Code</Disp>
      <Gap size="s" />
      <Copy>We have texted {displayMobile(phone ?? '')}.</Copy>
      <Pressable onPress={() => input.current?.focus()} accessibilityLabel="6 digit code" style={s.codeboxes}>
        {Array.from({ length: 6 }).map((_, i) => {
          const filled = i < digits.length;
          const current = i === digits.length;
          return (
            <View key={i} style={[s.box, filled && s.filled, current && s.current]}>
              <Text style={s.digit}>{digits[i] ?? ''}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={input}
        style={s.hidden}
        value={digits}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={6}
        autoFocus
        caretHidden
        onSubmitEditing={open}
      />
      <Gap size="l" />
      <Btn label="Open TK Privilege" onPress={open} disabled={!complete || busy} />
      {problem && (
        <>
          <Gap size="s" />
          <Small>{problem}</Small>
        </>
      )}
      <Gap />
      <TextLink label="Send it again" onPress={again} />
      <Gap />
    </Screen>
  );
}

const s = StyleSheet.create({
  codeboxes: { flexDirection: 'row', gap: 8, marginTop: 28 },
  box: { flex: 1, height: 54, borderBottomWidth: 1, borderBottomColor: C.hair, alignItems: 'center', justifyContent: 'center' },
  filled: { borderBottomColor: C.ink },
  current: { borderBottomColor: C.ink, borderBottomWidth: 2 },
  digit: { fontFamily: F.serif, fontSize: 24, color: C.ink },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1, top: 0, left: 0 },
});
