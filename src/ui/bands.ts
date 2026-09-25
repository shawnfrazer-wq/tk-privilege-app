import { BandWeeks, TierRules } from '../crm';
import { num, pounds } from '../format';
import { Figures } from './figures';

// The band weeks behind the general copy, from app_tier_rules by method. "micro" is micro rings, micro bonds
// and wefts, which share one clock; the copy reads micro_rings for them.
export function bandWeeks(rules: TierRules | null, family: 'micro' | 'tapes'): BandWeeks | null {
  const w = rules?.band_weeks?.[family === 'micro' ? 'micro_rings' : 'tapes'];
  return w && w.full_weeks != null && w.three_quarter_weeks != null && w.half_weeks != null ? w : null;
}

// 13 weeks reads as 3 months, as the wireframe has it
export function spell(weeks: number | null | undefined): string {
  if (weeks == null) return '';
  if (weeks === 13) return '3 months';
  return `${num(weeks)} weeks`;
}

// the FAQ answer "When should I come in to earn the most?": numbers only, never half, three quarters or full
// The £400 example is fixed text; its pound values are the example points at the redeem rate.
export function bandFaq(rules: TierRules | null, f: Figures): string {
  const m = bandWeeks(rules, 'micro');
  const t = bandWeeks(rules, 'tapes');
  if (!m || !t) return 'Come back earlier, earn more.';
  const eg = (points: number) => pounds(f.examplePounds(points));
  return (
    `Come back earlier, earn more. Take a £400 maintenance at Silver. Micro rings, micro bonds and wefts: come in for your next maintenance within ${spell(m.full_weeks)} and it earns 400 TK Points, ${eg(400)}. ` +
    `Within ${spell(m.three_quarter_weeks)}, 300 TK Points, ${eg(300)}. Within ${spell(m.half_weeks)}, 200 TK Points, ${eg(200)}. ` +
    `Tapes: within ${spell(t.full_weeks)}, 400 TK Points. Within ${spell(t.three_quarter_weeks)}, 300. Within ${spell(t.half_weeks)}, 200.`
  );
}
