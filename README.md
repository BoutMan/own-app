# Own

Women's strength & wellness app for the US market — iOS first, Android next.
Expo SDK 58 · React Native 0.88 · Expo Router · TypeScript strict.

Project brief for Claude Code and humans: [`CLAUDE.md`](CLAUDE.md). Product spec: [`docs/spec-fonctionnelle.md`](docs/spec-fonctionnelle.md). Design source of truth: [`design/`](design/).

## Run it

```bash
npm install
npx expo start          # then press i (iOS simulator), a (Android) or w (web)
npm run typecheck
```

On a phone: install **Expo Go**, scan the QR code printed by `npx expo start` (same Wi-Fi).

### Web preview (no simulator needed)

```bash
npm run preview         # builds preview/ — a static web build that runs under any sub-path
```

`preview/` is published as a private claude.ai artifact after each step. It is the web rendering of the
React Native code, close to iOS but not identical (fonts, shadows, scroll feel): check on a device before release.

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
  features/onboarding/ answers context, schedule rules, onboarding-only UI (StepScreen, SignaturePad…)
  lib/                 pure helpers (dates)
  content/             photos registry, mock data for static screens
assets/photos/         mood photos — NOT cleared for publication (design/photos/README.md)
design/                Claude Design export: PNG + HTML mockups, tokens, screen inventory
docs/                  spec, market study, source PDF guide
scripts/build-preview  web preview builder
```

## Status

- [x] Milestone 0 — foundations: Expo + Router, tokens, Instrument Sans, components, kitchen sink
- [x] First screens: 01 Splash, 02 Welcome, 12 Today (static mock data), tab bar
- [ ] Milestone 1 — MVP static screens + full navigation
  - [x] First launch: onboarding 1–7 (03–09), 10 Your season is ready, 11 Paywall
  - [ ] Tabs: 16 Programme, 15 Progress, 25 Me
  - [ ] Session: 13 Guided session, 14 Session complete
  - [ ] 17 Library, 18 Exercise detail, 21 Sunday check-in, 22 Block review, 23 My week is complicated
  - [ ] 26 Settings, 27 Subscription, 28 Data & privacy
- [ ] Milestone 2 — data model + programme content from the PDF
- [ ] Milestone 3 — session engine (+1 rule, deloads) with unit tests
- [ ] Milestone 4 — persisted onboarding + paywall (RevenueCat)
- [ ] Milestone 5 — local reminders, Sunday check-in, block reviews, photo vault
