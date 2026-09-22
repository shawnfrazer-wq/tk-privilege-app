import { BandWeeks, TierRules } from '../crm';
import { num } from '../format';

// The band weeks in the general copy: the CRM's when app_tier_rules sends them, the wireframe's otherwise.
// "micro" covers micro rings, micro bonds and wefts.
const FALLBACK: Record<'micro' | 'tapes', BandWeeks> = {
  micro: { full: 9, three_quarters: 11, half: 13 },
  tapes: { full: 7, three_quarters: 9, half: 11 },
};

export function bandWeeks(rules: TierRules | null, family: 'micro' | 'tapes'): { weeks: BandWeeks; fromCrm: boolean } {
  const sent = rules?.band_weeks?.[family];
  if (sent && sent.full && sent.three_quarters && sent.half) return { weeks: sent, fromCrm: true };
  return { weeks: FALLBACK[family], fromCrm: false };
}

// "3 months" is how the wireframe says 13 weeks; the CRM's own figures read in weeks
export function spell(weeks: number, fromCrm: boolean): string {
  if (!fromCrm && weeks === 13) return '3 months';
  return `${num(weeks)} weeks`;
}

// "Every 3 months earns half points. Every 11 weeks, three quarters. Every 9 weeks, full points."
export function bandSentence(rules: TierRules | null, family: 'micro' | 'tapes'): string {
  const { weeks, fromCrm } = bandWeeks(rules, family);
  return `Every ${spell(weeks.half, fromCrm)} earns half points. Every ${spell(weeks.three_quarters, fromCrm)}, three quarters. Every ${spell(weeks.full, fromCrm)}, full points.`;
}

// the FAQ answer "When should I come in to earn the most?"
export function bandFaq(rules: TierRules | null): string {
  const m = bandWeeks(rules, 'micro');
  const t = bandWeeks(rules, 'tapes');
  const mw = (n: number) => spell(n, m.fromCrm);
  const tw = (n: number) => spell(n, t.fromCrm);
  return (
    `Come back earlier, earn more. Micro rings, micro bonds and wefts: come in for your maintenance within ${mw(m.weeks.full)} of your last one and you earn full points, 10% back. ` +
    `Within ${mw(m.weeks.three_quarters)}, three quarters, 7.5% back. Within ${mw(m.weeks.half)}, half, 5% back. ` +
    `Tapes: within ${tw(t.weeks.full)}, full points. Within ${tw(t.weeks.three_quarters)}, three quarters. Within ${tw(t.weeks.half)}, half. ` +
    `So if you always come in at 12 weeks for micro rings, you earn half points every time.`
  );
}
