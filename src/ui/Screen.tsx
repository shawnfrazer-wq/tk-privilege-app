import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, ls, PAD } from '../theme';
import { BackIcon } from './Icons';
import { Nav, Tab } from './Nav';

type Props = {
  children: React.ReactNode;
  tab?: Tab;
  title?: string;
  back?: boolean;
  brand?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

const logoNavy = require('../../assets/logo_navy.png');

// .screen: status bar, optional .top bar, optional .brand, the scrolling .body with .pad, then the nav
export function Screen({ children, tab, title, back, brand, refreshing, onRefresh }: Props) {
  const router = useRouter();
  const hasTop = back || title !== undefined;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.screen}>
      <StatusBar style="dark" />
      {hasTop && (
        <View style={s.top}>
          {back ? (
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" style={s.back} hitSlop={8}>
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
        contentContainerStyle={s.pad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={C.mute} /> : undefined}
      >
        {children}
      </ScrollView>
      {tab && <Nav tab={tab} />}
    </SafeAreaView>
  );
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
  pad: { paddingHorizontal: PAD, paddingBottom: 40 },
});
