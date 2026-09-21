import { PlayfairDisplay_400Regular, PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, DataProvider, useAuth } from '../src/data';
import { sessionStillGood } from '../src/supabase';
import { C } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Routes() {
  const { signedIn, gate } = useAuth();
  const tab = { animation: 'none' as const, gestureEnabled: false };
  // The opening screen is the first route whether she is signed in or not, and it decides where to go.
  // While her card is incomplete only Your Details is available, so the router lands there and stays there.
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.paper } }}>
      <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: C.dark }, gestureEnabled: false }} />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="code" />
      <Stack.Protected guard={signedIn && !gate}>
        <Stack.Screen name="home" options={tab} />
        <Stack.Screen name="card" options={tab} />
        <Stack.Screen name="rewards" options={tab} />
        <Stack.Screen name="visits" options={tab} />
        <Stack.Screen name="more" options={tab} />
        <Stack.Screen name="contact" />
        <Stack.Screen name="how-points-work" />
        <Stack.Screen name="points" />
        <Stack.Screen name="faqs" />
        <Stack.Screen name="book" />
        <Stack.Screen name="booked" />
        <Stack.Screen name="refer" />
        <Stack.Screen name="review" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="details" options={{ gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    sessionStillGood()
      .then(setSignedIn)
      .catch(() => setSignedIn(false));
  }, []);

  const ready = fontsLoaded && signedIn !== null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;
  return (
    <SafeAreaProvider>
      <AuthProvider initial={signedIn === true}>
        <DataProvider>
          <Routes />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
