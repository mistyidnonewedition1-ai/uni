# Mon univers

Auto-portrait jouable. Le site entier est un jeu : six mini-jeux, un carnet, une progression.

Les textes d'exemple parlent d'Alex. Remplace-les avant l'exposé.

## 1. Lancer le projet

```bash
cd ~/spirt
npm install
npm run dev
```

Ouvre l'adresse affichée (souvent `http://localhost:5173`). Sur le même Wi-Fi, le téléphone peut utiliser l'adresse réseau indiquée par Vite.

## 2. Modifier tes informations

Ouvre `src/data/profile.js`. Chaque texte à changer est marqué `À PERSONNALISER`.

- Le prénom, l'âge, la phrase d'intro et l'auto-portrait final sont en haut du fichier.
- Chaque mini-jeu lit ce fichier. Tu n'as pas à modifier la logique.
- L'ordre des études est l'ordre juste du puzzle.
- Les leurres des passions sont des choses qui ne te ressemblent pas.
- Quand tes textes sont les tiens, passe `ready` à `true` pour masquer le rappel.

Limites, si tu ajoutes des blocs : 8 goûts, 8 découvertes dans l'univers, 6 traits de personnalité. Passions, études et langues suivent la longueur du tableau.

## 3. Mettre en ligne

Le plus simple : [Vercel](https://vercel.com).

1. Envoie le dossier sur GitHub.
2. Importe le dépôt sur Vercel.
3. Laisse les réglages (`npm run build`, dossier `dist`).
4. Déploie.

Netlify fonctionne aussi (`netlify.toml` est déjà là). Pour GitHub Pages, le `base` relatif et les adresses en `#/` évitent un réglage de serveur.

## 4. Récupérer l'URL publique

À la fin du déploiement, Vercel ou Netlify affiche une adresse du type `https://mon-univers.vercel.app`. C'est l'URL à partager. Tu peux la copier dans `.env.local` :

```bash
VITE_PUBLIC_URL=https://mon-univers.vercel.app
```

Puis relance un déploiement pour que le QR code la privilégie.

## 5. Générer le QR code

Ouvre le site **en ligne**, puis le bouton `QR` du ciel, ou ajoute `#/partager` à l'URL.

Le QR code reprend l'adresse publique de la page. Il refuse `localhost`. Si tu es encore en local, colle l'URL publique dans le champ : le code se génère aussitôt.

Montre ce code pendant l'exposé. Le public joue dans le navigateur, sans installer d'application.
