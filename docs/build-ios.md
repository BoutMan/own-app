# Installer Own sur un iPhone (development build)

Le projet est prêt pour EAS Build (le service de build d'Expo, dans le cloud : pas besoin de Mac ni de Xcode). Ce qui suit se lance depuis ton ordinateur, dans le dossier du projet.

## Ce qu'il faut avant

| Quoi | Pourquoi | Coût |
| --- | --- | --- |
| Compte Expo (expo.dev) | EAS Build | gratuit (quelques builds iOS par mois inclus) |
| Apple Developer Program, au nom de la société de préférence | installer sur un vrai iPhone, puis publier | 99 $ / an |
| iPhone sous iOS 16 ou plus, avec le **mode développeur** | lancer une app qui ne vient pas de l'App Store | — |
| Node 20+ sur l'ordinateur | lancer `eas` et le serveur de développement | — |

Identifiant de l'app : `com.own.app` dans `app.json`. S'il est déjà pris chez Apple (probable, il est court), le remplacer par un identifiant à vous, par exemple `com.<societe>.own`, **avant le premier build** : il ne se change plus une fois l'app créée dans App Store Connect.

## Premier build (20 minutes, dont 10 à 15 d'attente)

```bash
npm install
npm install -g eas-cli
eas login                      # compte Expo
eas init                       # crée le projet Expo
```

`eas init` affiche un `projectId` : l'ajouter dans `app.json`, sous `expo.extra.eas.projectId` (la config est dynamique, `eas` ne peut pas l'écrire lui-même).

```bash
eas device:create              # enregistre l'iPhone
```

Ouvrir le lien (ou le QR code) **sur l'iPhone**, installer le profil, puis revenir au terminal.

```bash
npm run build:ios:dev          # = eas build --profile development --platform ios
```

Au premier lancement, `eas` demande de se connecter au compte Apple Developer et propose de créer le certificat et le profil de provisioning : répondre oui partout, il les garde pour les fois suivantes.

À la fin, la page du build affiche un QR code : le scanner avec l'iPhone et installer.

Sur l'iPhone : Réglages → Confidentialité et sécurité → **Mode développeur** → activer, redémarrer.

## Tous les jours

```bash
npm run start:dev              # = expo start --dev-client
```

L'ordinateur et l'iPhone sur le même Wi-Fi : ouvrir Own sur l'iPhone, il trouve le serveur, ou scanner le QR code du terminal. Chaque modification du code s'affiche sur le téléphone en direct.

Il ne faut refaire un build que si on ajoute ou met à jour un module natif (un `npx expo install` d'un paquet `expo-…` ou `react-native-…`), ou si on change `app.json`. Ajouter un iPhone : `eas device:create`, puis rebuild.

## RevenueCat (quand le compte est prêt)

Les clés ne sont pas dans le dépôt. En local : `.env` (voir `.env.example`). Pour les builds EAS :

```bash
eas env:create --environment development --name REVENUECAT_IOS_KEY --value appl_xxx --visibility sensitive
```

Sans clé, l'app reste ouverte et rien n'est vendu : c'est voulu pour tester le reste.

## Faire tester Virgile ou d'autres

Le build `development` a besoin d'un ordinateur qui fait tourner le serveur. Pour un iPhone qui teste seul, utiliser le profil `preview` (le code est embarqué dans l'app, pas de serveur) : enregistrer son iPhone avec `eas device:create`, puis `eas build --profile preview --platform ios`. Plus tard, TestFlight remplacera tout ça (`--profile production` puis `eas submit`).

## Ce qu'on vérifie sur le téléphone (rien de tout ça ne tourne dans l'aperçu web)

- [ ] Base SQLite native : faire une séance, tuer l'app, rouvrir : tout est là.
- [ ] Mode avion : séance guidée, saisie, minuteurs.
- [ ] Notifications : autorisation au contrat, rappel 30 min avant (mettre une séance dans 35 min pour tester).
- [ ] Calendrier : le calendrier « Own » apparaît avec les séances.
- [ ] Coffre : Face ID, caméra avec silhouette fantôme, rien dans la pellicule, reverrouillage en quittant l'app.
- [ ] Partage : export JSON, date de départ.
- [ ] RevenueCat en sandbox (une fois les clés et les produits configurés) : essai, restauration, fin d'essai.
- [ ] Écrans comparés aux maquettes PNG (tailles, marges, zones sûres, encoche).

## Ce qui est configuré dans le dépôt

- `eas.json` : profils `development` (dev client, iPhone), `development-simulator`, `preview`, `production`.
- `app.json` :
  - `ITSAppUsesNonExemptEncryption = false` (pas de questionnaire export à chaque build) ;
  - manifeste de confidentialité (`privacyManifests`) : aucun suivi, aucune donnée collectée ;
  - permissions limitées à caméra, Face ID et calendrier (pas de micro, pas de rappels iOS) ;
  - pas de droit aux notifications push : tous les rappels sont locaux ;
  - icône et écran de lancement provisoires « own. ».
- Vérifié sans Mac : `expo prebuild` iOS (Info.plist, droits, manifeste) et bundle JavaScript iOS (aucun code web, aucun SDK de suivi).
