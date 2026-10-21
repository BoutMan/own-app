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
