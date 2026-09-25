import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Summary } from '../src/crm';
import { useData, useNow } from '../src/data';
import { dayMonth, dayNumber, monthShort, monthYear, num, pounds, time, updatedAgo, weekday } from '../src/format';
import { C, F } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { CareCardBoxes } from '../src/ui/CareCardBoxes';
import { Gap } from '../src/ui/Gap';
import { NextAppt } from '../src/ui/NextAppt';
import { PrivilegeCard } from '../src/ui/PrivilegeCard';
import { RowBtn } from '../src/ui/Rows';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect, Stale } from '../src/ui/T';
import { figures } from '../src/ui/figures';
import { track } from '../src/ui/tiers';
import { Waiting } from '../src/ui/Waiting';

function greeting(now: number, name: string) {
  const h = new Date(now).getHours();
  const g = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
  return `${g}, ${name}`;
}

// "first" only when she has never had a maintenance with the salon; the usual case is "next"
export const firstOrNext = (s: Summary) => (s.has_had_maintenance ? 'next' : 'first');

function careCardLine(s: Summary, rate: number): string {
  const pts = num(s.card_reward_points);
  const gbp = pounds(s.card_reward_pounds ?? s.card_reward_points / (rate || 10));
  if (!s.card_boxes) return `Your ${firstOrNext(s)} maintenance fills the first box. A full card is ${pts} points, ${gbp}.`;
  return `${num(s.card_boxes)} of ${num(s.card_target)}. A full card is ${pts} points, ${gbp}.`;
}

// 4 HOME
export default function Home() {
  const router = useRouter();
  const { summary: s, settings, requests, tierPerks, tierRules, failed, updatedAt, refreshing, refresh } = useData();
  const now = useNow();

  if (!s) {
    return <Screen tab="home" brand refreshing={refreshing} onRefresh={refresh} status={statusOf(s, failed)}>{null}</Screen>;
  }

  const f = figures(settings, tierRules, s);
  const rate = f.rate;
  const next = s.next_appointment_at;
  const waiting = !next && requests && requests.length > 0 ? requests[0] : null;
  const isNew = !next && !waiting && !s.balance_points && !s.pending_points && !s.has_had_maintenance;
  const t = track(s);
  const who = [s.next_appointment_services, s.next_appointment_stylists].filter(Boolean).join(' with ');
  const where = s.next_appointment_location ? `, ${s.next_appointment_location}` : '';
  const days = s.days_to_care_date;
  const freeColour = s.free_colour_left_pounds;
  // "left" once the desk has used some of her tier's free colour (app_tier_perks gives the tier's full amount)
  const colourFull = tierPerks?.find((p) => p.tier === s.tier)?.free_colour_pounds;
  const colourUsed = colourFull != null && freeColour < Number(colourFull);

  return (
    <Screen tab="home" brand refreshing={refreshing} onRefresh={refresh}>
      <Gap size="s" />
      <Disp>{greeting(now, s.first_name ?? '')}</Disp>
      <Gap />

      <PrivilegeCardButton onPress={() => router.navigate('/card')} s={s} />

      <Gap />
      <Waiting summary={s} />

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
              included={s.maintenance_perk_next ? 'Wash and blow dry included' : undefined}
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
          <Text style={h.tileBig}>{t.tileBig}</Text>
          <Text style={h.tileSmall}>{t.tileSmall}</Text>
        </View>
      </View>
      {(freeColour > 0 || s.davines_gift_owed) && (
        <View style={h.perklines}>
          {freeColour > 0 && (
            <View style={h.perkline}>
              <View style={h.dot} />
              <Text style={h.perkText}>You have {pounds(freeColour)} of free colour{colourUsed ? ' left' : ''}</Text>
            </View>
          )}
          {s.davines_gift_owed && (
            <View style={h.perkline}>
              <View style={h.dot} />
              <Text style={h.perkText}>Your Davines gift is waiting at the salon</Text>
            </View>
          )}
        </View>
      )}

      <Gap size="l" />
      <Sect>Care Card</Sect>
      <Gap size="s" />
      <Copy>{careCardLine(s, rate)}</Copy>
      <CareCardBoxes filled={s.card_boxes || 0} target={s.card_target || 4} />
      <Gap size="l" />
      <View>
        <RowBtn title="Your TK Points" sub="Every line, pending and released" onPress={() => router.push('/points')} />
        <RowBtn title="Refer a Friend" sub={`${num(f.referrer)} points for you, ${num(f.referred)} for her`} onPress={() => router.push('/refer')} />
        <RowBtn title="Leave a Review" sub={`${num(f.review)} points per platform`} onPress={() => router.push('/review')} />
        <RowBtn title="Your Details" sub="What the salon has for you" onPress={() => router.push('/details')} last />
      </View>
      <Stale>{updatedAgo(updatedAt, now)}</Stale>
    </Screen>
  );
}

function PrivilegeCardButton({ s, onPress }: { s: Summary; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Open your card">
      <PrivilegeCard tier={s.tier} name={[s.first_name, s.last_name].filter(Boolean).join(' ')} since={`Client since ${monthYear(s.client_since)}`} right={`${num(s.balance_points)} PTS`} />
    </Pressable>
  );
}

const h = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, backgroundColor: C.band, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, gap: 5 },
  tileBig: { fontFamily: F.serif, fontSize: 22, lineHeight: 24, color: C.ink },
  tileSmall: { fontFamily: F.reg, fontSize: 10.5, lineHeight: 15.75, color: C.mute },
  perklines: { gap: 6, marginTop: 12 },
  perkline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold },
  perkText: { fontFamily: F.reg, fontSize: 12.5, color: C.grey },
});
