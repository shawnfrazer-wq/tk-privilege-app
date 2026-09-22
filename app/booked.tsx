import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useData } from '../src/data';
import { dayMonth, num, pounds, time, weekday } from '../src/format';
import { Btn } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Note } from '../src/ui/Note';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp } from '../src/ui/T';

// 9b BOOKING REQUESTED
export default function Booked() {
  const router = useRouter();
  const { summary: s } = useData();
  const { start, stylist } = useLocalSearchParams<{ start: string; stylist: string }>();
  const where = s?.next_appointment_location ? `, ${s.next_appointment_location}` : '';
  const pending = s?.pending_points ?? 0;
  return (
    <Screen tab="home" back onBack={() => router.replace('/home')} title="Book">
      <Gap size="l" />
      <Disp>Requested</Disp>
      <Gap size="s" />
      <Copy>
        {weekday(start)} {dayMonth(start)} at {time(start)}
        {stylist ? ` with ${stylist}` : ''}
        {where}. Nothing is booked until the desk confirms it, usually the same day. We will message you either way.
      </Copy>
      {pending > 0 && !!s?.full_until && (
        <>
          <Gap />
          <Note
            title={`${num(pending)} points pending`}
            body={`Come back by ${dayMonth(s.full_until)} to earn ${num(s.pending_points_full)} TK Points, ${pounds(s.pending_pounds_full)}. It is the day you come in that decides.`}
          />
        </>
      )}
      <Gap size="l" />
      <Btn label="Back to home" onPress={() => router.replace('/home')} />
    </Screen>
  );
}
