import { Summary, Tier } from '../crm';
import { capitalise, num } from '../format';

// the tier sheet, fixed text
export const TIER_INFO: Record<Tier, { qual: string; gives: string[] }> = {
  silver: { qual: 'Where everyone starts', gives: ['1 point for every £1 at a care visit', 'Care Card'] },
  gold: { qual: '4 care visits in a rolling 12 months', gives: ['1.25 points for every £1 at a care visit', 'Care Card'] },
  black: { qual: '6 care visits in a rolling 12 months', gives: ['1.5 points for every £1 at a care visit', 'Care Card'] },
};

export const tierName = (t: Tier) => capitalise(t);
export const nextTier = (t: Tier) => (t === 'silver' ? 'Gold' : 'Black');

// .track on the Card screen
export function track(s: Summary): { line: string; sub: string; fill: number } {
  if (s.tier === 'black') {
    return { line: 'You are at the top', sub: `${num(s.visits_12m)} care visits in the last 12 months`, fill: 1 };
  }
  const n = s.visits_to_next_tier;
  const target = s.next_tier_visits ?? s.visits_12m + n;
  return {
    line: `${num(n)} more care visit${n === 1 ? '' : 's'} to ${nextTier(s.tier)}`,
    sub: `${num(s.visits_12m)} of ${num(target)} in the last 12 months`,
    fill: target > 0 ? Math.min(1, s.visits_12m / target) : 0,
  };
}

// the tier tile on Home
export function tierTile(s: Summary): { big: string; small: string } {
  if (s.tier === 'black') return { big: 'You are at the top', small: `${num(s.visits_12m)} care visits in the last 12 months` };
  const n = s.visits_to_next_tier;
  const big = s.visits_12m === 0 ? `${num(n)} visits` : `${num(n)} more visit${n === 1 ? '' : 's'}`;
  return { big, small: `Care visits to ${nextTier(s.tier)}` };
}
