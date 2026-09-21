# TK Privilege, the rules as they now stand

Final, 21 September 2026, after a final sweep of the wireframes against the live database. This
supersedes the build specification v2 of 19 September wherever the two disagree, and every rule
handed over in chat before today. Each rule says whether it is already built or still to do.

Wireframes, all screens: https://claude.ai/artifact/SdXCWCdjnvZqKZS1ya4JcB
New client, empty profile: https://claude.ai/artifact/Byv749sPKtwrimD5RKra9t
The app is being built in React Native, one codebase for iOS and Android.

## 1 Earning

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

## 3 The two booking bonuses

100 points for booking the next visit at the desk at checkout, on the day of the care visit. That is
the only way to earn it. A booking made later, by phone, by email or requested in the app, earns nothing.
The app cannot book. It can only send a request, see section 12.
A further 100 points for attending that appointment on the date originally booked. Moving it cancels
this second 100 only.
Both are pending from booking, released in full at check in, never banded, 100 or 0, one of each per
care visit, and both die with the visit's points at band 3. A manager awarding by hand awards all
three together or none.
BUILT on 20 September per the CMS log: bonus_rebook 100, bonus_kept 100, the bonus lives and dies
with its visit, privilege_award and privilege_writeoff carry it both ways.

## 4 Referrals

500 points to her when her friend books and pays. 1,000 points to the friend, usable on her first
visit, including against a new set. It is an acquisition cost and is treated as one. No cap on how
many friends she refers.
The app cannot see who she sent her code to. It shows only people who arrived with it.
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
The first time she signs in, the app shows Your Details with whatever the salon is missing, and she cannot go in until her card is complete. If her card is already complete she goes straight to Home.
Required: first and last name, mobile, email, address, postcode, preferred stylist, how she likes her hair, and best way to contact her.
Optional: birthday, day and month only, never the year, and occupation. The birthday hint reads "Having it lets us recognise your birthday." No birthday gift is promised or run by the system.
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
Every visit that is a care visit or a new set fills a box.
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

Tiers count care visits in a rolling 12 months, never spend.
Silver, where everyone starts: 1 point for every £1 at a care visit, and the Care Card.
Gold, 4 care visits: 1.25 points for every £1 at a care visit, and the Care Card.
Black, 6 care visits: 1.5 points for every £1 at a care visit, and the Care Card.
Tier never changes the bands. Every tier is on the same bands in section 2.
No birthday gift in the system. No discount on new sets. No extra days.
BUILT 21 September: salon.tiers.earn_rate 1, 1.25 and 1.5, applied by privilege_set_aside using her tier on the day of the visit.
TO DO: delete the black_saturday_priority_days setting, Saturday priority is removed.

## 12 Booking requests

Every booking request made in the app is emailed to info@tatianakarelina.co.uk through the salon's Google mailbox. The email carries her name, mobile, the service, the stylist, the day and time she asked for, and a link to her client card.
The desk books it in the diary as normal and lets her know. The time is not held while she waits. Nothing is booked until the desk confirms it.
The app shows the request as Requested until the booking appears in the diary, then shows it as her next appointment.
No requested state in the diary, no requests list, no confirm or decline buttons.
TO DO: a small table in the CRM to hold each request, and the email.
She picks from her stylist's free times, read from the diary through a CRM function, as the Booking screen shows.

## 13 Client data in the app

Nothing about a client is built into the app. Every name, referral code, balance, pound value, tier, care date, visit, ledger line, Care Card box and detail on Your Details is read from the CRM for the client who is signed in.
The names and figures in the wireframes (Sophie Alderton, SOPHIE 24, 1,240 points and the rest) are placeholders only.
Fonts, layout, colours and all fixed text are built exactly as the wireframes show them.
The app never works out a figure itself. Points, pound values, bands, tier and Care Card all come from named CRM functions.

## 14 Closed

Points last 24 months with a warning at 21, everywhere. Settings, app and specification v2 agree.
The £350 for 700 points error was in the FAQs Word document and Tatiana's brief, and the CMS chat
corrected both on 19 September to 350 points, £35.
No referral cap. The referred friend's 1,000 is usable on her first visit, new set included.
A complete card is required to go in, birthday and occupation optional, no points for it.
Care Card is 500 points for a full card of 4, the same for everyone.
Tier benefits set on 21 September: no birthday gift, no discount on new sets, no extra days.
No disclosure line on reviews.
Blow dry and trim earn. Earning is on the cash part only. Points are earned at care visits and spent on anything, at any visit.
FAQs are 9, retitled FAQs, including what happens if she comes in late (the bands, in weeks), how the 2 booking bonuses work with no exceptions, how the Care Card works, and what the different tiers give. Bottom menu on every signed in screen.
The Holiday screen is removed. Holidays are handled at the salon's discretion.

## 15 Still open

Nothing. The diary is open about 4 months ahead, confirmed by Shawn on 21 September.
