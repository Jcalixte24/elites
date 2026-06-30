/**
 * cms-hydrate.js — Hydratation CMS des pages statiques
 * Lit Firebase via cms.js et met à jour le contenu visible.
 * Le contenu statique HTML sert de secours si Firebase est indisponible.
 * Aucune icône emoji : seuls les TEXTES sont remplacés (les <svg> restent).
 */
(async function () {
  try { await loadAllCMS(); } catch (e) { return; }
  const cfg = (window.CMS && CMS.config) || {};

  // ── Coordonnées (topbar : on remplace le <span>, l'icône SVG est préservée) ──
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  setText('cms-tel', cfg.tel);
  setText('cms-email', cfg.email);

  // ── Page contact : coordonnées + liens ──
  const ciTel = document.getElementById('cms-ci-tel');
  if (ciTel && cfg.tel) { ciTel.textContent = cfg.tel; ciTel.href = 'tel:' + cfg.tel.replace(/\s/g, ''); }
  const ciMail = document.getElementById('cms-ci-email');
  if (ciMail && cfg.email) { ciMail.textContent = cfg.email; ciMail.href = 'mailto:' + cfg.email; }
  setText('cms-ci-addr', cfg.address);

  // ── Statistiques (accueil) ──
  document.querySelectorAll('[data-cms-stat]').forEach(el => {
    const key = el.dataset.cmsStat;
    if (cfg[key] !== undefined && cfg[key] !== null) {
      el.dataset.count = cfg[key];           // alimente le compteur animé
      if (!el.closest('.stat')) el.textContent = cfg[key];
    }
  });

  // ── Année scolaire ──
  if (cfg.year) document.querySelectorAll('.cms-year').forEach(el => { el.textContent = cfg.year; });

  // ── Page Événements / Actualités ──
  const evGrid = document.getElementById('cms-events-grid');
  if (evGrid && CMS.events && CMS.events.length) {
    const MOIS = { janvier:0,'février':1,fevrier:1,mars:2,avril:3,mai:4,juin:5,juillet:6,'août':7,aout:7,septembre:8,octobre:9,novembre:10,'décembre':11,decembre:11 };
    const parse = (str) => {
      if (!str) return 0;
      const m = str.toLowerCase().match(/(\d{1,2})?\s*([a-zéûôà]+)?\s*(\d{4})/);
      if (!m) return 0;
      return (parseInt(m[3]) || 0) * 10000 + (m[2] ? (MOIS[m[2]] ?? 0) : 0) * 100 + (parseInt(m[1]) || 1);
    };
    const sorted = [...CMS.events].sort((a, b) => parse(b.date) - parse(a.date));
    evGrid.innerHTML = sorted.map((ev, i) => `
      <article class="ev-card rv d${(i % 3) + 1}">
        ${ev.img ? `<img src="${ev.img}" alt="${ev.title || ''}" loading="lazy">` : ''}
        <div class="ev-card-body">
          <div class="ev-card-date">${ev.date || ''}</div>
          <h2 class="ev-card-title">${ev.title || ''}</h2>
          <p class="ev-card-text">${ev.text || ''}</p>
          ${ev.tag ? `<span class="ev-card-tag">${ev.tag}</span>` : ''}
        </div>
      </article>`).join('');
  }

  // ── Page Équipe : corps enseignant ──
  const teach = document.getElementById('cms-teachers-list');
  if (teach && CMS.teachers && CMS.teachers.length) {
    const initials = (s) => (s || '').replace(/Professeur (de |d')?/i, '').trim().slice(0, 2).toUpperCase();
    teach.innerHTML = CMS.teachers.map(t => `
      <div class="tcard">
        <div class="tcard-photo"><span class="initials">${initials(t.subj || t.name)}</span></div>
        <div class="tcard-body">
          <h3>${t.name || ''}</h3>
          <div class="tcard-role">${t.cycle || ''}</div>
          ${t.subj ? `<span class="tcard-subj">${t.subj}</span>` : ''}
        </div>
      </div>`).join('');
  }

  // ── Page Galerie ──
  const galGrid = document.getElementById('cms-gallery-grid');
  if (galGrid && CMS.gallery && CMS.gallery.length) {
    const zoom = `<div class="gf-zoom"><svg class="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></div>`;
    galGrid.innerHTML = CMS.gallery.map((g, i) => `
      <div class="gf-item rv d${(i % 3) + 1}">
        <img src="${g.src}" alt="${g.caption || 'Photo du collège'}" loading="lazy">
        ${zoom}
        ${g.caption ? `<div class="gf-cap">${g.caption}</div>` : ''}
      </div>`).join('');
    if (window.bindLightbox) window.bindLightbox();
  }

  // ── Cartes "Nos atouts" (accueil) ──
  const featGrid = document.getElementById('cms-features-grid');
  if (featGrid && CMS.features && CMS.features.length) {
    const ICONS = window.FEAT_ICONS || {};
    featGrid.innerHTML = CMS.features.map((f, i) => {
      const ico = ICONS[f.icon] || ICONS['star'];
      const svg = ico ? `<svg class="ic" viewBox="0 0 24 24">${ico.path}</svg>` : '';
      return `<div class="feature rv d${(i % 3) + 1}">
        <span class="icon-chip">${svg}</span>
        <h3>${f.title || ''}</h3>
        <p>${f.text || ''}</p>
      </div>`;
    }).join('');
  }

  // ── Réinitialise les animations sur le contenu fraîchement injecté ──
  document.querySelectorAll('#cms-events-grid .rv, #cms-teachers-list .tcard, #cms-gallery-grid .rv, #cms-features-grid .rv').forEach(el => el.classList.add('on'));
})();
