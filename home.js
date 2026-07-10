/* Sierra Estates — home page logic.
   Depends on data.js (window.HZDATA) and shared.js (window.HZ). Loaded with defer. */
(function () {
  'use strict';
  var D = window.HZDATA;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══ render dynamic content (before HZ.mount so i18n/icons/reveal apply) ═══ */

  /* hero slides + dots — only the first image loads eagerly */
  document.getElementById('hero-slides').innerHTML = D.slides.map(function (s, i) {
    var attrs = i === 0 ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
    return '<div class="slide' + (i === 0 ? ' on' : '') + '"><img src="' + s.img + '" alt=""' + attrs + '/></div>';
  }).join('');
  document.getElementById('hero-dots').innerHTML = D.slides.map(function (_, i) {
    return '<button type="button"' + (i === 0 ? ' class="on"' : '') + ' aria-label="Slide ' + (i + 1) + '"></button>';
  }).join('');

  /* featured properties (6) */
  document.getElementById('prop-grid').innerHTML = D.listings.slice(0, 6).map(HZ.pcard).join('');

  /* compound tiles */
  var picks = ['Hyde Park New Cairo', 'Mivida', 'Mountain View iCity', 'Eastown (SODIC)'];
  document.getElementById('comp-grid').innerHTML = picks.map(function (n, i) {
    var c = D.compounds.find(function (x) { return x.n === n; });
    if (!c) return '';
    return '<a class="comp rv d' + (i + 1) + '" href="compounds.html?cpd=' + encodeURIComponent(c.n) + '">' +
      '<img src="' + D.compoundImgs[n] + '" alt="' + c.n + '" loading="lazy" decoding="async"/>' +
      '<div class="co-scrim"></div>' +
      '<div class="co-count">AI ' + c.ai.toFixed(1) + ' · ' + c.g + '</div>' +
      '<div class="co-body"><h4>' + c.n + '</h4><span>' + c.z + ' · EGP ' + c.priceM + 'M avg</span></div></a>';
  }).join('');

  /* testimonials */
  var star = '<i data-lucide="star" class="i"></i>';
  document.getElementById('testi-grid').innerHTML = [1, 2, 3].map(function (n, i) {
    var nm = HZ.t('t' + n + 'n');
    var initials = nm.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('');
    return '<div class="tcard rv d' + (i + 1) + '">' +
      '<div class="stars" aria-hidden="true">' + star + star + star + star + star + '</div>' +
      '<p>“' + HZ.t('t' + n + 'q') + '”</p>' +
      '<div class="who"><span class="av" aria-hidden="true">' + initials + '</span><span><b>' + nm + '</b><small>' + HZ.t('t' + n + 'r') + '</small></span></div></div>';
  }).join('');

  /* market ticker (decorative, duplicated for the loop) */
  var tickItems = HZ.lang() === 'ar'
    ? ['ماونتن فيو +24%', 'أب تاون كايرو +31%', 'ميفيدا إيجار من $1,700/شهر', 'هايد بارك AI 9.8', 'الرحاب عائد 8.1%', 'مدينتي طلب متزايد']
    : ['Mountain View iCity +24%', 'Uptown Cairo +31%', 'Mivida rentals from $1,700/mo', 'Hyde Park AI score 9.8', 'Villette yield 8.1%', 'Taj City demand rising'];
  document.getElementById('ticker-row').innerHTML = tickItems.concat(tickItems).map(function (s) { return '<span>' + s + '</span>'; }).join('');

  /* AI hub cards */
  var AI_IC = {
    engine: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="20" stroke="#C8961A" stroke-width="1" stroke-dasharray="4 3" opacity=".4"><animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="8s" repeatCount="indefinite"/></circle><circle cx="24" cy="24" r="13" stroke="#E9C176" stroke-width="1" stroke-dasharray="3 4" opacity=".3"><animateTransform attributeName="transform" type="rotate" from="360 24 24" to="0 24 24" dur="5s" repeatCount="indefinite"/></circle><circle cx="24" cy="11" r="2.5" fill="#C8961A"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle><circle cx="24" cy="24" r="4" fill="#E9C176"><animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite"/></circle></svg>',
    match: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="18" stroke="#4ade80" stroke-width="1.5"><animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;0;.5" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="24" cy="24" r="5" fill="#4ade80"/><path d="M21.5 24 L23.5 26.5 L27.5 21" stroke="#071524" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    roi: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="7" y="30" width="7" height="10" rx="2" fill="#f59e0b" opacity=".5"><animate attributeName="height" values="3;10;3" dur="2.2s" repeatCount="indefinite"/><animate attributeName="y" values="37;30;37" dur="2.2s" repeatCount="indefinite"/></rect><rect x="17" y="22" width="7" height="18" rx="2" fill="#f59e0b" opacity=".75"><animate attributeName="height" values="7;18;7" dur="2.2s" begin=".35s" repeatCount="indefinite"/><animate attributeName="y" values="33;22;33" dur="2.2s" begin=".35s" repeatCount="indefinite"/></rect><rect x="27" y="13" width="7" height="27" rx="2" fill="#f59e0b"><animate attributeName="height" values="12;27;12" dur="2.2s" begin=".7s" repeatCount="indefinite"/><animate attributeName="y" values="28;13;28" dur="2.2s" begin=".7s" repeatCount="indefinite"/></rect></svg>',
    price: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 8 L32 8 L40 24 L32 40 L8 40 Z" stroke="#a78bfa" stroke-width="1.5" fill="rgba(167,139,250,.08)"/><circle cx="15" cy="18" r="3" stroke="#a78bfa" stroke-width="1.5"/><text x="26" y="30" text-anchor="middle" font-weight="700" font-size="15" fill="#a78bfa" font-family="monospace">$<animate attributeName="opacity" values="1;.25;1" dur="1.8s" repeatCount="indefinite"/></text></svg>',
    dream: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 10 L36 22 L33 22 L33 36 L15 36 L15 22 L12 22 Z" fill="#f472b6" opacity=".9"/><rect x="20" y="27" width="8" height="9" fill="#07121E" rx="1"/><g><animateTransform attributeName="transform" type="rotate" from="0 24 23" to="360 24 23" dur="3s" repeatCount="indefinite"/><circle cx="40" cy="23" r="2.2" fill="#f472b6"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle></g></svg>',
    imap: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="3" stroke="#C8961A" stroke-width="1.3" fill="rgba(200,150,26,.07)"/><circle cx="24" cy="23" r="5" fill="rgba(200,150,26,.2)" stroke="#C8961A" stroke-width="1.5"><animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle><circle cx="24" cy="23" r="2.5" fill="#C8961A"/></svg>',
    tour: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="18" stroke="#38bdf8" stroke-width="1.3" fill="rgba(56,189,248,.07)"/><ellipse cx="24" cy="24" rx="18" ry="7" stroke="#38bdf8" stroke-width="1" fill="none" opacity=".4"/><circle cx="24" cy="24" r="4" fill="#38bdf8"><animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite"/></circle><path d="M20 21 L28 24 L20 27 Z" fill="#fff" opacity=".9"/></svg>'
  };
  var aiTools = [
    { k: 'engine', t: 'ai1t', s: 'ai1s', live: true, href: 'ai-engine.html' },
    { k: 'match', t: 'ai2t', s: 'ai2s', href: 'matches.html' },
    { k: 'roi', t: 'ai3t', s: 'ai3s', href: 'roi.html' },
    { k: 'price', t: 'ai4t', s: 'ai4s', href: 'pricing.html' },
    { k: 'dream', t: 'ai5t', s: 'ai5s', href: 'advice.html' },
    { k: 'imap', t: 'ai6t', s: 'ai6s', href: 'compounds.html' },
    { k: 'tour', t: 'ai7t', s: 'ai7s', tour: true }
  ];
  document.getElementById('ai-grid').innerHTML = aiTools.map(function (tool, i) {
    return '<' + (tool.tour ? 'button' : 'a') + ' class="ai-card rv d' + ((i % 4) + 1) + '"' +
      (tool.tour ? ' type="button" id="ai-tour-card"' : ' href="' + tool.href + '"') + '>' +
      '<span class="ai-ic">' + AI_IC[tool.k] + '</span>' +
      '<h4 data-i18n="' + tool.t + '"></h4>' +
      '<p data-i18n="' + tool.s + '"></p>' +
      (tool.live ? '<span class="live-tag" data-i18n="aiLive"></span>' : '') +
      '</' + (tool.tour ? 'button' : 'a') + '>';
  }).join('');

  /* AI tool preview cards */
  var previews = [
    { href: 'matches.html', t: 'ai2t', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
    { href: 'pricing.html', t: 'ai4t', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
    { href: 'roi.html', t: 'ai3t', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80' }
  ];
  document.getElementById('ai-previews').innerHTML = previews.map(function (p) {
    return '<a href="' + p.href + '" class="ai-prev">' +
      '<img src="' + p.img + '" alt="" loading="lazy" decoding="async"/>' +
      '<div class="ap-scrim"></div>' +
      '<div class="ap-body"><div class="ap-live" data-i18n="aiLive"></div><div class="ap-tit" data-i18n="' + p.t + '"></div></div></a>';
  }).join('');

  /* inquiry selects */
  document.getElementById('inq-zone').innerHTML = ['z1', 'z2', 'z3', 'z4'].map(function (k) { return '<option data-i18n="' + k + '"></option>'; }).join('');
  document.getElementById('inq-type').innerHTML = ['lVilla', 'lApt', 'lTwin', 'lPent'].map(function (k) { return '<option data-i18n="' + k + '"></option>'; }).join('');

  /* mount shared chrome — applies i18n, icons, reveal-on-scroll, counters */
  HZ.mount('home');

  /* ═══ hero slider ═══ */
  var isAr = HZ.lang() === 'ar';
  var slides = document.querySelectorAll('.hero .slide');
  var dots = document.querySelectorAll('.hero .dots button');
  var cur = 0, timer;
  function setSlide(n) {
    slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
    cur = ((n % D.slides.length) + D.slides.length) % D.slides.length;
    slides[cur].classList.add('on'); dots[cur].classList.add('on');
    var s = D.slides[cur];
    document.getElementById('hero-pre').textContent = isAr ? s.preAr : s.pre;
    var words = (isAr ? s.mainAr : s.main).split(' ');
    var hl = words.splice(-Math.min(3, Math.max(1, words.length - 1))).join(' ');
    document.getElementById('hero-main').innerHTML = words.join(' ') + ' <span class="hl">' + hl + '</span>';
  }
  function arm() { clearInterval(timer); timer = setInterval(function () { setSlide(cur + 1); }, 6500); }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { setSlide(i); arm(); }); });
  setSlide(0);
  if (!reduced) {
    arm();
    // don't advance slides while the tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else arm();
    });
  }

  /* ═══ search tabs (visual mode toggle) ═══ */
  document.querySelectorAll('.search-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.search-tabs button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
    });
  });

  /* ═══ inquiry form ═══ */
  var segButtons = document.querySelectorAll('#inq-seg button');
  segButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      segButtons.forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true');
    });
  });
  var inqForm = document.getElementById('inq-form');
  inqForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // No backend yet — acknowledge locally so the form isn't a dead end.
    document.getElementById('inq-done').classList.add('on');
    inqForm.querySelector('button[type="submit"]').disabled = true;
  });

  /* CTA "List your property" → inquiry form with "Sell" preselected */
  document.getElementById('cta-list').addEventListener('click', function () {
    var sell = segButtons[2];
    if (sell) sell.click();
    document.getElementById('inquiry').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    var name = document.getElementById('inq-name');
    if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, reduced ? 0 : 600);
  });

  /* ═══ 3D tour embed — poster first, iframe only on demand ═══ */
  (function () {
    var TOUR_SRC = 'https://listing3d.com/embed/r39d0bd4dde0a4fe693c7fe5fd230a896';
    var poster = document.getElementById('vtv-poster');
    var iframe = document.getElementById('vtv-iframe');
    var loading = document.getElementById('vtv-loading');
    var fsBtn = document.getElementById('vtv-fs');
    var frame = document.getElementById('vtv-frame');
    var loaded = false;
    poster.addEventListener('click', function () {
      if (loaded) return;
      loaded = true;
      loading.style.display = 'flex';
      poster.style.display = 'none';
      iframe.src = TOUR_SRC;
      iframe.onload = function () { loading.style.display = 'none'; iframe.style.opacity = '1'; fsBtn.style.display = 'grid'; };
    });
    fsBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (frame.requestFullscreen) frame.requestFullscreen();
    });
  })();

  /* ═══ virtual tour modal (Three.js page in an iframe) ═══ */
  (function () {
    var modal = document.getElementById('tour-modal');
    var closeBtn = document.getElementById('tour-close');
    var lastFocus = null;
    function openTour() {
      var f = document.getElementById('tour-frame');
      if (!f.src) f.src = 'virtual-tour.html';
      lastFocus = document.activeElement;
      modal.classList.add('on');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeTour() {
      modal.classList.remove('on');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    document.getElementById('tour-open').addEventListener('click', openTour);
    var tourCard = document.getElementById('ai-tour-card');
    if (tourCard) tourCard.addEventListener('click', openTour);
    closeBtn.addEventListener('click', closeTour);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('on')) closeTour();
    });
  })();

  /* ═══ live compound map — Leaflet loaded lazily when the section nears view ═══ */
  (function () {
    var mapEl = document.getElementById('home-map');
    if (!mapEl) return;
    var CSS = [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css'
    ];
    var started = false;

    function loadScript(src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    function loadAssets() {
      CSS.forEach(function (href) {
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = href;
        document.head.appendChild(l);
      });
      return loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js').then(function () {
        return loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
      });
    }

    function initMap() {
      var featured = D.featured || [];
      var theme = HZ.theme();
      var map = L.map('home-map', { scrollWheelZoom: false, zoomControl: true }).setView([30.03, 31.57], 11);
      var tiles = {
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      };
      var layer = L.tileLayer(tiles[theme], { attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18 }).addTo(map);
      document.addEventListener('hzp:theme', function (e) { layer.setUrl(tiles[e.detail]); });

      function markerIcon(c, isFeatured) {
        var cls = 'cpd-marker' + (c.ai >= 9.2 ? ' hot' : '') + (isFeatured ? ' pulse' : '');
        return L.divIcon({ className: '', html: '<span class="' + cls + '" title="' + c.n + '">' + c.n + '</span>', iconSize: null });
      }
      var clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: function (cluster) {
          var count = cluster.getChildCount();
          var size = count >= 10 ? 'large' : count >= 5 ? 'medium' : 'small';
          return L.divIcon({ className: 'cpd-cluster cpd-cluster-' + size, html: '<span>' + count + '</span>', iconSize: [40, 40] });
        }
      });
      D.compounds.forEach(function (c) {
        var marker = L.marker(c.c, { icon: markerIcon(c, featured.indexOf(c.n) >= 0), title: c.n });
        marker.on('click', function () { location.href = 'compounds.html?cpd=' + encodeURIComponent(c.n); });
        clusterGroup.addLayer(marker);
      });
      map.addLayer(clusterGroup);
      try { map.fitBounds(clusterGroup.getBounds(), { padding: [40, 40], maxZoom: 13 }); } catch (e) {}
      requestAnimationFrame(function () { map.invalidateSize(); });
      window.addEventListener('resize', function () { map.invalidateSize(); });
    }

    function start() {
      if (started) return;
      started = true;
      loadAssets().then(initMap).catch(function () { /* map is progressive enhancement — page works without it */ });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
      }, { rootMargin: '600px 0px' });
      io.observe(mapEl);
    } else {
      start();
    }
  })();

  /* icons for content rendered after mount */
  HZ.refreshIcons();
  HZ.reveal();
})();
