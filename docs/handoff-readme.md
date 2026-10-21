# Kit de passation Own → Claude Code

Tout ce qu'il faut pour que Claude Code reprenne le projet sans repartir de zéro.

```
own/
├── CLAUDE.md                  ← brief du projet, lu automatiquement par Claude Code
├── README.md                  ← ce fichier
├── docs/
│   ├── kickoff-prompt.md      ← le premier message à coller dans Claude Code
│   ├── spec-fonctionnelle.md  ← la spec (renommée Own, schémas remis en texte)
│   ├── etude-de-marche.md     ← l'étude de marché US
│   └── Eclat-Movement-Guide.pdf ← le guide source (contenu du programme)
└── design/
    ├── screens.md             ← inventaire des 30 écrans : rôle, route, phase, liens
    ├── tokens.ts / tokens.json← couleurs, typo, rayons, espacements de la DA
    ├── overview/              ← 5 planches (une par parcours)
    ├── screens-png/           ← chaque écran en image
    ├── screens-html/          ← chaque écran en HTML autonome (s'ouvre dans un navigateur)
    ├── photos/                ← les photos utilisées (références sans droits, voir README)
    └── fonts/                 ← Instrument Sans
```

## Démarrer

**Sur ton Mac (recommandé)** — c'est là que Claude Code pourra lancer le simulateur iOS et vérifier ses écrans :

1. Dézippe le dossier là où tu ranges tes projets, par exemple `~/Projects/own`.
2. Dans ce dossier : `git init && git add . && git commit -m "Handoff kit"` pour avoir un point de départ propre.
3. Ouvre ce dossier dans Claude Code (terminal ou app desktop).
4. Colle le contenu de `docs/kickoff-prompt.md` comme premier message.

**Alternative** : pousse le dossier dans un dépôt GitHub privé et ouvre-le depuis Claude Code sur le web. Pratique pour travailler depuis n'importe où, mais sans simulateur iOS.

## À prévoir côté comptes et outils

- Mac avec Xcode (simulateur iOS), Node.js LTS.
- Compte Expo (gratuit) pour les builds.
- Apple Developer Program (99 $/an) au moment de tester sur iPhone via TestFlight et de publier.
- Compte RevenueCat (gratuit au démarrage) pour l'abonnement.

## Garder le design et le code alignés

Le canvas Claude Design reste la référence visuelle. Si tu modifies un écran dans le canvas, redemande un export des écrans concernés et remplace les fichiers dans `design/`, puis dis à Claude Code ce qui a changé.
