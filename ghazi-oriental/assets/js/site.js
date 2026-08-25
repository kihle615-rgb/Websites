/* ==========================================================================
   GHAZI ORIENTAL  —  page behaviour
   --------------------------------------------------------------------------
   Five jobs, in order:

     1. hold a preloader until the film has frames to show
     2. scrub the film with the scroll wheel, and swap the words with it
     3. keep the bar, the chapter readout and the reveals in step
     4. print the price list from SIZES
     5. print and filter the index from FRAGRANCES

   Product data lives in catalogue.js. Nothing in here needs editing to
   change a fragrance or a price.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (n, a, b) { return n < a ? a : n > b ? b : n; };


  /* ------------------------------------------------------------------------
     1. PRELOADER
     The counter tracks two things: the page's own load event and the film
     having enough data to paint. Whichever is slower sets the pace.
     ---------------------------------------------------------------------- */

  var load      = $('#load');
  var loadCount = $('#loadCount');
  var loadRing  = $('#loadRing');
  var video     = $('#film');

  var progress = 0;
  var ready = { page: false, film: false };
  var RING = 302;

  function paintLoader() {
    var target = (ready.page ? 50 : 0) + (ready.film ? 50 : 0);
    progress += (target - progress) * 0.12;
    if (target - progress < 0.6) progress = target;

    var shown = Math.round(progress);
    loadCount.textContent = shown < 10 ? '0' + shown : String(shown);
    loadRing.style.strokeDashoffset = String(RING - (RING * progress) / 100);

    if (progress >= 100) { finishLoader(); return; }
    requestAnimationFrame(paintLoader);
  }

  var loaderDone = false;
  function finishLoader() {
    if (loaderDone) return;
    loaderDone = true;
    load.setAttribute('data-done', 'true');
    load.setAttribute('aria-label', 'Loaded');
    window.setTimeout(function () { load.hidden = true; }, 900);
  }

  if (document.readyState === 'complete') ready.page = true;
  else window.addEventListener('load', function () { ready.page = true; });

  function filmSettled() { ready.film = true; }

  if (video) {
    if (video.readyState >= 2) filmSettled();
    ['loadeddata', 'canplay', 'error', 'stalled'].forEach(function (ev) {
      video.addEventListener(ev, filmSettled);
    });
    /* a <source> that can't be played fires on the source, not the video —
       and leaves networkState at NETWORK_NO_SOURCE with no event at all */
    $$('source', video).forEach(function (s) { s.addEventListener('error', filmSettled); });
    var watch = window.setInterval(function () {
      if (ready.film || video.networkState === 3) { filmSettled(); window.clearInterval(watch); }
    }, 250);
  } else {
    filmSettled();
  }

  /* never hold the page hostage to a slow connection */
  window.setTimeout(function () { ready.page = true; ready.film = true; }, 3500);
  requestAnimationFrame(paintLoader);


  /* ------------------------------------------------------------------------
     2. THE FILM
     Scroll position drives currentTime. The seek is eased rather than set
     outright, so a flicked wheel reads as a camera move instead of a jump.

     If the browser can't keep up with seeking — some mobile decoders can't —
     the film gives up and simply loops, which still looks right.
     ---------------------------------------------------------------------- */

  var track = $('#filmTrack');
  var beats = $$('.beat');
  var hint  = $('#filmHint');

  var scrubbing = false;
  var seekTarget = 0;
  var seekCurrent = 0;
  var stalled = 0;

  function filmProgress() {
    if (!track) return 0;
    var box = track.getBoundingClientRect();
    var span = box.height - window.innerHeight;
    if (span <= 0) return 0;
    return clamp(-box.top / span, 0, 1);
  }

  function setBeat(p) {
    var i = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
    for (var n = 0; n < beats.length; n++) {
      beats[n].setAttribute('data-on', n === i ? 'true' : 'false');
    }
    if (hint) hint.style.opacity = p > 0.04 ? '0' : '1';
  }

  function giveUpScrubbing() {
    if (!scrubbing) return;
    scrubbing = false;
    if (video) { video.loop = true; video.play().catch(function () {}); }
  }

  function scrubFrame() {
    if (!scrubbing) return;

    var d = video.duration;
    if (d && isFinite(d)) {
      seekCurrent += (seekTarget * d - seekCurrent) * 0.14;
      var want = clamp(seekCurrent, 0, d - 0.05);
      var gap = Math.abs(video.currentTime - want);

      /* a decoder that accepts the seek but never lands on the frame leaves
         this gap open — after a second of that, stop fighting it and loop */
      if (gap > 0.25) {
        stalled++;
        if (stalled > 60) { giveUpScrubbing(); return; }
      } else {
        stalled = 0;
      }

      if (!video.seeking && gap > 0.03) video.currentTime = want;
    }
    requestAnimationFrame(scrubFrame);
  }

  function startFilm() {
    if (!video || !track) return;

    if (reduced.matches) {
      video.pause();
      video.removeAttribute('autoplay');
      setBeat(0);
      return;
    }

    /* let it autoplay first so the decoder has real frames, then take over */
    var take = function () {
      if (scrubbing) return;
      video.pause();
      video.loop = false;
      scrubbing = true;
      seekTarget = filmProgress();
      seekCurrent = seekTarget * (video.duration || 0);
      requestAnimationFrame(scrubFrame);
    };

    if (video.readyState >= 2) window.setTimeout(take, 400);
    else video.addEventListener('loadeddata', function () { window.setTimeout(take, 400); });
  }


  /* ------------------------------------------------------------------------
     3. SCROLL — bar, chapter readout, mandala, beats
     One listener, one rAF tick, everything reads from it.
     ---------------------------------------------------------------------- */

  var bar      = $('#bar');
  var mandala  = $('#mandala');
  var chapNum  = $('#chapterNum');
  var chapName = $('#chapterName');
  var navLinks = $$('#nav a');

  var CHAPTERS = [
    { id: 'top',    num: 'I',   name: 'The film' },
    { id: 'house',  num: 'II',  name: 'The house' },
    { id: 'prices', num: 'III', name: 'Prices' },
    { id: 'index',  num: 'IV',  name: 'The index' },
    { id: 'visit',  num: 'V',   name: 'Visit' }
  ];

  var currentChapter = -1;
  var ticking = false;

  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;

    if (bar) bar.setAttribute('data-solid', y > 40 ? 'true' : 'false');

    var p = filmProgress();
    setBeat(p);
    if (scrubbing) seekTarget = p;

    if (mandala && !reduced.matches) {
      mandala.style.transform = 'rotate(' + (y * 0.02).toFixed(2) + 'deg)';
    }

    /* whichever chapter owns the middle of the screen */
    var mid = y + window.innerHeight * 0.45;
    var found = 0;
    for (var i = 0; i < CHAPTERS.length; i++) {
      var el = document.getElementById(CHAPTERS[i].id);
      if (el && el.offsetTop <= mid) found = i;
    }
    if (found !== currentChapter) {
      currentChapter = found;
      if (chapNum) chapNum.textContent = CHAPTERS[found].num;
      if (chapName) chapName.textContent = CHAPTERS[found].name;
      var hash = '#' + CHAPTERS[found].id;
      navLinks.forEach(function (a) {
        a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'true' : 'false');
      });
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);


  /* ------------------------------------------------------------------------
     4. REVEALS
     ---------------------------------------------------------------------- */

  var revealables = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduced.matches) {
    revealables.forEach(function (el) { el.setAttribute('data-shown', 'true'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-shown', 'true');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }


  /* ------------------------------------------------------------------------
     5. THE PRICE LIST
     ---------------------------------------------------------------------- */

  var sizesEl = $('#sizes');
  if (sizesEl && typeof SIZES !== 'undefined') {
    var frag = document.createDocumentFragment();
    SIZES.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'size';

      var ml = document.createElement('span');
      ml.className = 'size__ml';
      ml.textContent = s.ml + ' ml';

      var price = document.createElement('span');
      price.className = 'size__price';
      price.textContent = s.price;

      var note = document.createElement('span');
      note.className = 'size__note';
      note.textContent = 'Any fragrance in the index.';

      li.appendChild(ml); li.appendChild(price); li.appendChild(note);
      frag.appendChild(li);
    });
    sizesEl.appendChild(frag);
  }


  /* ------------------------------------------------------------------------
     6. THE INDEX
     Sort, group by first letter, filter, search. Matches are marked so the
     eye lands on the right row without reading the whole column.
     ---------------------------------------------------------------------- */

  var listEl   = $('#list');
  var emptyEl  = $('#empty');
  var tallyEl  = $('#tally');
  var searchEl = $('#search');
  var filterEls = $$('.filter');

  var TAGS = { her: 'Ladies', him: 'Gentlemen', unisex: 'Unisex' };
  var mode = 'all';

  function fold(s) {
    return s.normalize ? s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                       : s.toLowerCase();
  }

  function initial(name) {
    var k = fold(name).replace(/^[^0-9a-z]+/, '');
    return /^[0-9]/.test(k) ? '#' : (k.charAt(0) || '#').toUpperCase();
  }

  var ALL = (typeof FRAGRANCES === 'undefined' ? [] : FRAGRANCES).map(function (f) {
    return {
      name: f.name,
      roles: f.for.split(/\s+/),
      key: fold(f.name),
      letter: initial(f.name)
    };
  }).sort(function (a, b) {
    var an = a.letter === '#', bn = b.letter === '#';
    if (an !== bn) return an ? -1 : 1;
    var ak = a.key.replace(/^[^0-9a-z]+/, ''), bk = b.key.replace(/^[^0-9a-z]+/, '');
    return ak < bk ? -1 : ak > bk ? 1 : 0;
  });

  /* name, with the matched run wrapped in <mark> — built as nodes, never HTML */
  function nameNode(name, q) {
    var span = document.createElement('span');
    span.className = 'scent__name';
    var at = q ? fold(name).indexOf(q) : -1;
    if (at < 0) { span.textContent = name; return span; }
    span.appendChild(document.createTextNode(name.slice(0, at)));
    var m = document.createElement('mark');
    m.textContent = name.slice(at, at + q.length);
    span.appendChild(m);
    span.appendChild(document.createTextNode(name.slice(at + q.length)));
    return span;
  }

  function tagFor(roles) {
    if (roles.indexOf('unisex') > -1) return { text: TAGS.unisex, key: 'unisex' };
    return {
      text: roles.map(function (r) { return TAGS[r]; }).filter(Boolean).join(' · '),
      key: roles.join(' ')
    };
  }

  function matches(f, q) {
    if (mode === 'unisex' && f.roles.indexOf('unisex') === -1) return false;
    if (mode === 'her' && f.roles.indexOf('her') === -1) return false;
    if (mode === 'him' && f.roles.indexOf('him') === -1) return false;
    return !q || f.key.indexOf(q) > -1;
  }

  function render() {
    var q = fold((searchEl && searchEl.value || '').trim());
    var shown = ALL.filter(function (f) { return matches(f, q); });

    var frag = document.createDocumentFragment();
    var letter = null, group = null, items = null;

    shown.forEach(function (f) {
      if (f.letter !== letter) {
        letter = f.letter;
        group = document.createElement('section');
        group.className = 'letter';

        var h = document.createElement('h3');
        h.className = 'letter__head';
        var say = document.createElement('span');
        say.className = 'vh';
        say.textContent = letter === '#' ? 'Names starting with a number' : 'Names starting with ';
        h.appendChild(say);
        if (letter !== '#') h.appendChild(document.createTextNode(letter));
        else { var hash = document.createElement('span'); hash.setAttribute('aria-hidden','true'); hash.textContent = '#'; h.appendChild(hash); }
        group.appendChild(h);

        items = document.createElement('ul');
        items.className = 'letter__items';
        group.appendChild(items);
        frag.appendChild(group);
      }

      var li = document.createElement('li');
      li.className = 'scent';
      li.appendChild(nameNode(f.name, q));

      var t = tagFor(f.roles);
      var tag = document.createElement('span');
      tag.className = 'scent__tag';
      tag.setAttribute('data-for', t.key);
      tag.textContent = t.text;
      li.appendChild(tag);

      items.appendChild(li);
    });

    listEl.textContent = '';
    listEl.appendChild(frag);

    if (emptyEl) emptyEl.hidden = shown.length !== 0;

    if (tallyEl) {
      var label = mode === 'all' ? 'fragrances'
                : mode === 'her' ? 'in the ladies collection'
                : mode === 'him' ? 'in the gentlemen collection'
                : 'worn by anyone';
      tallyEl.textContent = shown.length === 0
        ? 'No match in ' + ALL.length + ' fragrances'
        : shown.length + ' ' + label;
    }
  }

  if (listEl && ALL.length) {
    render();

    if (searchEl) {
      var queued = false;
      searchEl.addEventListener('input', function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; render(); });
      });
    }

    filterEls.forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.getAttribute('data-filter');
        filterEls.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        render();
      });
    });

    if (searchEl) searchEl.placeholder = 'Search ' + ALL.length + ' fragrances';
  }


  /* ------------------------------------------------------------------------
     go
     ---------------------------------------------------------------------- */

  startFilm();
  onScrollFrame();
  reduced.addEventListener && reduced.addEventListener('change', function () {
    window.location.reload();
  });
})();
