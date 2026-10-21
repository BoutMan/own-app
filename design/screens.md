# Inventaire des écrans

30 artboards issus du canvas Claude Design (29 écrans + 1 planche de style). Chaque écran existe en PNG (à regarder) et en HTML autonome (à inspecter : couleurs, tailles, espacements exacts sont dans les `style=""`).

Les écrans 12 à 29 sont dans la DA finale (photo plein cadre, cartes tons, jauges). Les écrans 01 à 11 (onboarding) sont validés sur le fond mais un cran en dessous visuellement : à l'implémentation, les aligner sur les composants des écrans 12–29 (en-tête photo, cartes tons, jauges) plutôt que de les copier au pixel près.

Les maquettes sont des artboards de hauteur fixe : dans l'app, chaque écran défile, la barre d'onglets (Today / Programme / Progress / Me) reste fixée en bas, et les hauteurs de statut/encoche viennent de la safe area.

Vue d'ensemble par parcours : `design/overview/1-first-launch.jpg`, `2-daily-app.jpg`, `3-key-moments.jpg`, `4-account.jpg`, `5-style-guide.jpg`.

### 01 · Splash

- **Rendu** : `design/screens-png/01-splash.png` · **HTML** : `design/screens-html/01-splash.html`
- **Route proposée** : `app/index.tsx (splash)` · **Phase** : MVP
- **Rôle** : Écran de lancement plein cadre, logo « own. », barre de chargement. Redirige vers Welcome (1re ouverture) ou Today (déjà inscrite).
- **Mène vers** : `02-welcome`

### 02 · Welcome

- **Rendu** : `design/screens-png/02-welcome.png` · **HTML** : `design/screens-html/02-welcome.html`
- **Route proposée** : `app/(onboarding)/welcome.tsx` · **Phase** : MVP
- **Rôle** : Promesse en 3 piliers Move / Rest / Fuel, mosaïque photo, CTA « Start my season », lien Log in.
- **Mène vers** : `12-today`, `03-onboarding-1-7-feel`

### 03 · Onboarding 1/7 — Feel

- **Rendu** : `design/screens-png/03-onboarding-1-7-feel.png` · **HTML** : `design/screens-html/03-onboarding-1-7-feel.html`
- **Route proposée** : `app/(onboarding)/feel.tsx` · **Phase** : MVP
- **Rôle** : Onboarding 1/7 : choisir jusqu'à 3 ressentis (Strong, Light, Rested, Grounded, Confident, Energised). Réutilisés sur Me.
- **Mène vers** : `04-onboarding-2-7-goals`, `02-welcome`

### 04 · Onboarding 2/7 — Goals

- **Rendu** : `design/screens-png/04-onboarding-2-7-goals.png` · **HTML** : `design/screens-html/04-onboarding-2-7-goals.html`
- **Route proposée** : `app/(onboarding)/goals.tsx` · **Phase** : MVP
- **Rôle** : 2/7 : trois objectifs CLEAR (performance, sensation, libre). Règle : au moins deux sans lien avec le poids.
- **Mène vers** : `05-onboarding-3-7-health-check`, `03-onboarding-1-7-feel`

### 05 · Onboarding 3/7 — Health check

- **Rendu** : `design/screens-png/05-onboarding-3-7-health-check.png` · **HTML** : `design/screens-html/05-onboarding-3-7-health-check.html`
- **Route proposée** : `app/(onboarding)/health-check.tsx` · **Phase** : MVP
- **Rôle** : 3/7 : bilan santé (grossesse, post-partum, pathologie, reprise) + 3 questions plancher pelvien → adaptations automatiques.
- **Mène vers** : `04-onboarding-2-7-goals`, `06-onboarding-4-7-your-ground`

### 06 · Onboarding 4/7 — Your ground

- **Rendu** : `design/screens-png/06-onboarding-4-7-your-ground.png` · **HTML** : `design/screens-html/06-onboarding-4-7-your-ground.html`
- **Route proposée** : `app/(onboarding)/ground.tsx` · **Phase** : MVP
- **Rôle** : 4/7 : maison ou salle, équipement disponible.
- **Mène vers** : `05-onboarding-3-7-health-check`, `07-onboarding-5-7-starting-point`

### 07 · Onboarding 5/7 — Starting point

- **Rendu** : `design/screens-png/07-onboarding-5-7-starting-point.png` · **HTML** : `design/screens-html/07-onboarding-5-7-starting-point.html`
- **Route proposée** : `app/(onboarding)/starting-point.tsx` · **Phase** : MVP
- **Rôle** : 5/7 : les 7 marqueurs notés 1–10 + photos jour 0 (coffre verrouillé).
- **Mène vers** : `06-onboarding-4-7-your-ground`, `08-onboarding-6-7-your-dates`

### 08 · Onboarding 6/7 — Your dates

- **Rendu** : `design/screens-png/08-onboarding-6-7-your-dates.png` · **HTML** : `design/screens-html/08-onboarding-6-7-your-dates.html`
- **Route proposée** : `app/(onboarding)/dates.tsx` · **Phase** : MVP
- **Rôle** : 6/7 : jours et heure des séances, ajout au calendrier, rappel la veille.
- **Mène vers** : `07-onboarding-5-7-starting-point`, `09-onboarding-7-7-contract`

### 09 · Onboarding 7/7 — Contract

- **Rendu** : `design/screens-png/09-onboarding-7-7-contract.png` · **HTML** : `design/screens-html/09-onboarding-7-7-contract.html`
- **Route proposée** : `app/(onboarding)/contract.tsx` · **Phase** : MVP
- **Rôle** : 7/7 : contrat (6 engagements) signé au doigt, date de début.
- **Mène vers** : `08-onboarding-6-7-your-dates`, `10-your-season-is-ready`, `12-today`

### 10 · Your season is ready

- **Rendu** : `design/screens-png/10-your-season-is-ready.png` · **HTML** : `design/screens-html/10-your-season-is-ready.html`
- **Route proposée** : `app/(onboarding)/ready.tsx` · **Phase** : MVP
- **Rôle** : Récap du programme personnalisé (3 blocs, équipement, objectifs) avant le paywall.
- **Mène vers** : `11-paywall`

### 11 · Paywall

- **Rendu** : `design/screens-png/11-paywall.png` · **HTML** : `design/screens-html/11-paywall.html`
- **Route proposée** : `app/(onboarding)/paywall.tsx` · **Phase** : MVP
- **Rôle** : Annuel $59.99 avec essai 7 jours (mis en avant) ou mensuel $14.99. Restore / Terms / Privacy.
- **Mène vers** : `28-data-privacy`, `27-subscription`, `12-today`

### 12 · Today

- **Rendu** : `design/screens-png/12-today.png` · **HTML** : `design/screens-html/12-today.html`
- **Route proposée** : `app/(tabs)/index.tsx` · **Phase** : MVP
- **Rôle** : Accueil : séance du jour en grande photo, semaine, +1 du jour, jauges des rituels, tuiles check-in / cycle, « My why ».
- **Mène vers** : `21-sunday-check-in`, `20-cycle`, `25-me`, `16-programme`, `15-progress`, `13-guided-session`

### 13 · Guided session

- **Rendu** : `design/screens-png/13-guided-session.png` · **HTML** : `design/screens-html/13-guided-session.html`
- **Route proposée** : `app/session/[id].tsx` · **Phase** : MVP
- **Rôle** : Séance guidée : exercice en cours, bascule maison/salle, séries à valider, minuteur de repos, conseil coach, exercice suivant.
- **Mène vers** : `14-session-complete`, `12-today`

### 14 · Session complete

- **Rendu** : `design/screens-png/14-session-complete.png` · **HTML** : `design/screens-html/14-session-complete.html`
- **Route proposée** : `app/session/done.tsx` · **Phase** : MVP
- **Rôle** : Fin de séance : stats, +1 obtenu et prochaine charge, ressenti /10, lien vers le cercle et partage.
- **Mène vers** : `29-my-circle`, `24-share-my-glow-card`, `12-today`

### 15 · Progress

- **Rendu** : `design/screens-png/15-progress.png` · **HTML** : `design/screens-html/15-progress.html`
- **Route proposée** : `app/(tabs)/progress.tsx` · **Phase** : MVP (vault, tests) / V1 (carte glow)
- **Rôle** : Carte glow, compteurs, 7 marqueurs en jauges (repère jour 0), coffre photos.
- **Mène vers** : `25-me`, `16-programme`, `22-block-review`, `24-share-my-glow-card`, `12-today`

### 16 · Programme

- **Rendu** : `design/screens-png/16-programme.png` · **HTML** : `design/screens-html/16-programme.html`
- **Route proposée** : `app/(tabs)/programme.tsx` · **Phase** : MVP
- **Rôle** : Saison de 12 semaines, bloc en cours, séances de la semaine, « My week is complicated », blocs à venir.
- **Mène vers** : `17-exercise-library`, `23-my-week-is-complicated`, `25-me`, `15-progress`, `13-guided-session`, `12-today`

### 17 · Exercise library

- **Rendu** : `design/screens-png/17-exercise-library.png` · **HTML** : `design/screens-html/17-exercise-library.html`
- **Route proposée** : `app/library/index.tsx` · **Phase** : MVP
- **Rôle** : Bibliothèque des 35 mouvements : recherche, filtres par famille, move of the week, grille.
- **Mène vers** : `18-exercise-detail`, `16-programme`

### 18 · Exercise detail

- **Rendu** : `design/screens-png/18-exercise-detail.png` · **HTML** : `design/screens-html/18-exercise-detail.html`
- **Route proposée** : `app/library/[exerciseId].tsx` · **Phase** : MVP
- **Rôle** : Fiche exercice : démo vidéo, étapes, erreur fréquente, versions maison/salle, historique des charges, cue du coach.
- **Mène vers** : `17-exercise-library`

### 19 · Evening wind-down

- **Rendu** : `design/screens-png/19-evening-wind-down.png` · **HTML** : `design/screens-html/19-evening-wind-down.html`
- **Route proposée** : `app/routine/evening.tsx` · **Phase** : V1
- **Rôle** : Routine du soir guidée (écran sombre) : 7 postures, minuteur circulaire, lecture/pause.
- **Mène vers** : `12-today`

### 20 · Cycle

- **Rendu** : `design/screens-png/20-cycle.png` · **HTML** : `design/screens-html/20-cycle.html`
- **Route proposée** : `app/cycle.tsx` · **Phase** : V1
- **Rôle** : Phase du jour, frise 28 jours, ajustements de la semaine, ressentis, « mes règles ont commencé », profil personnel, mode contraception.
- **Mène vers** : `28-data-privacy`, `12-today`

### 21 · Sunday check-in

- **Rendu** : `design/screens-png/21-sunday-check-in.png` · **HTML** : `design/screens-html/21-sunday-check-in.html`
- **Route proposée** : `app/check-in.tsx` · **Phase** : MVP
- **Rôle** : Bilan du dimanche (2 min) : séances de la semaine, énergie/sommeil/humeur vs semaine précédente, 3 lignes de réflexion.
- **Mène vers** : `12-today`

### 22 · Block review

- **Rendu** : `design/screens-png/22-block-review.png` · **HTML** : `design/screens-html/22-block-review.html`
- **Route proposée** : `app/review/[block].tsx` · **Phase** : MVP
- **Rôle** : Bilan de bloc (J30/J60/J90…) : photos côte à côte, 5 tests avec écart, réponses, lancement du bloc suivant.
- **Mène vers** : `16-programme`, `15-progress`

### 23 · My week is complicated

- **Rendu** : `design/screens-png/23-my-week-is-complicated.png` · **HTML** : `design/screens-html/23-my-week-is-complicated.html`
- **Route proposée** : `app/life-happens.tsx` · **Phase** : MVP
- **Rôle** : Les 7 cas de la p. 55 (voyage, malade, règles, 20 min, salle bondée, sans matériel, arrêt long) → séance adaptée en un tap.
- **Mène vers** : `16-programme`, `13-guided-session`

### 24 · Share my glow card

- **Rendu** : `design/screens-png/24-share-my-glow-card.png` · **HTML** : `design/screens-html/24-share-my-glow-card.html`
- **Route proposée** : `app/share.tsx` · **Phase** : V1
- **Rôle** : Carte story 9:16 (semaine / séance / saison / ma photo), partage TikTok / Instagram / enregistrer. Jamais de chiffres corporels.
- **Mène vers** : `15-progress`

### 25 · Me

- **Rendu** : `design/screens-png/25-me.png` · **HTML** : `design/screens-html/25-me.html`
- **Route proposée** : `app/(tabs)/me.tsx` · **Phase** : MVP (V1 : badges)
- **Rôle** : Profil : photo plein cadre, saison, stats, my why, objectifs en jauges, badges, raccourcis, abonnement.
- **Mène vers** : `29-my-circle`, `20-cycle`, `09-onboarding-7-7-contract`, `16-programme`, `15-progress`, `22-block-review`, `26-settings`, `27-subscription`, `12-today`

### 26 · Settings

- **Rendu** : `design/screens-png/26-settings.png` · **HTML** : `design/screens-html/26-settings.html`
- **Route proposée** : `app/settings/index.tsx` · **Phase** : MVP
- **Rôle** : Profil, abonnement, entraînement (lieu, équipement, jours, unités lb/kg), corps, rappels, apps connectées, compte.
- **Mène vers** : `01-splash`, `25-me`, `05-onboarding-3-7-health-check`, `08-onboarding-6-7-your-dates`, `28-data-privacy`, `27-subscription`

### 27 · Subscription

- **Rendu** : `design/screens-png/27-subscription.png` · **HTML** : `design/screens-html/27-subscription.html`
- **Route proposée** : `app/settings/subscription.tsx` · **Phase** : MVP
- **Rôle** : Plan actif, frise de l'essai, inclus, choix annuel/mensuel, code acheteuse du guide, gérer dans l'App Store.
- **Mène vers** : `11-paywall`, `28-data-privacy`, `26-settings`

### 28 · Data & privacy

- **Rendu** : `design/screens-png/28-data-privacy.png` · **HTML** : `design/screens-html/28-data-privacy.html`
- **Route proposée** : `app/settings/privacy.tsx` · **Phase** : MVP
- **Rôle** : Où vivent les données (téléphone / compte chiffré / jamais partagé), permissions, export, effacement, suppression du compte.
- **Mène vers** : `26-settings`

### 29 · My circle

- **Rendu** : `design/screens-png/29-my-circle.png` · **HTML** : `design/screens-html/29-my-circle.html`
- **Route proposée** : `app/circle.tsx` · **Phase** : V2
- **Rôle** : Cercle privé de 8 femmes : avatars du jour, jauge collective, fil (séance faite, invitation, badge), parrainage.
- **Mène vers** : `25-me`

### 99 · Style guide v2

- **Rendu** : `design/screens-png/99-style-guide-v2.png` · **HTML** : `design/screens-html/99-style-guide-v2.html`
- **Route proposée** : `—` · **Phase** : —
- **Rôle** : Planche de la DA : palette, typographie, composants, règles photo / formes / couleur / ton.
- **Mène vers** : —
