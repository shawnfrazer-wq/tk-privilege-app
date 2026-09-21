import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { crm, Profile, Stylist } from '../src/crm';
import { useAuth, useData } from '../src/data';
import { capitalise, displayMobile, monthYear } from '../src/format';
import { signOut } from '../src/supabase';
import { C, F } from '../src/theme';
import { Btn, TextLink } from '../src/ui/Btn';
import { Field, Input, Select, TextArea } from '../src/ui/Field';
import { Gap } from '../src/ui/Gap';
import { Screen, statusOf } from '../src/ui/Screen';
import { SwitchRow } from '../src/ui/Switch';
import { Copy, Disp, Hint, Sect, Small } from '../src/ui/T';

const METHOD: Record<string, string> = {
  micro_rings: 'Micro rings',
  micro_bonds: 'Micro bonds',
  bonds: 'Micro bonds',
  tapes: 'Tapes',
  wefts: 'Wefts',
  topper: 'Topper',
  wig: 'Wig',
  clip_in: 'Clip-ins',
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
const CONTACT = ['Text', 'WhatsApp', 'Email', 'Call'].map((c) => ({ label: c, value: c }));
// the CRM stores sms, whatsapp, email or call
const contactLabel = (v: string | null) => (v === 'sms' ? 'Text' : v ? capitalise(v) : null);
const NO_PREFERENCE = 'none';

// 14 DETAILS. Also the complete card gate after the first sign in (rules.md section 6).
export default function Details() {
  const router = useRouter();
  const { gate, setGate } = useAuth();
  const { refresh } = useData();
  const [p, setP] = useState<Profile | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [bday, setBday] = useState<string | null>(null);
  const [bmon, setBmon] = useState<string | null>(null);
  const [occ, setOcc] = useState('');
  const [addr, setAddr] = useState('');
  const [post, setPost] = useState('');
  const [stylist, setStylist] = useState<string | null>(null);
  const [prefs, setPrefs] = useState('');
  const [contact, setContact] = useState<string | null>(null);
  const [byEmail, setByEmail] = useState(true);
  const [byText, setByText] = useState(true);
  const [byWhatsApp, setByWhatsApp] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadFailed(false);
      try {
        const [prof, st] = await Promise.all([crm.profile(), crm.stylists().catch(() => [] as Stylist[])]);
        setP(prof);
        setStylists(st);
        setFirst(prof.first_name ?? '');
        setLast(prof.last_name ?? '');
        setEmail(prof.email ?? '');
        setBday(prof.birth_day ? String(prof.birth_day) : null);
        setBmon(prof.birth_month ? String(prof.birth_month) : null);
        setOcc(prof.occupation ?? '');
        setAddr(prof.address ?? '');
        setPost(prof.postcode ?? '');
        setStylist(prof.preferred_staff_id ?? (prof.no_preferred_stylist ? NO_PREFERENCE : null));
        setPrefs(prof.how_she_likes_her_hair ?? '');
        setContact(contactLabel(prof.preferred_contact));
        setByEmail(prof.email_marketing ?? true);
        setByText(prof.sms_marketing ?? true);
        setByWhatsApp(prof.whatsapp_marketing ?? true);
      } catch (e) {
        console.error('app_profile', e);
        setLoadFailed(true);
      }
    })();
  }, [attempt]);

  const stylistOptions = useMemo(() => [...stylists.map((s) => ({ label: s.name, value: s.id })), { label: 'No preference', value: NO_PREFERENCE }], [stylists]);

  // the same check the wireframe runs: every required field filled
  const ok = [first, last, email, addr, post, prefs].every((v) => v.trim() !== '') && !!stylist && !!contact;

  async function save() {
    if (!ok || busy) return;
    setBusy(true);
    setProblem(null);
    try {
      const saved = await crm.saveProfile({
        first_name: first.trim(),
        last_name: last.trim(),
        email: email.trim(),
        birth_day: bday ? Number(bday) : '',
        birth_month: bmon ? Number(bmon) : '',
        occupation: occ.trim(),
        address: addr.trim(),
        postcode: post.trim(),
        preferred_staff_id: stylist && stylist !== NO_PREFERENCE ? stylist : '',
        no_preferred_stylist: stylist === NO_PREFERENCE,
        how_she_likes_her_hair: prefs.trim(),
        preferred_contact: contact ?? '',
        email_marketing: byEmail,
        sms_marketing: byText,
        whatsapp_marketing: byWhatsApp,
      });
      setP(saved);
      const complete = (saved.missing ?? []).length === 0;
      // app_summary is what Home, Card and every other screen show, so it is refetched before leaving
      if (gate) {
        if (complete) {
          await refresh();
          setGate(false);
          router.replace('/home');
        } else {
          setProblem(`Still needed: ${saved.missing.join(', ')}.`);
        }
      } else {
        await refresh();
        router.navigate('/more');
      }
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'Your details could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    Alert.alert('Delete my account', 'Removes your account and any points with it. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await crm.deleteAccount();
          } catch (e) {
            setProblem(e instanceof Error ? e.message : 'Your account could not be deleted.');
            return;
          }
          // the CRM has already deleted her sign in user, so only the phone's copy of the session is left to clear
          await signOut(true);
        },
      },
    ]);
  }

  return (
    <Screen tab={gate ? undefined : 'more'} back={!gate} onBack={() => router.navigate('/more')} title="Your Details" status={statusOf(p, loadFailed)} refreshing={false} onRefresh={() => setAttempt((a) => a + 1)}>
      <Gap />
      <Disp>Your Details</Disp>
      <Gap size="s" />
      <Copy>This is what the salon has for you. Keep it right and we can look after you properly.</Copy>

      <View style={d.goldpanel}>
        <Text style={d.goldTitle}>Complete your card</Text>
        <Text style={d.goldBody}>
          The first time you sign in, we ask for anything the salon does not have yet, and you go in once your card is complete. Only your birthday and occupation are optional, but they help us recognise you properly when your special day arrives.
        </Text>
      </View>

      <Gap size="l" />
      <Sect>You</Sect>
      <Gap size="s" />
      <View style={d.two}>
        <View style={{ flex: 1 }}>
          <Field label="First name">
            <Input value={first} onChangeText={setFirst} autoCapitalize="words" textContentType="givenName" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Last name">
            <Input value={last} onChangeText={setLast} autoCapitalize="words" textContentType="familyName" />
          </Field>
        </View>
      </View>
      <Field label="Mobile" hint="This is how you sign in. Ask reception to change it.">
        <Input value={p?.mobile ? displayMobile(p.mobile) : ''} readOnly />
      </Field>
      <Field label="Email">
        <Input value={email} onChangeText={setEmail} placeholder="Add your email" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      </Field>
      <View style={d.two}>
        <View style={{ flex: 1 }}>
          <Field label="Birthday">
            <Select value={bday} options={DAYS} placeholder="Day" onChange={setBday} accessibilityLabel="Birthday day" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Month" blankLabel>
            <Select value={bmon} options={MONTHS.map((m, i) => ({ label: m, value: String(i + 1) }))} placeholder="Month" onChange={setBmon} accessibilityLabel="Birthday month" />
          </Field>
        </View>
      </View>
      <Hint>Optional, day and month only. Having it lets us recognise your birthday.</Hint>
      <Gap size="s" />
      <Field label="Occupation, optional">
        <Input value={occ} onChangeText={setOcc} placeholder="Add your occupation" />
      </Field>

      <Gap size="l" />
      <Sect>Where You Are</Sect>
      <Gap size="s" />
      <Field label="Address">
        <Input value={addr} onChangeText={setAddr} placeholder="Add your address" textContentType="fullStreetAddress" />
      </Field>
      <Field label="Postcode">
        <Input value={post} onChangeText={setPost} placeholder="Add your postcode" autoCapitalize="characters" textContentType="postalCode" />
      </Field>

      <Gap size="l" />
      <Sect>Your Hair</Sect>
      <Gap size="s" />
      <Ro label="Method" value={p?.method ? METHOD[p.method] ?? capitalise(p.method) : ''} />
      <Ro label="Hair" value={capitalise(p?.hair_type)} />
      <Ro label="Salon" value={p?.salon ?? ''} />
      <Ro label="With us since" value={monthYear(p?.client_since)} />
      <Hint>Your stylist keeps these. Tell us at your next visit if any of it has changed.</Hint>
      <Gap size="s" />
      <Field label="Preferred stylist">
        <Select value={stylist} options={stylistOptions} placeholder="Choose" onChange={setStylist} accessibilityLabel="Preferred stylist" />
      </Field>
      <Field label="How you like your hair">
        <TextArea value={prefs} onChangeText={setPrefs} rows={3} placeholder="Parting, length, anything we should always do or never do." />
      </Field>

      <Gap size="l" />
      <Sect>How We Reach You</Sect>
      <Gap size="s" />
      <Field label="Choose one as your preferred way to reach out">
        <Select value={contact} options={CONTACT} placeholder="Choose" onChange={setContact} accessibilityLabel="Choose one as your preferred way to reach out" />
      </Field>
      <SwitchRow label="By email" on={byEmail} onChange={setByEmail} />
      <SwitchRow label="By text" on={byText} onChange={setByText} />
      <SwitchRow label="By WhatsApp" on={byWhatsApp} onChange={setByWhatsApp} last />
      <Hint>Appointment reminders always come through, whatever you choose here.</Hint>

      <Gap size="l" />
      <Btn label={gate ? 'Continue' : 'Save'} onPress={save} disabled={!ok || busy || !p} />
      {problem && (
        <>
          <Gap size="s" />
          <Small>{problem}</Small>
        </>
      )}
      <Gap size="s" />
      <Small style={d.centre}>Changes go to the desk, nothing is overwritten silently.</Small>
      <Gap size="l" />
      <View style={{ alignItems: 'center' }}>
        <TextLink label="Delete my account" onPress={remove} style={{ alignSelf: 'center' }} />
      </View>
      <Small style={d.centre}>Removes your account and any points with it. This cannot be undone.</Small>
    </Screen>
  );
}

// .ro
function Ro({ label, value }: { label: string; value: string }) {
  return (
    <View style={d.ro}>
      <Text style={d.roLabel}>{label}</Text>
      <Text style={d.roValue}>{value}</Text>
    </View>
  );
}

const d = StyleSheet.create({
  goldpanel: { backgroundColor: C.band, borderLeftWidth: 2, borderLeftColor: C.gold, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 16, marginTop: 20 },
  goldTitle: { fontFamily: F.reg, fontSize: 12.5, color: C.ink, marginBottom: 3 },
  goldBody: { fontFamily: F.reg, fontSize: 13, lineHeight: 20, color: C.grey },
  two: { flexDirection: 'row', gap: 18 },
  ro: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  roLabel: { fontFamily: F.reg, fontSize: 13, color: C.grey },
  roValue: { fontFamily: F.reg, fontSize: 13, color: C.ink, textAlign: 'right', flexShrink: 1 },
  centre: { textAlign: 'center' },
});
