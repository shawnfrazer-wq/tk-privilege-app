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

## Still needed from the CRM

Each of these is read by the app already, so it lights up as soon as the CRM adds it. Until then the app shows the fallback given.

1. **app_summary: next_appointment_location** (text, Kensington or Manchester). The Home and Visits screens show "Friday at 11:00, Kensington". Fallback: the salon name is left off.
2. **app_summary: band2_last_day and band3_last_day** (dates). The pending block in band 2 reads "It was £70 until 21 November, and it drops to £35 after 5 December", in band 3 "Nothing is released after 19 December", and once run out "These ran out on 19 December". Fallback: those clauses are left off.
3. **app_summary: pending_pounds_band2 and pending_pounds_band3** (numeric). The band 2 sentence needs the band 3 value ("drops to £35"). Fallback: clause left off.
4. **app_summary: pending_pounds_at_next_appointment** (numeric). When she is booked past band 1 the block reads "Worth £52.50 on 2 December. Come in by 21 November and it is £70." Fallback: the band 1 sentence is shown instead.
5. **app_summary: card_reward_pounds** (numeric, 50). The Care Card line reads "A full card is 500 points, £50". Fallback: the app divides card_reward_points by redeem_rate_points_per_pound, which is the one figure it works out itself until this lands.
6. **app_summary: next_tier_visits** (integer, 4 or 6). The tier tracker reads "4 of 6 in the last 12 months". Fallback: visits_12m plus visits_to_next_tier.
7. **Supabase auth: a test phone number with a fixed code** for the App Store reviewer and for testing, and the salon must be in the API's exposed schemas (the api_guard function suggests it is; it could not be confirmed from here because this container cannot reach the REST endpoint). Shawn to confirm both.

## Wireframe questions, not CRM

- Visits note: the sentence "Your own hair goes back in each time, re-tipped, with a few new strands where it has thinned." is written for micro rings. The app shows it for micro rings only. There is no equivalent sentence for tapes, wefts, toppers, wigs or clip-ins.
- Home tile for a Black client: the wireframe only shows Gold ("2 more visits, Care visits to Black") and a new client ("4 visits, Care visits to Gold"). For Black the app shows "You are at the top" and "6 care visits in the last 12 months", the wording the Card screen tracker uses.
- The grain texture on the card and tier chips (an SVG turbulence filter) has no React Native equivalent. The gradients and highlight are built; the grain is not.
- The opening video is positioned at "center 30%" in the wireframe. expo-video only offers a centred cover, so the frame is centred.

## Security note from the schema check

Supabase reports Row Level Security disabled on salon.privilege_members, salon.reward_menu, salon.care_pauses, salon.referrals and salon.service_price_history. These are readable and writable with the publishable key by any signed in user. Nothing was changed from here. For the CRM chat.
