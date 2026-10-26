# Programme : notes de transcription

Le programme du guide (`docs/Eclat-Movement-Guide.pdf`) est transcrit dans `src/domain/programme/`.
Chaque séance, règle et liste cite sa page. Ce fichier liste ce qui a été interprété, et ce qui reste à trancher.

## Interprétations faites (réversibles)

| Sujet | Ce que dit le guide | Ce que fait l'app |
| --- | --- | --- |
| Nom du bloc 3 | « Éclat » (ancien nom de l'app) | « Glow », comme dans les maquettes |
| Restes de français | « Planche » (p. 27), « Pompes » (p. 32) | « Plank », « Push-ups » |
| Charges | en kg (« 4 à 6 kg », « 1 à 2,5 kg ») | stockées en kg, affichées en lb par défaut (9–13 lb, +2 à 5 lb) |
| Split squat (B1 · B) | pas de fiche dédiée dans la bibliothèque | `exerciseId: null` (la fiche la plus proche est le Bulgarian split squat) |
| Squat (B3 · A) | « Squat », sac lourd ou barre | relié à la fiche Goblet squat |
| Semaines 2–3 | « 3 sets, RPE 7 » | séries du tableau (2 pour la fente et le superman, comme imprimé), RPE 7 |
| Bilan J30 | « bilan à chaque fin de bloc » (spec) | rattaché à la fin de la semaine 4 |

## À trancher (règles non écrites dans le guide)

1. **Semaine 1 et deload S4 pour la séance C (circuit, bloc 1)** : le guide dit « 2 séries par exercice » mais rien pour les tours du circuit. Aujourd'hui : 3 tours inchangés.
2. **Semaine 12** : « les trois dernières séances à −20 % ». Ce sont les 3 séances de la semaine 12, ou les 3 dernières faites (si une a sauté) ? Aujourd'hui : les 3 séances de la semaine 12.
3. **Semaine manquée** : p. 23 « −10 % sur la première séance » pour une semaine ; p. 55 « −20 % pendant une semaine » au-delà de deux semaines. Les deux sont encodés tels quels.
4. **Cardio** : bloc 3 = 2 séances de cardio par semaine (p. 23), contre 1 pour les blocs 1 et 2. Le planning de l'onboarding n'en propose qu'une (la marche du samedi).
5. **Versions douces** : le guide n'en donne que pour les circuits (blocs 2 et 3). Pour la force, la spec parle de « versions douces » (bilan santé, plancher pelvien) : à écrire, idéalement relues par une kiné (question ouverte de la spec).

## Moteur de progression (jalon 3) : choix faits

| Règle | Source | Implémentation (`src/domain/engine/`) |
| --- | --- | --- |
| +1 : une rep de plus | p. 38 | Vise la série la plus faible de la dernière fois + 1, plafonnée au haut de la fourchette |
| +1 : charge plus lourde | p. 38, spec | Quand toutes les séries atteignent le haut de la fourchette avec un RPE ≤ cible. Hausse d'au moins 1 kg (2,2 lb), arrondie au poids suivant qu'on trouve en salle : 18 lb → 22,5 lb, 10 kg → 11 kg, 12 kg → 14,5 kg |
| « Facile deux fois de suite » | spec | Toutes les séries des 2 dernières séances à 2 points de RPE ou plus sous la cible → charge plus lourde |
| Gainages | p. 38 (adapté) | +5 s, plafonné au haut de la fourchette ; au plafond : version plus dure |
| Poids du corps au plafond | p. 38 (étapes 3 et 4) | « Plus dur » : tempo 3 s à la descente ou niveau suivant |
| Stagnation | p. 38 | 3 séances sans hausse de charge ni de total de reps → check-list sommeil, protéines, repos, charge réelle, puis deload anticipé |
| Séances à charge réduite | p. 23 | Les séances de deload, test, maladie, règles ne servent pas de base au +1 suivant |
| Semaine sans aucune séance | p. 23, spec | On reprend la même semaine, −10 % sur la première séance, la saison s'allonge d'une semaine |
| 2 semaines vides ou plus | p. 55 | Redémarrage au début du bloc en cours, −20 % toute la semaine |
| Malade | p. 55 | −30 % (« reprise à 70 % ») ; sous le cou : message de repos |
| Règles douloureuses | p. 55 | −20 %, exercices de gainage retirés, marche de 10 min à la place |
| Supersets | p. 27 et suiv. | Les deux mouvements sont saisis séparément (reps + charge), chacun avec son propre +1 |
| Circuits (séance C) | p. 29 et suiv. | On compte les reps faites pendant la fenêtre de travail de chaque station ; le +1 = une rep de plus que le dernier tour. Historique séparé de celui des séances de force (un goblet squat en circuit ne se compare pas à un goblet squat lourd) |
| 2 signes de surentraînement | spec | Signes lus sans Apple Santé : sommeil (check-in), irritabilité (humeur du check-in), motivation (énergie du check-in) — un score ≤ 3/10 ou en baisse de 2 points ou plus depuis le check-in précédent — et performance en baisse 3 séances de suite sur un mouvement principal. 2 signes → carte « Take my deload week now » sur Today. La FC de repos arrivera avec Apple Santé (V1) |
| Deload anticipé | p. 23, p. 38 | Proposé après 2 signes ou une stagnation ; accepté, il applique la règle du deload (2 séries, −30 %) jusqu'au dimanche. Le programme ne recule pas d'une semaine |
| Badges | spec (« Badges de promesses tenues ») | 10, 30, 100 séances ; première pompe au sol (test noté « Floor ») ; premier deload tenu (séance finie en S4 ou S8 à charge réduite) ; plus « First week » (3 séances), premier bilan de bloc, saison complète. Aucun badge ne se perd |
| Courbe d'énergie du cycle | interprétation | Énergie du jour lue dans les ressentis : « Full of energy » = 3, « Low energy » = 1, sinon 2 ; moyenne par groupe de jours (règles, J6, J10…). Affichée après 2 cycles complets |
| Ajustements par phase (écran cycle) | p. 19 | Trois lignes par phase reprenant les conseils du guide ; jamais imposés |
| Rappels | spec (« Lasting 90 days ») | 30 min avant chaque séance, veille à 21 h, check-in le dimanche à 18 h, wind-down à 21 h 30 (désactivé par défaut), fin d'essai J−2 à 10 h |
| « Missed twice » (Progress) | interprétation | Nombre de fois où l'utilisatrice est restée 2 semaines calendaires ou plus sans séance |
