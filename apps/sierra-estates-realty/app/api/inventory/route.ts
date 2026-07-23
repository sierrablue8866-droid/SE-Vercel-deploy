/**
 * GET /api/inventory → InventoryResponse
 *
 * Reads the owner-inventory Google Sheet live (published CSV export), strips
 * every owner-identifying column, geocodes each unit's location, and returns a
 * public-safe `InventoryUnit[]` for the inventory map.
 *
 * Resilience: if the sheet can't be reached (offline, unshared, throttled) it
 * serves the committed snapshot at lib/inventory/snapshot.json instead of
 * erroring — the map always has data.
 *
 * The sheet id / gid default to the production inventory sheet and can be
 * overridden with INVENTORY_SHEET_ID / INVENTORY_SHEET_GID.
 */
import { NextResponse } from 'next/server';
import Papa from 'papaparse';
// gazetteer + normalize are the shared JS source of truth (see lib/inventory).
import { resolveLocation } from '@/lib/inventory/gazetteer';
import { normalizeRows } from '@/lib/inventory/normalize';
import snapshot from '@/lib/inventory/snapshot.json';
import type { InventoryResponse, InventoryUnit } from '@/lib/inventory/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHEET_ID =
  process.env.INVENTORY_SHEET_ID || '1g9GIcCM0slC5QplgzatZRxU46O_N4CR2jgDp9DeMYZk';
const SHEET_GID = process.env.INVENTORY_SHEET_GID || '1127958606';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

/** Snapshot fallback response. */
function snapshotResponse(): InventoryResponse {
  return {
    generatedAt: (snapshot as { generatedAt: string }).generatedAt,
    source: 'snapshot',
    count: (snapshot as { units: InventoryUnit[] }).units.length,
    units: (snapshot as { units: InventoryUnit[] }).units,
  };
}

async function fetchLive(): Promise<InventoryResponse | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(CSV_URL, {
      signal: controller.signal,
      // Cache the upstream CSV for 5 minutes to avoid hammering Google Sheets.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const csv = await res.text();
    const parsed = Papa.parse<Record<string, unknown>>(csv, {
      header: true,
      skipEmptyLines: true,
    });
    const units = normalizeRows(parsed.data, { resolveLocation });
    if (!units.length) return null;
    return {
      generatedAt: new Date().toISOString(),
      source: 'live',
      count: units.length,
      units,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const live = await fetchLive();
  const payload = live ?? snapshotResponse();
  return NextResponse.json(payload, {
    headers: {
      // Let the CDN serve a cached copy while revalidating in the background.
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
