import { useRouter } from 'expo-router';
import React from 'react';
import { Gap } from '../src/ui/Gap';
import { ContactIcon, DetailsIcon, InfoIcon, PointsIcon, QuestionIcon, ReferIcon, ReviewIcon } from '../src/ui/Icons';
import { RowLink } from '../src/ui/RowLink';
import { Screen } from '../src/ui/Screen';
import { Disp } from '../src/ui/T';

// MORE, the fifth tab (Shawn, 21 September): everything the other 4 tabs do not carry
export default function More() {
  const router = useRouter();
  return (
    <Screen tab="more" title="More">
      <Gap />
      <Disp>Everything Else</Disp>
      <Gap size="s" />
      <RowLink Icon={PointsIcon} title="Your Points" sub="Every line, pending and released" onPress={() => router.push('/points')} />
      <RowLink Icon={InfoIcon} title="How Points Work" sub="What you earn and when it is released" onPress={() => router.push('/how-points-work')} />
      <RowLink Icon={ReferIcon} title="Refer a Friend" sub="500 points for you, 1,000 for her" onPress={() => router.push('/refer')} />
      <RowLink Icon={ReviewIcon} title="Leave a Review" sub="250 points per platform" onPress={() => router.push('/review')} />
      <RowLink Icon={DetailsIcon} title="Your Details" sub="What the salon has for you" onPress={() => router.push('/details')} />
      <RowLink Icon={QuestionIcon} title="FAQs" sub="Your hair, and your points" onPress={() => router.push('/faqs')} />
      <RowLink Icon={ContactIcon} title="Contact Us" sub="WhatsApp, call or email the salon" onPress={() => router.push('/contact')} last />
    </Screen>
  );
}
