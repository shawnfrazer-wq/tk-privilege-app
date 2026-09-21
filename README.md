# TK Privilege

The client loyalty app for Tatiana Karelina salons. Start with CLAUDE.md, then docs/crm-api.md.

React Native with Expo and Expo Router. Screens are in app/, shared pieces in src/, the design in wireframes/all-screens.html.

    npm install
    npx expo start
    npx eas-cli build --platform ios --profile production

Every screen in the wireframes is built: opening, sign in, code, Home, Card, How Points Work, How Tiers Work, Tier Perks, Your TK Points, Rewards, Your Recent Visits, More, Contact, FAQs, Your Details with the complete card gate and Delete my account, booking requests, Refer a Friend and Review. The wallet passes and push notifications follow in stage 3.

To try it on a phone with Expo Go: `npm install`, then `npx expo start --tunnel` and scan the QR code.
