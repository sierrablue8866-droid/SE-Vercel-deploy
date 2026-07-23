/**
 * Leaflet Map Component — Mini-map for property location
 * File: SE/apps/client/src/components/LeafletMap.tsx
 *
 * Client-only component that renders a Leaflet map pinned to the compound's coordinates.
 * Displays a single marker at the property's compound location in New Cairo.
 */

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Compound coordinates (New Cairo area)
const COMPOUNDS = {
  'Mivida': [29.9738, 31.4742],
  'Hyde Park': [29.9845, 31.4829],
  'Eastown': [29.9654, 31.4921],
  'New Cairo': [29.9738, 31.4742],
  'Palm Hills': [29.9752, 31.4758],
  'Katameya': [29.9615, 31.4921],
} as Record<string, [number, number]>;

export default function LeafletMap({ compound }: { compound: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get compound coordinates
    const coords = COMPOUNDS[compound] || COMPOUNDS['New Cairo'];

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView(coords, 14);

      // Add tile layer (light theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18,
      }).addTo(mapRef.current);

      // Add marker
      markerRef.current = L.marker(coords as L.LatLngExpression, {
        icon: L.divIcon({
          className: '',
          html: `<span style="display:inline-flex;width:18px;height:18px;border-radius:50%;background:#00aeff;border:3px solid #fff;box-shadow:0 3px 10px rgba(13,33,54,.4);"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(mapRef.current);

      // Fix map size after layout settles
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 200);
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 800);
    }

    // Handle resize
    const handleResize = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [compound]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
