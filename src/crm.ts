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
  kept_bonus: number;
  kept_bonus_date: string | null;
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
  visits_12m: number;
  visits_to_next_tier: number;
  earn_rate: number | null;
  method: string | null;
  hair_type: string | null;
  details_complete: boolean;
  details_missing: string[];
  // Asked for in docs/crm-requests.md. Read when present, with a fallback until then.
  next_appointment_location?: string | null;
  band2_last_day?: string | null;
  band3_last_day?: string | null;
  pending_pounds_band2?: number | null;
  pending_pounds_band3?: number | null;
  pending_pounds_at_next_appointment?: number | null;
  card_reward_pounds?: number | null;
  next_tier_visits?: number | null;
};

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
};
