# TK Privilege, the rules as they now stand

Final, 21 September 2026, after a final sweep of the wireframes against the live database. Updated 22 September 2026 for counted maintenance, 1 booking bonus and the new tiers; where this file and claude/tk-privilege-tiers-app-brief.md disagree, the tiers brief wins. This
supersedes the build specification v2 of 19 September wherever the two disagree, and every rule
handed over in chat before today. Each rule says whether it is already built or still to do.

Wireframes, all screens: https://claude.ai/artifact/SdXCWCdjnvZqKZS1ya4JcB
New client, empty profile: https://claude.ai/artifact/Byv749sPKtwrimD5RKra9t
The app is being built in React Native, one codebase for iOS and Android.

## 1 Earning

COUNTED MAINTENANCE, 22 September: a care visit counts as a maintenance only if it is £200 or more AND at least 5 weeks (tapes) or 7 weeks (everything else) after her last counted maintenance. Only counted maintenances fill Care Card boxes, count towards tiers, earn the booking bonus and release pending points. Smaller or closer visits are top ups: they still earn, their points are added to what is pending and released with her next counted maintenance. New sets and new pieces no longer fill a Care Card box.

1 point for every £1 at a care visit, 10 points is £1 when spent.
A care visit is any maintenance appointment for micro rings, micro bonds, tapes or wefts, and any
maintenance for toppers, wigs or clip-ins.
Everything on that day's bill earns: the maintenance itself, colour, a blow dry, a trim, Davines
products, anything bought that day. New sets and new pieces earn nothing, though they still fill a
Care Card box.
She earns on the cash part of the bill only. Points spent earn nothing.
Points are earned only at care visits, but can be spent on anything, at any visit, including new
sets and pieces. Never on deposits or gift vouchers.
BUILT 21 September: redeem_only_at_care_appointment set to false, so privilege_can_redeem allows
points on any appointment.
BUILT: privilege_bill returns the cash element when earn_on_cash_element_only is true, which is its
default. Leave earn_blocked_when_points_spent at false, it is the old all or nothing switch.

## 2 Pending and release

Points from a care visit sit pending until she next attends, then release at the band her actual
attendance falls in: band 1 in full, band 2 at 75 per cent, band 3 at 50 per cent, past band 3
nothing. The client sees the whole 10 per cent, then 7.5, then 5.
The value on screen follows the band she is in today, from band_if_attended_today, and falls as she
crosses each boundary. The points figure stays the same, the pound value falls.
Micro rings, micro bonds and wefts: care date 56 days, bands at 63, 77, 91.
Tapes: care date 42 days, bands at 49, 63, 77.
Toppers, wigs and clip-ins: no care date and no bands, released in full whenever she comes in.
Bands hang off her effective care date, so a stylist's override moves the whole ladder.
BUILT: wefts at 56 and 63, topper and clip-in band 1 at 3650, bands off the care date in
privilege_band_on, rule 12 withdrawn and no unlock_deadline anywhere.
BUILT 21 September: care_date_days for topper, wig and clip_in at 0, and privilege_summary returns a
null next_care_date, so the app shows no countdown.

## 3 The booking bonus

Changed 22 September: 1 booking bonus of 100 points, not 2. She earns it only if she books her next visit at the desk on the day of a counted maintenance AND comes in on that exact date. Booking later, by phone, by email or through an app request, or moving the date, means no bonus. Released at check in, never banded.
The app cannot book. It can only send a request, see section 12.

## 4 Referrals

500 points to her when her friend books and pays. 1,000 points to the friend, usable on her first
visit, including against a new set. It is an acquisition cost and is treated as one. No cap on how
many friends she refers.
The app cannot see who she sent her code to. It shows only people who arrived with it.
Referral codes never contain a space: first name then 2 digits, written together, for example SHAWN36. Codes are always shown, copied and shared that way, and a code typed with a space still matches.
The referral message has no links in it. It reads: "Come to Tatiana Karelina with my code SHAWN36 and you will get 1,000 points, £100, to use on your first visit. Message the salon on WhatsApp on 07714 392999 or call 020 3645 1761 and give them my code." Decided by Shawn on 21 September.
TO DO: privilege_referral_code issues codes with no space, the 2 existing codes (SHAWN 36, APP 35) have the space taken out, and code lookup ignores spaces.
BUILT 21 September: referrer 500, referred 1,000, and can_redeem allows the referred friend's
1,000 on her first visit whatever it is.

## 5 Reviews

250 points per platform, Google and Trustpilot, once each in any rolling 6 months, so 500 is the
ceiling. Each platform is its own award, in any order.
The points are for posting a review, good or bad. Never for a rating, never for what she writes.
The Review screen carries the line: "We never ask for a particular rating and the points do not
depend on what you write."
No disclosure line is added to the review. Decided by Shawn on 21 September. The app copies her
text exactly as she wrote it.
The draft survives leaving the app, backgrounding and a force quit. Tapping a platform copies the
text and opens that platform. google_review_link is https://g.page/r/CWVX24-xJAz7EBM/review.
trustpilot_review_link is https://uk.trustpilot.com/evaluate/tatianakarelina.co.uk, set in
salon.settings on 21 September. The Trustpilot route stays hidden if it is ever empty.
Awarding: the app records when she taps Google or Trustpilot. The CRM shows a Review claims list
(name, platform, when). Google and Trustpilot email the salon when a review is posted, and the desk
finds her in Review claims and presses Pay 250. The CRM enforces 250 per platform, once each in any
rolling 6 months. Taps never claimed drop off after 30 days. Automatic checking can come later.
Trustpilot's invitation address goes on the salon's confirmation emails with no points attached.
BUILT 21 September: bonus_review_share 250.

## 6 Complete client card

Every client is already in the CRM, so there is no sign up. She signs in with her mobile and a one time code.
Sign in: her mobile and a one time code by text. The sign in screen has "Keep me signed in for 90 days", on by default. With it on, she stays signed in on that phone for 90 days and then needs a new code. With it off, she needs a new code each time she opens the app. This keeps text messages, and their cost, to a minimum.
The opening screen (video, logo and Privilege) plays every time the app is opened and never moves on by itself. She always presses the button. Signed out, it reads Log in and goes to Your Mobile Number. Signed in within her 90 days, it reads Enter and goes straight to Home. Decided by Shawn on 21 September.

The first time she signs in, the app shows Your Details with whatever the salon is missing, and she cannot go in until her card is complete. If her card is already complete she goes straight to Home.
Required: first and last name, mobile, email, address, postcode, preferred stylist, how she likes her hair, and best way to contact her.
Optional: birthday, day and month only, never the year, and occupation. The birthday hint reads "Having it lets us recognise your birthday." Gold and Black get birthday points (section 11).
No points for a complete card. The 100 is removed.
BUILT: occupation column, and profile_complete computed by trigger.
TO DO: set bonus_profile_setup to 0 so nothing is paid, and have profile_complete count the required fields only, leaving out birthday and occupation.

## 7 Method and hair type

method_code is the attachment method only: micro_rings, micro_bonds, tapes, wefts, topper, wig,
clip_in. hair_type holds russian or exclusive and never drives a care date, a band or a reward.
TO DO: retag the 43 services and remap the 1,022 cards holding russian, and rename bonds to
micro_bonds, as set out on 20 September.

## 8 Tailoring by type of client

Rewards filter to her family by default, with a link to the whole price list. Rewards opens on the
Colour filter, with Hair, Davines and All one tap away.
The Care Card is the same for everyone: 4 care visits fill it, and a full card is 500 points, £50.
Each box shows the TK mark: white on black when filled, faded in a dashed box when empty. No figure is printed in the last box.
Every counted maintenance fills a box. New sets and top ups do not.
TO DO: set bonus_card_complete back to 500 and care_card_boxes to 4 for every family, and stop
recording a free service owed in salon.care_card_rewards.
All reward prices and points round to the nearest £5.

## 9 App store requirements

Apple and Google both require in-app account deletion for any app where an account is created. Your
Details now carries "Delete my account", which must delete the account and its points, not just sign
out. Google also requires a web link for deletion requests.
The test client given to Apple's reviewer must already have a complete card, or the reviewer is stopped on Your Details.
Most existing clients will land on Your Details the first time they sign in, so the desk should expect questions in the first weeks.
Points redeem for real services, so they sit outside in-app purchase rules.
Never prompt for an App Store or Play rating with anything attached. Store ratings use the platform's
own prompt only.

## 10 Contact

WhatsApp: +44 (0) 7714 392999, opened with https://wa.me/447714392999
Telephone: +44 (0) 20 3645 1761, opened with tel:+442036451761
Email: info@tatianakarelina.co.uk, opened with mailto:info@tatianakarelina.co.uk
Each button opens the phone's own app. No integration is needed. Store all three in salon.settings
so they can be changed without an app release.

## 11 Tiers

Changed 22 September. Tiers are earned by a full Care Card plus tier points, on a calendar year. Everyone starts at Silver on the day they join.
Gold: a full Care Card and 1,500 tier points. Black: a full Care Card and 3,000 tier points. Toppers, wigs and clip-ins: tier points only, no Care Card needed.
Tier points: 1 for every £1 spent with the salon, on anything. They measure progress and are not spendable.
She moves up the moment she qualifies and holds the tier for the rest of that year and all of the next. To stay, during that next year she fills a Care Card and earns 1,250 tier points (Gold) or 2,500 (Black); otherwise on 1 January she moves to the tier her year supports. Joining in 2026: everything from the day she joins counts towards 2027.
Earn rates: Silver 1, Gold 1.25, Black 1.5 points per £1 at a maintenance.
Perks (from app_tier_perks): colour discount 10, 15, 30%; Davines discount 10, 15, 20%; free colour none, £100, £200 a year; maintenance perk (complimentary wash and blow dry) none, every second maintenance, every maintenance; birthday points none, 250, 500; Davines gift none, £50, £100 a year. Every member: booking bonus, Care Card, refer a friend, review points, 50% off first colour, free piece check.
Every figure in the app comes from app_tier_rules() and app_tier_perks(), never typed in.
Client facing copy about points never uses keep, lose, lapse or miss. Bands are described as "Come Back Earlier. Earn More" (Shawn, 22 September).

## 12 Booking requests

Every booking request made in the app is emailed to info@tatianakarelina.co.uk through the salon's Google mailbox. The email carries her name, mobile, the service, the stylist, the day and time she asked for, and a link to her client card.
The desk books it in the diary as normal and lets her know. The time is not held while she waits. Nothing is booked until the desk confirms it.
The app shows the request as Requested until the booking appears in the diary, then shows it as her next appointment.
No requested state in the diary, no requests list, no confirm or decline buttons.
TO DO: a small table in the CRM to hold each request, and the email.
She picks from her stylist's free times, read from the diary through a CRM function, as the Booking screen shows.

## 13 Client data in the app

Nothing about a client is built into the app. Every name, referral code, balance, pound value, tier, care date, visit, ledger line, Care Card box and detail on Your Details is read from the CRM for the client who is signed in.
The names and figures in the wireframes (Sophie Alderton, SOPHIE24, 1,240 points and the rest) are placeholders only.
Fonts, layout, colours and all fixed text are built exactly as the wireframes show them.
The app never works out a figure itself. Points, pound values, bands, tier and Care Card all come from named CRM functions.

## 14 Closed

Points last 24 months with a warning at 21, everywhere. Settings, app and specification v2 agree.
The £350 for 700 points error was in the FAQs Word document and Tatiana's brief, and the CMS chat
corrected both on 19 September to 350 points, £35.
No referral cap. The referred friend's 1,000 is usable on her first visit, new set included.
A complete card is required to go in, birthday and occupation optional, no points for it.
Care Card is 500 points for a full card of 4, the same for everyone.
Tier benefits replaced on 22 September by the perks in section 11.
No disclosure line on reviews.
Blow dry and trim earn. Earning is on the cash part only. Points are earned at care visits and spent on anything, at any visit.
FAQs are 9, retitled FAQs, including what happens if she comes in late (the bands, in weeks), how the 2 booking bonuses work with no exceptions, how the Care Card works, and what the different tiers give. Bottom menu on every signed in screen.
The Holiday screen is removed. Holidays are handled at the salon's discretion.

## 15 Still open

Nothing. The diary is open about 4 months ahead, confirmed by Shawn on 21 September.

## 16 Wording and empty states, 22 September

Two kinds of points, always named: TK Points are hers to spend (10 TK Points is £1). Tier Points move her up a tier, 1 for every £1 spent on anything, and are never spendable. The Card screen shows both side by side.
Rewards lists only what she can have today with her TK Points, filtered to her hair, with no link to the whole price list. With nothing to spend it shows "Your Rewards" and one line saying her next maintenance earns TK Points, with a link to How points work.
"First" or "next": the app says "your first maintenance" only when she has never had a maintenance with the salon. Every existing client, the usual case, sees "your next maintenance". TO DO for the CRM: a has_had_maintenance flag in app_summary so the app can choose.
Visits is titled Your Recent Visits and shows only her last 5 visits, newest first: service, date, stylist, the TK Points from that visit and whether they are pending or when they were released, and the top up line where it applies. The next appointment is on Home. Visits from before the scheme began show the service, date and stylist only, with no points column and never "No points".
Share your code opens the phone's own share sheet. Nothing in the app says "Choose an app".
Tier Perks top line: "Every member gets: the booking bonus, the Care Card, refer a friend, review points and 50% off your first colour." No free piece check (Shawn, 22 September).
Referral message (changed by Shawn, 22 September, replacing the no links rule): "...Message the salon on WhatsApp, call 020 3645 1761 or email us, and give them my code." WhatsApp and email us are underlined links (https://wa.me/447714392999 and mailto:info@tatianakarelina.co.uk); the phone number stays plain.
Card tier counter: an eyebrow "Next Tier: Gold" (or Black), her Tier Points large, "of [needed] Tier Points needed", a bar and the Care Card line. Tapping a higher tier shows that tier. A Gold or Black client tapping her own tier sees "Tier Points to Retain Gold/Black" with the keep figure and "Reviewed on 1 January".
FAQ wording, 22 September: the booking bonus answer opens with why we offer it, then how, firm but with no "no exceptions"; new sets and pieces "do not qualify for TK Points", never "earn nothing"; "Do points expire?"; "How do I progress to the next Tier?" ending "The How Tiers Work section has more details."
Confirmed by Shawn, 22 September: a new set or new piece does not fill a Care Card box; only counted maintenances of £200 or more do. Joining in 2026: see First tier year below. Everyone is Silver at launch.
Shawn, 22 September, round 5:
Never say half, three quarters or full points to a client. The pending block lists each date with the TK Points and their pound value, earliest first: "Come back by 9 November: 290 TK Points, £29", "By 23 November: ...", "By 7 December: ...". Dates that have passed drop off. The CRM sends the points and pounds for each date, rounded; the app never works them out. How Points Work and the FAQ use the same form (400, 300, 200 TK Points on a £400 maintenance).
More lists everything reachable elsewhere: Your TK Points, How Points Work, How Tiers Work, Tier Perks, Request a Booking, Refer a Friend, Leave a Review, Your Details, FAQs, Contact Us.
Rewards opens on Hair, then Colour, Davines, All. Every reward name has a capital letter on every word. Maintenance and re-do services (topper, wig and clip-in care, re-do wefts, re-do 1/2 head and similar) are never offered as rewards, because their price varies.
Free colour: the amount goes down as the desk uses it; Home shows what is left ("You have £60 of free colour left").
The review draft belongs to the client who wrote it: kept until she has shared it, cleared on sign out, never shown to another account or carried over from an old build.
Wallet: once the card is in Apple Wallet or Google Wallet on that phone, that button is hidden.
First tier year, confirmed by Shawn 22 September (replaces the earlier 31 December 2027 answer): launch in 2026 to 31 December 2027 is one tier year, the same way airlines run a calendar year. A client who reaches Gold or Black at any point in it, in 2026 or 2027, keeps the tier until 31 December 2028. She gets 1 free colour allowance and 1 Davines gift for that first period, in full, on the day she reaches the tier; no new allowance in January 2027 and nothing pro rated. 2028 is her stay year for 2029. From 2028 every tier year runs 1 January to 31 December, with allowances each January.
