import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useData } from '../src/data';
import { num } from '../src/format';
import { C, F, ls } from '../src/theme';
import { Gap } from '../src/ui/Gap';
import { Kind, Kinds } from '../src/ui/Kinds';
import { Know, RowBtn, SRow } from '../src/ui/Rows';
import { Screen, statusOf } from '../src/ui/Screen';
import { Copy, Disp, Sect } from '../src/ui/T';
import { bandWeeks, spell } from '../src/ui/bands';

// 6 HOW POINTS WORK. The fixed text is the wireframe's; the figures in it come from app_tier_rules and app_tier_perks.
export default function HowPointsWork() {
  const router = useRouter();
  const { tierRules: r, tierPerks: perks, failed, refreshing, refresh } = useData();
  if (!r || !perks) {
    return <Screen tab="card" back title="How Points Work" refreshing={refreshing} onRefresh={refresh} status={statusOf(r && perks, failed)}>{null}</Screen>;
  }
  const rate = (t: string) => perks.find((p) => p.tier === t)?.earn_rate ?? '';
  const rates = `: ${rate('silver')} at Silver, ${rate('gold')} at Gold and ${rate('black')} at Black`;
  const tierKind = `1 Tier Point for each £1 you spend. ${num(r.gold_achieve)} for Gold and ${num(r.black_achieve)} for Black.`;
  const micro = bandWeeks(r, 'micro');
  const tapes = bandWeeks(r, 'tapes');
  const maintenance = `A maintenance of £${num(r.care_visit_min_pounds)} or more, at least ${num(r.gap_weeks_tapes)} weeks after your last one for tapes, or ${num(r.gap_weeks_other)} weeks for everything else. It fills a box on your Care Card, counts towards your tier and releases the points pending from your last one.`;

  return (
    <Screen tab="card" back title="How Points Work" refreshing={refreshing} onRefresh={refresh}>
      <Gap />
      <Disp>How Points Work</Disp>
      <Gap size="s" />
      <Copy>There are 2 kinds of points. Every maintenance earns TK Points. They show in your account as “pending”, and they are released when you come in for your next maintenance.</Copy>
      <Gap size="s" />
      <Kinds>
        <Kind label="TK Points" text="Yours to spend. 10 TK Points is £1, off all products and services." />
        <Kind label="Tier Points" text={tierKind} />
      </Kinds>
      <Gap size="s" />
      <View>
        <RowBtn title="How Tiers Work" sub="Moving up, and staying there" onPress={() => router.push('/how-tiers-work')} />
        <RowBtn title="Tier Perks" sub="What Silver, Gold and Black give you" onPress={() => router.push('/tier-perks')} last />
      </View>

      <Gap />
      <Sect>What Counts as a Maintenance</Sect>
      <Gap size="s" />
      <Copy>{maintenance}</Copy>
      <Gap size="s" />
      <Copy>A smaller visit, or one sooner than that, is a top up. Top ups still earn points. They are added to what is pending and released with your next maintenance.</Copy>

      <Gap />
      <Sect>What You Earn</Sect>
      <Gap size="s" />
      <Copy>
        TK Points for every £1 you spend at a maintenance or a top up{rates}. The maintenance itself, colour, a blow dry, a trim, Davines products, anything you buy that day. 10 TK Points is £1. New sets and hair pieces do not qualify for TK Points.
      </Copy>

      <Gap />
      <Sect>Come Back Earlier. Earn More</Sect>
      <Gap size="s" />
      <Copy>A £400 maintenance at Silver puts 400 TK Points pending. 10 TK Points is always £1 when you spend them. How many are released depends on how early you come back for your next maintenance.</Copy>
      <Gap size="s" />
      <View style={s.egbox}>
        <Text style={s.eyebrow}>Micro rings, micro bonds and wefts</Text>
        <SRow gold left={`Every ${spell(micro?.full_weeks)}`} right="400 TK Points" note="£40" />
        <SRow gold left={`Every ${spell(micro?.three_quarter_weeks)}`} right="300 TK Points" note="£30" />
        <SRow gold left={`Every ${spell(micro?.half_weeks)}`} right="200 TK Points" note="£20" last />
      </View>
      <Gap size="s" />
      <View style={s.egbox}>
        <Text style={s.eyebrow}>Tapes</Text>
        <SRow gold left={`Every ${spell(tapes?.full_weeks)}`} right="400 TK Points" note="£40" />
        <SRow gold left={`Every ${spell(tapes?.three_quarter_weeks)}`} right="300 TK Points" note="£30" />
        <SRow gold left={`Every ${spell(tapes?.half_weeks)}`} right="200 TK Points" note="£20" last />
      </View>

      <Gap />
      <Sect>Toppers, Wigs and Clip-ins</Sect>
      <Gap size="s" />
      <Copy>Topper care, wig care and clip-in care work differently. There is no clock on them, so whenever you come in for your next maintenance your points are released in full.</Copy>

      <Gap />
      <Sect>Your Care Date</Sect>
      <Gap size="s" />
      <Copy>Your stylist sets it at the end of every visit, based on your preference, rather than a calendar. Toppers, wigs and clip-ins have no care date, because it depends on how much you wear the piece.</Copy>
      <Gap size="s" />
      <Copy>Optimal care cadence is:</Copy>
      <SRow left="Micro rings, micro bonds and wefts" right="8 weeks" />
      <SRow left="Tapes" right="6 weeks" last />

      <Gap size="l" />
      <Sect>Worth Knowing</Sect>
      <Gap size="s" />
      <Know title="Pending points belong to your next maintenance" body="They are released when you come in for it, and the earlier you come, the more are released." />
      <Know
        last
        title="Booking is worth 100 points"
        body="Book your next visit at the desk on the day of your maintenance, and come in on that exact date. That is the only way to earn it, and it is released when you arrive."
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  egbox: { borderWidth: 1, borderColor: C.gold, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18 },
  eyebrow: { fontFamily: F.med, fontSize: 9, letterSpacing: ls(0.2, 9), textTransform: 'uppercase', color: C.gold, marginBottom: 8 },
});
