import { Summary, Tier, TierRules } from '../crm';
import { capitalise, fullDate, num, yearOf } from '../format';

export const tierName = (t: Tier | string | null | undefined) => capitalise(t ?? '');
const RANK: Record<Tier, number> = { silver: 0, gold: 1, black: 2 };
export const rank = (t: Tier) => RANK[t] ?? 0;

// the tier above hers, from app_summary
export const nextTierOf = (s: Summary): Tier | null => s.next_tier;

// true when she is holding Gold or Black in the year she must earn it again
export const staying = (s: Summary) => !s.next_tier && s.keep_year_next != null && s.keep_points != null;

// Where she stands. climb: a tier above hers to reach. stay: Gold or Black in her stay year, earning it again.
// top: Gold or Black with no tier above and her stay year not yet begun, so nothing counts towards keeping it yet.
export type TierState = 'climb' | 'stay' | 'top';
export function tierState(s: Summary): TierState {
  if (staying(s)) return 'stay';
  if (s.next_tier || s.tier === 'silver') return 'climb';
  return 'top';
}

// her stay year is the year her tier runs to (tier_until), and the tier is then held for the year after
export const stayYear = (s: Summary) => yearOf(s.tier_until);
export const stayFor = (s: Summary) => (s.keep_year_next != null ? String(s.keep_year_next) : stayYear(s) ? String(Number(stayYear(s)) + 1) : '');
export const retainNote = (s: Summary) => (stayYear(s) ? `Counted during ${stayYear(s)}. Reviewed on 1 January` : 'Reviewed on 1 January');

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
export function track(s: Summary): { card: string; sub: string; tileBig: string; tileSmall: string } {
  const card = `Care Card: ${num(s.card_boxes)} of ${num(s.card_target)}`;
  const state = tierState(s);
  if (state === 'stay') {
    return { card, sub: `To stay ${tierName(s.tier)}`, tileBig: num(s.tier_points), tileSmall: `of ${fig(s.keep_points)} Tier Points to stay ${tierName(s.tier)}` };
  }
  if (state === 'top') {
    return { card, sub: `To stay ${tierName(s.tier)}`, tileBig: tierName(s.tier), tileSmall: s.tier_until ? `until ${fullDate(s.tier_until)}` : '' };
  }
  const next = s.next_tier ?? 'gold';
  return { card, sub: `Towards ${tierName(next)}`, tileBig: num(s.tier_points), tileSmall: `of ${fig(s.next_tier_points)} Tier Points to ${tierName(next)}` };
}

export type Counter = { label: string; have: string; need: string; fill: number; note: string | null };

// The tier counter on the Card screen. A chip above her tier shows her Tier Points against that tier. Her own
// tier, a chip below it, or no chip: her next tier when there is one; in her stay year the Tier Points counted
// so far against the keep figure; at the top before her stay year, 0 against the keep figure with "Counted
// during [stay year]", since nothing counts towards keeping the tier until then. Every figure and date is
// app_summary's or app_tier_rules'.
export function counter(s: Summary, rules: TierRules | null, chip: Tier | null): Counter {
  const tp = s.tier_points;
  const asNeed = (n: number | null | undefined) => `of ${fig(n)} Tier Points needed`;
  const climb = (tier: Tier, need: number | null): Counter => ({ label: `Next Tier: ${tierName(tier)}`, have: num(tp), need: asNeed(need), fill: pct(tp, need), note: null });
  const retain = (): Counter => {
    const label = `Tier Points to Retain ${tierName(s.tier)}`;
    if (tierState(s) === 'stay') {
      const need = s.keep_points ?? keepFor(s.tier, rules);
      return { label, have: num(tp), need: asNeed(need), fill: pct(tp, need), note: 'Reviewed on 1 January' };
    }
    return { label, have: '0', need: asNeed(keepFor(s.tier, rules)), fill: 0, note: retainNote(s) };
  };
  if (chip && rank(chip) > rank(s.tier)) return climb(chip, achieve(chip, rules));
  if (chip && chip === s.tier && s.tier !== 'silver') return retain();
  const state = tierState(s);
  if (state !== 'climb') return retain();
  const next = s.next_tier ?? 'gold';
  return climb(next, s.next_tier_points ?? achieve(next, rules));
}
