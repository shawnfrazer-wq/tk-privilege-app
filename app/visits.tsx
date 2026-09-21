import React, { useEffect } from 'react';
import { useData } from '../src/data';
import { capitalise, dayMonth, dayMonthYear, dayNumber, monthShort, num, time, weekday } from '../src/format';
import { Gap } from '../src/ui/Gap';
import { LedgerRow } from '../src/ui/Ledger';
import { NextAppt } from '../src/ui/NextAppt';
import { Note } from '../src/ui/Note';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';

const METHOD: Record<string, string> = {
  micro_rings: 'Micro Rings',
  micro_bonds: 'Micro Bonds',
  bonds: 'Micro Bonds',
  tapes: 'Tapes',
  wefts: 'Wefts',
  topper: 'Topper',
  wig: 'Wig',
  clip_in: 'Clip-ins',
};

// The wireframe sentence is written for micro rings, so it is shown for micro rings only. See docs/crm-requests.md.
const HOW_IT_IS_DONE: Record<string, string> = {
  micro_rings: ' Your own hair goes back in each time, re-tipped, with a few new strands where it has thinned.',
};

// 10 VISITS
export default function VisitsScreen() {
  const { summary: s, visits: v, failed, visitsFailed, loadVisits, refreshing, refresh } = useData();
  useEffect(() => {
    if (!v) loadVisits();
  }, [v, loadVisits]);
  const status = statusOf(s && v, failed || visitsFailed);
  const retry = () => {
    refresh();
    if (!v) loadVisits();
  };

  const next = s?.next_appointment_at;
  const who = [s?.next_appointment_services, s?.next_appointment_stylists].filter(Boolean).join(' with ');
  const where = s?.next_appointment_location ? `, ${s.next_appointment_location}` : '';
  const list = v?.visits ?? [];
  const onlyNewSets = list.length > 0 && list.every((x) => x.new_set);

  const setTitle = v?.method ? [capitalise(v.hair_type), METHOD[v.method] ?? capitalise(v.method)].filter(Boolean).join(' ') : v?.fitted_what ?? '';
  const setBody = v?.fitted_on
    ? `Fitted ${dayMonthYear(v.fitted_on)}${v.fitted_by ? ` by ${v.fitted_by}` : ''}.${HOW_IT_IS_DONE[v.method ?? ''] ?? ''}${
        v.care_every_weeks ? ` Your care date is every ${num(v.care_every_weeks)} weeks.` : ''
      }`
    : '';

  return (
    <Screen tab="visits" title="Your Visits" refreshing={refreshing} onRefresh={retry} status={status}>
      <Gap />
      <Disp>Your Visits</Disp>
      <Gap size="s" />
      <Copy>Every visit you have had with us, and what is booked next.</Copy>
      {!!setBody && (
        <>
          <Gap />
          <Note title={setTitle} body={setBody} />
        </>
      )}

      <Gap />
      <Sect>{next ? 'Your Next Appointment' : 'Nothing Booked Yet'}</Sect>
      {next ? (
        <NextAppt day={dayNumber(next)} month={monthShort(next)} what={who} detail={`${weekday(next)} at ${time(next)}${where}`} />
      ) : (
        onlyNewSets &&
        s?.care_date && (
          <>
            <Gap size="s" />
            <Copy>Your care date is {dayMonth(s.care_date)}. Book your first maintenance at the desk, or send a request from Home.</Copy>
          </>
        )
      )}

      <Gap size="l" />
      <Sect>Recent Visits</Sect>
      <Gap size="s" />
      {list.map((x, i) => {
        const last = i === list.length - 1;
        const detail = [dayMonthYear(x.d), x.stylists].filter(Boolean).join(', ');
        if (x.new_set) return <LedgerRow key={i} title={x.title ?? ''} detail={detail} right="New set" rightNote="Fills a box" muted last={last} />;
        return <LedgerRow key={i} title={x.title ?? ''} detail={detail} right={x.points != null ? num(x.points) : ''} rightNote={x.status} last={last} />;
      })}
    </Screen>
  );
}
