'use client';

/**
 * Sierra Estates — Client Portal Home Page (Houzez Remix Portal)
 */
import Script from 'next/script';

export default function ClientHomePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800;900&family=Cormorant+Garamond:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/client-page/shared.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />

      {/* Skip link */}
      <a className="skip-link" href="#main" data-i18n="skipToContent">
        Skip to content
      </a>

      {/* Site chrome (nav injected by shared.js) */}
      <div id="site-chrome" suppressHydrationWarning />

      <main id="main">
        {/* HERO SLIDER */}
        <header className="hero" data-screen-label="Home hero">
          <div id="hero-slides" suppressHydrationWarning />
          <div className="scrim" aria-hidden="true" />
          <div className="wrap">
            <div className="h-eyebrow" id="hero-pre" suppressHydrationWarning />
            <h1 id="hero-main" suppressHydrationWarning />
            <p className="sub" data-i18n="heroSub" />
            <div className="quick">
              <span>
                <i data-lucide="badge-check" className="i" /> <span data-i18n="q1" />
              </span>
              <span>
                <i data-lucide="map" className="i" /> <span data-i18n="q2" />
              </span>
              <span>
                <i data-lucide="shield-check" className="i" /> <span data-i18n="q3" />
              </span>
            </div>
          </div>
          <a className="map-cta" href="compounds.html" title="Explore Map">
            <span className="mc-ic">
              <i data-lucide="map" className="i" />
            </span>
            <span data-i18n="exploreMapBtn" />
          </a>
          <div className="dots wrap" id="hero-dots" style={{ left: 'auto' }} suppressHydrationWarning />
          <div className="page-laser" aria-hidden="true">
            <div className="page-laser-beam" />
          </div>
        </header>

        {/* BELL BAR */}
        <div className="bell-bar" id="bell-bar">
          <div className="bell-content">
            <span className="bell-text">
              The first real estate ecosystem in Egypt · استكشف أفضل الفرص المتاحة في التجمع الخامس <b>AI Driven</b> · قدم طلبك الآن
            </span>
            <span className="bell-badge">خصم 25%</span>
            <a href="#inquiry" className="bell-btn">
              اطلب الآن <i data-lucide="arrow-right" style={{ width: '13px', height: '13px' }} />
            </a>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="wrap searchbar">
          <div className="search-card rv">
            <div className="search-tabs">
              <button className="active" data-i18n="tabBuy" type="button" data-tab="buy" title="Buy" />
              <button data-i18n="tabRent" type="button" data-tab="rent" title="Rent" />
              <button data-i18n="tabNew" type="button" data-tab="new" title="New Launch" />
            </div>
            <div className="search-fields">
              <div className="field">
                <label data-i18n="fLoc">Location</label>
                <div className="val">
                  <i data-lucide="map-pin" className="i" />
                  <span id="sf-loc-txt">New Cairo (All)</span>
                  <i data-lucide="chevron-down" className="chev" />
                </div>
              </div>
              <div className="field">
                <label data-i18n="fType">Type</label>
                <div className="val">
                  <i data-lucide="home" className="i" />
                  <span id="sf-type-txt">Apartment</span>
                  <i data-lucide="chevron-down" className="chev" />
                </div>
              </div>
              <div className="field">
                <label data-i18n="fPrice">Price</label>
                <div className="val">
                  <i data-lucide="dollar-sign" className="i" />
                  <span id="sf-price-txt">Any Price</span>
                  <i data-lucide="chevron-down" className="chev" />
                </div>
              </div>
              <div className="field">
                <label data-i18n="fBeds">Bedrooms</label>
                <div className="val">
                  <i data-lucide="bed" className="i" />
                  <span id="sf-beds-txt">Any</span>
                  <i data-lucide="chevron-down" className="chev" />
                </div>
              </div>
              <div className="field searchbtn">
                <a className="btn btn-pri" href="properties.html" id="sf-submit">
                  <i data-lucide="search" className="i" /> <span data-i18n="btnSearch" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED PROPERTIES */}
        <section className="block">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-i18n="secCurated">Curated Collection</div>
                <h2 data-i18n="secResale">Resale & Rent in New Cairo</h2>
              </div>
              <a className="u-link" href="properties.html">
                <span data-i18n="btnViewAll">View All</span> <i data-lucide="arrow-right" className="i" />
              </a>
            </div>

            <div className="grid-cards" id="prop-grid" suppressHydrationWarning />
          </div>
        </section>

        {/* 360 VIRTUAL TOURS */}
        <section className="block" style={{ background: 'var(--surface-2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-i18n="sec3D">Immersive 3D</div>
                <h2 data-i18n="secVirtual">3D Virtual Tours</h2>
              </div>
              <a className="u-link" href="virtual-tour.html">
                <span data-i18n="btnAllTours">Explore All Tours</span> <i data-lucide="arrow-right" className="i" />
              </a>
            </div>

            {/* Virtual Tour Banner */}
            <div
              className="tour-hero"
              id="vtv-banner"
              style={{ marginBottom: '24px' }}
              onClick={() => {
                const tourElem = document.getElementById('vtv-banner');
                if (tourElem && tourElem.requestFullscreen) {
                  tourElem.requestFullscreen().catch(() => {});
                }
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
                alt="3D Virtual Tour Preview"
              />
              <div className="th-scrim" />
              <span className="th-badge">
                <i data-lucide="eye" className="i" /> 360° INTERACTIVE TOUR
              </span>
              <div className="th-play">
                <i data-lucide="play" className="i" />
              </div>
              <div className="th-body">
                <b>The Brooks — Luxury Villa 3D Walkthrough</b>
                <span>Click to enter full screen virtual tour · Matterport AI 360</span>
              </div>
            </div>

            <div className="rooms" id="rooms-strip" suppressHydrationWarning />
          </div>
        </section>

        {/* LIVE MAP INTELLIGENCE */}
        <section className="block">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow" data-i18n="secMapEye">Geographic Intelligence</div>
                <h2 data-i18n="secMapTit">Explore New Cairo Compounds Map</h2>
              </div>
              <a className="u-link" href="compounds.html">
                <span data-i18n="btnFullMap">Full Map View</span> <i data-lucide="arrow-right" className="i" />
              </a>
            </div>

            <div className="map-sticky-wrap">
              <div id="home-map" style={{ height: '480px' }} suppressHydrationWarning />
            </div>
          </div>
        </section>

        {/* AI HUB BANNER */}
        <section className="ai-hub">
          <div className="wrap">
            <div className="ai-eye">
              <span className="live" /> SIERRA ESTATES AI ENGINE
            </div>
            <h2>AI-Powered Real Estate Ecosystem</h2>
            <p className="ai-lead">Real-time property valuation, ROI calculator, instant matching, and automated deal intelligence.</p>
            <div className="ai-scan" />

            <div className="ai-grid">
              <a className="ai-card" href="roi.html">
                <h4>ROI & Yield Calculator</h4>
                <p>Calculate gross/net rental yields and 5-year capital growth forecasts across compounds.</p>
                <span className="live-tag">LIVE MARKET DATA</span>
              </a>

              <a className="ai-card" href="pricing.html">
                <h4>AVM Valuation Engine</h4>
                <p>Instant fair-market valuation model trained on verified New Cairo transactions.</p>
                <span className="live-tag">ACCURACY 98.4%</span>
              </a>

              <a className="ai-card" href="matches.html">
                <h4>AI Buyer Matching</h4>
                <p>Connect your requirement to off-market seller inventories via smart embeddings.</p>
                <span className="live-tag">REALTIME MATCHING</span>
              </a>

              <a className="ai-card" href="advice.html">
                <h4>Market Intelligence</h4>
                <p>Quarterly price-per-sqm trends, inflation hedges, and compound delivery heatmaps.</p>
                <span className="live-tag">Q2 2026 INSIGHTS</span>
              </a>
            </div>
          </div>
        </section>

        {/* INQUIRY / REQUEST SECTION */}
        <section className="block" id="inquiry">
          <div className="wrap">
            <div className="perfect">
              <div className="pf-left">
                <div className="eyebrow" style={{ color: '#8fe1ff' }}>Why Sierra Estates</div>
                <h2>The Premier Real Estate Agency in New Cairo</h2>
                <p>Direct contact with verified unit owners, zero spam, and licensed advisory brokers.</p>

                <div className="pf-item">
                  <span className="num">01</span>
                  <div>
                    <h4>100% Verified Inventory</h4>
                    <p>Every resale and rental property is physical-inspected and price-verified before listing.</p>
                  </div>
                </div>

                <div className="pf-item">
                  <span className="num">02</span>
                  <div>
                    <h4>Transparent Commissions</h4>
                    <p>No hidden fees. Standardized broker contracts with clear payment terms.</p>
                  </div>
                </div>

                <div className="pf-item">
                  <span className="num">03</span>
                  <div>
                    <h4>Dedicated Account Manager</h4>
                    <p>Personal assistance from search to contract signing and property handover.</p>
                  </div>
                </div>
              </div>

              <div className="inq">
                <h3>Submit Your Property Request</h3>
                <p>Looking to buy, rent, or sell in New Cairo? Get instant assistance within 15 minutes.</p>

                <form id="inq-form">
                  <div className="seg" id="inq-seg">
                    <button className="on" type="button" data-mode="buy">Buy</button>
                    <button type="button" data-mode="rent">Rent</button>
                    <button type="button" data-mode="sell">Sell</button>
                  </div>

                  <div className="frow">
                    <div>
                      <label htmlFor="inq-name">Your Name</label>
                      <input type="text" id="inq-name" required placeholder="Full Name" />
                    </div>
                    <div>
                      <label htmlFor="inq-phone">Phone Number</label>
                      <input type="tel" id="inq-phone" required placeholder="+20 1xx xxx xxxx" />
                    </div>
                  </div>

                  <div className="frow">
                    <div>
                      <label htmlFor="inq-email">Email Address</label>
                      <input type="email" id="inq-email" placeholder="name@domain.com" />
                    </div>
                    <div>
                      <label htmlFor="inq-zone">Target Compound / Zone</label>
                      <select id="inq-zone">
                        <option value="5th-settlement">Fifth Settlement</option>
                        <option value="golden-square">Golden Square</option>
                        <option value="mostakbal-city">Mostakbal City</option>
                        <option value="madinaty">Madinaty</option>
                      </select>
                    </div>
                  </div>

                  <button className="btn btn-pri" type="submit" id="inq-submit">
                    <span>Submit Inquiry</span> <i data-lucide="send" className="i" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="site-footer" suppressHydrationWarning />

      <Script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" strategy="beforeInteractive" />
      <Script src="/client-page/data.js" strategy="afterInteractive" />
      <Script src="/client-page/shared.js" strategy="afterInteractive" />
      <Script src="/client-page/home.js" strategy="afterInteractive" />
    </>
  );
}
