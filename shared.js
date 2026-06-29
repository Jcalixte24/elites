/* ═══════════════════════════════════════════
   Collège Les Élites — UI behaviour
═══════════════════════════════════════════ */
function closeMob(){ var m=document.getElementById('mob'); if(m) m.classList.remove('open'); }

document.addEventListener('DOMContentLoaded', function () {

  /* ── Splash ── */
  var splash = document.getElementById('splash');
  if (splash) {
    window.addEventListener('load', function () {
      setTimeout(function () { splash.classList.add('hide'); }, 950);
    });
    // safety: hide after 2.4s even if load is slow
    setTimeout(function(){ splash.classList.add('hide'); }, 2400);
  }

  /* ── Escape closes overlays ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMob();
      var lb = document.getElementById('lightbox');
      if (lb) lb.classList.remove('open');
    }
  });

  /* ── Scroll reveal ── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { revObs.observe(el); });

  /* ── Animated counters ── */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || '';
        var dur = 1700, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cntObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cntObs.observe(el); });
  }

  /* ── Lightbox (galleries) ── */
  function bindLightbox(){
    var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg');
    if (!lb || !lbImg) return;
    document.querySelectorAll('.gf-item, .gp-item').forEach(function (item) {
      if (item.dataset.lbBound) return;
      item.dataset.lbBound = '1';
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); }
      });
    });
    if (!lb.dataset.bound){ lb.dataset.bound='1';
      lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target.closest('.lb-close')) lb.classList.remove('open');
      });
    }
  }
  bindLightbox();
  window.bindLightbox = bindLightbox; // hydrate can re-bind after injecting images

  /* ── Nav active link (home anchors) ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  if (sections.length && navLinks.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            var href = a.getAttribute('href') || '';
            a.classList.toggle('active', href === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ── Contact form feedback (no backend yet) ── */
  var form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var orig = btn.innerHTML;
      btn.innerHTML = 'Message envoyé';
      btn.style.background = '#1E7A3D';
      btn.style.color = '#fff';
      setTimeout(function () { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 4200);
    });
  }

});
