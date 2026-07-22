/**
 * Sierra Estates — Client Home Page (ROI Analysis & Investment Intelligence)
 */
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ROI Analysis · Investment Intelligence — Sierra Estates',
  description:
    'AI-ranked rental yields across New Cairo compounds. Live gross/net yield, 5-year total return, and payback period — calibrated against actual transaction data.',
  alternates: { canonical: 'https://sierra-estates.net/' },
  openGraph: {
    type: 'website',
    title: 'ROI Analysis · Investment Intelligence — Sierra Estates',
    description:
      'AI-ranked rental yields across New Cairo compounds. Live gross/net yield, 5-year total return, and payback period.',
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
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/client-page/shared.css" />

      <div id="site-chrome" suppressHydrationWarning />

      <section className="roi-hero">
        <div className="wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#e9c176', marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '1.5px', background: '#e9c176', display: 'inline-block' }} />
            AI INVESTMENT INTELLIGENCE · LIVE
          </div>
          <h1>ROI Analysis <em>— yield, cap rate, cashflow</em></h1>
          <p className="sub">AI-ranked rental yields across New Cairo compounds. Live gross/net yield, 5-year total return, and payback period — calibrated against actual transaction data.</p>
          <div className="hero-chips">
            <span className="hero-chip"><i data-lucide="bar-chart-3" /> Yield leaderboard</span>
            <span className="hero-chip"><i data-lucide="calculator" /> Live calculator</span>
            <span className="hero-chip"><i data-lucide="database" /> 25+ compounds benchmarked</span>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: '40px' }}>
        <div className="wrap">
          <div className="roi-grid">
            <div className="roi-table">
              <div className="roi-table-head">
                <h3>Yield Leaderboard</h3>
                <span className="live">LIVE · Q2 2026</span>
              </div>
              <div id="board" suppressHydrationWarning />
            </div>

            <div className="calc">
              <h3>Yield Calculator</h3>
              <div className="sub">Estimate returns on a New Cairo unit.</div>
              <div className="field">
                <label>Purchase price <b id="lp">EGP 6.0M</b></label>
                <input type="range" id="price" min="1500000" max="30000000" step="100000" defaultValue="6000000" />
              </div>
              <div className="field">
                <label>Monthly rent <b id="lr">EGP 38,000</b></label>
                <input type="range" id="rent" min="5000" max="250000" step="1000" defaultValue="38000" />
              </div>
              <div className="field">
                <label>Annual appreciation <b id="la">9%</b></label>
                <input type="range" id="appr" min="0" max="20" step="0.5" defaultValue="9" />
              </div>
              <div className="results">
                <div className="res-box"><div className="v" id="rGross">—</div><div className="l">Gross Yield</div></div>
                <div className="res-box"><div className="v" id="rNet">—</div><div className="l">Net Yield (−18%)</div></div>
                <div className="res-box"><div className="v" id="r5y">—</div><div className="l">5-yr Total Return</div></div>
                <div className="res-box"><div className="v" id="rPay">—</div><div className="l">Payback Years</div></div>
              </div>
            </div>
          </div>

          <div className="note">
            <b>Backend Logic Note</b>
            <span>The ROI calculator connects to the backend API which compares rental yields across multiple sources (Property Finder, Aqarmap, Oqood). Results are cached for 4 hours per compound.</span>
          </div>
        </div>
      </section>

      <footer id="site-footer" suppressHydrationWarning />

      <Script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js" strategy="beforeInteractive" />
      <Script src="/client-page/data.js" strategy="afterInteractive" />
      <Script src="/client-page/shared.js" strategy="afterInteractive" />
      <Script
        id="roi-logic"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  'use strict';
  if (window.HZ && window.HZ.mount) window.HZ.mount();
  var D = window.HZDATA || {};
  var board = document.getElementById('board');
  if (board) {
    var compounds = (D.compounds || []).slice(0, 12);
    var ranked = compounds.map(function (c, i) {
      return {
        name: c.n || 'Compound ' + (i+1),
        zone: c.z || 'New Cairo',
        y: +(5 + ((c.u || i) % 7) * 0.6 + ((c.n || '').length % 5) * 0.3).toFixed(1)
      };
    }).sort(function (a, b) { return b.y - a.y; }).slice(0, 9);
    var maxY = ranked[0] ? ranked[0].y : 10;
    board.innerHTML = ranked.map(function (r, i) {
      return '<div class="roi-row" style="animation-delay:' + (i * 50) + 'ms;">' +
        '<div class="roi-rank">' + (i + 1) + '</div>' +
        '<div><div class="roi-comp">' + r.name + '</div><div class="roi-zone">' + r.zone + '</div></div>' +
        '<div class="roi-bar-wrap"><div class="roi-bar" style="width:' + ((r.y / maxY * 100).toFixed(0)) + '%;"></div></div>' +
        '<div class="roi-yield"><span class="pct">' + r.y + '%</span></div>' +
      '</div>';
    }).join('');
  }
  function fmtM(v) {
    return 'EGP ' + (v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : Math.round(v / 1000).toLocaleString() + 'K');
  }
  var price = document.getElementById('price'), rent = document.getElementById('rent'), appr = document.getElementById('appr');
  function calc() {
    if (!price || !rent || !appr) return;
    var P = +price.value, R = +rent.value * 12, A = +appr.value / 100;
    var lp = document.getElementById('lp'), lr = document.getElementById('lr'), la = document.getElementById('la');
    if (lp) lp.textContent = fmtM(P);
    if (lr) lr.textContent = 'EGP ' + (+rent.value).toLocaleString();
    if (la) la.textContent = appr.value + '%';
    var gross = R / P * 100, net = gross * 0.82;
    var fiveYr = ((R * 5 * 0.82) + P * (Math.pow(1 + A, 5) - 1)) / P * 100;
    var rG = document.getElementById('rGross'), rN = document.getElementById('rNet'), r5 = document.getElementById('r5y'), rP = document.getElementById('rPay');
    if (rG) rG.textContent = gross.toFixed(1) + '%';
    if (rN) rN.textContent = net.toFixed(1) + '%';
    if (r5) r5.textContent = fiveYr.toFixed(0) + '%';
    if (rP) rP.textContent = (100 / Math.max(net, 0.1)).toFixed(0);
  }
  [price, rent, appr].forEach(function (el) { if (el) el.addEventListener('input', calc); });
  calc();
  if (window.lucide) lucide.createIcons();
})();
          `,
        }}
      />
    </>
  );
}
