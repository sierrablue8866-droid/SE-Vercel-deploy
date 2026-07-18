/**
 * Sierra Estates — Enhanced Listing Detail Page
 * File: SE/apps/client/src/app/listings/[id]/page.tsx
 *
 * Server Component — Renders property detail with:
 * - Full gallery with hover effects
 * - Agent card with AI score
 * - Amenities & features
 * - Mini-map with Leaflet
 * - Similar properties
 * - Bilingual support (EN/AR)
 * - Real-time Firestore data
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  fetchActiveListingById,
  fetchActiveListings,
  formatPrice,
} from '@/lib/publicData';
import type { Listing } from '@sierra-estates/types';
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  CheckCircle,
  ArrowLeft,
  LayoutDashboard,
  ListChecks,
  Map,
  Calendar,
  MessageCircle,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import './listing-detail.css';

// Dynamically load Leaflet map (no SSR)
const MapComponent = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div style={{ height: 300, background: '#f0f0f0', borderRadius: 10 }} />,
});

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load language preference
    const savedLang = (localStorage.getItem('hzp-lang') || 'en') as 'en' | 'ar';
    setLang(savedLang);

    // Fetch listing
    const loadListing = async () => {
      try {
        const data = await fetchActiveListingById(id);
        if (!data) {
          setError(true);
          return;
        }
        setListing(data);

        // Fetch similar listings
        const allListings = await fetchActiveListings({ limitCount: 20 });
        const similarListings = allListings
          .filter(l => l.id !== id)
          .sort((a, b) => {
            const aScore = a.ai_score || 0;
            const bScore = b.ai_score || 0;
            const aDiff = Math.abs(aScore - (data.ai_score || 0));
            const bDiff = Math.abs(bScore - (data.ai_score || 0));
            return aDiff - bDiff;
          })
          .slice(0, 3);
        setSimilar(similarListings);
      } catch (err) {
        console.error('Error loading listing:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  if (loading) return <LoadingPlaceholder />;
  if (error || !listing) return notFound();

  const isAr = lang === 'ar';
  const isDark = false; // TODO: detect from theme

  const amenities = [
    'Private garden',
    'Covered parking',
    'Central AC',
    'Smart home ready',
    'Clubhouse access',
    "Kids' area",
    '24/7 security',
    'Community pool',
    'Fiber internet',
  ];

  const amenitiesAr = [
    'حديقة خاصة',
    'جراج مغطى',
    'تكييف مركزي',
    'منزل ذكي',
    'عضوية النادي',
    'منطقة أطفال',
    'أمن 24/7',
    'حمام سباحة',
    'إنترنت فايبر',
  ];

  const featsToShow = isAr ? amenitiesAr : amenities;

  return (
    <>
      {/* Back link */}
      <div className="container" style={{ padding: '24px 24px 0' }}>
        <Link
          href="/listings"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#00aeff',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> {isAr ? 'العودة للقائمة' : 'Back to Listings'}
        </Link>
      </div>

      <section className="listing-detail-section" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="wrap">
          {/* Header */}
          <div className="p-head rv">
            <div>
              <div className="ptype">
                {listing.compound_name} · {listing.property_type.replace('_', ' ')}
              </div>
              <h1>
                {listing.bedrooms} {isAr ? 'غرفة نوم' : 'Bedroom'} {listing.property_type.replace('_', ' ')}
              </h1>
              <div className="addr">
                <MapPin size={16} style={{ color: '#9aa4ad' }} />
                <span>
                  {listing.compound_name}, {listing.location_sector}, New Cairo
                </span>
              </div>
            </div>
            <div className="price">
              <span>{formatPrice(listing.price_egp, listing.mode)}</span>
              <small>{listing.mode === 'rent' ? 'Monthly' : 'Sale'}</small>
            </div>
          </div>

          {/* Gallery */}
          <Gallery listing={listing} />

          {/* Main Content Grid */}
          <div className="p-cols">
            <div>
              {/* Overview Panel */}
              <Panel title="Overview" icon={LayoutDashboard}>
                <SpecsGrid listing={listing} />
                <p className="desc" style={{ marginTop: 20 }}>
                  {isAr
                    ? `وحدة ${listing.property_type} استثنائية في ${listing.compound_name} — تشطيب فاخر، إطلالات مفتوحة، ومجتمع مغلق بخدمات متكاملة. موثّقة ميدانياً من فريق سيرا، ومسعّرة ببيانات السوق الحية عبر محرك AVM. متاحة للمعاينة خلال 24 ساعة.`
                    : `An exceptional ${listing.property_type} in ${listing.compound_name} — premium finishing, open views, and a fully-serviced gated community. Verified on-site by the Sierra team and priced against live market data through our AVM engine. Available for viewing within 24 hours.`}
                </p>
              </Panel>

              {/* Amenities Panel */}
              <Panel title="Amenities" icon={ListChecks}>
                <div className="feats">
                  {featsToShow.map((feat, i) => (
                    <span key={i}>
                      <CheckCircle size={16} style={{ color: '#1fae54' }} />
                      {feat}
                    </span>
                  ))}
                </div>
              </Panel>

              {/* Location Panel */}
              <Panel title="Location" icon={Map}>
                <div id="mini-map" style={{ height: 300, borderRadius: 10, background: '#f0f0f0' }}>
                  <Suspense fallback={<div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>Loading map...</div>}>
                    <MapComponent compound={listing.compound_name} />
                  </Suspense>
                </div>
              </Panel>

              {/* Payment Plan */}
              {listing.payment_plan && (
                <Panel title="Payment Plan">
                  <p style={{ color: '#5f7183' }}>{listing.payment_plan}</p>
                </Panel>
              )}

              {/* Virtual Tour */}
              {listing.virtual_tour_url && (
                <Panel title="3D Virtual Tour">
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden' }}>
                    <iframe
                      src={listing.virtual_tour_url}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen
                      title="3D Virtual Tour"
                    />
                  </div>
                </Panel>
              )}
            </div>

            {/* Agent Card Sidebar */}
            <aside>
              <AgentCard listing={listing} isAr={isAr} />
            </aside>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <>
              <div className="sec-head rv" style={{ marginTop: 56 }}>
                <div>
                  <div className="eyebrow">{isAr ? 'عقارات مشابهة' : 'Similar Properties'}</div>
                  <h2>{isAr ? 'خصائص مشابهة' : 'You Might Also Like'}</h2>
                </div>
                <Link href="/listings" className="sec-link">
                  <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                  <ArrowRight size={16} style={{ [isAr ? 'marginRight' : 'marginLeft']: 8 }} />
                </Link>
              </div>
              <div className="grid-props">
                {similar.map(prop => (
                  <PropertyCard key={prop.id} listing={prop} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * Gallery Component
 */
function Gallery({ listing }: { listing: Listing }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = listing.gallery_urls && listing.gallery_urls.length > 0
    ? [listing.cover_image_url || '', ...listing.gallery_urls].filter(Boolean)
    : listing.cover_image_url
    ? [listing.cover_image_url]
    : [];

  if (images.length === 0) return null;

  const mainImg = images[activeImageIdx];
  const thumbs = images.slice(0, 4);

  return (
    <div className="gallery" style={{ marginBottom: 44 }}>
      {/* Main image */}
      <div
        className="g main-img"
        style={{
          gridColumn: '1 / -1',
          height: 360,
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={mainImg}
          alt="Main property image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease-out',
          }}
        />
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12, marginTop: 12 }}>
        {thumbs.map((img, i) => (
          <div
            key={i}
            onClick={() => setActiveImageIdx(i)}
            style={{
              cursor: 'pointer',
              borderRadius: 8,
              overflow: 'hidden',
              border: activeImageIdx === i ? '2px solid #00aeff' : '1px solid #e7ebee',
              height: 80,
              opacity: activeImageIdx === i ? 1 : 0.6,
              transition: 'all 0.2s',
            }}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
        {images.length > 4 && (
          <div
            style={{
              borderRadius: 8,
              background: '#e7ebee',
              display: 'grid',
              placeItems: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#5f7183',
            }}
          >
            +{images.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Panel Component (reusable)
 */
function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="panel rv" style={{ background: '#fff', border: '1px solid #e7ebee', borderRadius: 16, padding: 28, marginBottom: 24 }}>
      <h3 style={{ fontSize: 19, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && <Icon size={20} style={{ color: '#00aeff' }} />}
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Specs Grid Component
 */
function SpecsGrid({ listing }: { listing: Listing }) {
  const specs = [
    { icon: BedDouble, label: 'Bedrooms', value: listing.bedrooms.toString() },
    { icon: Bath, label: 'Bathrooms', value: (listing.bathrooms || '—').toString() },
    { icon: Maximize, label: 'Area', value: `${listing.area_sqm} m²` },
    { icon: Sparkles, label: 'AI Score', value: `${(listing.ai_score || 0).toFixed(1)}/10` },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
      {specs.map((spec, i) => (
        <div
          key={i}
          style={{
            background: '#f6f8fa',
            border: '1px solid #e7ebee',
            borderRadius: 10,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <spec.icon size={20} style={{ color: '#00aeff', margin: '0 auto 8px', display: 'block' }} />
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9aa4ad', marginBottom: 4 }}>
            {spec.label}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{spec.value}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Agent Card (Sticky Sidebar)
 */
function AgentCard({ listing, isAr }: { listing: Listing; isAr: boolean }) {
  return (
    <div
      className="agent-card rv d1"
      style={{
        background: '#fff',
        border: '1px solid #e7ebee',
        borderRadius: 16,
        padding: 26,
        position: 'sticky',
        top: 100,
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 14,
            background: '#00aeff',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          SE
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00aeff', marginBottom: 3, fontWeight: 600 }}>
            {isAr ? 'مستشار' : 'LISTING ADVISOR'}
          </div>
          <h4 style={{ fontSize: 17, fontWeight: 700 }}>Sierra Estates</h4>
          <div style={{ fontSize: 12.5, color: '#9aa4ad' }}>New Cairo</div>
        </div>
      </div>

      {/* Buttons */}
      <button
        className="btn btn-pri"
        style={{
          width: '100%',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px',
          background: '#002b4b',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <Calendar size={16} />
        {isAr ? 'جدولة' : 'Schedule'}
      </button>
      <button
        className="btn btn-wa"
        style={{
          width: '100%',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px',
          background: '#1fae54',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <MessageCircle size={16} />
        {isAr ? 'WhatsApp' : 'Message'}
      </button>
      <button
        style={{
          width: '100%',
          padding: '12px',
          background: 'transparent',
          color: '#002b4b',
          border: '1px solid #e7ebee',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Phone size={16} />
        {isAr ? 'اتصل' : 'Call'}
      </button>

      {/* AI Score Banner */}
      <div
        style={{
          marginTop: 18,
          border: '1px dashed #e7ebee',
          borderRadius: 10,
          padding: 14,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          fontSize: 12.5,
          color: '#5f7183',
        }}
      >
        <b style={{ color: '#00aeff', fontFamily: 'monospace', fontSize: 18 }}>
          AI {(listing.ai_score || 0).toFixed(1)}
        </b>
        <span>{isAr ? 'درجة Sierra AI — معايرة مقابل 25 مركب في القاهرة الجديدة في الوقت الفعلي' : 'Sierra AI score — benchmarked against 25 New Cairo compounds in real time.'}</span>
      </div>
    </div>
  );
}

/**
 * Property Card (Similar Properties Grid)
 */
function PropertyCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div
        className="prop-card rv"
        style={{
          background: '#fff',
          border: '1px solid #e7ebee',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        {/* Image */}
        {listing.cover_image_url && (
          <div style={{ height: 200, overflow: 'hidden', background: '#f0f0f0' }}>
            <img
              src={listing.cover_image_url}
              alt={listing.compound_name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: '#00aeff', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
            {listing.compound_name}
          </div>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            {listing.bedrooms} Bed {listing.property_type}
          </h4>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#002b4b', marginBottom: 12 }}>
            {formatPrice(listing.price_egp, listing.mode)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#9aa4ad' }}>
            <span>{listing.area_sqm} m²</span>
            <span>{listing.bathrooms || '—'} Baths</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Loading Placeholder
 */
function LoadingPlaceholder() {
  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ animation: 'pulse 2s infinite' }}>
        <div style={{ height: 40, background: '#e7ebee', borderRadius: 8, marginBottom: 20 }} />
        <div style={{ height: 360, background: '#e7ebee', borderRadius: 16, marginBottom: 24 }} />
        <div style={{ height: 300, background: '#e7ebee', borderRadius: 16 }} />
      </div>
    </div>
  );
}
