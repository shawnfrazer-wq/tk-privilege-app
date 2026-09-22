import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { crm, FreeTime, Stylist } from '../src/crm';
import { useData } from '../src/data';
import { dayMonth, dayNumber, num, pounds, time } from '../src/format';
import { C, F, ls } from '../src/theme';
import { Btn } from '../src/ui/Btn';
import { Gap } from '../src/ui/Gap';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Eyebrow, Small } from '../src/ui/T';

const BATCH_DAYS = 31;
const MAX_DAYS = 120;
const LONDON = 'Europe/London';

const isoDay = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const londonDay = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: LONDON, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
const weekdayShort = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: LONDON, weekday: 'short' }).format(new Date(iso));

// 9 BOOKING. Her stylist's free times come from app_free_times; the request goes through app_request_booking.
export default function Book() {
  const router = useRouter();
  const { summary: s, refresh } = useData();
  const [staff, setStaff] = useState<Stylist | null>(null);
  const [slots, setSlots] = useState<FreeTime[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // the maintenance service for her method, from app_summary
  const service = s?.care_service_id ?? null;
  const serviceName = s?.care_service_name ?? '';

  useEffect(() => {
    (async () => {
      setLoadFailed(false);
      try {
        const [prof, list] = await Promise.all([crm.profile(), crm.stylists()]);
        const mine = list.find((x) => x.id === prof.preferred_staff_id) ?? list[0] ?? null;
        setStaff(mine);
      } catch (e) {
        console.error('app_stylists', e);
        setLoadFailed(true);
      }
    })();
  }, [attempt]);

  useEffect(() => {
    if (!staff || !service) return;
    let cancelled = false;
    (async () => {
      const start = new Date();
      for (let offset = 0; offset < MAX_DAYS; offset += BATCH_DAYS) {
        const from = new Date(start);
        from.setDate(from.getDate() + offset);
        try {
          const batch = await crm.freeTimes(staff.id, service, isoDay(from), BATCH_DAYS);
          if (cancelled) return;
          setSlots((prev) => {
            const seen = new Set(prev.map((p) => p.slot_start));
            return [...prev, ...batch.filter((b) => !seen.has(b.slot_start))];
          });
        } catch (e) {
          console.error('app_free_times', e);
          if (!cancelled) setLoadFailed(true);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [staff, service]);

  const days = useMemo(() => {
    const out: { key: string; first: string }[] = [];
    const seen = new Set<string>();
    for (const f of slots) {
      const k = londonDay(f.slot_start);
      if (!seen.has(k)) {
        seen.add(k);
        out.push({ key: k, first: f.slot_start });
      }
    }
    return out;
  }, [slots]);

  useEffect(() => {
    if (!day && days.length) setDay(days[0].key);
  }, [days, day]);

  const times = useMemo(() => slots.filter((f) => londonDay(f.slot_start) === day), [slots, day]);

  async function request() {
    if (!slot || !staff || !service || busy) return;
    setBusy(true);
    setProblem(null);
    try {
      await crm.requestBooking(service, staff.id, slot, null);
      refresh();
      router.replace({ pathname: '/booked', params: { start: slot, stylist: staff.name } });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'The request could not be sent.');
    } finally {
      setBusy(false);
    }
  }

  const pending = s?.pending_points ?? 0;
  const isNew = !!s && !s.has_had_maintenance;

  return (
    <Screen tab="home" back title="Book" status={statusOf(s && staff, loadFailed)} refreshing={false} onRefresh={() => setAttempt((a) => a + 1)}>
      <Gap />
      <Disp>{s?.care_date ? `Your Care Date Is ${dayMonth(s.care_date)}` : 'Your Next Visit'}</Disp>
      <Gap size="s" />
      {pending > 0 && s?.full_until ? (
        <Copy>Come by {dayMonth(s.full_until)} and your points stay full.</Copy>
      ) : isNew ? (
        <Copy>Your first maintenance appointment.</Copy>
      ) : null}

      <Gap />
      <Eyebrow>Choose a day</Eyebrow>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -26 }} contentContainerStyle={b.daychips}>
        {days.map((dd) => {
          const on = dd.key === day;
          return (
            <Pressable
              key={dd.key}
              onPress={() => {
                setDay(dd.key);
                setSlot(null);
              }}
              style={[b.daychip, on && b.daychipOn]}
              accessibilityRole="button"
            >
              <Text style={[b.dayNum, on && { color: '#fff' }]}>{dayNumber(dd.first)}</Text>
              <Text style={[b.dayName, on && { color: 'rgba(255,255,255,0.7)' }]}>{weekdayShort(dd.first)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Gap />
      <Eyebrow>{staff ? `${staff.name}'s times` : 'Times'}</Eyebrow>
      <View style={b.times}>
        {times.map((t) => {
          const on = t.slot_start === slot;
          return (
            <Pressable key={t.slot_start} onPress={() => setSlot(t.slot_start)} style={[b.time, on && b.timeOn]} accessibilityRole="button">
              <Text style={[b.timeText, on && { color: '#fff' }]}>{time(t.slot_start)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={b.summary}>
        <View style={b.r}>
          <Text style={b.rl}>What you are booking</Text>
          <Text style={b.rr}>{serviceName}</Text>
        </View>
        {pending > 0 && (
          <View style={b.r}>
            <Text style={b.rl}>Points pending</Text>
            <Text style={b.rr}>{num(pending)}</Text>
          </View>
        )}
        {pending > 0 && !!s?.full_until && (
          <View style={b.r}>
            <Text style={b.rl}>Released in full if you come by</Text>
            <Text style={b.rr}>
              {dayMonth(s.full_until)}, {pounds(s.pending_pounds_full)}
            </Text>
          </View>
        )}
      </View>
      <Gap />
      <Btn label="Request this booking" onPress={request} disabled={!slot || !service || !staff || busy} />
      {problem && (
        <>
          <Gap size="s" />
          <Small>{problem}</Small>
        </>
      )}
      <Gap size="s" />
      <Small style={{ textAlign: 'center' }}>The salon confirms it. You will see it as requested until they do.</Small>
    </Screen>
  );
}

const b = StyleSheet.create({
  daychips: { flexDirection: 'row', gap: 8, marginTop: 12, paddingHorizontal: 26 },
  daychip: { width: 76, backgroundColor: '#fff', borderWidth: 1, borderColor: C.hair, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center' },
  daychipOn: { borderColor: C.ink, backgroundColor: C.ink },
  dayNum: { fontFamily: F.serif, fontSize: 20, lineHeight: 22, color: C.ink },
  dayName: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.14, 9), textTransform: 'uppercase', color: C.mute, marginTop: 5 },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  time: { width: '31.5%', backgroundColor: '#fff', borderWidth: 1, borderColor: C.hair, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center' },
  timeOn: { borderColor: C.ink, backgroundColor: C.ink },
  timeText: { fontFamily: F.reg, fontSize: 12.5, color: C.ink },
  summary: { backgroundColor: C.band, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 18, marginTop: 22, gap: 9 },
  r: { flexDirection: 'row', justifyContent: 'space-between', gap: 14 },
  rl: { fontFamily: F.reg, fontSize: 12, color: C.grey, flexShrink: 1 },
  rr: { fontFamily: F.reg, fontSize: 12, color: C.ink, textAlign: 'right', flexShrink: 1 },
});
