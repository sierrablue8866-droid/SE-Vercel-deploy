'use client';
// @ts-nocheck
/* eslint-disable */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sierra Estates — Listings Manager Page
 * ═══════════════════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Edit3, Trash2, Phone, Eye, EyeOff, X, Check,
  Building2, MapPin, BedDouble, Maximize, Tag, Loader2, AlertCircle,
} from 'lucide-react';
import {
  fetchListings, createListingWithOwner, updateListing, deleteListingAndOwner,
  fetchOwnerByListingId,
} from '../services/firebaseUtils';
import type {
  Listing, ListingInput, Owner, ListingStatus, PropertyType,
  FinishingLevel, DeliveryStatus, ListingMode,
} from '../types';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400',
  sold: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400',
};

const PROPERTY_TYPES: PropertyType[] = [
  'apartment', 'villa', 'townhouse', 'twin_house', 'penthouse', 'duplex', 'studio',
];

const FINISHING_LEVELS: FinishingLevel[] = [
  'core_shell', 'semi', 'fully_finished', 'ultra_lux',
];

const DELIVERY_STATUSES: DeliveryStatus[] = [
  'ready', 'under_construction', 'off_plan',
];

export default function ListingsManagerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerCache, setOwnerCache] = useState<Record<string, Owner | null>>({});
  const [revealedOwners, setRevealedOwners] = useState<Set<string>>(new Set());

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchListings({
        status: filterStatus === 'all' ? undefined : filterStatus,
        limitCount: 200,
      });
      setListings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { loadListings(); }, [loadListings]);

  const handleRevealOwner = async (listingId: string) => {
    if (revealedOwners.has(listingId)) {
      setRevealedOwners(prev => {
        const next = new Set(prev);
        next.delete(listingId);
        return next;
      });
      return;
    }
    if (!ownerCache[listingId]) {
      try {
        const owner = await fetchOwnerByListingId(listingId);
        setOwnerCache(prev => ({ ...prev, [listingId]: owner }));
      } catch (err) {
        console.error('Failed to fetch owner:', err);
      }
    }
    setRevealedOwners(prev => new Set(prev).add(listingId));
  };

  const handleStatusChange = async (id: string, status: ListingStatus) => {
    try {
      await updateListing(id, { status });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing AND its owner record? This cannot be undone.')) return;
    try {
      await deleteListingAndOwner(id);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const filtered = listings.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (l.compound_name || '').toLowerCase().includes(q) ||
           (l.location_sector || '').toLowerCase().includes(q) ||
           (l.property_type || '').toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Listings Manager</h1>
          <p className="text-xs text-muted mt-1">
            {filtered.length} listing{filtered.length !== 1 ? 's' : ''} · Atomic CRUD with Owner PII protection
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-text rounded-xl font-semibold text-sm hover:opacity-90 transition active:scale-95 shadow-md"
        >
          <Plus size={18} /> New Listing
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-sm text-red-500">
          <AlertCircle size={18} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search compound, sector, or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted">
          <Loader2 className="animate-spin mr-3" size={24} /> Loading listings engine...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted bg-surface/50 border border-border rounded-2xl">
          <Building2 size={44} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No listings found</p>
          <p className="text-xs mt-1">Create a new property listing to populate the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-border rounded-2xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-surface-secondary text-muted text-xs uppercase font-semibold border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5">Compound</th>
                <th className="text-left px-5 py-3.5">Type</th>
                <th className="text-left px-5 py-3.5">Beds</th>
                <th className="text-left px-5 py-3.5">Area</th>
                <th className="text-left px-5 py-3.5">Price (EGP)</th>
                <th className="text-left px-5 py-3.5">Mode</th>
                <th className="text-left px-5 py-3.5">Status</th>
                <th className="text-left px-5 py-3.5">Owner PII</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(listing => (
                <tr key={listing.id} className="hover:bg-surface-hover/50 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-foreground">{listing.compound_name}</div>
                    <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {listing.location_sector}
                    </div>
                  </td>
                  <td className="px-5 py-4 capitalize font-medium">{listing.property_type.replace('_', ' ')}</td>
                  <td className="px-5 py-4 font-medium">{listing.bedrooms}</td>
                  <td className="px-5 py-4 font-medium">{listing.area_sqm} m²</td>
                  <td className="px-5 py-4 font-mono font-semibold text-accent">
                    {listing.price_egp?.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      listing.mode === 'sale' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {listing.mode}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={listing.status}
                      onChange={e => handleStatusChange(listing.id, e.target.value as ListingStatus)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${STATUS_COLORS[listing.status]}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {revealedOwners.has(listing.id) ? (
                      ownerCache[listing.id] ? (
                        <div className="text-xs">
                          <div className="font-bold text-foreground">{ownerCache[listing.id]!.owner_name}</div>
                          <div className="flex items-center gap-1 text-muted mt-0.5">
                            <Phone size={10} /> {ownerCache[listing.id]!.phone_number}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">No owner details</span>
                      )
                    ) : (
                      <button
                        onClick={() => handleRevealOwner(listing.id)}
                        className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
                      >
                        <Eye size={13} /> Reveal
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                      title="Delete listing + owner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadListings();
          }}
        />
      )}
    </div>
  );
}

function CreateListingModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void; }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [compoundName, setCompoundName] = useState('');
  const [locationSector, setLocationSector] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqm, setAreaSqm] = useState(180);
  const [priceEgp, setPriceEgp] = useState(10000000);
  const [mode, setMode] = useState<ListingMode>('sale');
  const [finishing, setFinishing] = useState<FinishingLevel>('fully_finished');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('ready');
  const [paymentPlan, setPaymentPlan] = useState('');
  const [status, setStatus] = useState<ListingStatus>('draft');

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [sourceType, setSourceType] = useState<'direct' | 'broker'>('direct');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compoundName.trim() || !ownerName.trim() || !ownerPhone.trim()) {
      setError('Compound name, owner name, and owner phone are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const listingInput: ListingInput = {
        status,
        property_type: propertyType,
        compound_name: compoundName.trim(),
        location_sector: locationSector.trim(),
        price_egp: Number(priceEgp),
        area_sqm: Number(areaSqm),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        finishing,
        mode,
        delivery_status: deliveryStatus,
        payment_plan: paymentPlan.trim() || undefined,
      };
      const ownerInput = {
        owner_name: ownerName.trim(),
        phone_number: ownerPhone.trim(),
        email: ownerEmail.trim() || undefined,
        source_type: sourceType,
      };

      await createListingWithOwner({ listing: listingInput, owner: ownerInput });
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-extrabold">Create Listing + Owner Record</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
              <Building2 size={16} /> Property Details (Public)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Compound Name" required>
                <input type="text" value={compoundName} onChange={e => setCompoundName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" placeholder="e.g. Mivida" required />
              </Field>
              <Field label="Location Sector">
                <input type="text" value={locationSector} onChange={e => setLocationSector(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" placeholder="e.g. 5th Settlement" />
              </Field>
              <Field label="Property Type">
                <select value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg">
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </Field>
              <Field label="Mode">
                <select value={mode} onChange={e => setMode(e.target.value as ListingMode)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg">
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </Field>
              <Field label="Bedrooms">
                <input type="number" min="0" value={bedrooms} onChange={e => setBedrooms(+e.target.value)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" />
              </Field>
              <Field label="Bathrooms">
                <input type="number" min="0" value={bathrooms} onChange={e => setBathrooms(+e.target.value)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" />
              </Field>
              <Field label="Area (m²)">
                <input type="number" min="0" value={areaSqm} onChange={e => setAreaSqm(+e.target.value)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" />
              </Field>
              <Field label="Price (EGP)">
                <input type="number" min="0" value={priceEgp} onChange={e => setPriceEgp(+e.target.value)} className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" />
              </Field>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
              <Phone size={16} /> Owner Contact (Private PII)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Owner Name" required>
                <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" placeholder="Full name" required />
              </Field>
              <Field label="Phone Number" required>
                <input type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg" placeholder="+20XXXXXXXXXX" required />
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-accent text-accent-text rounded-xl font-bold text-sm hover:opacity-90">
              {saving ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode; }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
