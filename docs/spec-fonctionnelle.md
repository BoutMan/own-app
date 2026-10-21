# Own — spec fonctionnelle de l'app

> **Note de passation (oct. 2026)** : l'app s'appelait « Éclat » au moment de la rédaction ; elle s'appelle désormais **Own**. Le guide PDF source (`docs/Eclat-Movement-Guide.pdf`) garde son nom d'origine. Pour l'interface, la référence est le dossier `design/` (plus récent que cette spec) ; pour les règles métier, c'est cette spec et le PDF.


Oct 19, 2026 · @Louison

L'app Own est le guide rendu vivant : un coach qui prépare la séance du jour, enregistre ce qui a été fait, ajuste la suivante avec la règle du +1 et mesure les progrès autrement qu'avec la balance. Le challenge de 90 jours devient une « saison » de 12 semaines qui s'enchaîne sur la suivante, sans date de fin.

## Le principe : des saisons, pas un challenge

On garde la structure qui fait la force du guide (3 blocs de 4 semaines, deloads S4 et S8, tests S12) mais on supprime la ligne d'arrivée : à la fin d'une saison, la suivante démarre avec les nouvelles charges comme point de départ. C'est déjà ce que recommande la page 38 du guide (« refaire les 12 semaines avec les charges atteintes »).

| Dans le PDF | Dans l'app |
| --- | --- |
| 90 jours, un début et une fin | Saisons de 12 semaines enchaînées ; la saison 2 reprend au bloc 1 avec les charges de la saison 1, ou propose des blocs spécialisés (fessiers, haut du corps, course) |
| Bilans J30 / J60 / J90 | Bilan à chaque fin de bloc (toutes les 4 semaines), pour toujours |
| Grille de 90 cases à cocher | Calendrier continu ; le succès se lit sur 12 semaines glissantes (objectif : 30 séances de force sur 36, soit 83 %) |
| « Day 90 » comme apothéose | Fin de saison célébrée (comparatif tests et photos), puis choix guidé de la saison suivante |
| Contrat signé une fois | Contrat signé à l'onboarding, relu et renouvelé à chaque saison |

Conséquence produit : l'abonnement a une raison d'exister au-delà de 3 mois, ce qu'un challenge à durée fixe ne donne pas.

## La boucle de l'app

**Boucle hebdomadaire (5 étapes)** — l'app ajuste la séance suivante à partir de ce qui a été fait :

1. **Planifier** : 4 rendez-vous au calendrier
2. **S'entraîner** : séance guidée, maison/salle
3. **Noter** : charge, reps, RPE par série
4. **Ajuster** : règle du +1 et deloads *(l'étape clé)*
5. **Faire le bilan** : chaque semaine, chaque bloc → retour à « Planifier » la semaine suivante

Ce qui module l'étape « Ajuster » : cycle, fatigue, absences, douleur, maladie.

Toutes les fonctionnalités ci-dessous servent cette boucle. L'étape « Ajuster » est celle qu'un PDF ne peut pas faire : c'est elle qui justifie l'abonnement.

## Onboarding : la partie 1 du guide, en 10 minutes

L'onboarding reprend les pages à remplir du guide (p. 6 à 14) dans l'ordre, en écrans courts. Il sert aussi de quiz avant le paywall : à la fin, l'utilisatrice voit son programme personnalisé et son point de départ.

1. **Mon pourquoi (méthode des trois cercles).** Ressentir / Faire / Devenir, puis la phrase qui résume tout. Trois tests optionnels en aide : « mardi 19 h », « personne ne regarde », « cinq pourquoi ». La phrase est réutilisée partout : widget d'écran d'accueil, écran de relance, fin de séance.
2. **Mes trois objectifs CLEAR.** Un objectif performance, un sensation, un libre. L'app vérifie la règle « au moins deux objectifs sans lien avec le poids » et propose des exemples. Chaque objectif a un « où j'en suis » et un « comment je le vérifie », revus à chaque bilan.
3. **Le bilan santé.** Questions de sécurité (grossesse, post-partum, pathologie, reprise après 2 ans), les 3 questions plancher pelvien et le test de diastasis guidé en vidéo. Chaque réponse active des adaptations automatiques : sauts remplacés par leur version au sol, RPE plafonné à 7, gainage remplacé par le dead bug, et une recommandation de consulter.
4. **Mon terrain.** Maison ou salle, équipement disponible (rien, élastique, haltères 4-6 kg, salle complète), modifiable chaque semaine.
5. **Mon point de départ.** Les 7 marqueurs notés de 1 à 10, les 5 tests (pompes, gainage, squats en 60 s, chaise, marche), mensurations et poids optionnels, 3 photos guidées (face, profil, dos) rangées dans un coffre verrouillé jusqu'au premier bilan.
6. **Mes rendez-vous.** Choix des jours et heures des 4 séances, ajout direct au calendrier du téléphone, démarrage le lundi suivant.
7. **Le contrat.** Les 6 engagements du guide, signés au doigt, avec la date de début. Option : envoyer la date à une proche (le dernier conseil de la p. 54).

## La séance guidée : le cœur de l'app

L'écran le plus utilisé doit faire tout ce que le PDF demande de faire à la main : chronométrer, noter, se souvenir de la charge de la semaine passée. L'utilisatrice ne doit prendre aucune décision pendant la séance.

| Fonction | Ce que ça remplace dans le PDF | Détail |
| --- | --- | --- |
| « Aujourd'hui » | Le tableau de la semaine type (p. 24) | La séance du jour (A, B, C ou cardio) s'affiche d'elle-même selon le planning ; un tap pour démarrer |
| Échauffement guidé de 5 min | Page 25 | Vidéo et minuteur enchaînés ; série d'échauffement rappelée sur le premier exercice lourd |
| Mode « rituel » | Le rituel de 5 minutes | Pendant l'échauffement : lancer la playlist, passer le téléphone en Ne pas déranger |
| Bascule maison / salle | Les deux lignes de chaque tableau | Par exercice, pas seulement par séance (salle bondée : on prend la version maison de cette ligne) |
| Saisie par série | Le tableau « Mes charges » | Charge et répétitions pré-remplies avec la dernière séance ; un tap pour valider, puis le RPE ressenti |
| Minuteur de repos automatique | « Chronométrez-le les premières semaines » | Se lance à la validation de la série (90 s, 75 s, 2 min selon l'exercice), vibration à la fin, visible sur l'écran verrouillé |
| Chrono de circuit | Les séances C (40/20, 45/15) | Rounds, travail, transition et repos entre rounds annoncés à la voix |
| Version plus douce en un tap | Colonne « gentler version » | Bouton « je bascule » en cours de round, sans culpabilité |
| Fiche exercice | Bibliothèque des 35 mouvements | Vidéo en boucle, muscles travaillés, placement, erreur fréquente, note du coach |
| Rappel respiration | « Expirez pendant l'effort » | Indice visuel ou audio sur la phase difficile de chaque répétition |
| Séance raccourcie | « J'ai 20 minutes », « 15 minutes » | Bouton qui garde les 3 premiers exercices, ou 2 rounds au lieu de 3 |
| Plan B de 10 minutes | Le « bare minimum » | 3 rounds de 15 squats, 10 pompes, 15 ponts, 30 s de gainage ; compte comme une séance |
| Retour à l'apaisement | 3 min de marche lente, respiration 4-8 | Écran de fin guidé, puis question « ressenti global /10 » |

## Le moteur de progression : la règle du +1 automatisée

C'est la vraie valeur ajoutée par rapport au PDF : l'app applique elle-même les règles de progression des pages 23, 38 et 55, que la plupart des lectrices n'appliqueront jamais seules. Chaque règle ci-dessous est déjà écrite dans le guide ; il suffit de la coder.

| Situation détectée | Règle appliquée par l'app |
| --- | --- |
| Haut de la fourchette atteint sur toutes les séries, proprement | Proposition +1 à 2,5 kg à la séance suivante (ou passage au niveau de pompes suivant) |
| Sinon | Un seul objectif +1 affiché avant chaque exercice, par ordre : une répétition, une charge, une amplitude, un tempo, moins de repos |
| Exercice jugé facile deux séances de suite | Hausse de charge suggérée |
| Semaines 4 et 8 | Deload automatique : 2 séries, charges − 30 %, avec un message qui explique pourquoi ne pas le sauter |
| Semaine 12 | Charges − 20 %, puis tests en fin de semaine |
| 3 séances sans progrès sur un exercice | Check-list sommeil, protéines, repos, charge réelle ; si tout est bon, deload anticipé proposé |
| 2 signes de surentraînement (sommeil dégradé, irritabilité, motivation en chute, perf en baisse 3 séances, FC de repos en hausse) | Deload immédiat proposé |
| Une semaine manquée | Reprise là où elle s'est arrêtée, charges − 10 % à la première séance ; le programme s'allonge d'une semaine, rien n'est « en retard » |
| 2 semaines ou plus d'arrêt | Redémarrage au début du bloc en cours, charges − 20 % la première semaine |
| Malade | Question « au-dessus ou en dessous du cou ? » : séance allégée ou repos, puis reprise à 70 % pendant 2 séances |
| Douleur signalée (vive, articulaire, qui irradie) | Arrêt de l'exercice, remplacement par un mouvement de la même famille, conseil de consulter si ça dure plus d'une semaine |
| Courbatures sur la zone de la prochaine séance | Charge − 20 % plutôt qu'annulation |

Le principe affiché partout est celui de la p. 55 : on ne dit jamais « j'annule », on dit « je réduis ».

## Le cycle comme boussole

Le guide traite le cycle comme une lentille, pas comme une règle : le programme reste fixé sur les semaines, et le cycle sert à moduler. L'app doit garder cette nuance, qui la distingue des apps de « cycle syncing ».

- **Saisie simple** : jour 1 des règles en un tap (ou import depuis Apple Santé / Health Connect). Phase du jour affichée sur l'écran « Aujourd'hui » avec le conseil de la p. 19.
- **Ajustements proposés, jamais imposés** : en phase lutéale, « baisser la charge de 10 à 20 % ne compte pas comme un échec » ; autour de l'ovulation, rappel technique sur squats, fentes et sauts, pas de record improvisé ; pendant les règles douloureuses, séance gardée avec − 20 % et gainage remplacé par une marche, ou jour de repos.
- **Échange de semaines** : si la semaine de tests tombe pendant les règles, l'app propose de l'intervertir avec la suivante.
- **Mon propre profil** : après 2 cycles, graphique énergie / sommeil / humeur / RPE par jour de cycle, pour voir son schéma réel plutôt que le schéma théorique.
- **Mode contraception hormonale** : pas de phases affichées, l'app se cale sur l'énergie du jour.
- **Confidentialité** : données de cycle stockées chiffrées, jamais transmises aux SDK publicitaires (TikTok, Meta), suppression en un tap. C'est le risque juridique n°1 relevé dans l'étude de marché précédente (affaire Flo / Meta).

## Suivi et progrès : mesurer autre chose que la balance

Le tableau de bord met en avant ce que le guide veut faire regarder : les séances faites, les charges, les 7 marqueurs. Le poids existe mais reste caché par défaut.

| Écran | Contenu | Règle issue du guide |
| --- | --- | --- |
| Mes rendez-vous | Calendrier continu, une case par jour, séances de force teintées ; compteur « 27 / 36 séances sur 12 semaines » | Seuil de succès à 30 / 36 ; on vise une saison finie, pas une grille parfaite |
| Mes charges | Courbe par exercice (charge, répétitions, niveau de pompes, temps de gainage et de chaise) | Utilisé contre le « mur de la semaine 3 » : la preuve qu'on a progressé avant que le miroir le montre |
| Mes 7 marqueurs | Énergie au réveil, sommeil, force ressentie, souffle, posture et dos, humeur, confiance : 3 notés chaque semaine, les 7 à chaque bilan | Graphique « radar » jour 0 vs aujourd'hui |
| Mes tests | Les 5 tests refaits en fin de bloc, avec l'écart depuis le départ | Rappel automatique S4, S8, S12 |
| Coffre photos | Photos guidées (silhouette fantôme pour reprendre la même pose, même cadrage), verrouillées jusqu'au premier bilan, comparaison côte à côte | « Vous ne les regarderez pas avant le jour 30 » ; stockées localement ou chiffrées |
| Mensurations | Tour de taille en priorité, hanches et cuisse en option | Taille mesurée au nombril, au réveil, jours 0 / 30 / 60 / 90 puis à chaque bilan |
| Poids (opt-in) | Une pesée par semaine, seule la moyenne mensuelle est affichée | Le chiffre du jour n'est jamais montré en grand |
| Bilans de bloc | Les questions des pages 60 à 62 (ce qui a le plus changé, ce qui a coûté, ce que je change) + objectifs CLEAR revus | Génére une « carte de saison » partageable (voir propositions) |
| Ma semaine | Gagné de la semaine, ce qui a coincé, ce que j'ajuste, notes libres | Rempli le dimanche en 2 minutes, notification dédiée |

## Récupération et habitudes du quotidien

Le guide fait de la récupération un pilier « non négociable » : l'app lui donne un vrai contenu les jours sans séance, ce qui crée une raison d'ouvrir l'app tous les jours.

- **Routine du matin (7 min)** et **routine du soir (10 min)** : versions guidées audio + vidéo, minuteur par position (45 s tenues le soir). Si une seule est gardée, l'app pousse celle du soir, comme le guide.
- **Habitudes du jour**, cochées en un geste depuis un widget : mobilité 7 min, 7 000 pas (lus depuis Apple Santé / Health Connect, moyenne hebdomadaire), sommeil 7 h et plus, eau 1,5 à 2 L, protéines à chaque repas.
- **Protéines sans comptage** : objectif 1,6 g/kg calculé à partir du poids saisi, affiché en portions « paume de main » (environ 4 par jour pour 60 kg), pas en grammes à peser.
- **Sommeil** : rappel d'heure de coucher fixe, rappel « écrans coupés » 30 min avant ; les 3 ajustements de la p. 50.
- **Jour de repos actif** : suggestions (marche, vélo doux, routine du soir) au lieu d'un écran vide.
- **Courbatures ou douleur ?** Mini-questionnaire qui distingue les deux, avec la règle du guide : une douleur vive, articulaire ou qui irradie arrête l'exercice.

## Adhérence : tenir quand la motivation tombe

La partie 6 du guide (« Lasting 90 days ») est la plus précieuse à transformer en app : une notification au bon moment fait ce qu'une page imprimée ne peut pas faire.

| Mécanique | Déclencheur | Ce que fait l'app |
| --- | --- | --- |
| Règle des deux jours (remplace la « streak ») | Une séance manquée | Pas de compteur remis à zéro ; message : « une séance manquée ne compte pas, on ne rate jamais deux fois de suite », avec le plan B de 10 min proposé |
| Mur de la semaine 3 (ennui) | Début S3 | Message préventif + courbe des charges depuis S1 (« vous avez déjà progressé ici ») + rappel que S4 est un deload |
| Mur de la semaine 7 (fatigue) | Début S7, ou 2 séances manquées en S6-S7 | Affichage de la phrase du « pourquoi », relecture du contrat, proposition de réduire le volume plutôt que la fréquence |
| Règle des deux minutes | L'utilisatrice ouvre la séance et hésite | Bouton « Juste l'échauffement » : si elle arrête après, c'est validé sans culpabilité |
| Rituel | Veille d'une séance, le soir | Rappel « préparez vos affaires » ; playlist unique liée (Spotify / Apple Music) ; Ne pas déranger pendant la séance |
| Habit stacking | Onboarding | « Après \[habitude existante\], je fais \[mobilité / séance\] », utilisé dans le texte des rappels |
| Reprendre, pas rattraper | Retour après 3 séances manquées | L'app bloque la tentation de faire 4 séances la semaine suivante ; reprise à − 10 % |
| Bienveillance envers soi | Notes libres et bilans | Ton des messages aligné sur le contrat (« parler à soi comme à sa meilleure amie »), jamais de sport présenté comme punition |
| Quand la vie s'en mêle | Bouton « Ma semaine est compliquée » | Les 7 cas de la p. 55 (voyage, maladie, règles, 20 min, salle bondée, sans matériel, arrêt long) donnent chacun une séance adaptée en un tap |

## Au-delà du PDF : propositions

Ces fonctions ne sont pas dans le guide. Les deux premières servent directement la distribution TikTok et la rétention ; ce sont celles que je prioriserais.

| Proposition | Pourquoi | Effort |
| --- | --- | --- |
| **Cartes « glow » partageables** : séances tenues, courbe de force, radar des 7 marqueurs, fin de saison, au format story 9:16 dans l'esthétique du guide | Boucle de croissance organique sur TikTok ; aucune photo avant/après, donc compatible avec les règles pub et l'esprit « no before-and-after » du guide | S |
| **Cercles privés** de 8 à 12 femmes qui démarrent le même lundi, sans fil public : check-in hebdo, réactions, « j'ai tenu ma séance » | Remplace le « dites-le à quelqu'un » de la p. 54 ; l'engagement social est le plus fort levier de rétention | M |
| **Volumes 2 et 3 en modules** : « l'assiette » (nutrition) et « le rituel beauté et sommeil », déjà annoncés en dernière page du guide | Contenu supplémentaire qui justifie l'abonnement ; peut aussi être vendu en PDF avant d'être intégré | M |
| **Voix de la coach** : notes audio courtes aux moments clés (première séance, S3, S7, bilans, fin de saison) | Le guide parle à la première personne ; garder cette relation dans l'app, et réutiliser ces audios sur TikTok | S |
| **Assistant IA nourri par la méthode** : répond aux questions du type de la p. 56 (créatine, cardio à jeun, « je n'ai pas perdu de poids ») | Le guide renvoie presque tout à 3 leviers (sommeil, protéines, régularité) : facile à cadrer ; garde-fous médicaux obligatoires | M |
| **Profils de vie** : post-partum (plancher pelvien, diastasis déjà présents) et périménopause | Le segment périménopause est le plus porteur de l'étude de marché ; un profil dédié suffit à s'y positionner | M |
| **Widgets, Live Activity et Apple Watch** : minuteur de repos et séance en cours sur l'écran verrouillé et la montre | Le téléphone reste loin pendant la séance, comme le demande le rituel | M |
| **Passerelle acheteuses du PDF** : code dans le PDF qui donne un tarif fondatrice et pré-remplit le jour 0 | Convertit la prévente en premières abonnées et en premiers avis App Store | S |
| **Mode hors ligne** | Salles en sous-sol, pas de réseau ; la séance ne doit jamais dépendre de la connexion | S |
| **Badges de promesses tenues** (10, 30, 100 séances ; première pompe au sol ; premier deload respecté) | Gamification douce sans série à casser, cohérente avec la règle des deux jours | S |
| **Saisons thématiques** après la première : fessiers, haut du corps, force + course | Répond à « et après le jour 90 ? » et maintient l'abonnement au-delà de 6 mois | L |
| **Lives mensuels** questions-réponses avec la coach | Fidélisation et contenu TikTok recyclé | S |
| **Analyse de posture par caméra** (squat, soulevé de terre roumain) | Différenciant mais coûteux et risqué techniquement ; à garder pour plus tard | L |

## Priorisation

| MVP · au lancement (ce qui remplace le PDF) | V1 · juste après (ce qui fait rester) | V2 · ensuite (ce qui fait grandir) |
| --- | --- | --- |
| Onboarding, contrat, jour 0 | Cycle et ajustements | Cercles privés |
| Séance guidée et minuteurs | Murs S3/S7, règle des 2 jours | Modules assiette, sommeil |
| Saisie charges, reps, RPE | Routines matin et soir | Assistant IA de la méthode |
| Règle du +1, deloads auto | Habitudes et Apple Santé | Profils post-partum, périménopause |
| Bascule maison / salle | Cartes glow partageables | Saisons thématiques |
| Calendrier et rappels | Voix de la coach | Lives mensuels |
| Bilans de bloc et tests | Widgets, Live Activity | Apple Watch |
| Coffre photos | Badges promesses tenues | Analyse de posture caméra |
| Passerelle acheteuses PDF | | |
| Mode hors ligne | | |

Le MVP doit déjà faire mieux que le PDF (séance guidée et progression automatique) ; les cartes partageables passent en V1 car elles alimentent TikTok dès les premières abonnées. Les phases ne sont pas datées : à caler selon le budget de développement et de tournage vidéo.

## Questions ouvertes à trancher

- [ ] **Quelle femme exactement ?** Le guide parle à une femme qui reprend le sport, sans âge précis (début de perte osseuse « dès la trentaine », post-partum mentionné). L'étude de marché pointait les 35-50 ans en périménopause. Le choix change l'onboarding, le ton des contenus et les créatrices TikTok.
- [ ] **Qui est la coach ?** Le guide est écrit à la première personne (« the questions I get asked ») mais sans visage. Une coach identifiée est un atout fort sur TikTok et pour les audios.
- [ ] **Langue et marché** : le guide est en anglais, cohérent avec les US. Une version française est-elle prévue ?
- [ ] **Vidéos d'exercices** : 35 mouvements, chacun en version maison et salle, plus les versions douces : environ 80 vidéos à tourner. Budget et calendrier de tournage ?
- [ ] **Modèle économique** : paywall dur après l'onboarding avec essai 7 jours et offre annuelle (recommandation de l'étude de marché) ou freemium ?
- [ ] **Validation médicale** : relecture des règles automatiques (bilan santé, plancher pelvien, douleur) par une kiné ou une sage-femme avant lancement.
- [ ] **Technique** : app native ou React Native / Flutter ; l'intégration Apple Santé / Health Connect et les Live Activities pèsent dans ce choix.
