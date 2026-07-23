/**
 * Public-safe inventory unit — the shape served by `/api/inventory`, stored in
 * the committed snapshot, and consumed by the inventory map.
 *
 * Deliberately excludes every owner-identifying field from the source CRM sheet
 * (name, mobile, owner). See lib/inventory/normalize.js.
 */

export type InventoryMode = 'rent' | 'sale';
export type InventoryStatus = 'available' | 'follow_up' | 'no_answer' | 'unavailable';

export interface InventoryUnit {
  /** Stable id — the listing code when present, else a row-derived fallback. */
  id: string;
  /** Internal listing code (e.g. "MT-B14-3U-8.34M"), if the sheet has one. */
  code: string | null;
  mode: InventoryMode;
  status: InventoryStatus;
  statusLabel: string;
  /** Canonical, display-ready location/compound name. */
  location: string;
  /** Original free-text location value from the sheet (for debugging/search). */
  rawLocation: string | null;
  zone: string;
  lat: number;
  lng: number;
  /** true when the location couldn't be resolved and a zone centroid was used. */
  approxLocation: boolean;
  propertyType: string | null;
  beds: number | null;
  /** Built-up area in m². */
  area: number | null;
  /** Garden area in m², when applicable. */
  garden: number | null;
  pool: boolean;
  furnished: string | null;
  /** Numeric price in EGP (total for sale, monthly for rent); 0 = on request. */
  price: number;
  priceLabel: string;
  comment: string | null;
  updatedAt: string | null;
}

export interface InventoryResponse {
  /** ISO timestamp of when this dataset was produced. */
  generatedAt: string;
  /** "live" = fetched from the Google Sheet this request; "snapshot" = fallback. */
  source: 'live' | 'snapshot';
  count: number;
  units: InventoryUnit[];
}
