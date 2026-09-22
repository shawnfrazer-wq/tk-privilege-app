import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Summary } from '../crm';
import { dayMonth, num, pounds } from '../format';
import { C, F, ls } from '../theme';

const NO_CLOCK = ['topper', 'wig', 'clip_in'];

// .waiting: the gold box with the pending TK Points. "Come Back Earlier. Earn More" lists each date, earliest
// first, with the TK Points and pound value the CRM sends for it; a date that has passed drops off. Then the
// booking bonus line. Every date and figure is app_summary's. Never half, three quarters or full points.
export function Waiting({ summary: s }: { summary: Summary }) {
  const pending = s.pending_points || 0;
  const noClock = NO_CLOCK.includes(s.method ?? '');
  const band = noClock ? 1 : (s.band_today ?? 1);
  const booked = !!s.next_appointment_at;
  const apptBand = s.next_appointment_band ?? 1;
  const late = booked && apptBand > 1;
  const runOut = !noClock && ![1, 2, 3].includes(band);

  if (!pending && !s.has_had_maintenance) return null;

  const showFig = pending > 0 && !runOut;
  const ladder = pending > 0 && !noClock && !runOut;
  let line: string | null = null;
  if (!pending || runOut) line = 'Earn points on your next maintenance.';
  else if (noClock) line = `Worth ${pounds(s.pending_pounds_full)}, released in full with your next maintenance.`;
  else if (late && s.pending_pounds_at_next_appointment != null) {
    const pts = s.pending_points_at_next_appointment;
    const earns = pts != null ? `${num(pts)} TK Points, ${pounds(s.pending_pounds_at_next_appointment)}` : pounds(s.pending_pounds_at_next_appointment);
    line = `Your appointment on ${dayMonth(s.next_appointment_at)} earns ${earns}.`;
  }
  const bonusDate = s.booking_bonus_date ?? s.next_appointment_at;
  const bonus = showFig && booked && s.booking_bonus > 0 && bonusDate ? `Plus ${num(s.booking_bonus)} booking points when you come in on ${dayMonth(bonusDate)}.` : null;

  // earliest date first; a row shows while its date is still ahead (band_today at or before it)
  const rows = [
    { show: band <= 1, date: s.full_until, points: s.pending_points_full, value: s.pending_pounds_full },
    { show: band <= 2, date: s.band2_last_day, points: s.pending_points_band2, value: s.pending_pounds_band2 },
    { show: band <= 3, date: s.band3_last_day, points: s.pending_points_band3, value: s.pending_pounds_band3 },
  ].filter((r) => r.show && r.date);

  return (
    <View style={w.box}>
      <Text style={w.eyebrow}>Pending</Text>
      {showFig && (
        <View style={w.fig}>
          <Text style={w.big}>{num(pending)}</Text>
          <Text style={w.unit}>TK Points</Text>
        </View>
      )}
      {ladder && rows.length > 0 && (
        <>
          <Text style={w.ladhead}>Come Back Earlier. Earn More</Text>
          <View style={w.ladder}>
            {rows.map((r, i) => (
              <View key={i} style={[w.srow, i === rows.length - 1 && !line && !bonus && { borderBottomWidth: 0 }]}>
                <Text style={w.srowText}>
                  {i === 0 ? 'Come back by ' : 'By '}
                  {dayMonth(r.date)}
                </Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={w.srowValue}>{num(r.points)} TK Points</Text>
                  <Text style={w.srowNote}>{pounds(r.value)}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
      {!!line && <Text style={[w.p, ladder && { marginTop: 8 }]}>{line}</Text>}
      {!!bonus && <Text style={[w.p, w.bonus, ladder && !line && { borderTopWidth: 0, marginTop: 0, paddingTop: 2 }]}>{bonus}</Text>}
    </View>
  );
}

const w = StyleSheet.create({
  box: { borderWidth: 1, borderColor: C.gold, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, gap: 6 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.gold },
  fig: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  big: { fontFamily: F.serif, fontSize: 32, lineHeight: 34, color: C.ink },
  unit: { fontFamily: F.reg, fontSize: 12, color: C.gold, letterSpacing: ls(0.04, 12) },
  ladhead: { fontFamily: F.serif, fontSize: 16, lineHeight: 21, color: C.ink, marginTop: 4 },
  ladder: { marginTop: 2 },
  srow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(169,131,81,0.22)' },
  srowText: { flex: 1, fontFamily: F.reg, fontSize: 12, lineHeight: 18, color: C.grey },
  srowValue: { fontFamily: F.reg, fontSize: 13, color: C.ink, textAlign: 'right' },
  srowNote: { fontFamily: F.reg, fontSize: 10.5, color: C.gold, marginTop: 3, textAlign: 'right' },
  p: { fontFamily: F.reg, fontSize: 12, lineHeight: 19.2, color: C.grey },
  bonus: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(169,131,81,0.28)', fontSize: 11.5 },
});
