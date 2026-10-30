# Own — app mobile de fitness féminin (marché US)

Ce fichier est le brief du projet pour Claude Code. Lis-le en entier au début de chaque session ; les détails sont dans les fichiers qu'il référence.

## Le produit en 5 lignes

- **Own** est une app iOS (puis Android) de musculation et de bien-être pour femmes, pensée pour le marché **US**. Distribution organique via **TikTok US**.
- Elle transforme un guide PDF de 90 jours (`docs/Eclat-Movement-Guide.pdf`) en coach vivant : elle prépare la séance du jour, enregistre ce qui a été fait, **ajuste la suivante (règle du +1, deloads)** et mesure les progrès autrement qu'avec la balance.
- Pas de challenge à durée fixe : des **saisons de 12 semaines** (3 blocs de 4 semaines) qui s'enchaînent.
- Ton : « une amie qui sait ». Zéro culpabilité, jamais d'avant/après public, on ne dit jamais « j'annule », on dit « je réduis ».
- Modèle : paywall dur après l'onboarding, essai 7 jours, **$59.99/an** (mis en avant) ou **$14.99/mois**.

Porteurs : Louison (CTO, dev web Next.js/TypeScript) et Virgile.

## Sources, par ordre d'autorité

| Sujet | Source de vérité |
| --- | --- |
| Interface, mise en page, couleurs, textes de l'app | `design/` (écrans PNG + HTML, `design/tokens.ts`, `design/screens.md`) |
| Règles métier, fonctionnalités, priorisation MVP/V1/V2 | `docs/spec-fonctionnelle.md` |
| Contenu du programme (séances, 35 exercices, tests, règles de progression, routines) | `docs/Eclat-Movement-Guide.pdf` (en anglais, citer les pages) |
| Contexte marché, prix, risques juridiques (données de santé) | `docs/etude-de-marche.md` |

Si la spec et le design se contredisent sur l'UI, le design gagne (il est plus récent). Si la spec et le PDF se contredisent sur une règle d'entraînement, demande.

## Langue

- Code, noms de fichiers, commits, commentaires : **anglais**.
- Textes de l'app : **anglais US** (reprendre ceux des maquettes mot pour mot).
- Échanges avec Louison : **français**.

## Stack proposée (à confirmer en première session)

Choix pragmatique pour un développeur React/TypeScript qui veut iOS d'abord sans réécrire pour Android :

- **Expo** (dernière version stable du SDK) + **TypeScript strict** + **Expo Router** (navigation par fichiers ; routes proposées dans `design/screens.md`). Development build (pas Expo Go) dès qu'on touche à HealthKit ou aux achats.
- UI : `StyleSheet` + `design/tokens.ts`, composants maison. Pas de kit UI tiers. `expo-image` pour les photos, `expo-linear-gradient` pour les en-têtes photo, `react-native-svg` pour les icônes et anneaux, `@expo-google-fonts/instrument-sans` pour la police.
- Données : **100 % locales** (décision de Louison, session 5) : SQLite (`expo-sqlite`) + Drizzle ORM, rien n'est synchronisé. Pas de compte, pas de backend pour les données de l'utilisatrice.
- Abonnements : **RevenueCat** (StoreKit 2 / Google Play Billing). Il ne reçoit que l'identifiant anonyme d'achat, jamais de donnée de santé ou d'entraînement.
- Rappels : `expo-notifications` en notifications **locales** planifiées.
- Santé : HealthKit en lecture seule (pas, sommeil, cycle) — phase V1.

Questionne ces choix si tu vois mieux, mais justifie par rapport aux contraintes ci-dessous.

## Règles non négociables

1. **Rien ne quitte le téléphone** (décision de Louison, session 5). Toutes les données de l'utilisatrice (séances, charges, bilan santé, cycle, marqueurs, photos, mensurations) sont stockées uniquement sur l'appareil. **Aucun SDK d'analytics, de crash reporting tiers, d'attribution ou de publicité** (pas de TikTok/Meta SDK, pas de Firebase Analytics, pas de Sentry). Seules exceptions réseau : l'achat via StoreKit/RevenueCat. Objectif App Store : étiquette de confidentialité « Data Not Collected ». Contexte : section « Risques réglementaires » de l'étude de marché (FTC Health Breach Notification Rule, affaire Flo/Meta) et App Store Review Guidelines 5.1.1 et 5.1.3 (données santé/HealthKit : pas de pub, pas de stockage iCloud, politique de confidentialité obligatoire).
2. **Photos de progression** : stockées uniquement sur le téléphone, coffre verrouillé (Face ID), jamais uploadées. L'écran 28 (Data & privacy) le promet : l'implémentation doit tenir chaque promesse de cet écran.
3. **Pas d'allégation médicale** : on parle de suivi et d'éducation, jamais de diagnostic ni de traitement. Les règles du bilan santé recommandent de consulter, elles ne diagnostiquent pas.
4. **Hors ligne** : séance guidée, saisie et minuteurs fonctionnent sans réseau.
5. **Unités** : impérial par défaut (lb, ft/in), métrique en option dans Settings. Toutes les charges sont stockées en kg en base et converties à l'affichage. Le PDF est en kg et certaines maquettes d'onboarding aussi : convertir.
6. Le poids corporel est **opt-in**, caché par défaut ; on ne l'affiche jamais en grand.

## Direction artistique (résumé — détails dans `design/tokens.ts`)

- Fond **blanc**, la **photo** porte l'émotion, le **noir** porte l'action (CTA, pilules actives, switches). Rien d'autre n'est noir.
- Une seule typo : **Instrument Sans** 400/500/600/700. Titres en 700 serrés (letter-spacing −0.04 à −0.065 em). **Jamais d'italique.**
- Dans chaque titre, **un seul mot clé** en cocoa `#8A6E5A` (« Today's **rituals** », « Your **glow** »). Sur une photo : `#E6D9CB`. Sur fond sombre : `#C9A98F`.
- Tons café-crème (vanilla, latte, mauve, fog, mocha) pour classer, numéroter et remplir les jauges ; chaque ton a sa couleur de texte foncée (contraste AA vérifié). Jamais un ton sur un bouton.
- Logo : « own. » en minuscules, 700.
- Pas d'emoji dans l'interface ; icônes SVG au trait 1.6–1.8.

### Composants récurrents (à construire une fois, réutiliser partout)

| Composant | Où le voir |
| --- | --- |
| `PhotoHeader` : photo pleine largeur, coins bas arrondis 34, filet blanc intérieur (inset 12, radius 28), dégradé sombre en bas, barre du haut (logo / boutons ronds blancs), titre blanc en bas avec mot clé | 12 Today, 14, 16, 20, 21, 25, 27 |
| `Pill` (blanche sur photo, noire si active, point cocoa optionnel) | partout |
| `ToneCard` : fond ton + carré d'icône blanc 38 + eyebrow + titre + texte | 12 (+1), 18, 20, 22, 23 |
| `Gauge` : carte blanche 64 px dont le fond se remplit du ton à hauteur du %, liseré cocoa 2 px au bord du remplissage, repère pointillé optionnel (valeur de départ), % ou coche noire à droite | 12 rituels, 15 marqueurs, 21, 22 tests, 25 objectifs |
| `StatTiles` : 3 tuiles tons, grand chiffre + libellé | 14, 15, 22, 25 |
| `QuoteCard` : carte mocha, grands guillemets cocoa, citation en 700 | 12, 18, 23, 25 |
| `PhotoTile` : photo arrondie 22 + pilule blanche en bas à gauche | 12, 17, 25 |
| `IconTile` (34/38, radius 11/12) + lignes de liste groupées sur fond mist | 26, 28 |
| `CTA` : pilule noire 56 px, libellé à gauche, rond blanc avec flèche à droite | 02, 21, 22 |
| `CircleButton` 44 (retour, fermer, réglages) | partout |
| `TabBar` 84 px, 4 onglets : Today, Programme, Progress, Me | 12, 15, 16, 25 |
| `SegmentedControl`, `Switch` 46×28, `DayPills` | 13, 26 |

## Périmètre et ordre de construction

La priorisation produit est dans la spec (section « Priorisation ») : **MVP** = ce qui remplace le PDF (onboarding, séance guidée, saisie, +1/deloads, maison/salle, calendrier et rappels, bilans et tests, coffre photos, code acheteuses du PDF, hors ligne). **V1** = cycle, routines matin/soir, Apple Santé, cartes glow, widgets. **V2** = cercles privés, IA, Apple Watch.

Ordre proposé pour le code (chaque jalon doit être testable sur simulateur avant de passer au suivant) :

0. **Fondations** : projet Expo, tokens, police, composants ci-dessus, écran `/dev/kitchen-sink` qui les montre tous. Comparer visuellement avec les PNG.
1. **Écrans statiques** : les écrans MVP avec données fictives, navigation complète selon `design/screens.md`.
2. **Modèle de données + contenu** : saison → blocs → semaines → séances → exercices (versions maison/salle/douce), tests, marqueurs. Extraire le programme du PDF en données typées (seed JSON) en citant les pages.
3. **Moteur de séance** : saisie par série, minuteur de repos, règle du +1, deloads S4/S8, semaine 12, semaine manquée, « My week is complicated » (tableau de la spec « Le moteur de progression »). Tests unitaires sur chaque règle.
4. **Onboarding persistant + paywall** (RevenueCat en sandbox).
5. **Rappels locaux, check-in du dimanche, bilans de bloc, coffre photos.**
6. Puis V1.

## Façon de travailler attendue

- Avant un jalon : un court plan (fichiers créés, choix faits, questions). Avant de coder une règle métier ambiguë : demander.
- Petits commits lisibles, un par sous-étape.
- Vérifier visuellement : lancer le simulateur iOS, faire une capture, la comparer au PNG de référence, corriger les écarts de tailles et d'espacements.
- TypeScript strict, pas de `any`. Tests unitaires (Jest) pour le moteur de progression et les conversions d'unités.
- Ne jamais committer de clés (RevenueCat) : `.env` + `app.config.ts`.

## Points connus à traiter

- Les **photos** de `design/photos/` sont des références d'ambiance (type Pinterest), **sans droits** : utilisables en développement, à remplacer par des shootings ou des images sous licence avant toute publication.
- Les dates, prénoms et chiffres des maquettes sont fictifs et parfois incohérents entre écrans : ne pas les reprendre comme logique.
- Écrans 01–11 : alignés sur l'ancienne mise en page ; les reconstruire avec les composants de la DA finale.
- Vidéos d'exercices : environ 80 à tourner (35 mouvements × maison/salle + versions douces). Prévoir un composant vidéo avec image de remplacement en attendant.
- Questions produit encore ouvertes (cible exacte, identité de la coach, validation médicale des règles automatiques, version française) : voir la fin de la spec. Ne pas trancher à la place de Louison.

## Notes de mise en place (session 1)

- Projet créé avec `create-expo-app` (SDK 58). `AGENTS.md` contient les consignes génériques d'Expo : toujours `npx expo install`, docs versionnées, pas de dossiers `ios/` `android/` à la main.
- Les routes vivent dans `src/app/`, le code partagé dans `src/components`, `src/theme`, `src/content`. Alias `@/` → `src/`.
- `src/theme/tokens.ts` est une copie de `design/tokens.ts` : garder les deux synchronisés.
- `expo-image` : `contentPosition` n'accepte pas `"center 35%"` ; écrire `{ top: '35%', left: '50%' }`.
- La barre d'onglets est un composant maison (`TabBar`) branché sur `Tabs` d'`expo-router`.
- Vérification visuelle possible sans simulateur : `npx expo export --platform web` puis capture Playwright à 390 px de large.
- Aperçu pour Louison : `npm run preview` construit `preview/` (export web adapté pour tourner sous un sous-chemin), puis publication en artifact privé avec `preview/index.html` + la liste `preview-files.json` (root `preview/`). URL actuelle : https://claude.ai/artifact/VErzAtq3JyZZtR6uKeC6g6 (republier au même fichier pour garder le lien).
- Onboarding (session 2) : réponses en mémoire dans `OnboardingContext` (pas encore persistées, jalon 4). Le récap « Your season is ready » est calculé depuis les réponses. Le design n'a pas d'étape « Mon pourquoi » (présente dans la spec) : question ouverte.
- Séance guidée (session 3) : `src/content/sessionA.ts` recopie la séance A du PDF (p. 27) en attendant le seed complet du jalon 2. « Planche » du PDF est traduit « Plank ». `features/session/runner.ts` = machine d'état minimale (séries, repos, fin) ; charges, RPE et +1 arrivent au jalon 3.
- Les écrans pas encore construits existent en `Placeholder` (avec bouton retour) pour qu'aucun lien ne mène à une 404.
- Bibliothèque (session 4) : `src/content/exercises.ts` contient les 35 fiches du PDF (pp. 41–47 : départ, mouvement, erreur fréquente), extraites automatiquement puis vérifiées. Les familles du PDF sont 5 (lower, upper, core, circuit, prevention), la maquette en annonçait 4 : le PDF fait foi. Photos provisoires dans `content/exerciseMedia.ts`.
- Aperçu : sur ordinateur, cadre iPhone 15 (390 × 844) avec encoche et zones sûres simulées (`src/lib/PreviewInsets.tsx`, sans effet sur iOS/Android).
- Tranché (session 5) : tout reste sur le téléphone, y compris le bilan santé ; pas de statistiques d'usage. L'écran 28 a été réécrit en conséquence (plus de compte, plus d'interrupteur « Anonymous usage stats » ni « Personalised offers », « Delete my account » devient « Erase all my data »), et Settings n'affiche plus d'e-mail ni de « Log out ».
- Sauvegarde iOS (session 5) : on laisse la base dans la sauvegarde iCloud/ordinateur de l'appareil (sauvegarde de l'utilisatrice, pas un envoi de notre part), sinon un changement de téléphone efface tout. Pas de CloudKit ni de stockage iCloud piloté par l'app.
- Conséquences à garder en tête : sans serveur, un téléphone perdu = données perdues (seule la sauvegarde iOS de l'utilisatrice les protège) ; les cercles privés (V2, écran 29) et la mesure des campagnes TikTok (pas de SDK d'attribution, seulement les chiffres agrégés d'App Store Connect) devront être repensés.
- Jalon 2 (session 6) : programme complet dans `src/domain/programme/` (3 blocs, 9 séances, règles par semaine, échauffement, marqueurs, tests, +1, semaines manquées, « My week is complicated »), chaque élément avec sa page. Points interprétés et questions ouvertes : `docs/programme-notes.md`. Base locale : `src/db/` (schéma Drizzle, migrations `drizzle/`, fonctions d'accès testées sur better-sqlite3). La base n'est pas encore ouverte au démarrage de l'app : ce sera le jalon 3 (attention, expo-sqlite sur le web demande des en-têtes spéciaux, à vérifier pour l'aperçu).
- Tests : `npm test` (Jest, preset jest-expo). Importer `describe/expect/it` depuis `@jest/globals`.
- Jalon 3 (session 7) : moteur dans `src/domain/engine/` (+1, ajustements, position dans la saison), choix documentés dans `docs/programme-notes.md`. La base est ouverte au démarrage (`DbProvider`) : expo-sqlite sur téléphone, sql.js (WebAssembly, sauvegardé en localStorage) dans l'aperçu web (`src/db/client.web.ts`). Migrations : runner maison `src/db/migrate.ts` partagé par les deux. Chaque série est enregistrée ; la semaine courante se calcule à partir des séances faites (`features/season/currentWeek.ts`). La saison 1 démarre à la première série enregistrée (lundi de la semaine) en attendant l'onboarding persistant.
- Aperçu : Settings → « Preview tools » (web uniquement) pour simuler une semaine et effacer les données de test.
- Session 8 (limites du jalon 3) : supersets (deux saisies) et circuits (reps par station, historique séparé) ; check-in du dimanche enregistré ; deload anticipé proposé sur Today (2 signes de surentraînement ou stagnation, `features/season/fatigue.ts`). L'onboarding est enregistré à la signature du contrat (`features/onboarding/record.ts`, champ prénom ajouté au contrat, absent de la maquette) ; refaire l'onboarding remplace une saison jamais entraînée. Profil lu via `features/profile/useProfile.ts` : prénom, semaine type, lieu, unités, why, rituels (eau, protéines, matin, soir ; les pas attendent Apple Santé), cycle (écran 20 minimal : règles, phase, conseil, contraception ; ressentis et « pattern » en V1), marqueurs (jour 0 + dernier check-in). Settings persiste lieu, équipement, jours, unités, cycle, versions douces, veille ; les autres rappels restent locaux à l'écran jusqu'au jalon 5. Restent fictifs : dates d'essai/abonnement (RevenueCat, jalon 4), badges (V1), valeurs du bilan de bloc (jalon 5).
- Session 9 (jalons 4 et 5, partie « restes ») : rappels locaux (`features/reminders/` : plan pur testé, `expo-notifications` en hebdomadaire, permission demandée à la signature du contrat ou en activant un rappel ; heure de séance réglable dans l'onboarding et Settings) ; tests du guide (`app/tests/[checkpoint].tsx`, hauteur des pompes notée) et bilan de bloc réel (`features/review/`, mots stockés dans `block_reviews`) ; badges « promesses tenues » (`domain/badges.ts`, jamais perdus) ; cycle : ressentis du jour (`cycle_feelings`), ajustements de la semaine par phase, courbe d'énergie personnelle après 2 cycles. Abonnement : RevenueCat (`features/subscription/`), clés dans `.env` (voir `.env.example`) lues par `app.config.ts`, entitlement `own`, offre courante avec paquets annuel et mensuel ; sans clé, l'app reste ouverte (build de dev) ; l'aperçu web simule l'essai (localStorage). Paywall dur : splash et onglets renvoient au paywall sans plan actif ; la croix du paywall revient en arrière au lieu d'ouvrir l'app. Codes acheteuses du PDF = offer codes App Store (feuille Apple, pas de serveur). Migration 0003.
- Session 10 (fin du jalon 5) : coffre photos (`features/vault/`, routes `app/vault/`) : face/profil/dos au jour 0 (onboarding, écran 07 → `(onboarding)/photos`) et à chaque bilan, silhouette fantôme de la photo précédente, fichiers dans `Paths.document/vault` (jamais la pellicule, jamais envoyés ; suivent la sauvegarde de l'appareil comme la base), Face ID ou code via `expo-local-authentication`, re-verrouillage dès que l'app passe en arrière-plan ; Progress, Me et le bilan n'affichent ses photos qu'une fois déverrouillé ; « Erase all my data » supprime les fichiers. Aperçu web : caméra du navigateur, photo gardée en data URI dans la base de l'aperçu. Calendrier (`features/calendar/`) : calendrier séparé « Own », séries hebdomadaires sur les 12 semaines, titres neutres ; permission demandée à l'entrée dans l'app si choisi à l'onboarding, interrupteur dans Settings. Légal : `src/content/legal.ts` (brouillon, `ENTITY` à compléter, à faire relire) → pages in-app `app/legal/[doc]` + `npm run legal` génère `legal/terms.html` et `legal/privacy.html` à héberger (URL à renseigner dans App Store Connect). « Export my data » réel (fichier JSON via la feuille de partage).
- Session 11 (petits trous) : « 10-min version » = bare minimum du guide p. 53 (variante `tenMin`, compte comme la séance du jour, rien pour le +1) ; « My contract » réaffiche le contrat signé (`ContractPaper` partagé, signature stockée en tracés SVG dans `profile.contract_signature`) ; « Send my start date to a friend » = feuille de partage (date seule) ; fiche exercice : favoris (`profile.saved_exercises`, filtre « Saved » dans la bibliothèque), dernières charges, variantes = toutes les apparitions dans le programme (`exerciseAppearances`) ; vidéos : registre `exerciseVideo` dans `content/exerciseMedia.ts` (vide, `require` des mp4 au fil du tournage) + `features/library/DemoVideo` (expo-video, embarquées pour le hors-ligne), aucun bouton mort tant qu'une vidéo manque. Onboarding réaligné sur la DA finale (CTA, cartes tons, lignes groupées, jauges). « Mon pourquoi » : tranché au plus léger, une phrase facultative sur l'étape 1 (Feel) avec le test du mardi (p. 9), sans changer le compteur 7 étapes ; à revoir si Louison veut l'exercice complet des trois cercles. Migration 0004.
- Session 12 (development build) : `expo-dev-client`, `eas.json` (development / development-simulator / preview / production, `appVersionSource: remote`), scripts `start:dev` et `build:ios:dev`. `app.json` : chiffrement non soumis à l'export, manifeste de confidentialité, push désactivé (`enableRemoteNotifications: false`, rappels locaux seulement), pas de permission Rappels iOS, plugin expo-video, icône et splash provisoires « own. ». Vérifié ici : `expo prebuild` iOS et bundle iOS. Le build lui-même n'a pas pu partir de ce conteneur : les hôtes Expo (expo.dev, api.expo.dev, exp.host) sont bloqués par la politique réseau et il n'y a ni jeton Expo ni compte Apple. Pas à pas pour Louison : `docs/build-ios.md`. À faire au premier build : `eas init` puis `extra.eas.projectId` dans `app.json` ; vérifier que `com.own.app` est libre chez Apple.
