# TK Privilege app: the CRM data guide

Everything the app reads or writes goes through the functions below. They live in the salon schema of Supabase project fqvwyerheoafulmezyfm, which is exposed to the API. Call them with supabase-js created with { db: { schema: "salon" } } and supabase.rpc("app_summary").

## Security, already in place

1. A signed in app client can call only functions whose names start with app_. Everything else is refused by salon.api_guard.
2. None of the app_ functions takes a client id. Each works out who she is from her own sign in. She can never read or change another client.
3. Anonymous callers can reach nothing except the staff PIN check used by the CRM.
4. The app never works out a figure. Points, pound values, bands, dates, tier and Care Card all come back from these functions.

## Sign in

1. supabase.auth.signInWithOtp({ phone: "+447700900123" }) sends the one time code.
2. supabase.auth.verifyOtp({ phone, token, type: "sms" }) signs her in. Keep the session on the phone.
3. Straight after, call app_link(). It matches her mobile to her client card and starts her membership. Returns { status, complete, missing }:
   linked: go on. If complete is false, show Your Details with the fields in missing and do not let her in until it is complete.
   not_recognised: show "If your number is not recognised, ask at reception and the salon will add you."
   ask_reception: the number is on more than 1 live card. Same message.
4. Call app_link() on every app start too. It is safe to repeat.

## Reading

app_summary(): Home, Card, pending block, Book, Rewards. jsonb: first_name, last_name, client_since, card_number, referral_code, balance_points, balance_pounds, pending_points, pending_pounds_full, pending_pounds_band2, pending_pounds_band3, pending_pounds_today, pending_pounds_at_next_appointment, pending_status, band_today (1, 2, 3 or 0), full_until, band2_last_day, band3_last_day, booking_bonus, kept_bonus, kept_bonus_date, care_date (null for toppers, wigs and clip-ins: show no countdown), days_to_care_date, next_appointment_at, next_appointment_services, next_appointment_stylists, next_appointment_location, next_appointment_band, card_boxes, card_target, card_reward_points, card_reward_pounds, tier, visits_12m, visits_to_next_tier, next_tier_visits, earn_rate, method, hair_type, family (micro, tapes, wefts, topper or clip_in), care_service_id and care_service_name (the maintenance service for her method, for Book), best_reward_name and best_reward_spare_pounds (the dearest colour service her balance covers and what is left over, both null when nothing is covered), details_complete, details_missing. Read again from the database on 21 September.
app_ledger(): Your Points. rows: line_date, title, detail, points, pounds, status (pending, done, lapsed). Pending first, then newest first. Titles and details are ready to show.
app_visits(): Visits. jsonb: method, hair_type, fitted_on, fitted_what, fitted_by, care_every_weeks (null when no clock), visits: [{ d, title, stylists, new_set, points, status }].
app_price_list(): Rewards. rows: id, name, price, points, section (colour, hair, davines, other), family (all, micro, tapes, wefts, topper or clip_in). Open on colour; show her family's rows and the rows for all first; All shows every row.
app_family(p_method): the family a method code belongs to. Used inside the CRM; the app reads family from app_summary.
app_referrals(): Refer a Friend. rows: friend, status (paid or waiting), happened_on, points, pounds
app_profile(): Your Details. jsonb of every field on the screen, plus missing.
app_settings(): Contact, Review, How Points Work. jsonb: contact_whatsapp, contact_phone, contact_email, google_review_link, trustpilot_review_link and the scheme figures. Hide a button whose link is empty.
app_stylists(): Book. rows: id, name
app_free_times(p_staff, p_service, p_from, p_days): Book. rows: slot_start. From 24 hours ahead, up to about 4 months, at most 31 days per call.
app_booking_requests(): Home, Requested. her waiting requests: id, requested_start, service, stylist, status

## Writing

app_save_profile(p jsonb): Save on Your Details. Any of: first_name, last_name, email, birth_day, birth_month, occupation, address, postcode, preferred_staff_id, no_preferred_stylist, how_she_likes_her_hair, preferred_contact (Text, WhatsApp, Email or Call), email_marketing, sms_marketing, whatsapp_marketing. Mobile cannot be changed in the app. Returns the saved profile with missing.
app_request_booking(p_service, p_staff, p_start, p_note): Request this booking. Checks the time is still free, saves the request and the CRM emails info@tatianakarelina.co.uk. At most 3 waiting at once. Closes itself when a booking goes into the diary, or after 7 days.
app_review_tap(p_platform): google or trustpilot. Records the tap for the desk's Review claims list.
app_delete_account(): Delete my account. Removes her points, ends her membership and deletes her sign in user. Her client record stays with the salon. The app then clears only the phone's copy of the session. Signing in again creates a new sign in user and app_link starts a fresh membership.

## Test accounts

Apple and Google reviewer: +44 7700 900123, card complete. Build tester: +44 7700 900124, card deliberately incomplete. Both use code 123456 and never receive messages.

## Tiers contract, 22 September (docs/tiers-app-brief.md section 6)

Not yet live on 22 September. The app reads all of it as optional and shows the layout without figures until it lands.

app_summary gains: tier_until, tier_points, tier_points_from, care_card_needed, next_tier, next_tier_points, keep_year_next, keep_points, free_colour_left_pounds, davines_gift_owed, davines_gift_pounds, maintenance_perk_next, first_colour_offer, booking_bonus (0 or 100), booking_bonus_date, has_had_maintenance.
app_summary loses: kept_bonus, kept_bonus_date, visits_12m, visits_to_next_tier, next_tier_visits.
app_visits rows gain: counted (bool).
app_tier_rules(): jsonb with gold_achieve, gold_keep, black_achieve, black_keep, care_card_boxes, care_visit_min_pounds, gap_weeks_tapes, gap_weeks_other, and asked for by the app: band_weeks { micro { full, three_quarters, half }, tapes { full, three_quarters, half } }.
app_tier_perks(): rows tier, earn_rate, colour_discount_pct, davines_discount_pct, free_colour_pounds, maintenance_perk, birthday_points, davines_gift_pounds.
