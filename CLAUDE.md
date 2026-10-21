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
- Données : **local-first** (la séance ne doit jamais dépendre du réseau : salles en sous-sol). SQLite (`expo-sqlite`) + Drizzle ORM. Synchronisation compte plus tard.
- Backend (quand nécessaire : compte, sauvegarde, cercles en V2) : Supabase (auth, Postgres). Données de cycle et de santé chiffrées.
- Abonnements : **RevenueCat** (StoreKit 2 / Google Play Billing).
- Rappels : `expo-notifications` en notifications **locales** planifiées.
- Santé : HealthKit en lecture seule (pas, sommeil, cycle) — phase V1.

Questionne ces choix si tu vois mieux, mais justifie par rapport aux contraintes ci-dessous.

## Règles non négociables

1. **Données de santé** (cycle, symptômes, bilan santé, photos) : jamais envoyées à un SDK publicitaire ou d'analytics (TikTok, Meta, etc.). Les SDK d'attribution ne reçoivent que des événements neutres : installation, début d'essai, achat. Voir la section « Risques réglementaires » de l'étude de marché (FTC Health Breach Notification Rule, affaire Flo/Meta).
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
- Ne jamais committer de clés (RevenueCat, Supabase) : `.env` + `app.config.ts`.

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
