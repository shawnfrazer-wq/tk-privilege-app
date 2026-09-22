import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { C, F } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Eyebrow, Small } from '../src/ui/T';
import { useData } from '../src/data';
import { bandFaq } from '../src/ui/bands';

const HAIR: [string, string][] = [
  [
    'Why do we encourage maintenance early?',
    'Because it keeps your own hair and scalp healthy, and it is the closest thing to having a brand new set every single time. Your own hair grows a little over a centimetre a month and the rings travel down with it, so they start to show around 8 weeks. As the extensions grow out, your own hair gathers and tangles at the root. That makes it harder to wash your scalp properly and to brush through, and over time it puts strain on your own hair. Coming on time keeps your hair healthy and looking new, and it makes the appointment itself quicker and easier for both of us.',
  ],
  [
    'What happens at a maintenance appointment?',
    'Come to us with your hair freshly washed. Your extensions come out, the rings are replaced and the ends are re-tipped, and the same hair goes back in. You walk out with what feels like a brand new set.',
  ],
];

const POINTS: [string, string][] = [
  [
    'How does the booking bonus work?',
    'Booking your next visit before you leave lets us keep the time that suits your hair best and plan the diary ahead. To thank you for it, we add 100 TK Points. To earn them, book your next visit at the desk on the day of your maintenance, and come in on that date. A visit booked later, by phone or by email, or moved to another day, does not qualify.',
  ],
  [
    'If I pay with points, do I still earn?',
    'You earn on the amount you pay in cash. Pay part of the bill with points and the rest in money, and the money part earns as normal.',
  ],
  [
    'Does a new set or hair piece earn points?',
    'TK Points come from what you spend at a maintenance: the maintenance itself, colour, a blow dry, a trim, Davines products, anything you buy that day. A new set or a new piece does not qualify for TK Points, but you can spend your TK Points on one.',
  ],
  [
    'How does the Care Card work?',
    'Every maintenance fills a box on your Care Card. Fill all 4 boxes and we add 500 points, worth £50, to your balance. A full card also counts towards Gold and Black.',
  ],
  [
    'What is a top up?',
    'A visit under £200, or one sooner than 5 weeks after your last maintenance for tapes, or 7 weeks for everything else. It still earns points. They are added to what is pending and released with your next maintenance. A top up does not fill a Care Card box.',
  ],
  [
    'Do points expire?',
    'After 24 months from the day they land, and we tell you 3 months before anything does. They are never taken away for anything you do.',
  ],
  [
    'How do I progress to the next Tier?',
    'Everyone starts at Silver. Fill a Care Card and earn 1,500 Tier Points for Gold, or 3,000 for Black. Tier points are 1 for every £1 you spend with us, on anything. You move up the moment you qualify, and keep your tier for the rest of that year and all of the next. The How Tiers Work section has more details.',
  ],
  [
    'What do the different tiers give me?',
    'More points on every maintenance, bigger discounts on colour and Davines, free colour, a wash and blow dry with your maintenance, birthday points and a Davines gift. Tier Perks shows exactly what each tier gives.',
  ],
];

// details / summary as an accordion: one answer open at a time, the first open to start, + closed and a dash open.
// The row moves and the answer fades with Reanimated, so opening and closing are smooth.
function Item({ q, a, open, onPress }: { q: string; a: string; open: boolean; onPress: () => void }) {
  return (
    <Animated.View layout={LinearTransition.duration(220)} style={f.details}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        hitSlop={{ top: 10, bottom: 10 }}
        style={({ pressed }) => [f.summary, pressed && { opacity: 0.6 }]}
      >
        <Text style={f.q}>{q}</Text>
        <Text style={f.mark}>{open ? '–' : '+'}</Text>
      </Pressable>
      {open && (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
          <Text style={f.a}>{a}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// 16 QUESTIONS, fixed text
export default function Faqs() {
  const router = useRouter();
  const { tierRules } = useData();
  const [open, setOpen] = useState<string | null>(HAIR[0][0]);
  const toggle = (q: string) => setOpen((cur) => (cur === q ? null : q));
  // the band weeks answer comes first, with the CRM's weeks when it sends them
  const points: [string, string][] = [['When should I come in to earn the most?', bandFaq(tierRules)], ...POINTS];
  return (
    <Screen tab="more" back onBack={() => router.navigate('/more')} title="FAQs">
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

      <Animated.View layout={LinearTransition.duration(220)}>
        <Gap size="l" />
        <Eyebrow>Your points</Eyebrow>
        <Gap size="s" />
        {points.map(([q, a]) => (
          <Item key={q} q={q} a={a} open={open === q} onPress={() => toggle(q)} />
        ))}

        <Gap size="l" />
        <Small>Anything else, message the salon from the Contact tab and we will answer it.</Small>
      </Animated.View>
    </Screen>
  );
}

const f = StyleSheet.create({
  details: { borderBottomWidth: 1, borderBottomColor: C.hairSoft, paddingVertical: 15 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14, minHeight: 24 },
  q: { flex: 1, fontFamily: F.reg, fontSize: 13, color: C.ink },
  mark: { fontFamily: F.reg, fontSize: 16, lineHeight: 18, color: C.mute, width: 14, textAlign: 'right' },
  a: { fontFamily: F.reg, fontSize: 13, lineHeight: 22, color: C.grey, marginTop: 10, textAlign: 'justify' },
});
