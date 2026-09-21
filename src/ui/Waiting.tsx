import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Summary } from '../crm';
import { dayMonth, num, pounds } from '../format';
import { C, F, ls } from '../theme';

const NO_CLOCK = ['topper', 'wig', 'clip_in'];
const familyLabel = (method: string | null) => (method === 'clip_in' ? 'Clip-in care' : 'Topper and wig care');

// The sentence under the pending figure. Every number in it comes from app_summary.
export function pendingLine(s: Summary): string {
  const full = pounds(s.pending_pounds_full);
  const today = pounds(s.pending_pounds_today);
  const until = dayMonth(s.full_until);
  if (NO_CLOCK.includes(s.method ?? '')) {
    return `Worth ${full} whenever you come in. ${familyLabel(s.method)} points are released in full.`;
  }
  const band = s.band_today ?? 1;
  if (band === 1) {
    const booked = !!s.next_appointment_at;
    const late = booked && (s.next_appointment_band ?? 1) > 1;
    if (late && s.pending_pounds_at_next_appointment != null) {
      return `Worth ${pounds(s.pending_pounds_at_next_appointment)} on ${dayMonth(s.next_appointment_at)}. Come in by ${until} and it is ${full}.`;
    }
    return `Worth ${full} if you come in by ${until}. Come later and less points are released.`;
  }
  if (band === 2) {
    let t = `Worth ${today} today. It was ${full} until ${until}`;
    if (s.pending_pounds_band3 != null && s.band2_last_day) {
      t += `, and it drops to ${pounds(s.pending_pounds_band3)} after ${dayMonth(s.band2_last_day)}`;
    }
    return t + '.';
  }
  if (band === 3) {
    return s.band3_last_day ? `Worth ${today} today. Nothing is released after ${dayMonth(s.band3_last_day)}.` : `Worth ${today} today.`;
  }
  const when = s.band3_last_day ? ` on ${dayMonth(s.band3_last_day)}` : '';
  const bonus = s.booking_bonus > 0 ? `the ${num(s.booking_bonus)} booking points` : 'the booking points';
  return `These ran out${when}, and ${bonus} with them. Your next care visit starts a new set.`;
}

export function bonusLine(s: Summary): string | null {
  if (!s.booking_bonus) return null;
  const kept = s.kept_bonus > 0 ? `, and another ${num(s.kept_bonus)} if you keep this appointment.` : '.';
  return `Plus ${num(s.booking_bonus)} booking points${kept}`;
}

const isRunOut = (s: Summary) => !NO_CLOCK.includes(s.method ?? '') && ![1, 2, 3].includes(s.band_today ?? 1);

// .waiting: the gold box with the pending points
export function Waiting({ summary }: { summary: Summary }) {
  if (!summary.pending_points) return null;
  const runOut = isRunOut(summary);
  const bonus = bonusLine(summary);
  return (
    <View style={[s.box, runOut && { opacity: 0.55 }]}>
      <Text style={s.eyebrow}>{runOut ? 'Run out' : 'Pending'}</Text>
      <View style={s.fig}>
        <Text style={s.big}>{num(summary.pending_points)}</Text>
        <Text style={s.unit}>points</Text>
      </View>
      <Text style={s.p}>{pendingLine(summary)}</Text>
      {bonus && <Text style={[s.p, s.bonus]}>{bonus}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  box: { borderWidth: 1, borderColor: C.gold, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, gap: 6 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.gold },
  fig: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  big: { fontFamily: F.serif, fontSize: 32, lineHeight: 34, color: C.ink },
  unit: { fontFamily: F.reg, fontSize: 12, color: C.gold, letterSpacing: ls(0.04, 12) },
  p: { fontFamily: F.reg, fontSize: 12, lineHeight: 19.2, color: C.grey },
  bonus: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(169,131,81,0.28)', fontSize: 11.5 },
});
