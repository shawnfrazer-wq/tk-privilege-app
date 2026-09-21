# TK Privilege app: standing instructions for Claude Code

Read this file, then docs/rules.md, docs/decisions-21-sep.md and docs/build-and-release-plan.md before writing any code. Open wireframes/all-screens.html in a browser to see every screen.

## What this is

TK Privilege is the loyalty app for Tatiana Karelina hair salons (Kensington and Manchester). Every client is already in the salon CRM. She signs in with her mobile number and a one time code by text, sees her Privilege card, points, visits and Care Card, and can send a booking request, refer a friend and share a review.

## How it is built

React Native with Expo (latest SDK), TypeScript, Expo Router. One codebase for iOS and Android. Builds and TestFlight submission through EAS. The Expo account is tatianakarelina and the project slug is tk-privilege (already created on expo.dev).

## The design is fixed

wireframes/all-screens.html is the specification. Match it exactly: fonts (Playfair Display for headings, Poppins for everything else, loaded with @expo-google-fonts), colours, spacing, card designs, gold boxes, justified body text, the bottom menu on every signed in screen, and every word of fixed text. Do not redesign, reword, add or remove anything. If something in the wireframe cannot be built as shown, stop and say so.

wireframes/new-client.html shows the same screens for a new client with nothing yet.

Two changes from the wireframes, made after testing on the phone on 21 September: Poppins is weight 400 everywhere the wireframes use 300, the body grey is #3E3A36 and the muted grey is #6E6A64. Every signed in screen that is not a tab has a back arrow. No screen is ever blank: while loading it shows a quiet spinner, and if a call fails it shows "Something went wrong. Pull down to try again." and logs the error.

Logos, the TK mark, wallet badges and the Google and Trustpilot marks are in assets/. The home screen video is built at 1080p. assets/loop-preview-only.mp4 is a small preview copy only; the 1080p file will be added to assets/ as loop.mp4.

## Client data

Nothing about a client is built into the app. Sophie Alderton, SOPHIE 24, 1,240 points and every other name and figure in the wireframes are placeholders. Every name, referral code, balance, pound value, tier, care date, visit, ledger line, Care Card box and detail on Your Details is read from the CRM for the client who is signed in.

The app never works out a figure itself and never writes to CRM tables. Points, pound values, bands, tier and Care Card come from named functions in the salon schema. Anything the client does (a booking request, a review tap, a change to her details, deleting her account) goes through a CRM function.

## The CRM

Supabase project fqvwyerheoafulmezyfm, schema salon.
URL: https://fqvwyerheoafulmezyfm.supabase.co
Publishable key: sb_publishable_jWITKqsg98dIrBIw3Y0DCQ_K1NNBKc2

docs/crm-api.md is the data guide. The app calls only the app_ functions listed there, with supabase-js created with { db: { schema: "salon" } } and supabase.rpc. It never calls a privilege_ function or reads a table directly; those are blocked for signed in clients by salon.api_guard.

The CRM is built and changed in a separate chat, never from here. Do not create or change tables, functions, policies or settings in Supabase. If the app needs something the CRM does not provide (for example a field app_summary does not return), stop and write it down in docs/crm-requests.md with exactly what it must return, so Shawn can pass it to the CRM chat.

## Sign in

Supabase phone auth with a one time code by text, sent through Twilio (already set up in Supabase). The sign in screen has a "Keep me signed in for 90 days" switch, on by default, under the mobile number and above Send me a code. With it on, she stays signed in on that phone for 90 days from the code and then needs a new one. With it off, she needs a new code each time the app is opened. The first time she signs in, if her card is incomplete she is taken to Your Details and cannot go further until the required fields are filled (see rules.md section 6). For testing, use +44 7700 900124 (card deliberately incomplete, for the Your Details gate) and +44 7700 900123 (card complete, kept for Apple's reviewer), both with code 123456. Neither receives messages.

## Build order

1. Read only: Opening, sign in, code, Home, Card, How points work, Your Points, Visits, Contact, FAQs.
2. Your Details with the complete card rule and Delete my account, booking request, Refer a Friend, Review.
3. Apple Wallet and Google Wallet passes, push notifications.
4. Store submission.

Finish each stage, build it with EAS and send it to TestFlight before starting the next.

## Writing

UK English. Numerals, never numbers in words. No em dashes. Keep every piece of fixed text exactly as the wireframes have it.
