# TK Privilege: build and release plan

Written 18 September 2026, updated 21 September. Covers the route from the signed off wireframes (v13) to a live app on the App Store and Google Play.

## Status

The D-U-N-S number for the salon company is held, confirmed 19 September. That was the longest lead item in the whole project and it is done. Both Apple and Google organisation enrolment are unblocked, and the same number serves both.

## 1. What the app gets built in

The wireframes are HTML. The real app should be React Native using Expo. One codebase produces both the iOS and the Android app, and Expo's build service (EAS) produces the signed builds and submits them to TestFlight and Play without needing a Mac or Xcode locally. This matters because Shawn is building with AI assistance rather than a native iOS and Android team.

The 21 wireframe screens translate almost one for one into React Native screens. The design decisions already settled carry straight across. The wireframes are the specification.

The video in the app is built at 1080p.

No client data is built into the app. Every name, referral code, balance, date, visit and ledger line in the wireframes (Sophie Alderton, SOPHIE24, 1,240 points and the rest) is a placeholder. In the app each one is read from the CRM for the client who is signed in. Fonts, layout, colours and all fixed text are built exactly as the wireframes show them.

Rough shape of the work: project scaffold and navigation, the card component with its three tier states, the data layer against Supabase, the forms, push notifications, and the Apple Wallet pass.

## 2. The Apple Wallet pass (approved 18 September)

The loyalty card gets a real Apple Wallet pass in addition to the in-app card, so it sits alongside the client's other cards and is reachable without opening the app.

What it needs: a Pass Type ID and signing certificate from the Apple Developer account (so it depends on section 4 being done first), a small signing service to generate each client's .pkpass, and the pass design, which follows the same tier colour logic as the in-app card. Passes support push updates, so a tier change or a points change updates the card in the client's Wallet without her doing anything.

The Android equivalent is Google Wallet, which is worth adding at the same time since the pass content is already modelled.

Beyond being genuinely useful, the Wallet pass is one of the strongest answers to Apple's Guideline 4.2 concern in section 6.

## 3. Connecting to the CRM

The CRM is the Supabase database already being built on the CMS side of this project. The app talks to it directly using the Supabase client library, so there is no separate API server to build.

Per the v12 build description the app is a thin client: it never calculates points, never writes to the ledger, never sets a tier and never decides a band. Every figure comes from a named database function. A booking, a redemption, a review share and away dates are all requests the salon system acts on, not table writes from the app.

### Authentication (settled 18 September)

Row Level Security is what stops one client reading another client's record, and it needs a verified identity to key off. A mobile number typed into a box is not that.

The settled answer: a one time code, on first install only. She enters her number, receives one text, and then stays signed in on that phone permanently. That single text buys a real Supabase phone auth session, which RLS keys off.

This needs an SMS provider wired into Supabase phone auth. Twilio is the usual choice. Cost is per message and only on first install per client, so it is negligible at salon scale.

## 4. Apple Developer Program, and TestFlight

Membership costs 99 USD a year, charged in local currency. Enrol as an organisation, not as an individual, so the app is published under the salon company rather than Shawn personally.

Enrol at https://developer.apple.com/programs/enroll/

What enrolment needs, all now available: the D-U-N-S number, the legal entity name exactly as registered, a work email address on the company's own domain (a personal gmail address will not be accepted), a publicly working website on that domain, which tatianakarelina.co.uk satisfies, and an Apple Account with two factor authentication enabled. The person enrolling must have authority to bind the company.

Apple then verifies the organisation, which usually takes a few days and sometimes involves a call to the company's listed number.

Once the developer account exists and there is a build: EAS builds the app, EAS submits it to App Store Connect, and the build appears in TestFlight. Internal testing covers up to 100 people on the team, needs no review at all, and a build is installable within minutes of upload. External testing covers up to 10,000 people and needs a Beta App Review, which is lighter than full App Store review and usually clears inside a day.

## 5. Google Play

Google Play Console costs 25 USD, one time, not annual.

Register at https://play.google.com/console/signup

Register as an organisation account rather than a personal one. Two reasons. Personal developer accounts created after 13 November 2023 must run a closed test with at least 12 testers opted in continuously for 14 days before the app is eligible for production release, and organisation accounts are not subject to that. And an organisation account requires the same D-U-N-S number, which is already held.

One trap: the organisation details on the Google Payments profile must match the Dun and Bradstreet record exactly, or the account falls out of good standing later.

Play's internal testing track is the equivalent of TestFlight internal testing: up to 100 testers, available almost immediately, no review.

## 6. What store review actually checks

The main Apple risk for an app of this kind is Guideline 4.2, minimum functionality. Apple rejects apps that are essentially a website in a wrapper. A loyalty card app is exactly the shape of thing that attracts this. What clears it is genuine native behaviour: the Apple Wallet pass, push notifications for appointment reminders, and native forms and navigation rather than a web view.

Apple will also need a demo account, because the app is only usable by existing salon clients and a reviewer is not one. A test client record with a working number, and a fixed code the reviewer can use to get past the one time code, has to be handed over in the review notes or the app is rejected as unreviewable. The test client must already have a complete card, or the reviewer is stopped on Your Details and the app is rejected.

Account deletion has to exist inside the app or Apple will reject it. Deleting the app account does not delete her client card, and the copy must say so.

Both stores need a privacy policy at a public URL before submission, and both need a data collection declaration (Apple's privacy nutrition labels, Google's Data Safety form). Because the app collects name, mobile, email, birthday, address, occupation, appointment history and marketing consents, this needs a real privacy policy page live on tatianakarelina.co.uk, not a placeholder.

Timings once submitted: Apple review is typically a day or two. Google's first review of a new app is usually a few days and slower than subsequent updates.

## 7. Store listing screenshots

Both stores require screenshots, and both require that they show the app as it actually is. Apple's Guideline 2.3.3 covers this, so final listing screenshots have to come from the built app, not from the wireframes.

What the wireframes are good for now is deciding the frames: which screens, in what order, and what caption sits over each. The usual set is 5 or 6 leading with the card, then the next appointment, then visits, then reviews. Agree that now, reshoot from the real build at submission.

Apple wants screenshots at the current required iPhone display sizes, Google wants phone screenshots plus a 1024 by 500 feature graphic and a 512 by 512 app icon.

## 8. Sequence

Done: D-U-N-S number.

Now, and in parallel with everything else: enrol in the Apple Developer Program as an organisation, using a work email on the salon domain. Register the Google Play Console organisation account. Get a privacy policy written and published on the salon website. Choose an SMS provider for the one time code.

Needs the CMS: the client, visits, appointments, points and reviews tables in their settled form, plus the named functions the v12 document specifies. The app build should start once those are stable, because the data layer is most of the app.

Then: build phase 1 read only (sign in, Home, Card, How points work, Her points, Visits, Contact, Questions), then the request screens, then redemption, then the review flow and push.

## Sources

Apple Developer Program enrolment and fee: https://developer.apple.com/programs/enroll/
Apple D-U-N-S requirement: https://developer.apple.com/help/account/membership/D-U-N-S/
Google Play required information for a developer account: https://support.google.com/googleplay/android-developer/answer/13628312
Google Play testing requirements for new personal developer accounts: https://support.google.com/googleplay/android-developer/answer/14151465
Expo EAS build setup: https://docs.expo.dev/build/setup/
Supabase with Expo React Native: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
