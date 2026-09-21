import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Summary } from '../src/crm';
import { useData, useNow } from '../src/data';
import { dayMonth, dayNumber, monthShort, monthYear, num, pounds, time, updatedAgo, weekday } from '../src/format';
import { C, F } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { NextAppt } from '../src/ui/NextAppt';
import { PrivilegeCard } from '../src/ui/PrivilegeCard';
import { Screen } from '../src/ui/Screen';
import { Copy, Disp, Sect, Stale } from '../src/ui/T';
import { DetailsIcon, PointsIcon, ReferIcon, ReviewIcon } from '../src/ui/Icons';
import { RowLink } from '../src/ui/RowLink';
import { statusOf } from '../src/ui/Screen';
import { tierTile } from '../src/ui/tiers';
import { Waiting } from '../src/ui/Waiting';

const tkmark = require('../assets/tkmark_white.png');

function greeting(now: number, name: string) {
  const h = new Date(now).getHours();
  const g = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
  return `${g}, ${name}`;
}

function careCardLine(s: Summary, rate: number): string {
  const pts = num(s.card_reward_points);
  const gbp = pounds(s.card_reward_pounds ?? s.card_reward_points / (rate || 10));
  if (!s.card_boxes) return `Your first care visit fills the first box. A full card is ${pts} points, ${gbp}.`;
  return `${num(s.card_boxes)} of ${num(s.card_target)}. A full card is ${pts} points, ${gbp}.`;
}

// 4 HOME
export default function Home() {
  const router = useRouter();
  const { summary: s, settings, requests, failed, updatedAt, refreshing, refresh } = useData();
  const now = useNow();

  if (!s) {
    return <Screen tab="home" brand refreshing={refreshing} onRefresh={refresh} status={statusOf(s, failed)}>{null}</Screen>;
  }

  const rate = Number(settings?.redeem_rate_points_per_pound) || 10;
  const next = s.next_appointment_at;
  // a booking request she has sent that the desk has not yet put in the diary (decisions-21-sep.md section 1)
  const waiting = !next && requests && requests.length > 0 ? requests[0] : null;
  const isNew = !next && !waiting && !s.balance_points && !s.pending_points && !s.visits_12m;
  const tile = tierTile(s);
  const target = s.card_target || 4;
  const who = [s.next_appointment_services, s.next_appointment_stylists].filter(Boolean).join(' with ');
  const where = s.next_appointment_location ? `, ${s.next_appointment_location}` : '';
  const days = s.days_to_care_date;

  return (
    <Screen tab="home" brand refreshing={refreshing} onRefresh={refresh}>
      <Gap size="s" />
      <Disp>{greeting(now, s.first_name ?? '')}</Disp>
      <Gap />

      <Pressable onPress={() => router.navigate('/card')} accessibilityRole="button" accessibilityLabel="Open your card">
        <PrivilegeCard
          tier={s.tier}
          name={[s.first_name, s.last_name].filter(Boolean).join(' ')}
          since={`Client since ${monthYear(s.client_since)}`}
          right={`${num(s.balance_points)} PTS`}
        />
      </Pressable>

      {!!s.pending_points && (
        <>
          <Gap />
          <Waiting summary={s} />
        </>
      )}

      {!isNew && (
        <>
          <Gap />
          <Sect>{next ? 'Your Next Appointment' : waiting ? 'Requested' : 'Nothing Booked Yet'}</Sect>
          {next ? (
            <NextAppt
              day={dayNumber(next)}
              month={monthShort(next)}
              what={who}
              detail={`${weekday(next)} at ${time(next)}${where}. Please arrive with clean, dry hair.`}
            />
          ) : waiting ? (
            <NextAppt
              day={dayNumber(waiting.requested_start)}
              month={monthShort(waiting.requested_start)}
              what={[waiting.service, waiting.stylist].filter(Boolean).join(' with ')}
              detail={`${weekday(waiting.requested_start)} at ${time(waiting.requested_start)}${where}`}
            />
          ) : (
            <>
              <Gap size="s" />
              <Btn variant="gold" label={s.care_date ? `Book my ${dayMonth(s.care_date)} visit` : 'Book my next visit'} onPress={() => router.push('/book')} />
            </>
          )}
        </>
      )}

      <Gap />
      <View style={h.tiles}>
        <View style={h.tile}>
          {s.care_date ? (
            <>
              <Text style={h.tileBig}>{days === 0 ? 'Today' : days != null && days < 0 ? `${num(-days)} days ago` : `In ${num(days)} days`}</Text>
              <Text style={h.tileSmall}>Your care date, {dayMonth(s.care_date)}</Text>
            </>
          ) : (
            <>
              <Text style={h.tileBig}>No care date</Text>
              <Text style={h.tileSmall}>Come in when your piece needs it</Text>
            </>
          )}
        </View>
        <View style={h.tile}>
          <Text style={h.tileBig}>{tile.big}</Text>
          <Text style={h.tileSmall}>{tile.small}</Text>
        </View>
      </View>

      <Gap size="l" />
      <Sect>Care Card</Sect>
      <Gap size="s" />
      <Copy>{careCardLine(s, rate)}</Copy>
      <View style={h.boxes}>
        {Array.from({ length: target }).map((_, i) => {
          const filled = i < (s.card_boxes || 0);
          return (
            <View key={i} style={[h.box, filled && h.boxFilled]}>
              {filled && <Image source={tkmark} style={{ width: 26, height: 26 }} />}
            </View>
          );
        })}
      </View>

      {/* the way to the 4 screens the bottom menu does not carry, in the Contact row style (Shawn, 21 September) */}
      <Gap size="l" />
      <RowLink Icon={PointsIcon} title="Your Points" sub="Every line, pending and released" onPress={() => router.push('/points')} />
      <RowLink Icon={ReferIcon} title="Refer a Friend" sub="500 points for you, 1,000 for her" onPress={() => router.push('/refer')} />
      <RowLink Icon={ReviewIcon} title="Leave a Review" sub="250 points per platform" onPress={() => router.push('/review')} />
      <RowLink Icon={DetailsIcon} title="Your Details" sub="What the salon has for you" onPress={() => router.push('/details')} last />
      <Stale>{updatedAgo(updatedAt, now)}</Stale>
    </Screen>
  );
}

const h = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, backgroundColor: C.band, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, gap: 5 },
  tileBig: { fontFamily: F.serif, fontSize: 22, lineHeight: 24, color: C.ink },
  tileSmall: { fontFamily: F.reg, fontSize: 10.5, lineHeight: 15.75, color: C.mute },
  boxes: { flexDirection: 'row', gap: 8, marginTop: 12 },
  box: { flex: 1, height: 44, borderWidth: 1, borderColor: C.hair, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  boxFilled: { backgroundColor: C.ink, borderColor: C.ink },
});
