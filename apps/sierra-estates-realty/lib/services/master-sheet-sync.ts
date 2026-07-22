import { google } from 'googleapis';
import { adminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS, Unit, PropertyStatus, PropertyType } from '@/lib/models/schema';
import { logger } from '@/lib/logger';

export const MASTER_SHEET_ID_DEFAULT = '1g9GIcCM0slC5QplgzatZRxU46O_N4CR2jgDp9DeMYZk';

export interface RawOwnerSheetRow {
  timestamp?: string;
  rowNo?: string;
  lastUpdated?: string;
  name?: string;
  mobile?: string;
  availability?: string;
  bedrooms?: string;
  location?: string;
  priceRaw?: string;
  furnished?: string;
  typeRaw?: string;
  propertyTypeRaw?: string;
  code?: string;
  ownerTypeRaw?: string;
  gardenArea?: string;
  spaceArea?: string;
  pool?: string;
  comment?: string;
}

function getSheetsClient() {
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (keyRaw) {
    const credentials = JSON.parse(keyRaw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return google.sheets({ version: 'v4', auth });
  }

  // Fallback to unauthenticated / API key if available
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  return google.sheets({ version: 'v4', auth: apiKey });
}

function parsePrice(priceStr?: string): { amount: number; currency: 'EGP' | 'USD' } {
  if (!priceStr) return { amount: 0, currency: 'EGP' };
  const isUsd = priceStr.includes('$') || priceStr.toLowerCase().includes('usd');
  const clean = priceStr.replace(/[^0-9.]/g, '');
  const amount = parseFloat(clean) || 0;
  return { amount, currency: isUsd ? 'USD' : 'EGP' };
}

function parseAvailability(avail?: string, typeRaw?: string): PropertyStatus {
  const normAvail = (avail || '').toLowerCase().trim();
  const normType = (typeRaw || '').toLowerCase().trim();

  if (normType.includes('اتباعت') || normAvail.includes('sold')) return 'sold';
  if (normType.includes('تم الايجار') || normAvail.includes('rented')) return 'rented';
  if (normAvail.includes('available')) return 'available';
  if (normAvail.includes('no answer') || normAvail.includes('not available')) return 'off-market';
  return 'available';
}

function parsePropertyType(raw?: string): PropertyType {
  const norm = (raw || '').toLowerCase().trim();
  if (norm.includes('villa')) return 'villa';
  if (norm.includes('town')) return 'townhouse';
  if (norm.includes('floor with garden') || norm.includes('garden')) return 'duplex';
  if (norm.includes('apartment') || norm.includes('شقة')) return 'apartment';
  if (norm.includes('penthouse')) return 'penthouse';
  if (norm.includes('chalet')) return 'chalet';
  return 'apartment';
}

export async function syncMasterOwnerSheet(sheetId?: string) {
  const spreadsheetId = sheetId || process.env.MASTER_SHEET_ID || MASTER_SHEET_ID_DEFAULT;
  logger.info(`[MasterSheetSync] Starting sync for sheet ID: ${spreadsheetId}`);

  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:R', // All 18 columns
    });

    const rows = res.data.values || [];
    if (rows.length <= 1) {
      logger.warn('[MasterSheetSync] Sheet is empty or header only.');
      return { success: true, count: 0, units: [] };
    }

    const dataRows = rows.slice(1); // skip header
    const parsedUnits: Partial<Unit>[] = [];
    const batch = adminDb.batch();
    const unitsCollection = adminDb.collection(COLLECTIONS.units);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.length < 5) continue;

      const [
        timestamp,
        rowNo,
        lastUpdated,
        name,
        mobile,
        availability,
        bedrooms,
        location,
        priceRaw,
        furnished,
        typeRaw,
        propertyTypeRaw,
        code,
        ownerTypeRaw,
        gardenArea,
        spaceArea,
        pool,
        comment
      ] = row;

      const { amount: price, currency } = parsePrice(priceRaw);
      const status = parseAvailability(availability, typeRaw);
      const propertyType = parsePropertyType(propertyTypeRaw);
      const area = parseFloat((spaceArea || '').replace(/[^0-9.]/g, '')) || 0;
      const bedCount = parseInt((bedrooms || '').replace(/[^0-9]/g, '')) || 0;
      const unitCode = (code || `SB-UNIT-${i + 1}`).trim();

      const unitDoc: Partial<Unit> = {
        code: unitCode,
        title: `${propertyType.toUpperCase()} in ${location || 'New Cairo'} - ${unitCode}`,
        compound: (location || 'New Cairo').trim(),
        location: (location || 'New Cairo').trim(),
        city: 'New Cairo',
        propertyType,
        category: 'residential',
        status,
        price,
        area,
        bedrooms: bedCount,
        syncSource: 'sheets',
        ownerType: (ownerTypeRaw || '').toLowerCase().includes('broker') ? 'broker' : 'owner',
        ownerContact: mobile || '',
        description: comment || `${furnished || ''} ${typeRaw || ''}`.trim(),
        updatedAt: new Date() as any,
      };

      parsedUnits.push(unitDoc);

      const docRef = unitsCollection.doc(unitCode.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
      batch.set(docRef, unitDoc, { merge: true });
    }

    await batch.commit();
    logger.info(`[MasterSheetSync] Successfully synchronized ${parsedUnits.length} active inventory assets.`);

    return {
      success: true,
      count: parsedUnits.length,
      units: parsedUnits,
    };
  } catch (err: any) {
    logger.error('[MasterSheetSync] Error syncing master owner sheet:', err.message);
    return { success: false, error: err.message };
  }
}
