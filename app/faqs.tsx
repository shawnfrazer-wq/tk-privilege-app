import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Eyebrow, Small } from '../src/ui/T';

const HAIR: [string, string][] = [
  [
    'Why do we encourage maintenance early?',
    'Because it is the closest thing to having a brand new set every single time. Your own hair grows a little over a centimetre a month and the rings travel down with it, so they start to show around 8 weeks. Left longer, your own hair gathers and tangles at the root. Coming on time keeps it looking new, and it makes the appointment itself quicker and easier for both of us.',
  ],
  [
    'What happens at a maintenance appointment?',
    'Come to us with your hair freshly washed. Your extensions come out, the rings are replaced and the ends are re-tipped, and the same hair goes back in. You walk out with what feels like a brand new set.',
  ],
];

const POINTS: [string, string][] = [
  [
    'What happens to my points if I come in late?',
    'Micro rings, micro bonds and wefts: come in for your maintenance at 8 weeks, or within a week after, and you get the full 10% back. By 11 weeks it is 7.5%, by 13 weeks 5%. After 13 weeks you get nothing, and the booking points go with them. So if you always come in at 12 weeks, you only ever get 5% back. Tapes: come in for your maintenance at 6 weeks, or within a week after, and you get the full 10% back. By 9 weeks it is 7.5%, by 11 weeks 5%. After 11 weeks you get nothing, and the booking points go with them.',
  ],
  [
    'How do the 2 booking bonuses work?',
    'There are 2, and there are no exceptions to either. You get 100 points for booking your next visit at the desk before you leave. Book it later, by phone or by email and you do not get it. You get another 100 for coming on the exact day you booked. Move the appointment to another day and you do not get it. Keeping your date is what lets the salon plan the diary ahead, and this is our thank you for it.',
  ],
  [
    'If I pay with points, do I still earn?',
    'You earn on the amount you pay in cash. Pay part of the bill with points and the rest in money, and the money part earns as normal.',
  ],
  [
    'Does a new set or hair piece earn points?',
    'No. Points come from what you spend at a care appointment, the maintenance itself, colour, a blow dry, a trim, Davines products, anything you buy that day. A new set or a new piece earns nothing, though it still fills a box on your Care Card, and you can spend your points on one.',
  ],
  [
    'How does the Care Card work?',
    'Every care visit fills a box on your Care Card, and so does a new set or a new piece. Fill all 4 boxes and we add 500 points, worth £50, to your balance.',
  ],
  [
    'Do they run out?',
    'After 24 months from the day they land, and we tell you 3 months before anything does. They are never taken away for anything you do.',
  ],
  [
    'What do the different tiers give me?',
    'Your tier is set by how many care visits you have had in the last 12 months, never by what you spend. Silver is where everyone starts: 1 point for every £1 at a care visit, and the Care Card. Gold comes at 4 care visits: 1.25 points for every £1. Black comes at 6 care visits: 1.5 points for every £1.',
  ],
];

// details / summary
function Item({ q, a, open, onPress }: { q: string; a: string; open: boolean; onPress: () => void }) {
  return (
    <View style={f.details}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ expanded: open }} style={f.summary}>
        <Text style={f.q}>{q}</Text>
        <Text style={f.mark}>{open ? '–' : '+'}</Text>
      </Pressable>
      {open && <Text style={f.a}>{a}</Text>}
    </View>
  );
}

// 16 QUESTIONS, fixed text
export default function Faqs() {
  const [open, setOpen] = useState<string | null>(HAIR[0][0]);
  const toggle = (q: string) => setOpen((cur) => (cur === q ? null : q));
  return (
    <Screen tab="contact" back title="FAQs">
      <Gap />
      <Disp>FAQs</Disp>
      <Gap size="s" />
      <Copy>The things clients ask us most. If yours is not here, message the salon and we will answer it.</Copy>
      <Gap />
      <Eyebrow>Your hair</Eyebrow>
      <Gap size="s" />
      {HAIR.map(([q, a]) => (
        <Item key={q} q={q} a={a} open={open === q} onPress={() => toggle(q)} />
      ))}

      <Gap size="l" />
      <Eyebrow>Your points</Eyebrow>
      <Gap size="s" />
      {POINTS.map(([q, a]) => (
        <Item key={q} q={q} a={a} open={open === q} onPress={() => toggle(q)} />
      ))}

      <Gap size="l" />
      <Small>Anything else, message the salon from the Contact tab and we will answer it.</Small>
    </Screen>
  );
}

const f = StyleSheet.create({
  details: { borderBottomWidth: 1, borderBottomColor: C.hairSoft, paddingVertical: 15 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14 },
  q: { flex: 1, fontFamily: F.reg, fontSize: 13, color: C.ink },
  mark: { fontFamily: F.reg, fontSize: 16, lineHeight: 18, color: C.mute },
  a: { fontFamily: F.reg, fontSize: 12, lineHeight: 20.4, color: C.grey, marginTop: 10, textAlign: 'justify' },
});
