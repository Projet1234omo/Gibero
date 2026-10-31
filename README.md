# GUIBERO Consulting – site vitrine

Site statique (HTML, Tailwind CSS, JavaScript) du cabinet GUIBERO Consulting :
sécurité incendie, sécurité électrique et sûreté à Abidjan.

Aucun PHP, aucune base de données : le site peut être hébergé gratuitement sur **GitHub Pages**.

## Voir le site en local
Double-cliquer sur `index.html`. (Les polices Google nécessitent une connexion Internet.)

## Mettre le site en ligne avec GitHub Pages

1. Créer un dépôt **public** sur GitHub (ex. `guibero`), sans README.
2. Dans le dossier du projet (terminal VS Code) :

   ```bash
   git init
   git add .
   git commit -m "Premier envoi du site GUIBERO"
   git branch -M main
   git remote add origin https://github.com/VOTRE-PSEUDO/guibero.git
   git push -u origin main
   ```

3. Sur GitHub : **Settings → Pages → Build and deployment**
   - Source : *Deploy from a branch*
   - Branch : `main` / dossier `/ (root)` → **Save**
4. Après 1 à 2 minutes, le site est visible à l'adresse :
   `https://VOTRE-PSEUDO.github.io/guibero/`

Pour publier une modification ensuite :

```bash
git add .
git commit -m "Description de la modification"
git push
```

> Le fichier vide `.nojekyll` indique à GitHub Pages de servir les fichiers tels quels (sans traitement Jekyll).

## Formulaire de contact (Formspree)
- Les messages sont envoyés à Formspree, qui les transfère à l'adresse e-mail du compte Formspree.
- Adresse du formulaire : `https://formspree.io/f/xgaaykvq` (attribut `action` du formulaire dans `index.html`).
- Fonctionne aussi sur GitHub Pages (aucun serveur nécessaire).
- Pour répondre à un client : cliquer sur « Répondre » dans l'e-mail reçu (le champ `email` sert d'adresse de réponse).
- Si le client a donné son numéro, l'e-mail contient une ligne « WhatsApp » avec un lien `https://wa.me/...`.
- Plan gratuit Formspree : 50 messages par mois (vérifier sur formspree.io).
- Premier envoi : Formspree peut demander de confirmer l'adresse e-mail du compte.

## Modifier les styles (Tailwind)
Le CSS est déjà généré dans `style.css` (il est versionné, GitHub Pages l'utilise directement).
Après avoir ajouté de nouvelles classes Tailwind dans `index.html` ou `script.js`, régénérer le CSS (Node.js requis) :

```bash
npm install          # une seule fois : installe Tailwind dans node_modules/
npm run build:css    # régénère style.css
npm run watch:css    # (option) régénère automatiquement à chaque sauvegarde
```

Ne pas oublier ensuite de faire `git add`, `git commit` et `git push`.

## Où se trouve quoi
- `index.html` : toute la page (accueil, à propos, services, méthodologie, références, contact)
- `input.css` : source Tailwind · `style.css` : CSS généré · `perso.css` : réglages personnels
- `script.js` : menu mobile, onglets des domaines, envoi du formulaire
- `assets/` : toutes les images (logos, photo du fondateur, photos des services `service-*.jpg` et des références `ref-*.jpg`)
- `tailwind.config.js`, `package.json` : configuration pour régénérer `style.css`
- `.gitignore` : fichiers que Git ne doit pas envoyer (`node_modules/`, fichiers système…)

## Réglages personnels (tailles et polices)
Le fichier `perso.css` est chargé après `style.css` : ce qui y est écrit l'emporte.
Il contient déjà le réglage des petits titres de sections (classe `surtitre`).
Pour un autre texte : ajouter une classe à sa balise dans `index.html` (ex. `class="mon-texte ..."`),
puis écrire sa règle dans `perso.css` (ex. `.mon-texte { font-size: 20px; }`).

## Mise en ligne sur Hostinger (alternative)
Gestionnaire de fichiers → dossier `public_html` → déposer le zip → Extraire.
Le fichier `index.html` doit se trouver directement dans `public_html`.
