# TK Privilege app: standing instructions for Claude Code

Read this file, then docs/rules.md, docs/decisions-21-sep.md and docs/build-and-release-plan.md before writing any code. Open wireframes/all-screens.html in a browser to see every screen.

## What this is

TK Privilege is the loyalty app for Tatiana Karelina hair salons (Kensington and Manchester). Every client is already in the salon CRM. She signs in with her mobile number and a one time code by text, sees her Privilege card, points, visits and Care Card, and can send a booking request, refer a friend and share a review.

## How it is built

React Native with Expo (latest SDK), TypeScript, Expo Router. One codebase for iOS and Android. Builds and TestFlight submission through EAS. The Expo account is tatianakarelina and the project slug is tk-privilege (already created on expo.dev).

## The design is fixed

wireframes/all-screens.html is the specification. Match it exactly: fonts (Playfair Display for headings, Poppins for everything else, loaded with @expo-google-fonts), colours, spacing, card designs, gold boxes, justified body text, the bottom menu on every signed in screen, and every word of fixed text. Do not redesign, reword, add or remove anything. If something in the wireframe cannot be built as shown, stop and say so.

wireframes/new-client.html shows the same screens for a new client with nothing yet.

Logos, the TK mark, wallet badges and the Google and Trustpilot marks are in assets/. The home screen video is built at 1080p. assets/loop-preview-only.mp4 is a small preview copy only; the 1080p file will be added to assets/ as loop.mp4.

## Client data

Nothing about a client is built into the app. Sophie Alderton, SOPHIE24, 1,240 points and every other name and figure in the wireframes are placeholders. Every name, referral code, balance, pound value, tier, care date, visit, ledger line, Care Card box and detail on Your Details is read from the CRM for the client who is signed in.

The app never works out a figure itself and never writes to CRM tables. Points, pound values, bands, tier and Care Card come from named functions in the salon schema. Anything the client does (a booking request, a review tap, a change to her details, deleting her account) goes through a CRM function.

## The CRM

Supabase project fqvwyerheoafulmezyfm, schema salon.
URL: https://fqvwyerheoafulmezyfm.supabase.co
Publishable key: sb_publishable_jWITKqsg98dIrBIw3Y0DCQ_K1NNBKc2

Existing functions include privilege_summary, privilege_card, privilege_card_boxes, privilege_card_target, privilege_tier, privilege_visit_count, privilege_band_on, privilege_band1_last_day, privilege_family, privilege_referral_code, privilege_request_booking, privilege_review_tap, privilege_profile_missing and privilege_delete_account.

The CRM is built and changed in a separate chat, never from here. Do not create or change tables, functions, policies or settings in Supabase. If the app needs something the CRM does not provide (for example a function that lists a stylist's free times, or the client's ledger lines), stop and write it down in docs/crm-requests.md with exactly what it must return, so Shawn can pass it to the CRM chat.

## Sign in

Supabase phone auth with a one time code by text, sent through Twilio (already set up in Supabase). The sign in screen has "Keep me signed in for 90 days", on by default. With it on, she stays signed in on that phone for 90 days from the code, then needs a new one; store the sign in date securely on the phone and sign her out when 90 days have passed. With it off, she needs a new code each time the app is opened. The first time she signs in, if her card is incomplete she is taken to Your Details and cannot go further until the required fields are filled (see rules.md section 6). For testing, use a Supabase test phone number with a fixed code.

## Build order

1. Read only: Opening, sign in, code, Home, Card, How points work, Your Points, Visits, Contact, FAQs.
2. Your Details with the complete card rule and Delete my account, booking request, Refer a Friend, Review.
3. Apple Wallet and Google Wallet passes, push notifications.
4. Store submission.

Finish each stage, build it with EAS and send it to TestFlight before starting the next.

## Rules change, 22 September 2026

Read docs/tiers-app-brief.md (copied from the project doc claude/tk-privilege-tiers-app-brief.md). It changes counted maintenance, the booking bonus (now 1), and tiers (Care Card plus tier points, calendar year), adds How Tiers Work and Tier Perks, and changes app_summary and app_visits fields and adds app_tier_rules() and app_tier_perks(). Every number shown comes from those functions. Never use keep, lose, lapse or miss in client facing copy about points.

## Referral code and message

A referral code never contains a space (SHAWN36, not SHAWN 36). Show, copy and share it with any spaces removed, even if the CRM returns one. The referral message has no links in it; use the exact text on the Refer a Friend screen in the wireframe.

## Writing

UK English. Numerals, never numbers in words. No em dashes. Keep every piece of fixed text exactly as the wireframes have it.

## Opening screen

The opening (video, logo and Privilege) plays every time the app is opened and never moves on by itself: no timer, no automatic move to sign in or Home. She always presses the button. Signed out, the button reads Log in and goes to Your Mobile Number. Signed in within her 90 days, it reads Enter and goes straight to Home; app_link runs in the background while the video plays.

## Navigation

Bottom menu: Home, Card, Rewards, Visits, More. More lists Your Points, How Points Work, Refer a Friend, Leave a Review, Your Details, FAQs and Contact Us. Home also has rows for Your Points, Refer a Friend, Leave a Review and Your Details. Body text is Poppins 400, 14px, grey #2E2A27; muted text #5A5650.
