import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useData } from '../src/data';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { MailIcon, PhoneIcon, QuestionIcon, WhatsAppIcon } from '../src/ui/Icons';
import { RowLink as Row } from '../src/ui/RowLink';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';

// 15 CONTACT. The 3 links come from salon.settings so they can change without a release.
export default function Contact() {
  const router = useRouter();
  const { settings, failed, refreshing, refresh } = useData();
  const toMore = () => router.navigate('/more');
  const open = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };
  return (
    <Screen tab="more" back onBack={toMore} title="Contact" refreshing={refreshing} onRefresh={refresh} status={statusOf(settings, failed)}>
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
  addr: { paddingVertical: 16 },
  addrTitle: { fontFamily: F.reg, fontSize: 13, color: C.ink },
  addrBody: { fontFamily: F.reg, fontSize: 12, lineHeight: 19.2, color: C.grey, marginTop: 3 },
});
