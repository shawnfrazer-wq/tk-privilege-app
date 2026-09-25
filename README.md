# TK Privilege

The client loyalty app for Tatiana Karelina salons. Start with CLAUDE.md, then docs/crm-api.md.

React Native with Expo and Expo Router. Screens are in app/, shared pieces in src/, the design in wireframes/all-screens.html.

    npm install
    npx expo start

Builds run through EAS from a Mac, never from a chat session: see docs/build-and-release-plan.md section 8 for the exact commands. The `internal` profile in eas.json is for TestFlight and Play internal testing, `production` for the stores. The Supabase URL and publishable key are constants in src/supabase.ts and are compiled into every build; nothing is read from a local file or an environment variable.

Every screen in the wireframes is built: opening, sign in, code, Home, Card, How Points Work, How Tiers Work, Tier Perks, Your TK Points, Rewards, Your Recent Visits, More, Contact, FAQs, Your Details with the complete card gate and Delete my account, booking requests, Refer a Friend and Review. The wallet passes and push notifications follow in stage 3.

To try it on a phone with Expo Go: `npm install`, then `npx expo start --tunnel` and scan the QR code.
