# Things the app needs from the CRM

Claude Code adds anything here that the CRM does not yet provide. Shawn passes this list to the CRM chat.

## Stage 1 check, 21 September 2026

Before the stage 1 screens were written, every CRM function stage 1 calls was checked against the live salon schema. The CRM already has a set of app facing functions that take no arguments and work from the signed in user (salon.current_member). Stage 1 uses only these.

| Screen | Function | Exists | Returns what the screen needs |
|---|---|---|---|
| Code (after the code is verified) | salon.app_link() | Yes | status: linked, not_recognised or ask_reception; complete; missing[] |
| Home, Card | salon.app_summary() | Yes | name, client_since, card_number, balance in points and pounds, pending points with full and today pound values, band_today, full_until, booking and kept bonus, care_date, days_to_care_date, next appointment (time, services, stylists, band), card_boxes, card_target, card_reward_points, tier, visits_12m, visits_to_next_tier, method, hair_type |
| Your Points | salon.app_ledger() | Yes | line_date, title, detail, points, pounds, status (pending, lapsed, done). Titles and details already match the wireframe wording |
| Visits | salon.app_visits() | Yes | method, hair_type, fitted_on, fitted_what, fitted_by, care_every_weeks, visits[] with date, title, stylists, new_set, points, status |
| Contact | salon.app_settings() | Yes | contact_whatsapp, contact_phone, contact_email as ready to open links, plus redeem_rate_points_per_pound |
| Sign in, Code | Supabase phone auth (signInWithOtp, verifyOtp) | Yes | a session for salon.current_member to key off |

All of these are SECURITY DEFINER, granted to authenticated, and salon.api_guard lets a client call only /rpc/app_* functions. Opening, How points work and FAQs are fixed text and call nothing.

## Stage 2 check, 21 September 2026

| Screen | Function | Exists | Returns what the screen needs |
|---|---|---|---|
| Your Details | salon.app_profile() | Yes | every field on the screen, plus missing[] |
| Your Details, Save | salon.app_save_profile(p jsonb) | Yes | the saved profile with missing[]; preferred_contact accepts Text, WhatsApp, Email or Call |
| Your Details, stylist list | salon.app_stylists() | Yes | id, name |
| Your Details, Delete my account | salon.app_delete_account() | Yes | removes her points and ends her membership |
| Book | salon.app_free_times(p_staff, p_service, p_from, p_days) | Yes | slot_start, at most 31 days a call, 24 hours ahead to about 4 months |
| Book, Request this booking | salon.app_request_booking(p_service, p_staff, p_start, p_note) | Yes | the request id; refuses a time no longer free and more than 3 waiting |
| Home, Requested | salon.app_booking_requests() | Yes | her waiting requests: requested_start, service, stylist, status |
| Refer a Friend | salon.app_referrals() | Yes | friend, status, happened_on, points, pounds |
| Review | salon.app_review_tap(p_platform) | Yes | records the tap; google or trustpilot |
| Review, Contact | salon.app_settings() | Yes | google_review_link and trustpilot_review_link; a button is hidden when its link is empty |

## Still needed from the CRM

### 22 September check: the tiers contract (docs/tiers-app-brief.md section 6)

Every app_ function was read again from the database on 22 September after the tiers brief. None of the new contract is live yet. The app reads every item below as optional: each screen shows its layout, and the figures appear as soon as the CRM sends them. Nothing is typed into the app.

1. **app_tier_rules()**: jsonb with gold_achieve, gold_keep, black_achieve, black_keep, care_card_boxes, care_visit_min_pounds, gap_weeks_tapes, gap_weeks_other. Used on How Points Work, How Tiers Work and the Card screen (tapping a tier chip). Until it lands, the sentences that carry those figures are shown without them ("Fill a Care Card and earn Tier Points.") and the Example note on How Tiers Work is left out.
2. **app_tier_perks()**: rows tier, earn_rate, colour_discount_pct, davines_discount_pct, free_colour_pounds, maintenance_perk, birthday_points, davines_gift_pounds. Used for the Tier Perks table and the earn rates on How Points Work. Until it lands the table shows its headings, row labels and her highlighted column with empty cells.
3. **app_summary gains**: tier_until, tier_points, tier_points_from, care_card_needed, next_tier, next_tier_points, keep_year_next, keep_points, free_colour_left_pounds, davines_gift_owed, davines_gift_pounds, maintenance_perk_next, first_colour_offer, booking_bonus_date. Used on Home (Tier Points tile, free colour and Davines gift lines, "Wash and blow dry included"), Card (Tier Points box, "Gold until", the tier line and bar, "Reviewed on 1 January") and How Tiers Work (status line, Your Next Tier or Staying Black, the 2 bars). Until they land the Tier Points figures are blank and those lines are hidden.
4. **app_summary: has_had_maintenance** (boolean). The app says "your first maintenance" only when this is false, and "your next maintenance" otherwise, on Home (Care Card line), Rewards (nothing to spend yet) and Book. Until it lands every client sees "next".
5. **app_summary loses** kept_bonus, kept_bonus_date, visits_12m, visits_to_next_tier and next_tier_visits. The app no longer reads them. The pending block's booking line reads "Plus 100 booking points when you come in on [booking_bonus_date]", and uses next_appointment_at until booking_bonus_date lands.
6. **app_visits rows gain counted** (boolean). Your Recent Visits shows "Top up. Points added to your next maintenance." when it is false. Until it lands no visit is marked a top up.
7. **app_ledger wording**: the ledger titles still read "Pending until your next visit", "Keeping it, pending" and "Kept your appointment". The wireframe reads "Pending until your next maintenance" and the booking bonus line "Booked at the desk on 19 September. Yours when you come in on 14 November." The app shows the titles as the CRM sends them, so these are for the CRM chat.
8. **The band weeks in the general copy.** How Points Work and the FAQs carry the wireframe's fixed wording for micro rings, micro bonds and wefts (9, 11 weeks and 3 months) and tapes (7, 9, 11 weeks). The brief says weeks come from the CRM for other methods; if that copy should follow the CRM, an app_ function returning the band weeks per method is needed. Her own dates and values in the pending block already come from app_summary.

### Delivered earlier and wired

next_appointment_location, band2_last_day, band3_last_day, pending_pounds_band2, pending_pounds_band3, pending_pounds_at_next_appointment, card_reward_pounds, family, care_service_id, care_service_name, best_reward_name and best_reward_spare_pounds on app_summary; family on app_price_list; app_delete_account deletes the sign in user; the test numbers.

## Wireframe questions, not CRM

Stage 2 additions, built as described and open to change:

- Home carries 4 rows under the Care Card and More carries 7, in the wireframe's .rowbtn style (title, line and chevron, no icon) as the 22 September wireframe shows.
- Home while a booking request is waiting: decisions-21-sep.md says the app shows it as Requested. The app shows the heading "Requested" (the Requested screen's own word) with the request's date, service, stylist and time in the next appointment layout, and no Book button.
- Book for a client with no care date (toppers, wigs and clip-ins): the wireframe heading "Your Care Date Is 14 November" has nothing to fill it, so the app shows "Your Next Visit".
- Home rows, the More tab and its 7 rows, and the back arrows to More on Contact, FAQs, Refer a Friend, Review and Your Details are as Shawn set them on 21 September. The line icons on those rows are the app's own.
- Book with no preferred stylist: the wireframe shows only "Tatiana's times". The app uses her preferred stylist, or the first stylist app_stylists returns when she has no preference.
- Selects on Your Details (birthday, stylist, best way to contact you) open a bottom sheet of choices, since native has no dropdown control. Delete my account asks once in the phone's own confirm dialogue, using the wireframe's own sentence, before calling the CRM.
- The share button on Refer a Friend copies the message and opens the phone's share sheet, so "Copied, now pick an app" is literal.


- Visits note: the sentence "Your own hair goes back in each time, re-tipped, with a few new strands where it has thinned." is written for micro rings. The app shows it for micro rings only. There is no equivalent sentence for tapes, wefts, toppers, wigs or clip-ins.
- Home tile for a Black client: the wireframe only shows Gold ("2 more visits, Care visits to Black") and a new client ("4 visits, Care visits to Gold"). For Black the app shows "You are at the top" and "6 care visits in the last 12 months", the wording the Card screen tracker uses.
- The grain texture on the card and tier chips (an SVG turbulence filter) has no React Native equivalent. The gradients and highlight are built; the grain is not.
- The opening video is positioned at "center 30%" in the wireframe. expo-video only offers a centred cover, so the frame is centred.

## Security note from the schema check

Supabase reports Row Level Security disabled on salon.privilege_members, salon.reward_menu, salon.care_pauses, salon.referrals and salon.service_price_history. These are readable and writable with the publishable key by any signed in user. Nothing was changed from here. For the CRM chat.
