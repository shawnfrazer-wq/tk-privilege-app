import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Summary } from '../crm';
import { dayMonth, num, pounds } from '../format';
import { C, F, ls } from '../theme';

const NO_CLOCK = ['topper', 'wig', 'clip_in'];

// .waiting: the gold box with the pending TK Points. "Come Back Earlier. Earn More" with her 3 dated lines,
// a line whose date has passed hidden, then the booking bonus line. Every date and value is app_summary's.
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
  else if (late) {
    const share = apptBand === 2 ? 'three quarters' : apptBand === 3 ? 'half points' : null;
    if (share) line = `Your appointment on ${dayMonth(s.next_appointment_at)} earns ${share}.`;
  }
  const bonusDate = s.booking_bonus_date ?? s.next_appointment_at;
  const bonus = showFig && booked && s.booking_bonus > 0 && bonusDate ? `Plus ${num(s.booking_bonus)} booking points when you come in on ${dayMonth(bonusDate)}.` : null;

  const rows = [
    { show: band <= 3, text: `Come back by ${dayMonth(s.band3_last_day)}: earn half points on your last maintenance.`, value: pounds(s.pending_pounds_band3) },
    { show: band <= 2, text: `By ${dayMonth(s.band2_last_day)}: earn three quarters.`, value: pounds(s.pending_pounds_band2) },
    { show: band <= 1, text: `By ${dayMonth(s.full_until)}: earn full points.`, value: pounds(s.pending_pounds_full) },
  ].filter((r) => r.show);

  return (
    <View style={w.box}>
      <Text style={w.eyebrow}>Pending</Text>
      {showFig && (
        <View style={w.fig}>
          <Text style={w.big}>{num(pending)}</Text>
          <Text style={w.unit}>TK Points</Text>
        </View>
      )}
      {ladder && (
        <>
          <Text style={w.ladhead}>Come Back Earlier. Earn More</Text>
          <View style={w.ladder}>
            {rows.map((r, i) => (
              <View key={i} style={[w.srow, i === rows.length - 1 && !line && !bonus && { borderBottomWidth: 0 }]}>
                <Text style={w.srowText}>{r.text}</Text>
                <Text style={w.srowValue}>{r.value}</Text>
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
  p: { fontFamily: F.reg, fontSize: 12, lineHeight: 19.2, color: C.grey },
  bonus: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(169,131,81,0.28)', fontSize: 11.5 },
});
