import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, ls } from '../theme';
import { CardIcon, ContactIcon, HomeIcon, RewardsIcon, VisitsIcon } from './Icons';

export type Tab = 'home' | 'card' | 'rewards' | 'visits' | 'contact';

const TABS: { key: Tab; label: string; href: '/home' | '/card' | '/rewards' | '/visits' | '/contact'; Icon: typeof HomeIcon }[] = [
  { key: 'home', label: 'Home', href: '/home', Icon: HomeIcon },
  { key: 'card', label: 'Card', href: '/card', Icon: CardIcon },
  { key: 'rewards', label: 'Rewards', href: '/rewards', Icon: RewardsIcon },
  { key: 'visits', label: 'Visits', href: '/visits', Icon: VisitsIcon },
  { key: 'contact', label: 'Contact', href: '/contact', Icon: ContactIcon },
];

// nav.nav: the bottom menu on every signed in screen
export function Nav({ tab }: { tab: Tab }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.nav, { paddingBottom: Math.max(22, insets.bottom + 8) }]}>
      {TABS.map(({ key, label, href, Icon }) => {
        const on = key === tab;
        const colour = on ? C.ink : C.navOff;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={s.btn}
            onPress={() => {
              if (!on) router.navigate(href);
            }}
          >
            <Icon color={colour} />
            <Text style={[s.label, { color: colour }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.hairSoft,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  btn: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 4 },
  label: { fontFamily: F.med, fontSize: 8, letterSpacing: ls(0.12, 8), textTransform: 'uppercase' },
});
