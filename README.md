# Own

Women's strength & wellness app for the US market — iOS first, Android next.
Expo SDK 58 · React Native 0.88 · Expo Router · TypeScript strict.

Project brief for Claude Code and humans: [`CLAUDE.md`](CLAUDE.md). Product spec: [`docs/spec-fonctionnelle.md`](docs/spec-fonctionnelle.md). Design source of truth: [`design/`](design/).

## Run it

```bash
npm install
npx expo start          # then press i (iOS simulator), a (Android) or w (web)
npm run typecheck
npm test                # Jest: units, programme content, session runner, database
npm run db:generate     # after a change in src/db/schema.ts
```

On a phone: install **Expo Go**, scan the QR code printed by `npx expo start` (same Wi-Fi).

### Web preview (no simulator needed)

```bash
npm run preview         # builds preview/ — a static web build that runs under any sub-path
```

`preview/` is published as a private claude.ai artifact after each step. On a desktop it shows the app inside an
iPhone 15-sized frame (390 × 844 pt, simulated notch and safe areas); on a phone it fills the screen. It is the web
rendering of the React Native code, close to iOS but not identical (fonts, shadows, scroll feel): the App Store build
comes from the same code through EAS Build. In the preview the database is SQLite compiled to WebAssembly (sql.js),
saved in the browser; Settings → Preview tools simulates any week and erases the test data.

## Layout

```
src/
  app/                 Expo Router routes (one file = one screen)
    index.tsx          01 Splash
    (onboarding)/      02 Welcome, then onboarding 1–7, paywall
    (tabs)/            12 Today · 16 Programme · 15 Progress · 25 Me
    dev/kitchen-sink   every design-system component (dev only, Me → "Open kitchen sink")
  components/          design system (PhotoHeader, Pill, CTA, ToneCard, Gauge, …)
  theme/               tokens (copied from design/tokens.ts) + typography helpers
  domain/programme/    the guide's programme as typed data (blocks, sessions, week rules, +1…), with pages
  domain/engine/       progression engine: +1 rule, load adjustments, season position (pure, tested)
  domain/units.ts      kg ↔ lb, display rounding
  db/                  on-device SQLite (Drizzle schema, repositories); migrations in drizzle/
  features/onboarding/ answers context, schedule rules, onboarding-only UI (StepScreen, SignaturePad…)
  features/session/    guided session: playable steps and runner
  lib/                 pure helpers (dates)
  content/             exercise cards, photos registry
assets/photos/         mood photos — NOT cleared for publication (design/photos/README.md)
design/                Claude Design export: PNG + HTML mockups, tokens, screen inventory
docs/                  spec, market study, source PDF guide
scripts/build-preview  web preview builder
```

## Status

- [x] Milestone 0 — foundations: Expo + Router, tokens, Instrument Sans, components, kitchen sink
- [x] First screens: 01 Splash, 02 Welcome, 12 Today (static mock data), tab bar
- [x] Milestone 1 — MVP static screens + full navigation
  - [x] First launch: onboarding 1–7 (03–09), 10 Your season is ready, 11 Paywall
  - [x] Tabs: 16 Programme, 15 Progress, 25 Me
  - [x] Session: 13 Guided session (runs session A from the guide p. 27), 14 Session complete
  - [x] 17 Library (the 35 cards of the guide), 18 Exercise detail, 21 Sunday check-in, 22 Block review, 23 My week is complicated
  - [x] 26 Settings, 27 Subscription, 28 Data & privacy
  - V1/V2 screens (19 Evening wind-down, 24 Glow card, 29 Circle) are placeholders; 20 Cycle has its first version
- [x] Milestone 2 — data model + programme content from the PDF (see docs/programme-notes.md)
- [x] Milestone 3 — session engine: logged sets, +1 rule, deloads, missed weeks, plan B (src/domain/engine, tested)
  - supersets and circuits logged per move, early deload on two signs of overtraining or a stall
- [ ] Milestone 4 — persisted onboarding (done) + paywall (RevenueCat, to do)
- [ ] Milestone 5 — local reminders, Sunday check-in (stored), block reviews, photo vault
