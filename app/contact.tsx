import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useData } from '../src/data';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { GoIcon, MailIcon, PhoneIcon, QuestionIcon, WhatsAppIcon } from '../src/ui/Icons';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';

type RowProps = { Icon: typeof MailIcon; title: string; sub: string; onPress: () => void; last?: boolean };

// .contact
function Row({ Icon, title, sub, onPress, last }: RowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [c.row, last && { borderBottomWidth: 0 }, pressed && { opacity: 0.6 }]}>
      <View style={c.ic}>
        <Icon color={C.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={c.title}>{title}</Text>
        <Text style={c.sub}>{sub}</Text>
      </View>
      <GoIcon color={C.ink} />
    </Pressable>
  );
}

// 15 CONTACT. The 3 links come from salon.settings so they can change without a release.
export default function Contact() {
  const router = useRouter();
  const { settings } = useData();
  const open = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };
  return (
    <Screen tab="contact" title="Contact">
      <Gap />
      <Disp>We Are Here for Your Hair</Disp>
      <Gap size="s" />
      <Copy>Appointments, aftercare, or anything you are unsure about.</Copy>
      <Gap />
      <Row Icon={WhatsAppIcon} title="WhatsApp" sub="Usually answered within the hour" onPress={() => open(settings?.contact_whatsapp)} />
      <Row Icon={PhoneIcon} title="Call Kensington" sub="Tuesday to Saturday" onPress={() => open(settings?.contact_phone)} />
      <Row Icon={MailIcon} title="Email" sub="For anything longer" onPress={() => open(settings?.contact_email)} />
      <Row Icon={QuestionIcon} title="FAQs" sub="Your hair, and your points" onPress={() => router.push('/faqs')} last />

      <Gap />
      <Sect>Find Us</Sect>
      <View style={c.addr}>
        <Text style={c.addrTitle}>Kensington</Text>
        <Text style={c.addrBody}>33 Holland Street{'\n'}London W8 4LX</Text>
      </View>
      <View style={c.addr}>
        <Text style={c.addrTitle}>Manchester</Text>
        <Text style={c.addrBody}>49 Piccadilly{'\n'}Manchester M1 2AP</Text>
      </View>
    </Screen>
  );
}

const c = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  ic: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.band, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.reg, fontSize: 13.5, color: C.ink },
  sub: { fontFamily: F.light, fontSize: 11.5, color: C.mute, marginTop: 2 },
  addr: { paddingVertical: 16 },
  addrTitle: { fontFamily: F.reg, fontSize: 13, color: C.ink },
  addrBody: { fontFamily: F.light, fontSize: 12, lineHeight: 19.2, color: C.grey, marginTop: 3 },
});
