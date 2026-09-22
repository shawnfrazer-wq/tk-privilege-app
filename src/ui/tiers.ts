import { Summary, Tier, TierRules } from '../crm';
import { capitalise, num } from '../format';

export const tierName = (t: Tier | string | null | undefined) => capitalise(t ?? '');
const RANK: Record<Tier, number> = { silver: 0, gold: 1, black: 2 };
export const rank = (t: Tier) => RANK[t] ?? 0;

// the tier above hers, from app_summary
export const nextTierOf = (s: Summary): Tier | null => s.next_tier;

// true when she is holding Gold or Black in the year she must earn it again
export const staying = (s: Summary) => !s.next_tier && s.keep_year_next != null && s.keep_points != null;

// the Tier Points a tier takes to reach, and to keep, from app_tier_rules
export const achieve = (tier: Tier, rules: TierRules | null): number | null =>
  tier === 'gold' ? rules?.gold_achieve ?? null : tier === 'black' ? rules?.black_achieve ?? null : null;
export const keepFor = (tier: Tier, rules: TierRules | null): number | null =>
  tier === 'gold' ? rules?.gold_keep ?? null : tier === 'black' ? rules?.black_keep ?? null : null;

// toppers, wigs and clip-ins need no Care Card for a tier
export const cardNeeded = (s: Summary) => s.care_card_needed;

const pct = (a: number | null | undefined, b: number | null | undefined) => (a != null && b ? Math.min(1, Math.max(0, a / b)) : 0);
const fig = (n: number | null | undefined) => (n != null ? num(n) : '');

// the Tier Points tile on Home and the Tier Points box on Card
export function track(s: Summary): { card: string; sub: string; tileSmall: string } {
  const card = `Care Card: ${num(s.card_boxes)} of ${num(s.card_target)}`;
  if (staying(s)) {
    return { card, sub: `To stay ${tierName(s.tier)}`, tileSmall: `of ${fig(s.keep_points)} Tier Points to stay ${tierName(s.tier)}` };
  }
  const next = s.next_tier ?? 'gold';
  return { card, sub: `Towards ${tierName(next)}`, tileSmall: `of ${fig(s.next_tier_points)} Tier Points to ${tierName(next)}` };
}

export type Counter = { label: string; have: string; need: string; fill: number; note: boolean };

// The tier counter on the Card screen. With no chip tapped: her next tier, or Tier Points to Retain when she is
// holding Gold or Black in her stay year. A higher tier tapped shows that tier. Her own tier tapped, as Gold or
// Black, shows what keeps it. Every figure is app_summary's or app_tier_rules'.
export function counter(s: Summary, rules: TierRules | null, chip: Tier | null): Counter {
  const tp = s.tier_points;
  const asNeed = (n: number | null | undefined) => `of ${fig(n)} Tier Points needed`;
  if (chip && rank(chip) > rank(s.tier)) {
    const need = achieve(chip, rules);
    return { label: `Next Tier: ${tierName(chip)}`, have: num(tp), need: asNeed(need), fill: pct(tp, need), note: false };
  }
  if ((chip && chip === s.tier && s.tier !== 'silver') || (!chip && staying(s))) {
    const need = s.keep_points ?? keepFor(s.tier, rules);
    return { label: `Tier Points to Retain ${tierName(s.tier)}`, have: num(tp), need: asNeed(need), fill: pct(tp, need), note: true };
  }
  const next = s.next_tier ?? 'gold';
  const need = s.next_tier_points ?? achieve(next, rules);
  return { label: `Next Tier: ${tierName(next)}`, have: num(tp), need: asNeed(need), fill: pct(tp, need), note: false };
}
