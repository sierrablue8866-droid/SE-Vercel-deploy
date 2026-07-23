/**
 * Sierra Estates — client portal data + i18n
 * Ported from the owner-approved ui_kits/houzez-portal/data.js + shared.js I18N.
 * The `listings`/`compounds` arrays are the LOCAL FALLBACK; live data is read
 * from Firestore `properties` at runtime (see fetchFeaturedProperties / etc.).
 */
import { collection, query, limit as fbLimit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Listing {
  id: number | string;
  code: string;
  cmp: string;
  zone: string;
  type: string;
  beds: number;
  bath: number;
  area: number;
  egpM: number;
  usd: number;
  ai: number;
  tag: string | null;
  mode: 'sale' | 'rent';
  agent: string;
  ago: string;
  img: string;
  featured?: boolean;
}

export interface Compound {
  n: string;
  g: string;
  ai: number;
  z: string;
  priceM: number;
  rent: number;
  /** [lat, lng] — ported from ui_kits/houzez-portal/data.js, used by the live Leaflet map. */
  c: [number, number];
}

export interface Slide {
  pre: string;
  preAr: string;
  main: string;
  mainAr: string;
  img: string;
}

export const SLIDES: Slide[] = [
  { pre: 'FIRST & ONLY WEBSITE IN EGYPT DESIGNED FOR NEW CAIRO', preAr: 'الموقع الأول والوحيد في مصر المصمم للقاهرة الجديدة', main: 'The First Exclusive Destination for New Cairo Properties. Rent & Resale.', mainAr: 'الوجهة الحصرية الأولى لعقارات القاهرة الجديدة. إيجار وبيع.', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=85' },
  { pre: 'BEST-IN-CLASS DESIGN', preAr: 'تصميم من الطراز الأول', main: 'Redefining Luxury Living with AI-Driven Excellence', mainAr: 'نعيد تعريف الفخامة بتميّز الذكاء الاصطناعي', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=85' },
  { pre: 'AI-DRIVEN EXCELLENCE', preAr: 'تميّز بالذكاء الاصطناعي', main: 'Smart Matches for Smart Investors', mainAr: 'توافق ذكي لمستثمرين أذكياء', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85' },
  { pre: 'EXCLUSIVE NETWORK', preAr: 'شبكة حصرية', main: 'Unrivaled Access to Premium Compounds', mainAr: 'وصول لا يُضاهى لأرقى الكمبوندات', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&q=85' },
  { pre: 'CURATED PORTFOLIO', preAr: 'محفظة منتقاة', main: 'Your Journey to Exceptional Homes Begins Here', mainAr: 'رحلتك نحو منزل استثنائي تبدأ هنا', img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1920&q=85' },
];


export const COMPOUNDS: Compound[] = [
  { n: 'Katameya Heights', g: '+10%', ai: 9.0, z: 'Katameya', priceM: 26, rent: 5000, c: [29.99, 31.48] },
  { n: 'Katameya Dunes', g: '+12%', ai: 8.8, z: 'Katameya', priceM: 18, rent: 3400, c: [29.985, 31.492] },
  { n: 'Swan Lake Residence', g: '+15%', ai: 8.9, z: '5th Settlement', priceM: 8.5, rent: 1700, c: [30.045, 31.635] },
  { n: 'Mivida', g: '+18%', ai: 9.1, z: '5th Settlement', priceM: 10.5, rent: 2100, c: [30.007, 31.589] },
  { n: 'Cairo Festival City Residences', g: '+12%', ai: 8.7, z: 'New Cairo', priceM: 7.5, rent: 1500, c: [30.016, 31.469] },
  { n: 'Hyde Park New Cairo', g: '+22%', ai: 9.8, z: '5th Settlement', priceM: 28.5, rent: 5200, c: [30.008, 31.645] },
  { n: 'Taj City', g: '+19%', ai: 9.5, z: 'New Cairo', priceM: 35, rent: 6500, c: [30.065, 31.531] },
  { n: 'Eastown (SODIC)', g: '+19%', ai: 9.0, z: '5th Settlement', priceM: 11.5, rent: 2400, c: [30.018, 31.587] },
  { n: 'Mountain View iCity', g: '+24%', ai: 9.6, z: '5th Settlement', priceM: 22, rent: 3200, c: [30.014, 31.618] },
  { n: 'Zed East (Ora)', g: '+13%', ai: 8.7, z: 'New Cairo', priceM: 8, rent: 1600, c: [30.095, 31.61] },
  { n: 'Palm Hills New Cairo', g: '+21%', ai: 9.2, z: '5th Settlement', priceM: 25, rent: 4800, c: [30.002, 31.608] },
  { n: 'The Waterway', g: '+14%', ai: 8.8, z: 'New Cairo', priceM: 12, rent: 2300, c: [30.04, 31.47] },
  { n: 'Lake View Residence', g: '+13%', ai: 8.7, z: 'New Cairo', priceM: 9.5, rent: 1900, c: [30.022, 31.532] },
  { n: 'Fifth Square (Al Marasem)', g: '+17%', ai: 9.0, z: '5th Settlement', priceM: 8.5, rent: 1750, c: [30.025, 31.578] },
  { n: 'Villette (SODIC)', g: '+20%', ai: 9.3, z: '5th Settlement', priceM: 24.5, rent: 4400, c: [30.053, 31.598] },
  { n: 'Stone Residence (Rooya)', g: '+15%', ai: 8.8, z: 'New Cairo', priceM: 7.8, rent: 1550, c: [30.028, 31.557] },
  { n: 'The Square (Al Ahly Sabbour)', g: '+16%', ai: 8.9, z: 'New Cairo', priceM: 9, rent: 1800, c: [30.033, 31.542] },
  { n: 'El Patio Oro (La Vista)', g: '+15%', ai: 8.9, z: 'New Cairo', priceM: 10, rent: 2000, c: [30.029, 31.56] },
  { n: 'El Patio 7 (La Vista)', g: '+14%', ai: 8.8, z: 'New Cairo', priceM: 8.5, rent: 1700, c: [30.035, 31.565] },
  { n: 'Katameya Gardens', g: '+11%', ai: 8.6, z: 'Katameya', priceM: 15, rent: 2800, c: [29.992, 31.488] },
  { n: 'Village Gardens Katameya', g: '+11%', ai: 8.6, z: 'Katameya', priceM: 16, rent: 3000, c: [29.988, 31.484] },
  { n: 'Galleria Moon Valley', g: '+13%', ai: 8.7, z: 'New Cairo', priceM: 7, rent: 1400, c: [30.02, 31.55] },
  { n: '90 Avenue (Tabarak)', g: '+14%', ai: 8.8, z: '5th Settlement', priceM: 8, rent: 1600, c: [30.028, 31.572] },
  { n: 'Azzar New Cairo', g: '+13%', ai: 8.7, z: 'New Cairo', priceM: 7.5, rent: 1500, c: [30.022, 31.568] },
  { n: 'District 5 (Marakez)', g: '+16%', ai: 8.9, z: 'New Cairo', priceM: 9.5, rent: 1900, c: [30.012, 31.5] },
  { n: 'The Brooks (PRE)', g: '+17%', ai: 8.9, z: 'Mostakbal', priceM: 7, rent: 1400, c: [30.07, 31.57] },
  { n: 'STEI8HT (LMD)', g: '+16%', ai: 8.8, z: 'Mostakbal', priceM: 6.5, rent: 1300, c: [30.075, 31.575] },
  { n: 'The Crest (IL Cazar)', g: '+15%', ai: 8.7, z: 'Mostakbal', priceM: 7.2, rent: 1450, c: [30.068, 31.562] },
  { n: 'Azad & Azad Views', g: '+14%', ai: 8.6, z: 'Mostakbal', priceM: 6.8, rent: 1350, c: [30.078, 31.558] },
];

/** Compound name → [lat, lng], for the property mini-map (falls back to New Cairo centroid). */
export const NEW_CAIRO_CENTER: [number, number] = [30.03, 31.55];
export function compoundCoords(name: string): [number, number] {
  const hit = COMPOUNDS.find((c) => c.n === name || c.n.startsWith(name) || name.startsWith(c.n.split(' (')[0]));
  return hit ? hit.c : NEW_CAIRO_CENTER;
}

export const COMPOUND_IMGS: Record<string, string> = {
  'Hyde Park New Cairo': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'Mivida': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'Mountain View iCity': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'Eastown (SODIC)': 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80',
  'Taj City': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
  'Villette (SODIC)': 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
  'Palm Hills New Cairo': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
  'Katameya Heights': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
};

export const INTERIORS = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
];

export const AGENT_IMG = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80';

export function priceLabel(p: Pick<Listing, 'mode' | 'usd' | 'egpM'>): string {
  return p.mode === 'rent'
    ? '$' + p.usd.toLocaleString() + '/mo'
    : 'EGP ' + p.egpM.toFixed(1) + 'M';
}

/* ── Firestore mapping ──────────────────────────────────────────────────────
   Reads the live `properties` collection via the client SDK (same pattern as
   DesktopHome.tsx). Missing / unconfigured Firestore → empty array. */
function mapDoc(id: string, p: Record<string, unknown>): Listing {
  const num = (v: unknown, d: number): number => (typeof v === 'number' ? v : d);
  const str = (v: unknown, d: string): string => (typeof v === 'string' ? v : d);
  const rawPrice = p.price_egp ?? p.price;
  const egpM = typeof rawPrice === 'number' ? (rawPrice > 1000 ? rawPrice / 1e6 : rawPrice) : num(p.egpM, 10);
  const mode: 'sale' | 'rent' = p.mode === 'rent' || p.listingType === 'rent' ? 'rent' : 'sale';
  return {
    id,
    code: str(p.code, id.slice(0, 8).toUpperCase()),
    cmp: str(p.compound_name, str(p.compound, str(p.location, 'New Cairo'))),
    zone: str(p.location_sector, str(p.zone, str(p.district, 'New Cairo'))),
    type: str(p.property_type, str(p.propertyType, str(p.type, 'Villa'))),
    beds: num(p.bedrooms, num(p.beds, 3)),
    bath: num(p.bathrooms, num(p.bath, 2)),
    area: num(p.area_sqm, num(p.area, 200)),
    egpM,
    usd: num(p.usd, num(p.rent, Math.round(egpM * 180))),
    ai: num(p.ai_score, num(p.ai, num(p.aiScore, 9.0))),
    tag: p.status === 'sold' ? 'Sold' : null,
    mode,
    agent: str(p.agent_name, str(p.agentName, str(p.agent, 'Sarah M.'))),
    ago: 'Just now',
    img: str(
      p.cover_image_url ?? p.image_url ?? p.coverImageUrl ?? p.imageUrl ?? (p.images as string[])?.[0],
      INTERIORS[Math.floor(Math.random() * INTERIORS.length)]
    ),
    featured: typeof p.featured === 'boolean' ? p.featured : false,
  };
}

export async function fetchListings(max = 24): Promise<Listing[]> {
  try {
    const snap = await getDocs(query(collection(db, 'listings'), fbLimit(max)));
    if (snap.empty) return [];
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  } catch {
    return [];
  }
}
