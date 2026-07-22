/**
 * Sierra Estates — Client Portal Home Page (Compounds Intelligence Map)
 */
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sierra Estates · Compounds & Intelligence Map',
  description:
    'Live Leaflet intelligence map — 29 New Cairo compounds, AI score & growth, theme-aware tiles, ready & under-construction unit filters.',
  alternates: { canonical: 'https://sierra-estates.net/' },
  openGraph: {
    type: 'website',
    title: 'Sierra Estates · Compounds & Intelligence Map',
    description:
      'Live Leaflet intelligence map — 29 New Cairo compounds, AI score & growth, theme-aware tiles.',
    url: 'https://sierra-estates.net/',
    images: [{ url: '/assets/logo-gold.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function ClientHomePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="/client-page/shared.css" />

      <div id="site-chrome" suppressHydrationWarning />

      <header className="page-hero" data-screen-label="Compounds hero">
        <div className="wrap">
          <div className="crumbs">
            <a href="index.html" data-i18n="crumbHome">Home</a>
            <span className="sep">/</span>
            <span data-i18n="navCpds">Compounds</span>
          </div>
          <h1 data-i18n="cpdsTit">New Cairo Compounds</h1>
          <p className="sub" data-i18n="cpdsSub">Explore 29 top compounds with live market intelligence, pricing benchmarks, and available units.</p>
        </div>
      </header>

      <section className="block" data-screen-label="Intelligence map">
        <div className="wrap">
          {/* ADVANCED FILTER BAR */}
          <div className="af-bar rv" id="af-bar">
            {/* Search */}
            <div className="af-search">
              <i data-lucide="search" className="i" />
              <input type="text" id="cpd-search" placeholder="Search compounds, zones..." />
              <button className="cs-clear" id="cpd-search-clear" type="button" aria-label="Clear" style={{ display: 'none' }}>×</button>
            </div>

            {/* Property Type */}
            <div className="af-group">
              <label className="af-label" data-i18n="afType">Type</label>
              <div className="af-chips" id="af-type">
                <button className="af-chip on" data-type="all" type="button">All</button>
                <button className="af-chip" data-type="Apartment" type="button">Apartment</button>
                <button className="af-chip" data-type="Villa" type="button">Villa</button>
                <button className="af-chip" data-type="Townhouse" type="button">Townhouse</button>
                <button className="af-chip" data-type="Twin House" type="button">Twin House</button>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="af-group">
              <label className="af-label" data-i18n="afBeds">Bedrooms</label>
              <div className="af-chips" id="af-beds">
                <button className="af-chip on" data-beds="0" type="button">Any</button>
                <button className="af-chip" data-beds="1" type="button">1+</button>
                <button className="af-chip" data-beds="2" type="button">2+</button>
                <button className="af-chip" data-beds="3" type="button">3+</button>
                <button className="af-chip" data-beds="4" type="button">4+</button>
                <button className="af-chip" data-beds="5" type="button">5+</button>
              </div>
            </div>

            {/* Price Range */}
            <div className="af-group af-price-group">
              <label className="af-label" data-i18n="afPrice">Price (EGP M)</label>
              <div className="af-price">
                <input type="number" id="af-price-min" placeholder="Min" min="0" step="0.5" />
                <span className="af-price-sep">—</span>
                <input type="number" id="af-price-max" placeholder="Max" min="0" step="0.5" />
              </div>
            </div>

            {/* Delivery Status */}
            <div className="af-group">
              <label className="af-label" data-i18n="afDelivery">Delivery</label>
              <div className="af-chips" id="af-delivery">
                <button className="af-chip on" data-delivery="all" type="button">Any</button>
                <button className="af-chip" data-delivery="ready" type="button">Ready to Move</button>
                <button className="af-chip" data-delivery="under_construction" type="button">Under Construction</button>
              </div>
            </div>

            {/* Mode (sale/rent) */}
            <div className="af-group">
              <label className="af-label" data-i18n="afMode">Mode</label>
              <div className="af-seg" id="af-mode">
                <button className="on" data-m="all" type="button" data-i18n="modeAll">All</button>
                <button data-m="sale" type="button" data-i18n="modeSale">Sale</button>
                <button data-m="rent" type="button" data-i18n="modeRent">Rent</button>
              </div>
            </div>

            {/* Clear all */}
            <button className="af-clear" id="af-clear" type="button">
              <i data-lucide="rotate-ccw" className="i" style={{ width: '13px', height: '13px' }} />
              <span>Clear</span>
            </button>

            {/* Result count */}
            <div className="af-count" id="af-count">— units</div>
          </div>

          {/* Zone chips */}
          <div className="zone-chips" id="zone-chips" suppressHydrationWarning />

          <div className="map-shell rv">
            <div id="cpd-map" suppressHydrationWarning />
            <aside className="intel" id="intel" suppressHydrationWarning>
              <div className="hint">
                <i data-lucide="mouse-pointer-click" className="i" />
                <span data-i18n="mapHint">Tap any compound on the map or list to view market intelligence</span>
              </div>
            </aside>
          </div>

          <div className="grid-cpds" id="cpd-cards" suppressHydrationWarning />
          <div className="cpd-empty" id="cpd-empty" style={{ display: 'none' }} data-i18n="noCpd">No compounds found</div>
        </div>
      </section>

      <footer id="site-footer" suppressHydrationWarning />

      {/* UNITS SHEET */}
      <div className="sheet-overlay" id="sheet-ov">
        <div className="sheet" role="dialog" aria-modal="true">
          <div className="sh-head">
            <div>
              <h3 id="sh-title" />
              <div className="sub" id="sh-sub" />
            </div>
            <button className="sh-close" id="sh-close" type="button" aria-label="Close">
              <i data-lucide="x" className="i" />
            </button>
          </div>
          <div className="sh-filters">
            <div className="shf">
              <label data-i18n="shCompound">Compound</label>
              <select id="shf-cpd" />
            </div>
            <div className="shf">
              <label data-i18n="shBeds">Beds</label>
              <select id="shf-beds">
                <option value="0" data-i18n="shAnyBeds">Any</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div className="shf-seg" id="shf-mode">
              <button className="on" data-m="all" type="button" data-i18n="modeAll">All</button>
              <button data-m="sale" type="button" data-i18n="modeSale">Sale</button>
              <button data-m="rent" type="button" data-i18n="modeRent">Rent</button>
            </div>
            <span className="shf-count" id="shf-count" />
          </div>
          <div className="sh-scroll">
            <table>
              <thead>
                <tr id="sh-thead" />
              </thead>
              <tbody id="sh-tbody" />
            </table>
            <div className="sh-empty" id="sh-empty" style={{ display: 'none' }} data-i18n="shNoUnits">No matching units</div>
          </div>
        </div>
      </div>

      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js" strategy="beforeInteractive" />
      <Script src="/client-page/data.js" strategy="afterInteractive" />
      <Script src="/client-page/shared.js" strategy="afterInteractive" />
      <Script
        id="cpd-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  'use strict';
  function initPage() {
    if (!window.L || !window.HZDATA || !window.HZ) {
      setTimeout(initPage, 100);
      return;
    }
    var D = window.HZDATA;
    HZ.mount('cpds');

    var mapEl = document.getElementById('cpd-map');
    if (!mapEl || mapEl._leaflet_id) return;

    var map = L.map('cpd-map', { scrollWheelZoom: false, zoomControl: true, touchZoom: true, dragging: true }).setView([30.03, 31.57], 11);
    var tiles = {
      light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    };
    var layer = L.tileLayer(tiles[HZ.theme() || 'light'], { attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18 }).addTo(map);
    document.addEventListener('hzp:theme', function (e) { layer.setUrl(tiles[e.detail]); });

    setTimeout(function () { map.invalidateSize(); }, 200);
    setTimeout(function () { map.invalidateSize(); }, 800);
    window.addEventListener('resize', function () { map.invalidateSize(); });

    function unitPrice(u) {
      return u.mode === 'rent' ? '$' + u.usd.toLocaleString() + '/mo' : 'EGP ' + u.egpM.toFixed(1) + 'M';
    }

    var shState = { cpd: null, type: 'all', beds: 0, priceMin: null, priceMax: null, delivery: 'all', mode: 'all' };

    function renderSheet() {
      var c = shState.cpd;
      if (!c) return;
      var all = D.unitsFor(c.n);
      var units = all.filter(function (u) {
        if (shState.type !== 'all' && u.type !== shState.type) return false;
        if (shState.beds && u.beds < shState.beds) return false;
        if (shState.priceMin !== null && u.mode === 'sale' && u.egpM < shState.priceMin) return false;
        if (shState.priceMax !== null && u.mode === 'sale' && u.egpM > shState.priceMax) return false;
        if (shState.delivery !== 'all' && u.delivery !== shState.delivery) return false;
        if (shState.mode !== 'all' && u.mode !== shState.mode) return false;
        return true;
      });
      var st = document.getElementById('sh-title'), ss = document.getElementById('sh-sub'), sc = document.getElementById('shf-count');
      if (st) st.textContent = (HZ.t('unitsTit') || 'Units') + ' · ' + c.n;
      if (ss) ss.textContent = all.length + ' ' + (HZ.t('unitsWord') || 'units') + ' — ' + (HZ.t('unitsSub') || 'live available inventory');
      if (sc) sc.textContent = (HZ.t('shShowing') || 'Showing') + ' ' + units.length + ' ' + (HZ.t('shOf') || 'of') + ' ' + all.length;

      var th = document.getElementById('sh-thead');
      if (th) {
        th.innerHTML = ['thCode', 'thType', 'thBeds', 'thBath', 'thArea', 'thFloor', 'thPrice', 'thAI', 'thDelivery', 'thStatus', ''].map(function (k) {
          return '<th>' + (k ? HZ.t(k) || k : '') + '</th>';
        }).join('');
      }
      var tb = document.getElementById('sh-tbody');
      if (tb) {
        tb.innerHTML = units.map(function (u) {
          var rs = u.status === 'reserved';
          var dl = u.delivery === 'ready' ? 'Ready' : 'U/C';
          return '<tr class="' + (rs ? 'reserved' : '') + '" data-u="' + u.code + '">' +
            '<td class="mono">' + u.code + '</td>' +
            '<td>' + u.type + '</td>' +
            '<td class="mono">' + u.beds + '</td>' +
            '<td class="mono">' + u.bath + '</td>' +
            '<td class="mono">' + u.area + ' m²</td>' +
            '<td class="mono">' + u.floor + '</td>' +
            '<td class="mono">' + unitPrice(u) + '</td>' +
            '<td class="mono">' + u.ai.toFixed(1) + '</td>' +
            '<td><span class="st ' + (u.delivery === 'ready' ? 'av' : 'rs') + '">' + dl + '</span></td>' +
            '<td><span class="st ' + (rs ? 'rs' : 'av') + '">' + (rs ? 'Reserved' : 'Available') + '</span></td>' +
            '<td class="go">' + (rs ? '' : '<i data-lucide="arrow-right" class="i" style="width:15px;height:15px"></i>') + '</td></tr>';
        }).join('');
        tb.querySelectorAll('tr:not(.reserved)').forEach(function (tr) {
          tr.addEventListener('click', function () {
            location.href = 'property.html?cpd=' + encodeURIComponent(c.n) + '&u=' + encodeURIComponent(tr.getAttribute('data-u'));
          });
        });
      }
      var se = document.getElementById('sh-empty');
      if (se) se.style.display = units.length ? 'none' : 'block';
      if (window.lucide) lucide.createIcons();
    }

    function openSheet(c) {
      shState.cpd = c;
      shState.type = uf.type;
      shState.beds = uf.beds;
      shState.priceMin = uf.priceMin;
      shState.priceMax = uf.priceMax;
      shState.delivery = uf.delivery;
      shState.mode = uf.mode;
      var sel = document.getElementById('shf-cpd');
      if (sel) {
        sel.innerHTML = D.compounds.slice().sort(function (a, b) { return a.n.localeCompare(b.n); })
          .map(function (x) { return '<option value="' + x.n.replace(/"/g, '') + '"' + (x.n === c.n ? ' selected' : '') + '>' + x.n + ' (' + D.unitsFor(x.n).length + ')</option>'; }).join('');
      }
      var sb = document.getElementById('shf-beds');
      if (sb) sb.value = String(uf.beds);
      document.querySelectorAll('#shf-mode button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === uf.mode); });
      renderSheet();
      var ov = document.getElementById('sheet-ov');
      if (ov) ov.classList.add('on');
      document.body.style.overflow = 'hidden';
    }

    function closeSheet() {
      var ov = document.getElementById('sheet-ov');
      if (ov) ov.classList.remove('on');
      document.body.style.overflow = '';
    }

    var shCpd = document.getElementById('shf-cpd'), shBeds = document.getElementById('shf-beds'), shClose = document.getElementById('sh-close'), shOv = document.getElementById('sheet-ov');
    if (shCpd) shCpd.addEventListener('change', function () { var val = this.value; var c = D.compounds.find(function (x) { return x.n === val; }); if (c) { shState.cpd = c; renderSheet(); } });
    if (shBeds) shBeds.addEventListener('change', function () { shState.beds = parseInt(this.value, 10); renderSheet(); });
    document.querySelectorAll('#shf-mode button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('#shf-mode button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); shState.mode = b.getAttribute('data-m'); renderSheet();
      });
    });
    if (shClose) shClose.addEventListener('click', closeSheet);
    if (shOv) shOv.addEventListener('click', function (e) { if (e.target === this) closeSheet(); });

    function showIntel(c) {
      var el = document.getElementById('intel');
      if (!el) return;
      var units = D.unitsFor(c.n);
      el.innerHTML =
        '<h3>' + c.n + '</h3>' +
        '<div class="zone">' + c.z + ' · New Cairo</div>' +
        '<div class="metric"><span>Available Units</span><b class="link" id="intel-units">' + units.length + ' <i data-lucide="table-2" class="i" style="width:14px;height:14px"></i></b></div>' +
        '<div class="metric"><span>AI Score</span><b>' + c.ai.toFixed(1) + ' / 10</b></div>' +
        '<div class="metric"><span>1-yr Growth</span><b class="up">' + c.g + '</b></div>' +
        '<div class="metric"><span>Avg Price / m²</span><b>EGP ' + c.priceM + 'M</b></div>' +
        '<div class="metric"><span>Avg Rent</span><b>$' + c.rent.toLocaleString() + '/mo</b></div>' +
        '<button class="btn btn-pri" type="button" id="intel-open"><i data-lucide="table-2" class="i"></i> View Units Sheet (' + units.length + ')</button>';
      var iu = el.querySelector('#intel-units'), io = el.querySelector('#intel-open');
      if (iu) iu.addEventListener('click', function () { openSheet(c); });
      if (io) io.addEventListener('click', function () { openSheet(c); });
      if (window.lucide) lucide.createIcons();
    }

    var activeZone = 'all';
    var uf = { q: '', type: 'all', beds: 0, priceMin: null, priceMax: null, delivery: 'all', mode: 'all' };

    function matchesFilters(u) {
      if (uf.type !== 'all' && u.type !== uf.type) return false;
      if (uf.beds && u.beds < uf.beds) return false;
      if (uf.priceMin !== null && u.mode === 'sale' && u.egpM < uf.priceMin) return false;
      if (uf.priceMax !== null && u.mode === 'sale' && u.egpM > uf.priceMax) return false;
      if (uf.delivery !== 'all' && u.delivery !== uf.delivery) return false;
      if (uf.mode !== 'all' && u.mode !== uf.mode) return false;
      return true;
    }

    var markersMap = {};
    D.compounds.forEach(function (c) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="cpd-marker" id="cpd-mk-' + c.id + '"><span>' + c.n + '</span><span class="u" id="cpd-mk-u-' + c.id + '"></span></div>',
        iconSize: [120, 28], iconAnchor: [60, 14]
      });
      var m = L.marker([c.lat, c.lng], { icon: icon }).addTo(map);
      m.on('click', function () {
        showIntel(c);
        map.flyTo([c.lat, c.lng], 13.5, { duration: 0.8 });
      });
      markersMap[c.id] = { marker: m, compound: c };
    });

    function renderList() {
      var q = uf.q.trim().toLowerCase();
      var totalMatchingUnits = 0;

      var filtered = D.compounds.filter(function (c) {
        if (activeZone !== 'all' && c.z !== activeZone) return false;
        if (q && c.n.toLowerCase().indexOf(q) === -1 && (c.z || '').toLowerCase().indexOf(q) === -1) return false;
        var validUnits = D.unitsFor(c.n).filter(matchesFilters);
        return validUnits.length > 0;
      });

      D.compounds.forEach(function (c) {
        var validUnits = D.unitsFor(c.n).filter(matchesFilters);
        var entry = markersMap[c.id];
        var passesZoneAndSearch = (activeZone === 'all' || c.z === activeZone) && (!q || c.n.toLowerCase().indexOf(q) !== -1 || (c.z || '').toLowerCase().indexOf(q) !== -1);
        if (passesZoneAndSearch && validUnits.length > 0) {
          totalMatchingUnits += validUnits.length;
          if (entry) {
            entry.marker.getElement()?.classList.remove('zero');
            var uSpan = document.getElementById('cpd-mk-u-' + c.id);
            if (uSpan) uSpan.textContent = validUnits.length;
          }
        } else {
          if (entry) entry.marker.getElement()?.classList.add('zero');
        }
      });

      var ac = document.getElementById('af-count');
      if (ac) ac.textContent = totalMatchingUnits + ' units';

      var container = document.getElementById('cpd-cards');
      if (container) {
        container.innerHTML = filtered.map(function (c) {
          var validUnits = D.unitsFor(c.n).filter(matchesFilters);
          return '<div class="cpd-card" data-id="' + c.id + '">' +
            '<div class="top"><h4>' + c.n + '</h4><span class="ai-pill">AI ' + c.ai.toFixed(1) + '</span></div>' +
            '<div class="zline">' + c.z + ' · New Cairo</div>' +
            '<div class="meta"><span>Avg <b>EGP ' + c.priceM + 'M</b></span><span class="up">' + c.g + '</span></div>' +
            '<span class="u-link">' + validUnits.length + ' units available <i data-lucide="arrow-right" class="i" style="width:14px;height:14px"></i></span>' +
          '</div>';
        }).join('');

        container.querySelectorAll('.cpd-card').forEach(function (card) {
          var id = card.getAttribute('data-id');
          var c = D.compounds.find(function (x) { return String(x.id) === id; });
          if (!c) return;
          card.addEventListener('click', function () {
            showIntel(c);
            map.flyTo([c.lat, c.lng], 13.5, { duration: 0.8 });
          });
        });
      }
      var emptyEl = document.getElementById('cpd-empty');
      if (emptyEl) emptyEl.style.display = filtered.length ? 'none' : 'block';
      if (window.lucide) lucide.createIcons();
    }

    /* Zone chips */
    var zones = ['all'].concat(Array.from(new Set(D.compounds.map(function (c) { return c.z; }))).sort());
    var zc = document.getElementById('zone-chips');
    if (zc) {
      zc.innerHTML = zones.map(function (z) {
        var count = z === 'all' ? D.compounds.length : D.compounds.filter(function (c) { return c.z === z; }).length;
        return '<button class="zchip ' + (z === 'all' ? 'on' : '') + '" data-z="' + z + '" type="button">' + (z === 'all' ? 'All Zones' : z) + ' <span class="zc-n">' + count + '</span></button>';
      }).join('');
      zc.querySelectorAll('.zchip').forEach(function (btn) {
        btn.addEventListener('click', function () {
          zc.querySelectorAll('.zchip').forEach(function (b) { b.classList.remove('on'); });
          btn.classList.add('on');
          activeZone = btn.getAttribute('data-z');
          renderList();
        });
      });
    }

    /* Filter listeners */
    var searchInp = document.getElementById('cpd-search'), searchClear = document.getElementById('cpd-search-clear');
    if (searchInp) {
      searchInp.addEventListener('input', function () {
        uf.q = this.value;
        if (searchClear) searchClear.style.display = uf.q ? 'block' : 'none';
        renderList();
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchInp) searchInp.value = '';
        uf.q = '';
        searchClear.style.display = 'none';
        renderList();
      });
    }

    document.querySelectorAll('#af-type .af-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#af-type .af-chip').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        uf.type = btn.getAttribute('data-type');
        renderList();
      });
    });

    document.querySelectorAll('#af-beds .af-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#af-beds .af-chip').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        uf.beds = parseInt(btn.getAttribute('data-beds'), 10);
        renderList();
      });
    });

    var pMin = document.getElementById('af-price-min'), pMax = document.getElementById('af-price-max');
    if (pMin) pMin.addEventListener('input', function () { uf.priceMin = this.value ? parseFloat(this.value) : null; renderList(); });
    if (pMax) pMax.addEventListener('input', function () { uf.priceMax = this.value ? parseFloat(this.value) : null; renderList(); });

    document.querySelectorAll('#af-delivery .af-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#af-delivery .af-chip').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        uf.delivery = btn.getAttribute('data-delivery');
        renderList();
      });
    });

    document.querySelectorAll('#af-mode button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#af-mode button').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        uf.mode = btn.getAttribute('data-m');
        renderList();
      });
    });

    var afClear = document.getElementById('af-clear');
    if (afClear) {
      afClear.addEventListener('click', function () {
        uf = { q: '', type: 'all', beds: 0, priceMin: null, priceMax: null, delivery: 'all', mode: 'all' };
        if (searchInp) searchInp.value = '';
        if (searchClear) searchClear.style.display = 'none';
        if (pMin) pMin.value = '';
        if (pMax) pMax.value = '';
        document.querySelectorAll('#af-type .af-chip').forEach(function (b, i) { b.classList.toggle('on', i === 0); });
        document.querySelectorAll('#af-beds .af-chip').forEach(function (b, i) { b.classList.toggle('on', i === 0); });
        document.querySelectorAll('#af-delivery .af-chip').forEach(function (b, i) { b.classList.toggle('on', i === 0); });
        document.querySelectorAll('#af-mode button').forEach(function (b, i) { b.classList.toggle('on', i === 0); });
        renderList();
      });
    }

    renderList();

    /* Query param auto-selection: e.g. ?cpd=The%20Brooks%20(PRE) */
    var params = new URLSearchParams(window.location.search);
    var targetCpd = params.get('cpd');
    if (targetCpd) {
      var found = D.compounds.find(function (x) { return x.n.toLowerCase() === targetCpd.toLowerCase() || x.n.toLowerCase().indexOf(targetCpd.toLowerCase()) !== -1; });
      if (found) {
        showIntel(found);
        map.flyTo([found.lat, found.lng], 13.5, { duration: 1 });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})();
          `,
        }}
      />
    </>
  );
}
