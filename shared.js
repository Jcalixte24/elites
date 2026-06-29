document.addEventListener('DOMContentLoaded', function () {

  /* ── Splash ── */
  var splash = document.getElementById('splash');
  var spLogo = document.getElementById('spLogo');
  var navLogo = document.getElementById('navLogo');
  if (spLogo && navLogo) spLogo.src = navLogo.src;
  if (splash) {
    window.addEventListener('load', function () {
      setTimeout(function () { splash.classList.add('hide'); }, 950);
    });
  }

  /* ── Mobile overlay keyboard close ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var mob = document.getElementById('mob');
      if (mob) mob.classList.remove('open');
      var lb = document.getElementById('lightbox');
      if (lb) lb.classList.remove('open');
    }
  });

  /* ── Scroll reveal ── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { revObs.observe(el); });

  /* ── Animated counters ── */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        var duration = 1800;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cntObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cntObs.observe(el); });
  }

  /* ── Gallery lightbox ── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  if (lb && lbImg) {
    document.querySelectorAll('.gf-item, .gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); }
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close')) lb.classList.remove('open');
    });
  }

  /* ── Nav active link on home page ── */
  var sections = document.querySelectorAll('section[id], div[id="stats"]');
  if (sections.length) {
    var navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ── Contact form feedback ── */
  var form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = '#25a244';
      setTimeout(function () { btn.textContent = orig; btn.style.background = ''; }, 4000);
    });
  }

});
