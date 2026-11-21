import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Undo2, RotateCcw, Copy, Check, Navigation, Eye, Map as MapIcon, Satellite } from 'lucide-react';

export interface FarmMapViewerProps {
  coordinates?: number[][][] | number[][];
  farmName?: string;
  khasra?: string;
  height?: string;
  interactive?: boolean;
  enableDrawing?: boolean;
  onRegionChange?: (coords: [number, number][], areaHectares: number) => void;
}

export const PRESET_REGIONS: Record<string, { name: string; khasra: string; coords: [number, number][]; area: number }> = {
  "bhopal_48_2": {
    name: "Bhopal North Field (Berasia)",
    khasra: "48/2",
    coords: [
      [77.4128, 23.2599],
      [77.4155, 23.2605],
      [77.4162, 23.2578],
      [77.4132, 23.2572],
      [77.4128, 23.2599]
    ],
    area: 2.462
  },
  "sehore_112_1": {
    name: "Sehore Riverbank Plot (Ashta)",
    khasra: "112/1",
    coords: [
      [77.0850, 23.1950],
      [77.0885, 23.1960],
      [77.0890, 23.1925],
      [77.0855, 23.1918],
      [77.0850, 23.1950]
    ],
    area: 3.751
  },
  "raisen_95_4": {
    name: "Raisen Hillside Terrace (Gairatganj)",
    khasra: "95/4",
    coords: [
      [77.7810, 23.3315],
      [77.7845, 23.3325],
      [77.7850, 23.3290],
      [77.7815, 23.3285],
      [77.7810, 23.3315]
    ],
    area: 2.304
  }
};

const DEFAULT_COORDS: [number, number][] = PRESET_REGIONS["bhopal_48_2"].coords;

// Geodesic spherical polygon area calculation in hectares
export function computeGeodesicArea(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const radius = 6378137; // Earth's WGS84 authalic radius in meters
  let total = 0;
  const numPoints = coords.length;
  
  // Ensure closed polygon ring
  const pts = (coords[0][0] === coords[numPoints - 1][0] && coords[0][1] === coords[numPoints - 1][1])
    ? coords
    : [...coords, coords[0]];

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const lon1 = (p1[0] * Math.PI) / 180;
    const lat1 = (p1[1] * Math.PI) / 180;
    const lon2 = (p2[0] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    total += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  const areaSqMeters = Math.abs((total * radius * radius) / 2.0);
  return Number((areaSqMeters / 10000.0).toFixed(3));
}

// Safely extract [lng, lat][] list regardless of GeoJSON Polygon nesting
export function extractCoordinates(raw?: any): [number, number][] {
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_COORDS;
  }
  try {
    if (Array.isArray(raw[0]) && Array.isArray(raw[0][0])) {
      const ring = raw[0];
      const valid = ring.filter((p: any) => Array.isArray(p) && p.length >= 2 && !isNaN(Number(p[0])) && !isNaN(Number(p[1])));
      if (valid.length >= 3) return valid.map((p: any) => [Number(p[0]), Number(p[1])]);
    }
    if (Array.isArray(raw[0]) && typeof raw[0][0] === 'number') {
      const valid = raw.filter((p: any) => Array.isArray(p) && p.length >= 2 && !isNaN(Number(p[0])) && !isNaN(Number(p[1])));
      if (valid.length >= 3) return valid.map((p: any) => [Number(p[0]), Number(p[1])]);
    }
  } catch (e) {
    console.warn('Failed parsing coordinates for FarmMapViewer, using fallback', e);
  }
  return DEFAULT_COORDS;
}

export const FarmMapViewer: React.FC<FarmMapViewerProps> = ({
  coordinates,
  farmName = "Patel Khasra 48/2 North Plot",
  khasra = "48/2",
  height = "380px",
  interactive = true,
  enableDrawing = true,
  onRegionChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTilesRef = useRef<L.TileLayer | null>(null);

  const [points, setPoints] = useState<[number, number][]>(() => extractCoordinates(coordinates));
  const [isDrawing, setIsDrawing] = useState(false);
  const [basemap, setBasemap] = useState<'satellite' | 'streets'>('satellite');
  const [copied, setCopied] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const calculatedArea = computeGeodesicArea(points);
  const areaAcres = Number((calculatedArea * 2.47105).toFixed(2));

  // Sync with incoming coordinates prop when not actively drawing
  useEffect(() => {
    if (coordinates && !isDrawing) {
      const parsed = extractCoordinates(coordinates);
      setPoints(parsed);
    }
  }, [coordinates]);

  // Notify parent of region changes
  useEffect(() => {
    if (onRegionChange && points.length >= 3) {
      onRegionChange(points, calculatedArea);
    }
  }, [points, calculatedArea]);

  // Initialize Leaflet Map
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    let isCancelled = false;

    const timer = setTimeout(() => {
      if (isCancelled || !parent) return;

      try {
        parent.innerHTML = '';
        if ((parent as any)._leaflet_id) {
          delete (parent as any)._leaflet_id;
        }

        const mapDiv = document.createElement('div');
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        mapDiv.style.borderRadius = '1rem';
        parent.appendChild(mapDiv);

        // Compute centroid
        const lats = points.map(p => p[1]);
        const lngs = points.map(p => p[0]);
        const centerLat = lats.length ? (Math.min(...lats) + Math.max(...lats)) / 2 : 23.2599;
        const centerLng = lngs.length ? (Math.min(...lngs) + Math.max(...lngs)) / 2 : 77.4128;

        const map = L.map(mapDiv, {
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
          attributionControl: false,
          doubleClickZoom: false
        }).setView([centerLat, centerLng], 15);

        // Tile layer
        const tileUrl = basemap === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const tileLayer = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
        baseTilesRef.current = tileLayer;

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setMapReady(true);

        map.invalidateSize();
      } catch (err) {
        console.warn('Leaflet initialization error:', err);
      }
    }, 40);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {}
        mapRef.current = null;
      }
      if (parent) {
        parent.innerHTML = '';
        if ((parent as any)._leaflet_id) {
          delete (parent as any)._leaflet_id;
        }
      }
    };
  }, [basemap]);

  // Update Polygon & Draggable Markers whenever points change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up existing polygon
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    // Clean up existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    if (points.length === 0) return;

    // Leaflet uses [lat, lng]
    const latLngs: L.LatLngTuple[] = points.map(([lng, lat]) => [lat, lng]);

    // Draw Polygon if at least 3 points
    if (points.length >= 3) {
      const polygon = L.polygon(latLngs, {
        color: '#5B7553',
        weight: 3,
        fillColor: '#5B7553',
        fillOpacity: 0.35,
        dashArray: isDrawing ? '6, 6' : undefined
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.5; color: #1B1D1C; padding: 4px;">
          <strong style="color: #8B5F4D; font-size: 14px;">${farmName}</strong><br/>
          <b>Khasra:</b> ${khasra}<br/>
          <b>Mapped Area:</b> ${calculatedArea} Ha (${areaAcres} Acres)<br/>
          <b>Boundary Nodes:</b> ${points.length} points
        </div>
      `);

      polygonLayerRef.current = polygon;
    }

    // Add draggable corner pins
    if (interactive && markersLayerRef.current) {
      points.forEach(([lng, lat], idx) => {
        const customIcon = L.divIcon({
          className: 'custom-field-pin',
          html: `
            <div style="
              background-color: #5B7553;
              color: white;
              font-size: 10px;
              font-weight: bold;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              border: 2px solid #FBF9F5;
              cursor: grab;
            ">
              ${idx + 1}
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker([lat, lng], {
          icon: customIcon,
          draggable: enableDrawing
        });

        // Update point on marker drag
        marker.on('drag', (e: any) => {
          const newPos = e.target.getLatLng();
          setPoints(prev => {
            const updated = [...prev];
            updated[idx] = [Number(newPos.lng.toFixed(6)), Number(newPos.lat.toFixed(6))];
            // If closed ring and dragging first point, sync last point
            if (idx === 0 && updated.length > 3 && updated[0][0] === updated[updated.length - 1][0]) {
              updated[updated.length - 1] = [Number(newPos.lng.toFixed(6)), Number(newPos.lat.toFixed(6))];
            }
            return updated;
          });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [points, isDrawing, interactive, enableDrawing, farmName, khasra, calculatedArea, areaAcres]);

  // Click-to-Add Points when drawing is enabled
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !enableDrawing) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawing) return;
      const newPoint: [number, number] = [
        Number(e.latlng.lng.toFixed(6)),
        Number(e.latlng.lat.toFixed(6))
      ];
      setPoints(prev => [...prev, newPoint]);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawing, enableDrawing]);

  // Action handlers
  const handleUndo = () => {
    if (points.length === 0) return;
    setPoints(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleLoadPreset = (key: string) => {
    const preset = PRESET_REGIONS[key];
    if (preset) {
      setPoints(preset.coords);
      if (mapRef.current) {
        const lats = preset.coords.map(p => p[1]);
        const lngs = preset.coords.map(p => p[0]);
        mapRef.current.setView([(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2], 15);
      }
    }
  };

  const handleCopyGeoJSON = () => {
    const geojson = {
      type: "Feature",
      properties: {
        farm_name: farmName,
        khasra: khasra,
        area_hectares: calculatedArea,
        area_acres: areaAcres
      },
      geometry: {
        type: "Polygon",
        coordinates: [points.length >= 3 ? [...points, points[0]] : points]
      }
    };
    navigator.clipboard.writeText(JSON.stringify(geojson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#EAE3D9] bg-[#222B23] shadow-md font-sans">
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Mode indicator & Area metrics */}
        <div className="bg-[#1B1D1C]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDrawing ? 'bg-amber-400 animate-ping' : 'bg-[#5B7553]'}`} />
            <span className="text-xs font-semibold">
              {isDrawing ? 'Click map to add boundary points' : 'Field Region Delineated'}
            </span>
          </div>
          <span className="h-4 w-px bg-white/20" />
          <div className="text-xs font-mono">
            <span className="text-[#A8D59D] font-bold">{calculatedArea} Ha</span>
            <span className="text-white/60 ml-1.5">({areaAcres} Acres · {points.length} pts)</span>
          </div>
        </div>

        {/* Right: Basemap & Copy controls */}
        <div className="flex items-center gap-1.5 bg-[#1B1D1C]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setBasemap(b => b === 'satellite' ? 'streets' : 'satellite')}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-white/90 hover:bg-white/10 flex items-center gap-1.5 transition"
            title="Toggle between Satellite Imagery and Street Basemap"
          >
            {basemap === 'satellite' ? <Satellite className="w-3.5 h-3.5 text-blue-400" /> : <MapIcon className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="capitalize">{basemap}</span>
          </button>
          
          <button
            type="button"
            onClick={handleCopyGeoJSON}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-white/90 hover:bg-white/10 flex items-center gap-1.5 transition"
            title="Copy GeoJSON Polygon to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'GeoJSON'}</span>
          </button>
        </div>

      </div>

      {/* Primary Leaflet Container */}
      <div 
        ref={containerRef} 
        style={{ height, width: '100%' }}
        className="w-full relative cursor-crosshair"
      />

      {/* Bottom Interactive Toolbar (when drawing enabled) */}
      {enableDrawing && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 bg-[#F5EFE6]/95 backdrop-blur-md p-2.5 rounded-2xl border border-[#CAB4AA]/60 shadow-lg pointer-events-auto text-xs">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDrawing(!isDrawing)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 shadow-sm ${
                isDrawing
                  ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-400'
                  : 'bg-[#8B5F4D] hover:bg-[#74503F] text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isDrawing ? 'Done Adding Points' : '+ Draw Region on Map'}</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={points.length === 0}
              className="px-2.5 py-1.5 rounded-xl border border-[#CAB4AA] text-[#68625B] hover:bg-white/80 disabled:opacity-40 transition flex items-center gap-1"
              title="Undo last added point"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={points.length === 0}
              className="px-2.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-40 transition flex items-center gap-1"
              title="Clear all points"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#68625B]">
            <span className="font-semibold text-[#1B1D1C]">Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset('bhopal_48_2')}
              className="px-2 py-1 rounded-lg border border-[#CAB4AA] bg-white hover:bg-[#EAE3D9] text-[#1B1D1C] transition"
            >
              Bhopal 48/2 (2.46 Ha)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('sehore_112_1')}
              className="px-2 py-1 rounded-lg border border-[#CAB4AA] bg-white hover:bg-[#EAE3D9] text-[#1B1D1C] transition hidden sm:inline-block"
            >
              Sehore 112/1 (3.75 Ha)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('raisen_95_4')}
              className="px-2 py-1 rounded-lg border border-[#CAB4AA] bg-white hover:bg-[#EAE3D9] text-[#1B1D1C] transition hidden md:inline-block"
            >
              Raisen 95/4 (2.30 Ha)
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
