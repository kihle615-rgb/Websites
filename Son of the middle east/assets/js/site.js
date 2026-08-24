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

  /* ── Dropdown menu ────────────────────────────────────────────────────── */

  var menuBtn   = document.getElementById('menuBtn');
  var menuPanel = document.getElementById('menuPanel');
  var menuWrap  = document.getElementById('menu');

  if (menuBtn && menuPanel && menuWrap) {
    var menuLinks = Array.prototype.slice.call(menuPanel.querySelectorAll('a'));

    var setMenu = function (open, returnFocus) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuPanel.hidden = !open;
      if (!open && returnFocus) menuBtn.focus();
    };
    var isOpen = function () { return menuBtn.getAttribute('aria-expanded') === 'true'; };

    menuBtn.addEventListener('click', function () { setMenu(!isOpen()); });

    // Anchors jump within the page, so close on the way out.
    menuLinks.forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setMenu(false, true); return; }
      if (!isOpen()) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var i = menuLinks.indexOf(document.activeElement);
      var next = e.key === 'ArrowDown'
        ? (i < 0 ? 0 : (i + 1) % menuLinks.length)
        : (i <= 0 ? menuLinks.length - 1 : i - 1);
      menuLinks[next].focus();
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !menuWrap.contains(e.target)) setMenu(false);
    });

    // Opening with the keyboard should land on the first item. stopPropagation
    // matters: without it the document handler below also runs on this same
    // keypress and advances focus a second time, landing on item two.
    menuBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen()) setMenu(true);
        if (menuLinks[0]) menuLinks[0].focus();
      }
    });
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
    '.section__head, .split__text, .split__figure, .stage, .facts, .grid__foot, ' +
    '.draft-note, .era, .contact-card, .map, .reason, .material'
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

  /* ── Map: fall back to an address panel if the embed can't load ───────── */

  var mapBox   = document.getElementById('map');
  var mapFrame = document.getElementById('mapFrame');
  var mapTpl   = document.getElementById('mapFallback');

  if (mapBox && mapFrame && mapTpl) {
    var settled = false;
    var useFallback = function () {
      if (settled) return;
      settled = true;
      if (mapFrame.parentNode) mapFrame.remove();
      mapBox.appendChild(mapTpl.content.cloneNode(true));
    };

    // A blocked iframe still fires `load` for the browser's own error page, so
    // the iframe cannot report its own failure. Probe the host instead: with
    // mode:'no-cors' a reachable host resolves opaquely and a blocked one rejects.
    if (window.fetch) {
      window.fetch('https://maps.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' })
        .then(function () { settled = true; })
        .catch(useFallback);
    }
    window.setTimeout(useFallback, 6000);   // backstop for a hanging request
  }

  /* ── Highlight today in the opening hours ─────────────────────────────── */

  var todayRow = document.querySelector('#hours tr[data-day="' + new Date().getDay() + '"]');
  if (todayRow) {
    todayRow.classList.add('is-today');
    var th = todayRow.querySelector('th');
    if (th) {
      var tag = document.createElement('span');
      tag.className = 'hours__today';
      tag.textContent = ' — today';
      th.appendChild(tag);
    }
  }

  /* ── Year ─────────────────────────────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
