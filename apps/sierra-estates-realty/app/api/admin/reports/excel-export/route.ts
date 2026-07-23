import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * 📊 Excel / CSV Exporter Route for Super Broker Agent
 * Generates downloadable CSV reports for leads and property benchmarks.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'listings';

  try {
    if (type === 'market') {
      const snap = await getDocs(collection(db, 'market_intelligence'));
      const rows = [
        ['Compound', 'Units Count', 'Avg Price (EGP)', 'Avg EGP/sqm', 'Min Price (EGP)', 'Max Price (EGP)', 'Last Updated'],
      ];

      snap.forEach((d) => {
        const data = d.data();
        rows.push([
          `"${data.compound || ''}"`,
          data.count || 0,
          data.avgPriceEgp || 0,
          data.avgPricePerSqm || 0,
          data.minPriceEgp || 0,
          data.maxPriceEgp || 0,
          `"${data.updatedAt || ''}"`,
        ]);
      });

      const csvContent = rows.map((r) => r.join(',')).join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="super_broker_market_study_${Date.now()}.csv"`,
        },
      });
    }

    // Default: Listings Export
    const listingsSnap = await getDocs(collection(db, 'listings'));
    const rows = [
      ['ID', 'Compound', 'Sector', 'Property Type', 'Mode', 'Bedrooms', 'Bathrooms', 'Area (sqm)', 'Price (EGP)', 'Status', 'Featured'],
    ];

    listingsSnap.forEach((d) => {
      const data = d.data();
      rows.push([
        `"${d.id}"`,
        `"${data.compound_name || data.compound || ''}"`,
        `"${data.location_sector || data.zone || ''}"`,
        `"${data.property_type || data.type || ''}"`,
        `"${data.mode || 'sale'}"`,
        data.bedrooms || 0,
        data.bathrooms || 0,
        data.area_sqm || 0,
        data.price_egp || 0,
        `"${data.status || 'draft'}"`,
        data.featured ? 'Yes' : 'No',
      ]);
    });

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="super_broker_listings_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('[Excel Export Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
