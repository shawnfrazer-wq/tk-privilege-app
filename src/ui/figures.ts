import { Settings, Summary, TierRules } from '../crm';

// The scheme figures inside the fixed copy, from app_settings, app_tier_rules and app_summary. The wireframe's
// figures stand in only until those have loaded. Nothing here is worked out; each is a value the CRM sends.
export type Figures = {
  rate: number; // TK Points to £1
  bookingBonus: number;
  careMin: number; // a maintenance is this many pounds or more
  gapTapes: number;
  gapOther: number;
  firstColourPct: number;
  cardBoxes: number;
  cardPoints: number;
  cardPounds: number | null;
  referrer: number;
  referred: number;
  review: number;
  reviewMonths: number;
  expiryMonths: number;
  goldAchieve: number;
  blackAchieve: number;
  // derived from the points and the redeem rate, so a rate change can never leave a stale pound figure
  referrerPounds: number;
  referredPounds: number;
  reviewBoth: number;
  examplePounds: (points: number) => number;
};

const n = (v: string | number | null | undefined, fallback: number) => {
  const x = Number(v);
  return v != null && v !== '' && isFinite(x) ? x : fallback;
};

export function figures(settings: Settings | null, rules: TierRules | null, summary: Summary | null): Figures {
  const rate = n(settings?.redeem_rate_points_per_pound, 10) || 10;
  const referrer = n(settings?.bonus_referral_referrer, 500);
  const referred = n(settings?.bonus_referral_referred, 1000);
  const review = n(settings?.bonus_review_share, 250);
  return {
    rate,
    bookingBonus: n(rules?.booking_bonus_points ?? settings?.bonus_kept, 100),
    careMin: n(rules?.care_visit_min_pounds, 200),
    gapTapes: n(rules?.gap_weeks_tapes, 5),
    gapOther: n(rules?.gap_weeks_other, 7),
    firstColourPct: n(rules?.first_colour_discount_pct, 50),
    cardBoxes: n(rules?.care_card_boxes ?? settings?.care_card_boxes, 4),
    cardPoints: n(settings?.bonus_card_complete ?? summary?.card_reward_points, 500),
    cardPounds: summary?.card_reward_pounds ?? (settings?.bonus_card_complete == null ? 50 : null),
    referrer,
    referred,
    review,
    reviewMonths: n(settings?.bonus_review_share_months, 6),
    expiryMonths: n(settings?.points_expiry_months, 24),
    goldAchieve: n(rules?.gold_achieve, 1500),
    blackAchieve: n(rules?.black_achieve, 3000),
    referrerPounds: referrer / rate,
    referredPounds: referred / rate,
    reviewBoth: review * 2,
    examplePounds: (points: number) => points / rate,
  };
}
