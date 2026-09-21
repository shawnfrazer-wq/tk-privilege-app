import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Btn } from '../src/ui/Btn';
import { C, F, ls } from '../src/theme';

const loop = require('../assets/loop.mp4');
const poster = require('../assets/poster.jpg');
const wordmark = require('../assets/logo_white.png');

// 1 OPENING SCREEN, black then the loop, then the login rises over it
const EASE = Easing.bezier(0.23, 1, 0.32, 1);

export default function Opening() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const player = useVideoPlayer(loop, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const vid = useRef(new Animated.Value(0)).current;
  const mark = useRef(new Animated.Value(0)).current;
  const sub = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mark, { toValue: 1, duration: 1000, easing: EASE, useNativeDriver: true }),
      Animated.timing(sub, { toValue: 1, duration: 1000, delay: 300, easing: EASE, useNativeDriver: true }),
      Animated.timing(vid, { toValue: 1, duration: 1400, delay: 2200, easing: EASE, useNativeDriver: true }),
      Animated.timing(enter, { toValue: 1, duration: 900, delay: 3200, easing: EASE, useNativeDriver: true }),
    ]).start();
  }, [mark, sub, vid, enter]);

  const rise = (v: Animated.Value, from: number) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
  });

  const markWidth = Math.min(272, width * 0.76);

  return (
    <View style={s.screen}>
      <StatusBar style="light" />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: vid }]}>
        <Image source={poster} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.86)']}
        locations={[0, 0.34, 0.68, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={s.brandblock}>
        <Animated.Image source={wordmark} resizeMode="contain" style={[{ width: markWidth, height: markWidth * (130 / 520) }, rise(mark, 8)]} />
        <Animated.Text style={[s.wordsub, rise(sub, 8)]}>Privilege</Animated.Text>
      </View>
      <Animated.View style={[s.enter, rise(enter, 18)]}>
        <Btn variant="light" label="Log in" onPress={() => router.push('/sign-in')} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.dark },
  brandblock: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  wordsub: {
    fontFamily: F.semi,
    fontSize: 15,
    letterSpacing: ls(0.54, 15),
    color: '#fff',
    marginTop: 24,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingLeft: ls(0.54, 15),
  },
  enter: { position: 'absolute', left: 0, right: 0, bottom: 58, alignItems: 'center' },
});
