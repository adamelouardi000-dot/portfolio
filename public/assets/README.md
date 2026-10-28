# Ressources publiques du portfolio

Les fichiers suivants sont intégrés et configurés dans les données :

| Ressource | Fichier | Chemin servi par le site |
| --- | --- | --- |
| CV fourni, copié sans modification | `adam-elouardi-cv.pdf` | `/assets/adam-elouardi-cv.pdf` |
| Portrait original extrait du CV, 158 × 216 pixels | `adam-elouardi-portrait.jpg` | `/assets/adam-elouardi-portrait.jpg` |
| Figure du rapport PFA : comparaison Trivy | `pfa-trivy-comparison.png` | `/assets/pfa-trivy-comparison.png` |
| Figure du rapport PFA : Docker Hub, tag v1 | `pfa-dockerhub-v1.png` | `/assets/pfa-dockerhub-v1.png` |
| Badge Oracle Architect Associate, édition 2026, fourni sans date ni lien de vérification | `oracle-oci-architect-associate-2026.jpg` | `/assets/oracle-oci-architect-associate-2026.jpg` |

Pour remplacer le CV ou le portrait, conserver le nom ou modifier `profile.cv` / `profile.photo` dans `src/data/profile.ts`. Une photo originale de meilleure résolution peut remplacer le petit portrait extrait du CV ; aucun visage artificiel n’a été généré.

Le fichier `oracle-oci-architect-associate-2026.jpg` est la copie non modifiée du badge Oracle fourni. L’édition 2026 est distincte d’une date d’obtention. Sa date et son lien officiel de vérification restent à fournir. Il ne remplace pas la mention « OCI Security » du CV. Aucun PDF de certification n’a été ajouté lors de cet ajout.

Les captures des autres projets et les éventuels logos officiels restent à fournir. Ajouter leurs chemins et textes alternatifs FR/EN dans `src/data/projects.ts` ou `certifications` dans `src/data/profile.ts`. Le rapport PFA complet n’est pas publié ici.

Tout fichier de ce dossier sera public après déploiement, y compris ce document. Le dépôt app33 du stage est confidentiel : ne pas ajouter de code, document ou capture interne. Pour les autres projets, utiliser seulement des ressources autorisées à être publiques, sans secret ni donnée personnelle tierce.
