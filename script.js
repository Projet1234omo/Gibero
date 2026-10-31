// Menu mobile
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}
// Année automatique du footer
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Formulaire de contact (envoi via Formspree, sans quitter la page)
const contactForm = document.getElementById('contact-form');
const formStatut = document.getElementById('form-statut');

function afficherStatut(type, texte) {
  if (!formStatut) return;
  formStatut.textContent = texte;
  formStatut.className = 'mb-4 rounded-lg border px-4 py-3 font-medium ' + (type === 'succes'
    ? 'border-green-300 bg-green-50 text-green-800'
    : 'border-red-300 bg-red-50 text-red-800');
  formStatut.setAttribute('role', type === 'succes' ? 'status' : 'alert');
  formStatut.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Transforme le numéro saisi en lien WhatsApp (wa.me) — renvoie '' si impossible
function lienWhatsApp(numero) {
  let n = numero.trim();
  const international = n.startsWith('+') || n.startsWith('00');
  n = n.replace(/\D/g, '');
  if (n.startsWith('00')) n = n.slice(2);
  if (!international) {
    if (n.length === 10 && n.startsWith('0')) n = '225' + n;   // numéro ivoirien local : 07 XX XX XX XX
    else if (!(n.startsWith('225') && n.length === 13)) return '';
  }
  return n.length >= 8 && n.length <= 15 ? 'https://wa.me/' + n : '';
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bouton = contactForm.querySelector('button[type="submit"]');
    const nom = contactForm.querySelector('#nom');
    const email = contactForm.querySelector('#email');
    const tel = contactForm.querySelector('#telephone');
    const besoin = contactForm.querySelector('#sujet');
    const message = contactForm.querySelector('#message');

    // Vérifications
    if (!nom.value.trim() || !email.value.trim() || !message.value.trim()) {
      afficherStatut('erreur', 'Veuillez renseigner votre nom, votre e-mail et votre message.');
      return;
    }
    if (!email.checkValidity()) {
      afficherStatut('erreur', "L'adresse e-mail saisie n'est pas valide.");
      return;
    }
    const chiffres = tel.value.replace(/\D/g, '');
    if (tel.value.trim() && (chiffres.length < 8 || chiffres.length > 15 || /[^\d\s+().-]/.test(tel.value))) {
      afficherStatut('erreur', 'Le numéro de téléphone saisi n\'est pas valide.');
      return;
    }

    // Données envoyées : objet de l'e-mail avec le besoin, et lien WhatsApp si un numéro est donné
    const donnees = new FormData(contactForm);
    donnees.set('subject', 'Nouvelle demande – ' + besoin.value + ' – GUIBERO Consulting');
    const wa = tel.value.trim() ? lienWhatsApp(tel.value) : '';
    if (wa) donnees.set('WhatsApp', wa);

    bouton.disabled = true;
    const texteBouton = bouton.textContent;
    bouton.textContent = 'Envoi en cours…';
    bouton.classList.add('opacity-60', 'cursor-not-allowed');

    try {
      const reponse = await fetch(contactForm.action, {
        method: 'POST',
        body: donnees,
        headers: { Accept: 'application/json' }
      });
      if (reponse.ok) {
        contactForm.reset();
        afficherStatut('succes', 'Votre message a été envoyé avec succès. Nous vous répondrons rapidement.');
      } else {
        afficherStatut('erreur', "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous écrire sur WhatsApp.");
      }
    } catch (err) {
      afficherStatut('erreur', "Envoi impossible : vérifiez votre connexion Internet, puis réessayez.");
    } finally {
      bouton.disabled = false;
      bouton.textContent = texteBouton;
      bouton.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });
}

// Onglets « Nos domaines et services »
// Sans JavaScript, les trois domaines restent visibles l'un sous l'autre.
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
if (tabs.length) {
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

  function activer(index, focus) {
    tabs.forEach((t, i) => {
      const actif = i === index;
      t.setAttribute('aria-selected', String(actif));
      t.tabIndex = actif ? 0 : -1;
      if (panels[i]) panels[i].hidden = !actif;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activer(i, false));
    t.addEventListener('keydown', e => {
      let cible = null;
      if (e.key === 'ArrowRight') cible = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') cible = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') cible = 0;
      if (e.key === 'End') cible = tabs.length - 1;
      if (cible !== null) { e.preventDefault(); activer(cible, true); }
    });
  });

  activer(0, false);
}

