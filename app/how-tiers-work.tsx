import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useData } from '../src/data';
import { fullDate, num } from '../src/format';
import { C, F, ls } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Kind, Kinds } from '../src/ui/Kinds';
import { Note } from '../src/ui/Note';
import { PrivilegeCard } from '../src/ui/PrivilegeCard';
import { Bar, Know } from '../src/ui/Rows';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';
import { figures } from '../src/ui/figures';
import { cardNeeded, keepFor, retainNote, stayFor, stayYear, tierName, tierState } from '../src/ui/tiers';

// 7 HOW TIERS WORK. Her status and progress from app_summary, the rules from app_tier_rules.
export default function HowTiersWork() {
  const { summary: s, settings, tierRules: r, failed, refreshing, refresh } = useData();
  if (!s || !r) {
    return <Screen tab="card" back title="How Tiers Work" refreshing={refreshing} onRefresh={refresh} status={statusOf(s && r, failed)}>{null}</Screen>;
  }
  const f = figures(settings, r, s);
  // climb: her next tier. stay: Gold or Black in her stay year. top: Gold or Black before her stay year, when
  // nothing counts towards keeping it yet, so both bars start at 0 against the keep figures.
  const state = tierState(s);
  const stay = state !== 'climb';
  const cardTier = stay ? s.tier : s.next_tier ?? 'gold';
  const target = state === 'stay' ? s.keep_points : state === 'top' ? keepFor(s.tier, r) : s.next_tier_points;
  const tp = state === 'top' ? 0 : s.tier_points;
  const fig = (n: number | null | undefined) => (n != null ? num(n) : '');
  // the Care Card condition for the tier: counted maintenances this tier year, full once the CRM says it is met
  const boxes = state === 'top' ? 0 : s.tier_card_boxes;
  const boxTarget = r.care_card_boxes || s.card_target;
  const boxFill = state === 'top' ? 0 : s.tier_card_done ? 1 : boxTarget ? boxes / boxTarget : 0;
  const status = s.tier === 'silver' ? 'You are Silver' : `You are ${tierName(s.tier)}${s.tier_until ? ` until ${fullDate(s.tier_until)}` : ''}`;
  const name = [s.first_name, s.last_name].filter(Boolean).join(' ');
  // the first tier year's dates from app_tier_rules when it sends them, the wireframe's until then
  const firstYearEnd = r.first_tier_year_until ? fullDate(r.first_tier_year_until) : '31 December 2027';
  const firstTierEnd = r.first_tier_until ? fullDate(r.first_tier_until) : '31 December 2028';

  return (
    <Screen tab="card" back title="How Tiers Work" refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <Disp>How Tiers Work</Disp>
      <Gap />
      <Text style={t.status}>{status}</Text>

      <Gap size="l" />
      <Sect>{stay ? `Staying ${tierName(s.tier)}` : 'Your Next Tier'}</Sect>
      <Gap size="s" />
      <View style={{ marginTop: 4 }}>
        <PrivilegeCard tier={cardTier} word={tierName(cardTier)} name={name} since={stay ? `${tierName(s.tier)} for ${stayFor(s)}` : 'Your next tier'} right="" />
      </View>
      <View style={t.needs}>
        <Text style={t.eyebrow}>{stay ? `What you need during ${stayYear(s)}` : 'What you need'}</Text>
        {cardNeeded(s) && (
          <View>
            <View style={t.nh}>
              <Text style={t.nhLabel}>Fill a Care Card</Text>
              <Text style={t.nhVal}>{`${num(boxes)} of ${num(boxTarget)}`}</Text>
            </View>
            <Bar fill={boxFill} style={{ marginTop: 8 }} />
          </View>
        )}
        <View>
          <View style={t.nh}>
            <Text style={t.nhLabel}>{`Earn ${fig(target)} Tier Points`.replace('  ', ' ')}</Text>
            <Text style={t.nhVal}>{`${fig(tp)} of ${fig(target)}`}</Text>
          </View>
          <Bar fill={tp != null && target ? tp / target : 0} style={{ marginTop: 8 }} />
        </View>
        {stay && <Text style={t.note}>{state === 'top' ? retainNote(s) : 'Reviewed on 1 January'}</Text>}
      </View>

      <Gap size="l" />
      <Sect>How It Works</Sect>
      <Gap size="s" />
      <Copy>You move up a tier by coming in for your maintenance and earning Tier Points.</Copy>
      <Gap size="s" />
      <Know title="Gold" body={`Fill a Care Card and earn ${num(r.gold_achieve)} Tier Points.`} />
      <Know title="Black" body={`Fill a Care Card and earn ${num(r.black_achieve)} Tier Points.`} />
      <Know title="Toppers, wigs and clip-ins" body="No Care Card needed, Tier Points only." last />

      <Gap />
      <Sect>TK Points and Tier Points</Sect>
      <Gap size="s" />
      <Kinds>
        <Kind label="TK Points" text={`Yours to spend. ${num(f.rate)} TK Points is £1, off all products and services.`} />
        <Kind label="Tier Points" text={`1 Tier Point for each £1 you spend. ${num(r.gold_achieve)} for Gold and ${num(r.black_achieve)} for Black.`} />
      </Kinds>

      <Gap />
      <Sect>Your Tier Year</Sect>
      <Gap size="s" />
      <Copy>Your tier year runs from 1 January to 31 December. You move up the moment you qualify, and keep your tier for the rest of that year and all of the next.</Copy>
      <Gap size="s" />
      <Copy>
        {`To stay in your tier, during that next year fill a Care Card and earn ${num(r.gold_keep)} Tier Points for Gold, or ${num(r.black_keep)} for Black. If not, on 1 January you move to the tier your year supports.`}
      </Copy>
      <Gap size="s" />
      <Note title="Example" body={`Reach Gold in June 2027 and you are Gold until 31 December 2028. Fill a Care Card and earn ${num(r.gold_keep)} Tier Points during 2028 to stay Gold for 2029.`} />

      <Gap />
      <Sect>What Counts as a Maintenance</Sect>
      <Gap size="s" />
      <Copy>{`A maintenance of £${num(r.care_visit_min_pounds)} or more, at least ${num(r.gap_weeks_tapes)} weeks after your last one for tapes, or ${num(r.gap_weeks_other)} weeks for everything else.`}</Copy>

      <Gap />
      <Sect>Joining in 2026</Sect>
      <Gap size="s" />
      <Copy>{`Your first tier year runs from the day you join to ${firstYearEnd}. Move up at any point in it and you keep your tier until ${firstTierEnd}. After that, every tier year runs from 1 January to 31 December.`}</Copy>
    </Screen>
  );
}

const t = StyleSheet.create({
  status: { fontFamily: F.reg, fontSize: 12.5, color: C.gold, marginTop: 6 },
  needs: { marginTop: 16, gap: 14 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.mute },
  nh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  nhLabel: { fontFamily: F.reg, fontSize: 13, color: C.ink },
  nhVal: { fontFamily: F.reg, fontSize: 13, color: C.grey },
  note: { fontFamily: F.reg, fontSize: 11.5, color: C.mute, marginTop: -6 },
});
