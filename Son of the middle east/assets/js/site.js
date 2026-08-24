/* Son of the Middle East — site behaviour.
   Product content lives in fragrances.js; this file only renders it. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Collection ──────────────────────────────────────────────────────── */

  function noteRow(key, values) {
    return (
      '<div class="notes__row">' +
        '<span class="notes__key">' + key + '</span>' +
        '<p class="notes__val">' + values.join(', ') + '</p>' +
      '</div>'
    );
  }

  function card(f) {
    var price = f.price
      ? '<p class="card__price">' + f.price + '</p>'
      : '<p class="card__price card__price--ask">Ask in store</p>';

    return (
      '<li class="card reveal">' +
        '<div class="card__media">' +
          '<img src="' + f.image + '" alt="' + f.name + ' eau de parfum" loading="lazy">' +
        '</div>' +
        '<div class="card__body">' +
          '<h3 class="card__name">' + f.name + '</h3>' +
          '<p class="card__line">' + f.line + '</p>' +
          '<p class="card__blurb">' + f.blurb + '</p>' +
          '<div class="notes">' +
            noteRow('Top', f.notes.top) +
            noteRow('Heart', f.notes.heart) +
            noteRow('Base', f.notes.base) +
          '</div>' +
          '<div class="card__foot">' +
            price +
            '<p class="card__size">' + f.size + '</p>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  }

  var grid = document.getElementById('grid');
  if (grid && typeof FRAGRANCES !== 'undefined') {
    grid.innerHTML = FRAGRANCES.map(card).join('');
  }

  if (typeof DRAFT !== 'undefined' && DRAFT) {
    var note = document.getElementById('draftNote');
    if (note) note.hidden = false;
  }

  /* ── Scroll progress: the sillage fill + mobile bar ───────────────────── */

  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  var fill = document.querySelector('.sillage__fill');
  var topbar = document.querySelector('.topbar');
  var ticking = false;

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

    bar.style.transform = 'scaleX(' + pct + ')';
    if (fill) fill.style.transform = 'scaleY(' + pct + ')';
    if (topbar) topbar.classList.toggle('is-stuck', window.scrollY > 40);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ── Active section on the rail ───────────────────────────────────────── */

  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-node]'));
  var sections = nodes
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        nodes.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */

  var revealables = document.querySelectorAll(
    '.section__head, .split__text, .split__figure, .stage, .facts, .grid__foot, .draft-note'
  );
  Array.prototype.forEach.call(revealables, function (el) { el.classList.add('reveal'); });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      el.classList.add('is-in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      io.observe(el);
    });
  }

  /* ── Hero video: don't autoplay for reduced-motion visitors ───────────── */

  var video = document.querySelector('.hero__video');
  if (video && reduceMotion) { video.removeAttribute('autoplay'); video.pause(); }

  /* ── Year ─────────────────────────────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
