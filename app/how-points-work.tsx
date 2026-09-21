import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F, ls } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Sect, Small } from '../src/ui/T';

// .srow, inside an .egbox or on its own
function Row({ left, right, note, gold, last }: { left: string; right: string; note?: string; gold?: boolean; last?: boolean }) {
  return (
    <View style={[s.srow, gold && s.srowGold, last && { borderBottomWidth: 0 }]}>
      <Text style={s.srowLeft}>{left}</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={s.srowRight}>{right}</Text>
        {!!note && <Text style={s.srowNote}>{note}</Text>}
      </View>
    </View>
  );
}

// .know
function Know({ title, body, last }: { title: string; body: string; last?: boolean }) {
  return (
    <View style={[s.know, last && { borderBottomWidth: 0 }]}>
      <Text style={s.knowTitle}>{title}</Text>
      <Text style={s.knowBody}>{body}</Text>
    </View>
  );
}

// 6 HOW POINTS WORK, fixed text
export default function HowPointsWork() {
  return (
    <Screen tab="card" back title="How Points Work">
      <Gap />
      <Disp>How Points Work</Disp>
      <Gap size="s" />
      <Copy>Your first care visit after signing up earns points. They show in your account as “pending” until your next visit, and they are released when you arrive.</Copy>

      <Gap />
      <Sect>What Is a Care Visit</Sect>
      <Gap size="s" />
      <Copy>Any maintenance appointment for micro rings, bonds, tapes and wefts, as well as any maintenance for toppers, wigs and clip-ins. A new set or a new piece is not a care visit.</Copy>

      <Gap />
      <Sect>What You Earn</Sect>
      <Gap size="s" />
      <Copy>1 point for every £1 you spend at a care visit. The maintenance itself, colour, a blow dry, a trim, Davines products, anything you buy that day. 10 points is £1. New sets and hair pieces do not earn points.</Copy>

      <Gap />
      <Sect>What That Is Worth</Sect>
      <Gap size="s" />
      <Copy>A £400 visit puts 400 points pending. 10 points is always £1 when you spend them. What changes is how many of those pending points are released, and that depends on how often you come in.</Copy>
      <Gap size="s" />
      <View style={s.egbox}>
        <Text style={s.eyebrow}>Micro rings, micro bonds and wefts</Text>
        <Row gold left="Come every 8 weeks" right="All 400" note="£40, 10% back" />
        <Row gold left="Every 10 weeks" right="300" note="£30, 7.5% back" />
        <Row gold left="Every 12 weeks" right="200" note="£20, 5% back" />
        <Row gold left="Longer than that" right="Talk to us" note="Nothing automatic" last />
      </View>
      <Gap size="s" />
      <View style={s.egbox}>
        <Text style={s.eyebrow}>Tapes</Text>
        <Row gold left="Come every 6 weeks" right="All 400" note="£40, 10% back" />
        <Row gold left="Every 8 weeks" right="300" note="£30, 7.5% back" />
        <Row gold left="Every 10 weeks" right="200" note="£20, 5% back" />
        <Row gold left="Longer than that" right="Talk to us" note="Nothing automatic" last />
      </View>

      <Gap />
      <Sect>Toppers, Wigs and Clip-ins</Sect>
      <Gap size="s" />
      <Copy>Topper care, wig care and clip-in care work differently. Points are earned and released in full, whenever you come in. There is no clock on them, so you always get the whole 10%.</Copy>

      <Gap />
      <Sect>Your Care Date</Sect>
      <Gap size="s" />
      <Copy>Your stylist sets it at the end of every visit, based on your hair rather than a calendar. Toppers, wigs and clip-ins have no care date, because it depends on how much you wear the piece. Come in when it needs it and your points are released in full.</Copy>
      <Gap size="s" />
      <Row left="Micro rings, micro bonds and wefts" right="8 weeks" />
      <Row left="Tapes" right="6 weeks" />
      <Row left="Toppers, wigs and clip-ins" right="No care date" last />

      <Gap size="l" />
      <Sect>Worth Knowing</Sect>
      <Gap size="s" />
      <Know title="Pending points are not yours yet" body="How many are released is set by how often you come in for care. They belong to your next visit, not the one you are in." />
      <Know title="Booking is worth 100 points" body="Book your next visit at the desk before you leave. That is the only way to earn it, and it is released when you arrive." />
      <Know title="Keeping it is worth another 100" body="Come to the appointment you booked, on the day you booked it, and you get a second 100. Move it and you keep the first but not the second." />
      <Know
        last
        title="When you come in decides what you get"
        body="Micro rings, micro bonds and wefts: come in for your maintenance at 8 weeks, or within a week after, and you get the full 10% back. By 11 weeks it is 7.5%, by 13 weeks 5%. After 13 weeks you get nothing, and the booking points go with them. Tapes: come in for your maintenance at 6 weeks, or within a week after, and you get the full 10% back. By 9 weeks it is 7.5%, by 11 weeks 5%. After 11 weeks you get nothing, and the booking points go with them."
      />

      <Gap />
      <Small>Once released, points last 24 months, and we tell you 3 months before any run out.</Small>
    </Screen>
  );
}

const s = StyleSheet.create({
  egbox: { borderWidth: 1, borderColor: C.gold, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.gold, marginBottom: 8 },
  srow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  srowGold: { borderBottomColor: 'rgba(169,131,81,0.22)' },
  srowLeft: { flex: 1, fontFamily: F.light, fontSize: 12.5, lineHeight: 18.75, color: C.grey },
  srowRight: { fontFamily: F.reg, fontSize: 12.5, lineHeight: 18.75, color: C.ink, textAlign: 'right' },
  srowNote: { fontFamily: F.light, fontSize: 10.5, color: C.gold, marginTop: 3, textAlign: 'right' },
  know: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.hairSoft },
  knowTitle: { fontFamily: F.reg, fontSize: 13, color: C.ink, marginBottom: 4 },
  knowBody: { fontFamily: F.light, fontSize: 12, lineHeight: 19.8, color: C.grey, textAlign: 'justify' },
});
