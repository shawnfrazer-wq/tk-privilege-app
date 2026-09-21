import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, ls, PAD } from '../theme';
import { BackIcon } from './Icons';
import { Nav, Tab } from './Nav';
import { Copy } from './T';

export type Status = 'loading' | 'error' | 'ready';

type Props = {
  children: React.ReactNode;
  tab?: Tab;
  title?: string;
  back?: boolean;
  onBack?: () => void;
  brand?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  status?: Status;
};

const logoNavy = require('../../assets/logo_navy.png');

// A screen is never blank: while its data loads it shows a quiet spinner, and if the call fails it says so.
export const WENT_WRONG = 'Something went wrong. Pull down to try again.';

// .screen: status bar, optional .top bar, optional .brand, the scrolling .body with .pad, then the nav
export function Screen({ children, tab, title, back, onBack, brand, refreshing, onRefresh, status = 'ready' }: Props) {
  const router = useRouter();
  const hasTop = back || title !== undefined;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.screen}>
      <StatusBar style="dark" />
      {hasTop && (
        <View style={s.top}>
          {back ? (
            <Pressable onPress={onBack ?? (() => router.back())} accessibilityRole="button" accessibilityLabel="Back" style={s.back} hitSlop={8}>
              <BackIcon color={C.ink} />
            </Pressable>
          ) : (
            <View style={{ width: 32 }} />
          )}
          <Text style={s.title}>{title ?? ''}</Text>
          <View style={{ width: 32 }} />
        </View>
      )}
      {brand && (
        <View style={s.brand}>
          <Image source={logoNavy} style={{ width: 112, height: 112 * (113 / 428) }} resizeMode="contain" />
        </View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[s.pad, status !== 'ready' && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={C.mute} /> : undefined}
      >
        {status === 'loading' ? (
          <View style={s.centre}>
            <ActivityIndicator color={C.mute} />
          </View>
        ) : status === 'error' ? (
          <View style={s.centre}>
            <Copy style={{ textAlign: 'center' }}>{WENT_WRONG}</Copy>
          </View>
        ) : (
          children
        )}
      </ScrollView>
      {tab && <Nav tab={tab} />}
    </SafeAreaView>
  );
}

// what a screen shows for a piece of data it is waiting on
export function statusOf(data: unknown, failed: boolean): Status {
  if (data) return 'ready';
  return failed ? 'error' : 'loading';
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: PAD,
    minHeight: 40,
  },
  back: { padding: 6, marginLeft: -6 },
  title: { fontFamily: F.med, fontSize: 11, letterSpacing: ls(0.2, 11), textTransform: 'uppercase', color: C.ink },
  brand: { alignItems: 'center', paddingTop: 16, paddingBottom: 6, paddingHorizontal: PAD },
  pad: { paddingHorizontal: PAD, paddingBottom: 24 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
});
