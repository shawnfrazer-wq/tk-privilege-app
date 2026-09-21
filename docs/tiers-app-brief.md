# TK Privilege: rules change, 22 September 2026

Copied from the project doc claude/tk-privilege-tiers-app-brief.md. The CRM is being updated to match; field names below are the contract. Do not hard code any number: every figure comes from the CRM.

## 1 What has changed in the rules

1.1 Counted maintenance. A care visit counts as a maintenance only if it is £200 or more AND at least 5 weeks (tapes) or 7 weeks (everything else) after her last counted maintenance. Only counted maintenances fill Care Card boxes, count towards tiers, earn the booking bonus and release points that are waiting.
1.2 Smaller or closer visits (top ups) still earn points. Those points are added to what is already waiting and are released with her next counted maintenance. On the Visits screen show them as: "Top up. Points added to your next maintenance."
1.3 Booking bonus. There is now 1 booking bonus of 100 points, not 2. She earns it only if she books her next visit at the desk on the day of a counted maintenance AND comes in on that exact date. Moving the date means no bonus.
1.4 Tiers are now earned by Care Card plus spend, on a calendar year. Details in section 3.
1.5 Earn rates stay: Silver 1, Gold 1.25, Black 1.5 points per £1 on maintenance.
1.6 Everyone starts at Silver on the day they join.

## 2 How points work, wording change

Describe the bands as earning more for coming earlier. Use her own dates and values from app_summary.

Headline: "Come Back Earlier. Earn More" (changed by Shawn, 22 September).

Lines, using her dates:
"Come back by [band3_last_day]: earn half points on your last maintenance."
"By [band2_last_day]: earn three quarters."
"By [full_until]: earn full points."

Show the pound value beside each line: pending_pounds_band3, pending_pounds_band2, pending_pounds_full. Hide a line once its date has passed.

General copy for micro rings and bonds (weeks come from the CRM for other methods):
"Every 3 months earns half points. Every 11 weeks, three quarters. Every 9 weeks, full points."

Never use the words keep, lose, lapse or miss in client facing copy about points. If nothing is waiting, show: "Earn points on your next maintenance."
Under the How Points Work page add links to 2 new pages: How Tiers Work and Tier Perks.

## 3 New page: How Tiers Work

Copy:
Everyone starts at Silver. You move up a tier by coming in for your maintenance and earning tier points.

Gold: fill a Care Card and earn 1,500 tier points.
Black: fill a Care Card and earn 3,000 tier points.
Toppers, wigs and clip-ins: no Care Card needed, tier points only.

Tier points: 1 for every £1 you spend with us, on anything. They measure your progress. They are not points to spend.

Your tier year runs from 1 January to 31 December. You move up the moment you qualify, and keep your tier for the rest of that year and all of the next.

To stay in your tier, during that next year fill a Care Card and earn 1,250 tier points for Gold, or 2,500 for Black. If not, on 1 January you move to the tier your year supports.

Example: reach Gold in June 2027 and you are Gold until 31 December 2028. Fill a Care Card and earn 1,250 tier points during 2028 to stay Gold for 2029.

What counts as a maintenance: a maintenance of £200 or more, at least 5 weeks after your last one for tapes, or 7 weeks for everything else.

Joining in 2026: everything from the day you join counts towards 2027.

Progress panel at the top of the page, from app_summary:
- Her tier and "until [tier_until]" (hide for Silver).
- If she can move up: "[next_tier]: [tier_points] of [next_tier_points] tier points" as a bar, and "Care Card: [card_boxes] of [card_target]" (hide the Care Card line when care_card_needed is false).
- If she holds Gold or Black in her stay year: "To stay [tier] for [keep_year_next]: [tier_points] of [keep_points] tier points" plus the Care Card line, with "Reviewed on 1 January".

All numbers in the copy above (1,500, 3,000, 1,250, 2,500, £200, 5 and 7 weeks) come from app_tier_rules(), never typed in.

## 4 New page: Tier Perks

Top line: "Every member gets: the booking bonus, the Care Card, refer a friend, review points and 50% off your first colour." (No free piece check, removed by Shawn.)

Table, 3 columns Silver, Gold, Black, from app_tier_perks():

| | Silver | Gold | Black |
|---|---|---|---|
| Points per £1 | 1 | 1.25 | 1.5 |
| Colour discount | 10% | 15% | 30% |
| Davines discount | 10% | 15% | 20% |
| Free colour | ✗ | £100 | £200 |
| Maintenance perk | ✗ | ✓ | ✓ |
| Birthday points | ✗ | 250 | 500 |
| Davines gift | ✗ | £50 | £100 |

Text below the table:
Colour discount. Taken off any colour service at the till.
Davines discount. Taken off any Davines product at the till.
Free colour. An amount to spend on any colour service you choose, given each year you hold Gold or Black.
Maintenance perk. A complimentary wash and blow dry with your maintenance: every second maintenance for Gold, every maintenance for Black.
Birthday points. Added to your balance on your birthday.
Davines gift. Davines products of your choice, given each year you hold Gold or Black.
New to colour with us? Your first colour is half price.

Highlight her own column.

Changed by Shawn, 22 September: on the Card screen, tapping a tier chip does not open this page and shows no panel or extra text. Tapping a tier above hers changes the existing tier points line and bar to that tier: "[Tier]: [tier_points] of [achieve] tier points", with the bar filled to match. Tapping her own tier or one below puts the line and bar back to her normal view. No outline or highlight on the tapped chip. The "How tiers work" link below leads to How Tiers Work, which links to this page.

## 5 Card screen and Home

Replace "visits to next tier" with tier points progress from app_summary. If free_colour_left_pounds > 0 or davines_gift_owed is true, show a small line on Home: "You have £[x] of free colour" / "Your Davines gift is waiting at the salon". If maintenance_perk_next is true, show on the next appointment block: "Wash and blow dry included".

## 6 Data contract

app_summary gains: tier_until (date or null), tier_points (this qualifying period), tier_points_from (date), care_card_needed (bool), next_tier (gold, black or null), next_tier_points, keep_year_next (for example 2029, or null), keep_points (or null), free_colour_left_pounds, davines_gift_owed (bool), davines_gift_pounds, maintenance_perk_next (bool), first_colour_offer (bool), booking_bonus (0 or 100), booking_bonus_date (the date it depends on).
app_summary loses: kept_bonus, kept_bonus_date, visits_12m, visits_to_next_tier, next_tier_visits.
app_visits rows gain: counted (bool). Show the Top up wording when counted is false.
New app_tier_rules(): jsonb with gold_achieve, gold_keep, black_achieve, black_keep, care_card_boxes, care_visit_min_pounds, gap_weeks_tapes, gap_weeks_other.
New app_tier_perks(): rows tier, earn_rate, colour_discount_pct, davines_discount_pct, free_colour_pounds, maintenance_perk, birthday_points, davines_gift_pounds.

## 7 Changes agreed with Shawn after the CRM brief, 22 September

The wireframe is the final word on layout and wording. In summary:
- Two named kinds of points everywhere: TK Points (spendable, 10 TK Points is £1) and Tier Points (1 for each £1 spent, never spendable). The Card screen shows both side by side in place of the single balance. How Points Work and How Tiers Work open with the two explainer boxes.
- How Tiers Work opens with her status, then Your Next Tier with the next tier's card and What you need (Care Card bar, Tier Points bar). A Black client sees Staying Black instead.
- How Tiers Work and Tier Perks are linked only from near the top of How Points Work. No links between them and none on the Card screen or More.
- Tier Perks has a "What Each Perk Means" heading under the table.
- Rewards lists only what she can have today with her TK Points, filtered to her hair. No whole price list link. With nothing to spend: "Your Rewards" and one line with a How points work link.
- Your Recent Visits (the Visits tab) lists her last 5 visits only. Pre scheme visits show no points column.
- "First" maintenance only when she has never had one; otherwise "next". Needs a has_had_maintenance flag from the CRM.
- Your Care Date copy: "based on your preference", and "Optimal care cadence is:" with 2 rows only.
- Tighter spacing throughout, as in the wireframe.

UK English, numerals, no em dashes.
