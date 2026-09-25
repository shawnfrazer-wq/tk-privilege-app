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

Asked on 22 September, round 5. The app is built to read these and works without them until they are live:

- app_summary: pending_points_at_next_appointment, the TK Points her booked appointment would release, beside pending_pounds_at_next_appointment. For the Home line "Your appointment on 2 December earns 525 TK Points, £52.50." Until it is sent the line reads "Your appointment on 2 December earns £52.50."
- app_summary: the best reward for each Rewards filter, not only Colour. The Rewards lead line now picks from the chosen filter (Hair, Colour, Davines, All), so the app needs best_reward_name and best_reward_spare_pounds for hair (cuts, styling, treatments and her hair pieces), davines and all, or one pair keyed by filter. Until then the app picks the dearest row it shows for that filter and takes the spare as balance_pounds less the row's price, the figure app_summary gives for Colour.
- app_price_list: never send maintenance or re-do services (care, re-do, refit) as rewards. The app drops any such name it sees, but the list should not carry them.
- app_settings, pound companions for the fixed copy, 25 September: the app now reads the scheme figures in its fixed text from app_settings and app_tier_rules (booking bonus, £200 and the 5 and 7 weeks, the redeem rate, referral and review points, first colour discount, Care Card boxes and points, expiry months, Gold and Black targets). One figure has no CRM value and stays as the wireframe's words until one is sent: the "3 months before" notice on expiry, so points_expiry_notice_months. Shawn, 25 September: the pound values beside the referral points, "500 for both" on Review and the £40, £30 and £20 in the £400 example are derived in the app from the points and redeem_rate_points_per_pound, the same rule as the Care Card pounds, so a rate change can never leave a stale pound figure. The £400 example and its 400, 300 and 200 TK Points stay as fixed text; it is an example and the band shares are not sent.
- app_tier_rules: first_tier_year_until (2027-12-31) and first_tier_until (2028-12-31), the first tier year's dates for the Joining in 2026 paragraph on How Tiers Work, so every date on the screen comes from the CRM. Until sent the app shows the wireframe's dates. Her own tier_until already reads 31 December 2028 for a tier reached in the first year.

Live on 22 September and wired: pending_points_full, pending_points_band2 and pending_points_band3 on app_summary, the TK Points behind each date on the pending block.

### Done on 22 September (the tiers contract, docs/tiers-app-brief.md section 6)

- app_tier_rules(): gold_achieve, gold_keep, black_achieve, black_keep, care_card_boxes, care_visit_min_pounds, gap_weeks_tapes, gap_weeks_other, booking_bonus_points, first_colour_discount_pct, and band_weeks by method code (care_weeks, full_weeks, three_quarter_weeks, half_weeks; null for toppers, wigs and clip-ins). Used on How Points Work, How Tiers Work, the FAQ band answer and the Card tier counter. The wireframe fallback for the band weeks is retired; 13 weeks reads as 3 months as the wireframe has it.
- app_tier_perks(): the Tier Perks table and the earn rates on How Points Work.
- app_summary: tier_until, tier_points, tier_points_from, care_card_needed, next_tier, next_tier_points, keep_year_next, keep_points, tier_card_boxes and tier_card_done (the Care Card bar on How Tiers Work), free_colour_left_pounds, davines_gift_owed, davines_gift_pounds, maintenance_perk_next, first_colour_offer, booking_bonus_date, has_had_maintenance, and her method's care_weeks, full_weeks, three_quarter_weeks and half_weeks.
- app_summary no longer returns kept_bonus, kept_bonus_date, visits_12m, visits_to_next_tier or next_tier_visits, and the app no longer reads them.
- app_visits rows carry counted; a top up says so on Your Recent Visits.
- Referral codes without spaces (APPLE86).

### Ledger titles, checked 22 September

The app has never held a ledger title: Your TK Points prints app_ledger's title and detail exactly as sent, and nothing is cached between sign ins. Read through the app's connection on 22 September, app_ledger sends "Waiting for your next maintenance", "Booking bonus, waiting", "Booking bonus", "Released", "Spent at the till", "Review posted, Google", "Referral, Olivia T" and "Care Card complete" for the reviewer's card, which is the CRM's list. The wireframe's line titles are placeholders only.

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
