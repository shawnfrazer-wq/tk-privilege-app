import { BandWeeks, TierRules } from '../crm';
import { num } from '../format';

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

// "Every 3 months earns half points. Every 11 weeks, three quarters. Every 9 weeks, full points."
export function bandSentence(rules: TierRules | null, family: 'micro' | 'tapes'): string {
  const w = bandWeeks(rules, family);
  if (!w) return '';
  return `Every ${spell(w.half_weeks)} earns half points. Every ${spell(w.three_quarter_weeks)}, three quarters. Every ${spell(w.full_weeks)}, full points.`;
}

// the FAQ answer "When should I come in to earn the most?"
export function bandFaq(rules: TierRules | null): string {
  const m = bandWeeks(rules, 'micro');
  const t = bandWeeks(rules, 'tapes');
  if (!m || !t) return 'Come back earlier, earn more.';
  return (
    `Come back earlier, earn more. Micro rings, micro bonds and wefts: come in for your maintenance within ${spell(m.full_weeks)} of your last one and you earn full points, 10% back. ` +
    `Within ${spell(m.three_quarter_weeks)}, three quarters, 7.5% back. Within ${spell(m.half_weeks)}, half, 5% back. ` +
    `Tapes: within ${spell(t.full_weeks)}, full points. Within ${spell(t.three_quarter_weeks)}, three quarters. Within ${spell(t.half_weeks)}, half. ` +
    `So if you always come in at 12 weeks for micro rings, you earn half points every time.`
  );
}
