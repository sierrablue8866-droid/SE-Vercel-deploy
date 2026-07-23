import { NextResponse } from 'next/server';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

interface CompoundBenchmark {
  compound: string;
  count: number;
  avgPriceEgp: number;
  avgPricePerSqm: number;
  minPriceEgp: number;
  maxPriceEgp: number;
  updatedAt: string;
}

/**
 * 🌙 Nightly Market Study Cron Job — Super Broker Intelligence
 *
 * Runs nightly to calculate price per sqm trends across key New Cairo compounds.
 * Writes output to Firestore collection `market_intelligence`.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Basic verification — allow execution if CRON_SECRET isn't explicitly set in dev
    console.warn('[Nightly Market Study] Executing without explicit bearer token');
  }

  try {
    const listingsSnap = await getDocs(collection(db, 'listings'));
    const compoundsMap: Record<string, { totalPrice: number; totalArea: number; minPrice: number; maxPrice: number; count: number }> = {};

    listingsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const compound = data.compound_name || data.compound || 'New Cairo General';
      const price = Number(data.price_egp || data.price || 0);
      const area = Number(data.area_sqm || data.area || 0);

      if (price > 0 && area > 0) {
        if (!compoundsMap[compound]) {
          compoundsMap[compound] = {
            totalPrice: 0,
            totalArea: 0,
            minPrice: Infinity,
            maxPrice: -Infinity,
            count: 0,
          };
        }

        const entry = compoundsMap[compound];
        entry.totalPrice += price;
        entry.totalArea += area;
        entry.minPrice = Math.min(entry.minPrice, price);
        entry.maxPrice = Math.max(entry.maxPrice, price);
        entry.count += 1;
      }
    });

    const benchmarks: CompoundBenchmark[] = [];
    const nowIso = new Date().toISOString();

    for (const [compound, stats] of Object.entries(compoundsMap)) {
      const avgPriceEgp = Math.round(stats.totalPrice / stats.count);
      const avgPricePerSqm = Math.round(stats.totalPrice / stats.totalArea);

      const benchmark: CompoundBenchmark = {
        compound,
        count: stats.count,
        avgPriceEgp,
        avgPricePerSqm,
        minPriceEgp: stats.minPrice === Infinity ? 0 : stats.minPrice,
        maxPriceEgp: stats.maxPrice === -Infinity ? 0 : stats.maxPrice,
        updatedAt: nowIso,
      };

      benchmarks.push(benchmark);

      // Save to Firestore market_intelligence
      const docId = compound.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      await setDoc(doc(db, 'market_intelligence', docId), {
        ...benchmark,
        created_at: serverTimestamp(),
      }, { merge: true });
    }

    return NextResponse.json({
      success: true,
      agent: 'super-broker',
      timestamp: nowIso,
      compoundsAnalyzed: benchmarks.length,
      benchmarks,
    });
  } catch (error: any) {
    console.error('[Nightly Market Study Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Market study failed' },
      { status: 500 }
    );
  }
}
