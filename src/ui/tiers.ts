import { Summary, Tier, TierRules } from '../crm';
import { capitalise, num } from '../format';

export const tierName = (t: Tier | string | null | undefined) => capitalise(t ?? '');
const RANK: Record<Tier, number> = { silver: 0, gold: 1, black: 2 };
export const rank = (t: Tier) => RANK[t] ?? 0;

// the tier above hers, from app_summary when it says, else the ladder
export const nextTierOf = (s: Summary): Tier | null => s.next_tier ?? (s.tier === 'silver' ? 'gold' : s.tier === 'gold' ? 'black' : null);

// true when she is holding Gold or Black in the year she must earn it again
export const staying = (s: Summary) => !s.next_tier && s.keep_year_next != null && s.keep_points != null;

// the Tier Points a tier takes to reach, from app_tier_rules, or from app_summary for her next tier
export function achieve(tier: Tier, s: Summary, rules: TierRules | null): number | null {
  if (rules) return tier === 'gold' ? rules.gold_achieve : tier === 'black' ? rules.black_achieve : null;
  return tier === s.next_tier ? (s.next_tier_points ?? null) : null;
}

const NO_CLOCK = ['topper', 'wig', 'clip_in'];
// toppers, wigs and clip-ins need no Care Card for a tier
export const cardNeeded = (s: Summary) => s.care_card_needed ?? !NO_CLOCK.includes(s.method ?? '');

const pct = (a: number | null | undefined, b: number | null | undefined) => (a != null && b ? Math.min(1, Math.max(0, a / b)) : 0);

// .track on the Card screen and the tile on Home. Every figure is app_summary's; the layout stands without them.
export function track(s: Summary): { line: string; fill: number; card: string; note: boolean; sub: string; tileSmall: string } {
  const tp = s.tier_points;
  const card = `Care Card: ${num(s.card_boxes)} of ${num(s.card_target)}`;
  if (staying(s)) {
    const target = s.keep_points ?? null;
    return {
      line: `To stay ${tierName(s.tier)} for ${s.keep_year_next}: ${tp != null ? num(tp) : ''} of ${target != null ? num(target) : ''} Tier Points`,
      fill: pct(tp, target),
      card,
      note: true,
      sub: `To stay ${tierName(s.tier)}`,
      tileSmall: `of ${target != null ? num(target) : ''} Tier Points to stay ${tierName(s.tier)}`,
    };
  }
  const next = nextTierOf(s) ?? 'gold';
  const target = s.next_tier_points ?? null;
  if (tp == null || target == null) {
    return { line: `${tierName(next)}: Tier Points`, fill: 0, card, note: false, sub: `Towards ${tierName(next)}`, tileSmall: `Tier Points to ${tierName(next)}` };
  }
  return {
    line: `${tierName(next)}: ${num(tp)} of ${num(target)} Tier Points`,
    fill: pct(tp, target),
    card,
    note: false,
    sub: `Towards ${tierName(next)}`,
    tileSmall: `of ${num(target)} Tier Points to ${tierName(next)}`,
  };
}

// tapping a tier chip above hers on the Card screen: her Tier Points against what that tier takes
export function trackFor(chip: Tier, s: Summary, rules: TierRules | null): { line: string; fill: number } | null {
  if (rank(chip) <= rank(s.tier)) return null;
  const need = achieve(chip, s, rules);
  const tp = s.tier_points;
  if (need == null || tp == null) return { line: `${tierName(chip)}: ${tp != null ? num(tp) : ''} Tier Points`, fill: 0 };
  return { line: `${tierName(chip)}: ${num(tp)} of ${num(need)} Tier Points`, fill: pct(tp, need) };
}
