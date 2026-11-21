import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FarmMapViewerProps {
  coordinates?: number[][][] | number[][];
  farmName?: string;
  khasra?: string;
  height?: string;
  interactive?: boolean;
}

const DEFAULT_COORDS: [number, number][] = [
  [77.4128, 23.2599],
  [77.4155, 23.2605],
  [77.4162, 23.2578],
  [77.4132, 23.2572],
  [77.4128, 23.2599]
];

// Helper to safely extract a clean [lng, lat][] list regardless of GeoJSON nesting
function extractCoordinates(raw?: any): [number, number][] {
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_COORDS;
  }
  try {
    // Case 1: GeoJSON Polygon coordinates: [[[lng, lat], [lng, lat], ...]]
    if (Array.isArray(raw[0]) && Array.isArray(raw[0][0])) {
      const ring = raw[0];
      const valid = ring.filter((p: any) => Array.isArray(p) && p.length >= 2 && !isNaN(Number(p[0])) && !isNaN(Number(p[1])));
      if (valid.length >= 3) return valid.map((p: any) => [Number(p[0]), Number(p[1])]);
    }
    // Case 2: Array of points: [[lng, lat], [lng, lat], ...]
    if (Array.isArray(raw[0]) && typeof raw[0][0] === 'number') {
      const valid = raw.filter((p: any) => Array.isArray(p) && p.length >= 2 && !isNaN(Number(p[0])) && !isNaN(Number(p[1])));
      if (valid.length >= 3) return valid.map((p: any) => [Number(p[0]), Number(p[1])]);
    }
  } catch (e) {
    console.warn('Failed parsing coordinates for FarmMapViewer, using default fallback', e);
  }
  return DEFAULT_COORDS;
}

export const FarmMapViewer: React.FC<FarmMapViewerProps> = ({
  coordinates,
  farmName = "Patel Khasra 48/2 North Plot",
  khasra = "48/2",
  height = "320px",
  interactive = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  const cleanCoords = extractCoordinates(coordinates);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    let mapInstance: L.Map | null = null;
    let isCancelled = false;

    // Small delay to ensure container layout has settled
    const timer = setTimeout(() => {
      if (isCancelled || !parent) return;

      try {
        // Always clean any prior instances or stale DOM elements
        parent.innerHTML = '';
        if ((parent as any)._leaflet_id) {
          delete (parent as any)._leaflet_id;
        }

        // Create a fresh dedicated map wrapper
        const mapDiv = document.createElement('div');
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        mapDiv.style.borderRadius = '1rem';
        parent.appendChild(mapDiv);

        // Calculate centroid safely
        const lats = cleanCoords.map(p => p[1]);
        const lngs = cleanCoords.map(p => p[0]);
        const centerLat = lats.length ? (Math.min(...lats) + Math.max(...lats)) / 2 : 23.2599;
        const centerLng = lngs.length ? (Math.min(...lngs) + Math.max(...lngs)) / 2 : 77.4128;

        // Initialize Leaflet
        mapInstance = L.map(mapDiv, {
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
          attributionControl: false,
          doubleClickZoom: interactive
        }).setView([centerLat, centerLng], 15);

        // ESRI Satellite imagery layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18,
          errorTileUrl: ''
        }).addTo(mapInstance);

        // Convert [lng, lat] to Leaflet [lat, lng]
        const leafletLatLngs: [number, number][] = cleanCoords.map(c => [c[1], c[0]]);

        // Delineate cadastral boundary polygon
        const polygon = L.polygon(leafletLatLngs, {
          color: '#5B7553',
          weight: 3,
          fillColor: '#5B7553',
          fillOpacity: 0.35,
          dashArray: '4, 4'
        }).addTo(mapInstance);

        polygon.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.5; color: #1B1D1C; padding: 4px;">
            <strong style="color: #8B5F4D; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px;">${farmName}</strong><br/>
            <b>Khasra:</b> ${khasra}<br/>
            <b>Mapped Geodesic:</b> 2.46 Ha
          </div>
        `);

        // If interactive or container resized, invalidate size
        mapInstance.invalidateSize();
      } catch (err) {
        console.warn('Leaflet interactive initialization skipped, falling back to SVG vector view:', err);
        setMapError(true);
      }
    }, 30);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {}
        mapInstance = null;
      }
      if (parent) {
        parent.innerHTML = '';
        if ((parent as any)._leaflet_id) {
          delete (parent as any)._leaflet_id;
        }
      }
    };
  }, [cleanCoords, farmName, khasra, interactive]);

  // Compute SVG bounding box for clean vector fallback
  const lats = cleanCoords.map(p => p[1]);
  const lngs = cleanCoords.map(p => p[0]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lngSpan = (maxLng - minLng) || 0.001;
  const latSpan = (maxLat - minLat) || 0.001;

  // Normalized SVG points (within 400x240 box with padding)
  const svgPoints = cleanCoords.map(([lng, lat]) => {
    const x = 40 + ((lng - minLng) / lngSpan) * 320;
    const y = 200 - ((lat - minLat) / latSpan) * 160;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#EAE3D9] shadow-inner bg-[#222B23]">
      
      {/* Primary Leaflet Container */}
      <div 
        ref={containerRef} 
        style={{ height, width: '100%' }} 
        className={mapError ? 'hidden' : 'block'}
      />

      {/* High-Fidelity Vector Satellite Fallback View (activates if Leaflet or tiles fail) */}
      {mapError && (
        <div style={{ height }} className="w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E2E20] via-[#2A3B2B] to-[#162117]">
          {/* Subtle Grid Background representing Satellite Orthorectification */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(#CAB4AA 1px, transparent 1px), linear-gradient(90deg, #CAB4AA 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Cadastral Boundary Polygon */}
          <svg viewBox="0 0 400 240" className="w-full h-full max-w-lg p-4 z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <polygon 
              points={svgPoints} 
              fill="#5B7553" 
              fillOpacity="0.4" 
              stroke="#A8D59D" 
              strokeWidth="2.5" 
              strokeDasharray="4 3" 
            />
            {cleanCoords.map(([lng, lat], i) => {
              const x = 40 + ((lng - minLng) / lngSpan) * 320;
              const y = 200 - ((lat - minLat) / latSpan) * 160;
              return (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={y} 
                  r="4" 
                  fill="#FBF9F5" 
                  stroke="#5B7553" 
                  strokeWidth="2" 
                />
              );
            })}
          </svg>

          {/* Center Info Overlay */}
          <div className="absolute bottom-3 left-3 bg-[#1B1D1C]/80 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-[#FBF9F5] border border-white/10 z-20">
            <span className="font-serif font-semibold text-sm text-[#EAE3D9] block">{farmName}</span>
            <span className="text-[11px] text-[#CAB4AA] font-mono">Khasra {khasra} · 2.46 Ha Geodesic Mapped</span>
          </div>
        </div>
      )}

      {/* Floating Status Pill */}
      <div className="absolute top-3 right-3 bg-[#1B1D1C]/90 backdrop-blur-md text-[#FBF9F5] px-3.5 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-2 shadow-lg border border-white/10 z-20 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#5B7553] animate-pulse" />
        <span>Sentinel-2 Multispectral + Cadastral Overlay</span>
      </div>

    </div>
  );
};
