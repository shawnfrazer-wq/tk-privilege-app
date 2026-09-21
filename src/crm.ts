// Every figure on every screen comes from these functions in the salon schema. The app never works one out.
import { supabase } from './supabase';

export type Tier = 'silver' | 'gold' | 'black';

export type Summary = {
  first_name: string | null;
  last_name: string | null;
  client_since: string | null;
  card_number: string | null;
  referral_code: string | null;
  balance_points: number;
  balance_pounds: number;
  pending_points: number;
  pending_pounds_full: number;
  pending_pounds_today: number;
  pending_status: string | null;
  band_today: number | null;
  full_until: string | null;
  booking_bonus: number;
  care_date: string | null;
  days_to_care_date: number | null;
  next_appointment_at: string | null;
  next_appointment_services: string | null;
  next_appointment_stylists: string | null;
  next_appointment_band: number | null;
  card_boxes: number;
  card_target: number;
  card_reward_points: number;
  tier: Tier;
  earn_rate: number | null;
  method: string | null;
  hair_type: string | null;
  details_complete: boolean;
  details_missing: string[];
  next_appointment_location: string | null;
  band2_last_day: string | null;
  band3_last_day: string | null;
  pending_pounds_band2: number | null;
  pending_pounds_band3: number | null;
  pending_pounds_at_next_appointment: number | null;
  card_reward_pounds: number | null;
  family: string | null;
  care_service_id: string | null;
  care_service_name: string | null;
  // the dearest colour service her balance covers, and what is left over; both null when nothing is covered
  best_reward_name: string | null;
  best_reward_spare_pounds: number | null;
  // 22 September contract (docs/tiers-app-brief.md section 6). Optional until the CRM carries them.
  tier_until?: string | null;
  tier_points?: number | null;
  tier_points_from?: string | null;
  care_card_needed?: boolean | null;
  next_tier?: Tier | null;
  next_tier_points?: number | null;
  keep_year_next?: number | null;
  keep_points?: number | null;
  free_colour_left_pounds?: number | null;
  davines_gift_owed?: boolean | null;
  davines_gift_pounds?: number | null;
  maintenance_perk_next?: boolean | null;
  first_colour_offer?: boolean | null;
  booking_bonus_date?: string | null;
  has_had_maintenance?: boolean | null;
  // kept by the CRM for now, no longer shown
  kept_bonus?: number | null;
  kept_bonus_date?: string | null;
  visits_12m?: number | null;
  visits_to_next_tier?: number | null;
  next_tier_visits?: number | null;
};

export type TierRules = {
  gold_achieve: number;
  gold_keep: number;
  black_achieve: number;
  black_keep: number;
  care_card_boxes: number;
  care_visit_min_pounds: number;
  gap_weeks_tapes: number;
  gap_weeks_other: number;
};

export type TierPerk = {
  tier: Tier;
  earn_rate: number | string;
  colour_discount_pct: number;
  davines_discount_pct: number;
  free_colour_pounds: number;
  maintenance_perk: boolean;
  birthday_points: number;
  davines_gift_pounds: number;
};

export type Profile = {
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
  email: string | null;
  birth_day: number | null;
  birth_month: number | null;
  occupation: string | null;
  address: string | null;
  postcode: string | null;
  method: string | null;
  hair_type: string | null;
  salon: string | null;
  client_since: string | null;
  preferred_staff_id: string | null;
  no_preferred_stylist: boolean | null;
  preferred_stylist: string | null;
  how_she_likes_her_hair: string | null;
  preferred_contact: string | null;
  email_marketing: boolean | null;
  sms_marketing: boolean | null;
  whatsapp_marketing: boolean | null;
  missing: string[];
};

export type ProfilePatch = Partial<{
  first_name: string;
  last_name: string;
  email: string;
  birth_day: number | '';
  birth_month: number | '';
  occupation: string;
  address: string;
  postcode: string;
  preferred_staff_id: string;
  no_preferred_stylist: boolean;
  how_she_likes_her_hair: string;
  preferred_contact: string;
  email_marketing: boolean;
  sms_marketing: boolean;
  whatsapp_marketing: boolean;
}>;

export type Stylist = { id: string; name: string };
// family is 'all' or a family name (micro, tapes, wefts, topper, clip_in); her own family's rows come first
export type PriceRow = { id: string; name: string; price: number | string; points: number; section: 'colour' | 'hair' | 'davines' | 'other'; family: string | null };
export type FreeTime = { slot_start: string };
export type BookingRequest = { id: number; requested_start: string; service: string | null; stylist: string | null; status: string };
export type Referral = { friend: string; status: 'paid' | 'waiting'; happened_on: string | null; points: number; pounds: number | string | null };

export type LedgerLine = {
  line_date: string;
  title: string;
  detail: string | null;
  points: number;
  pounds: number | string | null;
  status: 'pending' | 'lapsed' | 'done';
};

export type Visit = {
  d: string;
  title: string | null;
  stylists: string | null;
  new_set: boolean | null;
  points: number | null;
  status: string | null;
  // false for a top up (22 September); missing until the CRM carries it
  counted?: boolean | null;
};

export type Visits = {
  method: string | null;
  hair_type: string | null;
  fitted_on: string | null;
  fitted_what: string | null;
  fitted_by: string | null;
  care_every_weeks: number | null;
  visits: Visit[];
};

export type Settings = Record<string, string>;

export type Link = {
  status: 'linked' | 'not_recognised' | 'ask_reception';
  complete?: boolean;
  missing?: string[];
};

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}

export const crm = {
  link: () => rpc<Link>('app_link'),
  summary: () => rpc<Summary>('app_summary'),
  ledger: () => rpc<LedgerLine[]>('app_ledger'),
  visits: () => rpc<Visits>('app_visits'),
  settings: () => rpc<Settings>('app_settings'),
  profile: () => rpc<Profile>('app_profile'),
  saveProfile: (p: ProfilePatch) => rpc<Profile>('app_save_profile', { p }),
  stylists: () => rpc<Stylist[]>('app_stylists'),
  priceList: () => rpc<PriceRow[]>('app_price_list'),
  tierRules: () => rpc<TierRules>('app_tier_rules'),
  tierPerks: () => rpc<TierPerk[]>('app_tier_perks'),
  freeTimes: (staff: string, service: string, from: string, days: number) =>
    rpc<FreeTime[]>('app_free_times', { p_staff: staff, p_service: service, p_from: from, p_days: days }),
  requestBooking: (service: string, staff: string, start: string, note: string | null) =>
    rpc<number>('app_request_booking', { p_service: service, p_staff: staff, p_start: start, p_note: note }),
  bookingRequests: () => rpc<BookingRequest[]>('app_booking_requests'),
  referrals: () => rpc<Referral[]>('app_referrals'),
  reviewTap: (platform: 'google' | 'trustpilot') => rpc<number>('app_review_tap', { p_platform: platform }),
  deleteAccount: () => rpc<number>('app_delete_account'),
};
