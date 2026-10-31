/* =====================================================================
   EFFETS VISUELS — GUIBERO Consulting
   ---------------------------------------------------------------------
   Ce fichier ajoute les animations du site. Il ne touche pas au contenu :
   si on le retire, le site fonctionne exactement comme avant.

   Sommaire (chaque effet peut être désactivé dans RÉGLAGES ci-dessous) :
    1. Barre de progression de lecture
    2. En-tête : ombre, compactage, masquage au défilement
    3. Lien du menu actif selon la section visible
    4. Accueil : braises animées (canvas) + titre mot par mot
    5. Parallaxe du logo en filigrane
    6. Apparitions au défilement (fondu, glissement, cascade)
    7. Bandeau défilant des savoir-faire
    8. Cartes inclinées en 3D avec reflet lumineux
    9. Boutons magnétiques + onde au clic
   10. Méthodologie : compteurs et ligne de progression
   11. Références : visionneuse d'images (lightbox)
   12. Bouton « retour en haut » avec anneau de progression
   13. Halo lumineux qui suit la souris
   14. Changement d'onglet en fondu

   Les visiteurs qui ont demandé « moins d'animations » dans leur système
   (Windows / Android / iOS) voient le site sans les effets en mouvement.
   ===================================================================== */

(() => {
  'use strict';

  /* ---------- RÉGLAGES : mettre false pour couper un effet ---------- */
  const REGLAGES = {
    barreProgression: true,
    enteteDynamique:  true,
    menuActif:        true,
    braises:          true,
    titreAnime:       true,
    parallaxe:        true,
    apparitions:      true,
    bandeau:          true,
    cartes3D:         true,
    boutonsMagnetiques: true,
    methodologie:     true,
    visionneuse:      true,
    retourEnHaut:     true,
    halo:             true,
    ongletsFondu:     true,
  };

  /* Couleurs du site (identiques à tailwind.config.js) */
  const C = { navy: '#0b1626', flame: '#e8431f', volt: '#f6b800', bleu: '#2f8fdb' };

  const moinsAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sourisPrecise   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------------
     Styles des effets : injectés ici pour ne pas avoir à régénérer
     le CSS Tailwind (style.css reste inchangé).
     --------------------------------------------------------------- */
  const css = `
  /* 1. Barre de progression */
  .fx-progress{position:fixed;top:0;left:0;height:3px;width:100%;z-index:60;transform-origin:0 50%;transform:scaleX(0);
    background:linear-gradient(90deg,${C.flame},${C.volt});box-shadow:0 0 12px rgba(232,67,31,.6);pointer-events:none}

  /* 2. En-tête */
  header.fx-header{transition:transform .35s ease,box-shadow .35s ease,background-color .35s ease}
  header.fx-header.fx-scrolled{box-shadow:0 10px 30px rgba(0,0,0,.35)}
  header.fx-header.fx-cache{transform:translateY(-100%)}

  /* 3. Menu actif */
  header nav a.fx-lien{position:relative}
  header nav a.fx-lien::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;border-radius:2px;
    background:${C.volt};transform:scaleX(0);transition:transform .3s ease}
  header nav a.fx-lien:hover::after,header nav a.fx-lien.fx-actif::after{transform:scaleX(1)}
  header nav a.fx-lien.fx-actif{color:${C.volt}}

  /* 4. Accueil */
  #accueil{position:relative}
  .fx-braises{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
  .fx-mot{display:inline-block;opacity:0;transform:translateY(.6em) rotate(3deg);filter:blur(6px);
    animation:fx-mot .8s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes fx-mot{to{opacity:1;transform:none;filter:none}}
  .fx-mot-accent{background:linear-gradient(90deg,${C.volt},${C.flame},${C.volt});background-size:200% 100%;
    -webkit-background-clip:text;background-clip:text;color:transparent;animation:fx-mot .8s cubic-bezier(.2,.8,.2,1) forwards,fx-brille 4s linear 1.5s infinite}
  @keyframes fx-brille{to{background-position:-200% 0}}
  .fx-entree{opacity:0;transform:translateY(20px);animation:fx-mot .9s cubic-bezier(.2,.8,.2,1) forwards}
  .fx-defiler{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:26px;height:42px;border:2px solid rgba(255,255,255,.45);
    border-radius:14px;display:flex;justify-content:center;padding-top:7px}
  .fx-defiler::before{content:"";width:4px;height:8px;border-radius:2px;background:${C.volt};animation:fx-roulette 1.8s ease-in-out infinite}
  @keyframes fx-roulette{0%{opacity:0;transform:translateY(0)}30%{opacity:1}80%{opacity:0;transform:translateY(14px)}100%{opacity:0}}

  /* 6. Apparitions */
  .fx-reveal{opacity:0;transform:translateY(40px);transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1);
    transition-delay:var(--fx-delai,0s);will-change:opacity,transform}
  .fx-reveal.fx-gauche{transform:translateX(-50px)}
  .fx-reveal.fx-droite{transform:translateX(50px)}
  .fx-reveal.fx-zoom{transform:scale(.9)}
  .fx-reveal.fx-vu{opacity:1;transform:none}
  .surtitre.fx-trait{position:relative;display:inline-block;padding-bottom:6px}
  .surtitre.fx-trait::after{content:"";position:absolute;left:0;bottom:0;height:3px;width:100%;border-radius:3px;background:currentColor;
    transform:scaleX(0);transform-origin:0 50%;transition:transform 1s cubic-bezier(.2,.8,.2,1) .3s}
  .surtitre.fx-trait.fx-vu::after{transform:scaleX(.35)}

  /* 7. Bandeau défilant */
  .fx-bandeau-cadre{overflow:hidden;background:${C.navy};padding:14px 0;position:relative;z-index:2}
  .fx-bandeau{overflow:hidden;background:${C.flame};color:#fff;padding:14px 0;transform:rotate(-1.2deg);width:104%;margin-left:-2%;
    box-shadow:0 10px 30px rgba(232,67,31,.25)}
  .fx-bandeau-piste{display:flex;width:max-content;animation:fx-marquee 32s linear infinite}
  .fx-bandeau:hover .fx-bandeau-piste{animation-play-state:paused}
  .fx-bandeau span{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:1.35rem;letter-spacing:.06em;text-transform:uppercase;
    padding:0 22px;white-space:nowrap;display:flex;align-items:center;gap:22px}
  .fx-bandeau span::after{content:"";width:9px;height:9px;background:${C.volt};transform:rotate(45deg);display:inline-block}
  @keyframes fx-marquee{to{transform:translateX(-50%)}}

  /* 8. Cartes 3D */
  .fx-tilt{transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s ease;position:relative}
  .fx-tilt:hover{box-shadow:0 25px 50px -12px rgba(11,22,38,.45)}
  .fx-tilt .fx-reflet{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .4s ease;
    background:radial-gradient(400px circle at var(--fx-x,50%) var(--fx-y,50%),rgba(255,255,255,.14),transparent 45%)}
  .fx-tilt:hover .fx-reflet{opacity:1}
  .ref-card img,.svc-card img{transition:transform .8s cubic-bezier(.2,.8,.2,1)}
  .ref-card:hover img,.svc-card:hover img{transform:scale(1.07)}
  .ref-card{cursor:zoom-in}

  /* 9. Boutons */
  .fx-btn{position:relative;overflow:hidden;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .3s ease !important}
  .fx-btn:hover{box-shadow:0 10px 25px -5px rgba(232,67,31,.45)}
  .fx-onde{position:absolute;border-radius:50%;background:rgba(255,255,255,.45);transform:scale(0);animation:fx-onde .7s ease-out forwards;pointer-events:none}
  @keyframes fx-onde{to{transform:scale(4);opacity:0}}

  /* 10. Méthodologie */
  #methodologie ol{position:relative}
  .fx-ligne{position:absolute;left:0;right:0;top:-22px;height:4px;border-radius:4px;background:rgba(11,22,38,.08);overflow:hidden}
  .fx-ligne b{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:0 50%;transition:transform 2.2s cubic-bezier(.6,0,.2,1);
    background:linear-gradient(90deg,${C.flame},${C.volt})}
  .fx-ligne.fx-vu b{transform:scaleX(1)}
  #methodologie li{transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s ease}
  #methodologie li:hover{transform:translateY(-8px);box-shadow:0 20px 40px -15px rgba(232,67,31,.5)}
  #methodologie li.fx-etape-active span{text-shadow:0 0 22px rgba(232,67,31,.8)}

  /* 11. Visionneuse */
  .fx-lightbox{position:fixed;inset:0;z-index:100;background:rgba(5,10,18,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:14px;padding:20px;opacity:0;transition:opacity .3s ease;backdrop-filter:blur(6px)}
  .fx-lightbox.fx-ouverte{opacity:1}
  .fx-lightbox img{max-width:min(1100px,92vw);max-height:78vh;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,.6);
    transform:scale(.92);transition:transform .4s cubic-bezier(.2,.8,.2,1)}
  .fx-lightbox.fx-ouverte img{transform:none}
  .fx-lightbox p{color:#e2e8f0;font-size:.95rem;text-align:center;max-width:700px;margin:0}
  .fx-lb-btn{position:absolute;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);width:48px;height:48px;border-radius:50%;
    font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .fx-lb-btn:hover{background:${C.flame}}
  .fx-lb-fermer{top:20px;right:20px}.fx-lb-prec{left:20px;top:50%}.fx-lb-suiv{right:20px;top:50%}
  .fx-lb-compteur{color:#94a3b8;font-size:.8rem;letter-spacing:.1em}

  /* 12. Retour en haut */
  .fx-haut{position:fixed;right:20px;bottom:20px;z-index:55;width:52px;height:52px;border-radius:50%;border:0;cursor:pointer;background:${C.navy};
    color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px rgba(0,0,0,.3);
    opacity:0;transform:translateY(20px) scale(.8);pointer-events:none;transition:opacity .35s ease,transform .35s ease}
  .fx-haut.fx-visible{opacity:1;transform:none;pointer-events:auto}
  .fx-haut:hover{background:${C.flame}}
  .fx-haut svg.fx-anneau{position:absolute;inset:0;transform:rotate(-90deg)}
  .fx-haut circle{fill:none;stroke-width:3}
  .fx-haut:focus-visible{outline:3px solid ${C.volt};outline-offset:3px}

  /* 13. Halo souris */
  .fx-halo{position:fixed;left:0;top:0;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;pointer-events:none;z-index:1;
    background:radial-gradient(circle,rgba(246,184,0,.10),rgba(232,67,31,.05) 40%,transparent 70%);mix-blend-mode:screen;
    transition:opacity .4s ease;opacity:0}

  /* 14. Onglets */
  .tab-panel.fx-panneau{animation:fx-panneau .6s cubic-bezier(.2,.8,.2,1)}
  @keyframes fx-panneau{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}

  @media (prefers-reduced-motion: reduce){
    .fx-reveal,.fx-mot,.fx-entree{opacity:1!important;transform:none!important;filter:none!important;animation:none!important;transition:none!important}
    .fx-bandeau-piste{animation:none}
  }`;
  const style = document.createElement('style');
  style.id = 'effets-guibero';
  style.textContent = css;
  document.head.appendChild(style);

  const header = $('header');
  const hero = $('#accueil');

  /* =========================== 1. Barre de progression */
  let barre = null;
  if (REGLAGES.barreProgression) {
    barre = document.createElement('div');
    barre.className = 'fx-progress';
    barre.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barre);
  }

  /* =========================== 2. En-tête dynamique */
  if (REGLAGES.enteteDynamique && header) header.classList.add('fx-header');

  /* =========================== 12. Bouton retour en haut */
  let boutonHaut = null, anneau = null;
  if (REGLAGES.retourEnHaut) {
    boutonHaut = document.createElement('button');
    boutonHaut.className = 'fx-haut';
    boutonHaut.type = 'button';
    boutonHaut.setAttribute('aria-label', 'Revenir en haut de la page');
    boutonHaut.innerHTML = `
      <svg class="fx-anneau" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="23" stroke="rgba(255,255,255,.15)"></circle>
        <circle cx="26" cy="26" r="23" stroke="${C.volt}" stroke-linecap="round" stroke-dasharray="144.5" stroke-dashoffset="144.5"></circle>
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
    document.body.appendChild(boutonHaut);
    anneau = boutonHaut.querySelectorAll('circle')[1];
    boutonHaut.addEventListener('click', () => window.scrollTo({ top: 0, behavior: moinsAnimations ? 'auto' : 'smooth' }));
  }

  /* --- Une seule fonction appelée au défilement (plus fluide) --- */
  let dernierY = window.scrollY, enAttente = false;
  function surDefilement() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, y / max) : 0;

    if (barre) barre.style.transform = `scaleX(${ratio})`;

    if (REGLAGES.enteteDynamique && header) {
      header.classList.toggle('fx-scrolled', y > 20);
      const menuOuvert = $('#mobile-menu') && !$('#mobile-menu').classList.contains('hidden');
      // On cache l'en-tête quand on descend, on le remontre dès qu'on remonte
      header.classList.toggle('fx-cache', !menuOuvert && y > dernierY && y > 400);
    }

    if (boutonHaut) {
      boutonHaut.classList.toggle('fx-visible', y > 600);
      anneau.style.strokeDashoffset = String(144.5 * (1 - ratio));
    }

    if (REGLAGES.parallaxe && !moinsAnimations && hero) {
      const contenu = $('.max-w-6xl', hero);
      if (contenu && y < window.innerHeight * 1.2) {
        contenu.style.transform = `translateY(${y * 0.25}px)`;
        contenu.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)));
      }
    }

    dernierY = y;
    enAttente = false;
  }
  window.addEventListener('scroll', () => {
    if (!enAttente) { enAttente = true; requestAnimationFrame(surDefilement); }
  }, { passive: true });
  surDefilement();

  /* =========================== 3. Menu actif (scrollspy) */
  if (REGLAGES.menuActif) {
    const liens = $$('header nav a[href^="#"]').filter(a => a.getAttribute('href').length > 1);
    liens.forEach(a => { if (!a.className.includes('bg-flame')) a.classList.add('fx-lien'); });
    const sections = liens.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const espion = new IntersectionObserver(entrees => {
      entrees.forEach(e => {
        if (!e.isIntersecting) return;
        liens.forEach(a => a.classList.toggle('fx-actif', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => espion.observe(s));
  }

  /* =========================== 4a. Braises animées (canvas) */
  if (REGLAGES.braises && !moinsAnimations && hero) {
    const canvas = document.createElement('canvas');
    canvas.className = 'fx-braises';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let L = 0, H = 0, particules = [], actif = true;
    const ratioPx = Math.min(window.devicePixelRatio || 1, 2);

    function dimensionner() {
      L = hero.offsetWidth; H = hero.offsetHeight;
      canvas.width = L * ratioPx; canvas.height = H * ratioPx;
      ctx.setTransform(ratioPx, 0, 0, ratioPx, 0, 0);
      const nombre = Math.round(Math.min(90, L / 14));
      particules = Array.from({ length: nombre }, () => nouvelle(true));
    }
    function nouvelle(partout) {
      return {
        x: Math.random() * L,
        y: partout ? Math.random() * H : H + 10,
        r: Math.random() * 2.2 + 0.6,
        vy: Math.random() * 0.6 + 0.25,
        oscillation: Math.random() * Math.PI * 2,
        vitesseOsc: Math.random() * 0.02 + 0.005,
        couleur: Math.random() < 0.65 ? '232,67,31' : '246,184,0',
        vie: Math.random() * 0.6 + 0.4,
      };
    }
    let sourisX = -999, sourisY = -999;
    hero.addEventListener('pointermove', e => {
      const b = hero.getBoundingClientRect(); sourisX = e.clientX - b.left; sourisY = e.clientY - b.top;
    });
    hero.addEventListener('pointerleave', () => { sourisX = sourisY = -999; });

    function dessiner() {
      if (!actif) return;
      ctx.clearRect(0, 0, L, H);
      for (const p of particules) {
        p.oscillation += p.vitesseOsc;
        p.y -= p.vy;
        p.x += Math.sin(p.oscillation) * 0.5;
        // Les braises fuient doucement la souris
        const dx = p.x - sourisX, dy = p.y - sourisY, d = Math.hypot(dx, dy);
        if (d < 110) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
        const alpha = Math.max(0, Math.min(1, p.y / H)) * p.vie;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${p.couleur},${alpha})`);
        g.addColorStop(1, `rgba(${p.couleur},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
        if (p.y < -10) Object.assign(p, nouvelle(false));
      }
      requestAnimationFrame(dessiner);
    }
    // On met l'animation en pause quand l'accueil n'est plus visible (économie de batterie)
    new IntersectionObserver(([e]) => {
      const etaitActif = actif; actif = e.isIntersecting;
      if (actif && !etaitActif) requestAnimationFrame(dessiner);
    }).observe(hero);
    window.addEventListener('resize', dimensionner);
    dimensionner();
    requestAnimationFrame(dessiner);

    // Petit indicateur « faites défiler »
    const indic = document.createElement('a');
    indic.href = '#apropos';
    indic.className = 'fx-defiler';
    indic.setAttribute('aria-label', 'Faire défiler vers la suite');
    hero.appendChild(indic);
  }

  /* =========================== 4b. Titre mot par mot */
  if (REGLAGES.titreAnime && !moinsAnimations && hero) {
    const h1 = $('h1', hero);
    if (h1) {
      const texte = h1.textContent.trim();
      h1.setAttribute('aria-label', texte);   // les lecteurs d'écran lisent la phrase entière
      const motsAccent = ['qualité', 'sécurité,'];
      h1.innerHTML = texte.split(/\s+/).map((mot, i) => {
        const accent = motsAccent.includes(mot.toLowerCase()) ? ' fx-mot-accent' : '';
        return `<span class="fx-mot${accent}" aria-hidden="true" style="animation-delay:${0.15 + i * 0.07}s">${mot}</span>`;
      }).join(' ');
      // Les éléments sous le titre arrivent ensuite
      const fin = 0.15 + texte.split(/\s+/).length * 0.07;
      $$('p, .flex', $('.max-w-6xl', hero)).forEach((el, i) => {
        if (el === h1) return;
        el.classList.add('fx-entree');
        el.style.animationDelay = (i === 0 ? 0 : fin + i * 0.12) + 's';
      });
    }
  }

  /* =========================== 5. Parallaxe du filigrane à la souris */
  if (REGLAGES.parallaxe && !moinsAnimations && sourisPrecise) {
    $$('.filigrane').forEach(section => {
      section.addEventListener('pointermove', e => {
        const b = section.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5;
        const y = (e.clientY - b.top) / b.height - 0.5;
        section.style.setProperty('--fx-px', `${x * -30}px`);
        section.style.setProperty('--fx-py', `${y * -30}px`);
      });
    });
    style.textContent += `.filigrane::before{translate:var(--fx-px,0) var(--fx-py,0);transition:translate .6s cubic-bezier(.2,.8,.2,1)}`;
  }

  /* =========================== 7. Bandeau défilant */
  if (REGLAGES.bandeau && hero) {
    const mots = ['Audit & notice de sécurité', 'Conseil', 'Formation', 'Installation', 'Maintenance',
      'Sécurité incendie', 'Sécurité électrique', 'Sûreté', 'Mise en conformité', 'Respect des normes'];
    const bandeau = document.createElement('div');
    bandeau.className = 'fx-bandeau';
    bandeau.setAttribute('aria-hidden', 'true');
    const serie = mots.map(m => `<span>${m}</span>`).join('');
    bandeau.innerHTML = `<div class="fx-bandeau-piste">${serie}${serie}</div>`;
    const cadre = document.createElement('div');
    cadre.className = 'fx-bandeau-cadre';
    cadre.appendChild(bandeau);
    hero.after(cadre);
  }

  /* =========================== 6. Apparitions au défilement */
  if (REGLAGES.apparitions && !moinsAnimations) {
    const groupes = [
      { sel: 'main section h2, main section > div > h3', type: '' },
      { sel: '.surtitre', type: 'fx-gauche' },
      { sel: '#apropos .grid > *, #apropos p:not(.surtitre)', type: '' },
      { sel: '.tab-btn', type: 'fx-zoom', cascade: true },
      { sel: '.svc-card', type: '', cascade: true },
      { sel: '#methodologie li', type: '', cascade: true },
      { sel: '#methodologie .mt-16 > *', type: '' },
      { sel: '.ref-card', type: 'fx-zoom', cascade: true },
      { sel: '#references .md\\:col-span-1', type: 'fx-gauche' },
      { sel: '#references .md\\:col-span-2', type: 'fx-droite' },
      { sel: '#contact form', type: 'fx-droite' },
      { sel: '#contact .max-w-6xl > div > div:first-child, #contact .grid > div:first-child', type: 'fx-gauche' },
    ];
    const deja = new Set();
    const observateur = new IntersectionObserver(entrees => {
      entrees.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fx-vu'); observateur.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    groupes.forEach(g => {
      let elements = [];
      try { elements = $$(g.sel); } catch (_) { return; }
      const parParent = new Map();
      elements.forEach(el => {
        if (deja.has(el) || el.closest('header') || el.closest('#accueil')) return;
        deja.add(el);
        el.classList.add('fx-reveal');
        if (g.type) el.classList.add(g.type);
        if (g.cascade) {   // délai progressif entre frères : effet « cascade »
          const n = parParent.get(el.parentElement) || 0;
          parParent.set(el.parentElement, n + 1);
          el.style.setProperty('--fx-delai', `${Math.min(n, 6) * 0.1}s`);
        }
        observateur.observe(el);
      });
    });

    // Trait qui se dessine sous les petits titres
    $$('.surtitre').forEach(s => s.classList.add('fx-trait'));
  }

  /* =========================== 8. Cartes 3D */
  if (REGLAGES.cartes3D && !moinsAnimations && sourisPrecise) {
    $$('.svc-card, .ref-card, #methodologie li, #apropos .bg-navy-900').forEach(carte => {
      carte.classList.add('fx-tilt');
      const reflet = document.createElement('span');
      reflet.className = 'fx-reflet';
      reflet.setAttribute('aria-hidden', 'true');
      carte.appendChild(reflet);
      carte.addEventListener('pointermove', e => {
        const b = carte.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        carte.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-4px)`;
        carte.style.setProperty('--fx-x', `${x * 100}%`);
        carte.style.setProperty('--fx-y', `${y * 100}%`);
      });
      carte.addEventListener('pointerleave', () => { carte.style.transform = ''; });
    });
  }

  /* =========================== 9. Boutons magnétiques + onde */
  if (REGLAGES.boutonsMagnetiques) {
    const boutons = $$('a.bg-flame-500, button.bg-flame-500, #contact-form button[type="submit"], #accueil .flex a');
    boutons.forEach(btn => {
      btn.classList.add('fx-btn');
      btn.addEventListener('click', e => {
        if (moinsAnimations) return;
        const b = btn.getBoundingClientRect(), taille = Math.max(b.width, b.height);
        const onde = document.createElement('span');
        onde.className = 'fx-onde';
        Object.assign(onde.style, { width: taille + 'px', height: taille + 'px',
          left: (e.clientX - b.left - taille / 2) + 'px', top: (e.clientY - b.top - taille / 2) + 'px' });
        btn.appendChild(onde);
        setTimeout(() => onde.remove(), 700);
      });
      if (moinsAnimations || !sourisPrecise) return;
      btn.addEventListener('pointermove', e => {
        const b = btn.getBoundingClientRect();
        const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* =========================== 10. Méthodologie */
  if (REGLAGES.methodologie) {
    const liste = $('#methodologie ol');
    if (liste) {
      const etapes = $$('li', liste);
      const ligne = document.createElement('div');
      ligne.className = 'fx-ligne';
      ligne.setAttribute('aria-hidden', 'true');
      ligne.innerHTML = '<b></b>';
      liste.prepend(ligne);

      new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        ligne.classList.add('fx-vu');
        etapes.forEach((li, i) => {
          const num = $('span', li);
          if (!num) return;
          const cible = parseInt(num.textContent, 10);
          if (moinsAnimations || isNaN(cible)) return;
          // Chaque numéro compte de 00 à sa valeur, l'un après l'autre
          setTimeout(() => {
            li.classList.add('fx-etape-active');
            let n = 0;
            const t = setInterval(() => {
              n++;
              num.textContent = String(n).padStart(2, '0');
              if (n >= cible) { clearInterval(t); setTimeout(() => li.classList.remove('fx-etape-active'), 600); }
            }, 90);
            num.textContent = '00';
          }, i * 420);
        });
      }, { threshold: 0.4 }).observe(liste);
    }
  }

  /* =========================== 11. Visionneuse des références */
  if (REGLAGES.visionneuse) {
    const images = $$('#references img');
    let index = 0, boite = null;

    function ouvrir(i) {
      index = (i + images.length) % images.length;
      const img = images[index];
      if (!boite) {
        boite = document.createElement('div');
        boite.className = 'fx-lightbox';
        boite.setAttribute('role', 'dialog');
        boite.setAttribute('aria-modal', 'true');
        boite.setAttribute('aria-label', 'Visionneuse des références');
        boite.innerHTML = `
          <button class="fx-lb-btn fx-lb-fermer" type="button" aria-label="Fermer">✕</button>
          <button class="fx-lb-btn fx-lb-prec" type="button" aria-label="Image précédente">‹</button>
          <img alt="">
          <p></p><span class="fx-lb-compteur"></span>
          <button class="fx-lb-btn fx-lb-suiv" type="button" aria-label="Image suivante">›</button>`;
        boite.addEventListener('click', e => {
          if (e.target === boite || e.target.classList.contains('fx-lb-fermer')) fermer();
          if (e.target.classList.contains('fx-lb-prec')) ouvrir(index - 1);
          if (e.target.classList.contains('fx-lb-suiv')) ouvrir(index + 1);
        });
        // Balayage gauche / droite sur téléphone
        let departX = null;
        boite.addEventListener('touchstart', e => { departX = e.touches[0].clientX; }, { passive: true });
        boite.addEventListener('touchend', e => {
          if (departX === null) return;
          const dx = e.changedTouches[0].clientX - departX;
          if (Math.abs(dx) > 50) ouvrir(index + (dx < 0 ? 1 : -1));
          departX = null;
        });
        document.body.appendChild(boite);
        requestAnimationFrame(() => boite.classList.add('fx-ouverte'));
        document.body.style.overflow = 'hidden';
        $('.fx-lb-fermer', boite).focus();
      }
      const grande = $('img', boite);
      grande.src = img.currentSrc || img.src;
      grande.alt = img.alt;
      const carte = img.closest('article');
      const titre = carte ? $('h3, h4, strong', carte) : null;
      $('p', boite).textContent = titre ? titre.textContent.trim() : img.alt;
      $('.fx-lb-compteur', boite).textContent = `${index + 1} / ${images.length}`;
    }
    function fermer() {
      if (!boite) return;
      const b = boite; boite = null;
      b.classList.remove('fx-ouverte');
      document.body.style.overflow = '';
      setTimeout(() => b.remove(), 300);
      images[index] && images[index].closest('article')?.focus?.();
    }
    images.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.tabIndex = 0;
      img.addEventListener('click', () => ouvrir(i));
      img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(i); } });
    });
    document.addEventListener('keydown', e => {
      if (!boite) return;
      if (e.key === 'Escape') fermer();
      if (e.key === 'ArrowRight') ouvrir(index + 1);
      if (e.key === 'ArrowLeft') ouvrir(index - 1);
    });
  }

  /* =========================== 13. Halo lumineux */
  if (REGLAGES.halo && !moinsAnimations && sourisPrecise) {
    const halo = document.createElement('div');
    halo.className = 'fx-halo';
    halo.setAttribute('aria-hidden', 'true');
    document.body.appendChild(halo);
    let cx = 0, cy = 0, hx = 0, hy = 0;
    // Le halo n'apparaît que sur les sections sombres, où il se voit
    const sombres = $$('#accueil, #references, footer, .bg-navy-800, .bg-navy-900');
    window.addEventListener('pointermove', e => {
      cx = e.clientX; cy = e.clientY;
      const surSombre = sombres.some(s => { const b = s.getBoundingClientRect(); return cy >= b.top && cy <= b.bottom; });
      halo.style.opacity = surSombre ? '1' : '0';
    }, { passive: true });
    (function suivre() {
      hx += (cx - hx) * 0.12; hy += (cy - hy) * 0.12;   // suivi avec un léger retard, plus doux
      halo.style.transform = `translate(${hx}px, ${hy}px)`;
      requestAnimationFrame(suivre);
    })();
  }

  /* =========================== 14. Onglets en fondu */
  if (REGLAGES.ongletsFondu && !moinsAnimations) {
    $$('[role="tab"]').forEach(onglet => {
      onglet.addEventListener('click', () => {
        const panneau = document.getElementById(onglet.getAttribute('aria-controls'));
        if (!panneau) return;
        panneau.classList.remove('fx-panneau');
        void panneau.offsetWidth;          // relance l'animation
        panneau.classList.add('fx-panneau');
        // Les cartes du nouvel onglet apparaissent en cascade
        $$('.fx-reveal', panneau).forEach(el => el.classList.add('fx-vu'));
      });
    });
  }
})();
