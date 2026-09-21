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

Each of these is read by the app already, so it lights up as soon as the CRM adds it. Until then the app shows the fallback given.

1. **app_summary: next_appointment_location** (text, Kensington or Manchester). The Home and Visits screens show "Friday at 11:00, Kensington". Fallback: the salon name is left off.
2. **app_summary: band2_last_day and band3_last_day** (dates). The pending block in band 2 reads "It was £70 until 21 November, and it drops to £35 after 5 December", in band 3 "Nothing is released after 19 December", and once run out "These ran out on 19 December". Fallback: those clauses are left off.
3. **app_summary: pending_pounds_band2 and pending_pounds_band3** (numeric). The band 2 sentence needs the band 3 value ("drops to £35"). Fallback: clause left off.
4. **app_summary: pending_pounds_at_next_appointment** (numeric). When she is booked past band 1 the block reads "Worth £52.50 on 2 December. Come in by 21 November and it is £70." Fallback: the band 1 sentence is shown instead.
5. **app_summary: card_reward_pounds** (numeric, 50). The Care Card line reads "A full card is 500 points, £50". Fallback: the app divides card_reward_points by redeem_rate_points_per_pound, which is the one figure it works out itself until this lands.
6. **app_summary: next_tier_visits** (integer, 4 or 6). The tier tracker reads "4 of 6 in the last 12 months". Fallback: visits_12m plus visits_to_next_tier.
7. Confirmed by docs/crm-api.md on 21 September: the salon schema is exposed to the API, and the test numbers are +44 7700 900123 (complete card, Apple's reviewer) and +44 7700 900124 (incomplete card), both with code 123456.

8. **app_summary: care_service_id and care_service_name** (the maintenance service for her method, for example Micro Ring Maintenance for micro_rings). app_free_times and app_request_booking both take a service id, and nothing the app may call returns which service is her care visit. salon.services carries a method_code and privilege_role, so the CRM can pick it. **Until this lands the Book screen shows no days or times and Request this booking stays off.** The summary line "What you are booking" shows care_service_name.
9. **Deleting the sign in user after app_delete_account.** The guide says the app's own server must delete her auth user with the admin API, but there is no app server. As it stands her sign in user remains, and app_link would reactivate a membership marked left the next time she signs in. The CRM chat needs to decide where that deletion runs (an edge function called by the app, or a job that removes auth users whose membership has ended).

## Wireframe questions, not CRM

Stage 2 additions, built as described and open to change:

- Home has no way to reach Your Details, Refer a Friend or Review in the wireframe (the prototype uses its Screens menu). The app puts 3 rows under the Care Card in the wireframe's unused .rowbtn style, labelled with the 3 screens' own titles.
- Home while a booking request is waiting: decisions-21-sep.md says the app shows it as Requested. The app shows the heading "Requested" (the Requested screen's own word) with the request's date, service, stylist and time in the next appointment layout, and no Book button.
- Book for a client with no care date (toppers, wigs and clip-ins): the wireframe heading "Your Care Date Is 14 November" has nothing to fill it, so the app shows "Your Next Visit".
- Book with no preferred stylist: the wireframe shows only "Tatiana's times". The app uses her preferred stylist, or the first stylist app_stylists returns when she has no preference.
- Selects on Your Details (birthday, stylist, best way to contact you) open a bottom sheet of choices, since native has no dropdown control. Delete my account asks once in the phone's own confirm dialogue, using the wireframe's own sentence, before calling the CRM.
- The share button on Refer a Friend copies the message and opens the phone's share sheet, so "Copied, now pick an app" is literal.


- Visits note: the sentence "Your own hair goes back in each time, re-tipped, with a few new strands where it has thinned." is written for micro rings. The app shows it for micro rings only. There is no equivalent sentence for tapes, wefts, toppers, wigs or clip-ins.
- Home tile for a Black client: the wireframe only shows Gold ("2 more visits, Care visits to Black") and a new client ("4 visits, Care visits to Gold"). For Black the app shows "You are at the top" and "6 care visits in the last 12 months", the wording the Card screen tracker uses.
- The grain texture on the card and tier chips (an SVG turbulence filter) has no React Native equivalent. The gradients and highlight are built; the grain is not.
- The opening video is positioned at "center 30%" in the wireframe. expo-video only offers a centred cover, so the frame is centred.

## Security note from the schema check

Supabase reports Row Level Security disabled on salon.privilege_members, salon.reward_menu, salon.care_pauses, salon.referrals and salon.service_price_history. These are readable and writable with the publishable key by any signed in user. Nothing was changed from here. For the CRM chat.
