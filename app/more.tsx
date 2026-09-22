import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Gap } from '../src/ui/Gap';
import { RowBtn } from '../src/ui/Rows';
import { Screen } from '../src/ui/Screen';
import { Disp } from '../src/ui/T';

// MORE, the fifth tab: everything reachable elsewhere, the 10 rows the wireframe lists
export default function More() {
  const router = useRouter();
  return (
    <Screen tab="more" title="More">
      <Gap />
      <Disp>Everything Else</Disp>
      <Gap />
      <View>
        <RowBtn title="Your TK Points" sub="Every line, pending and released" onPress={() => router.push('/points')} />
        <RowBtn title="How Points Work" sub="What you earn and when it is released" onPress={() => router.push('/how-points-work')} />
        <RowBtn title="How Tiers Work" sub="Moving up, and staying there" onPress={() => router.push('/how-tiers-work')} />
        <RowBtn title="Tier Perks" sub="What Silver, Gold and Black give you" onPress={() => router.push('/tier-perks')} />
        <RowBtn title="Request a Booking" sub="Ask for a day and time with your stylist" onPress={() => router.push('/book')} />
        <RowBtn title="Refer a Friend" sub="500 TK Points for you, 1,000 for her" onPress={() => router.push('/refer')} />
        <RowBtn title="Leave a Review" sub="250 TK Points per platform" onPress={() => router.push('/review')} />
        <RowBtn title="Your Details" sub="What the salon has for you" onPress={() => router.push('/details')} />
        <RowBtn title="FAQs" sub="Your hair, and your points" onPress={() => router.push('/faqs')} />
        <RowBtn title="Contact Us" sub="WhatsApp, call or email the salon" onPress={() => router.push('/contact')} last />
      </View>
    </Screen>
  );
}
