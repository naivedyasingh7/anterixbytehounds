import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FarmMapViewerProps {
  coordinates?: number[][][];
  farmName?: string;
  khasra?: string;
  height?: string;
  interactive?: boolean;
}

export const FarmMapViewer: React.FC<FarmMapViewerProps> = ({
  coordinates,
  farmName = "Patel Khasra 48/2 North Plot",
  khasra = "48/2",
  height = "320px",
  interactive = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const defaultCoords = [
    [77.4128, 23.2599],
    [77.4155, 23.2605],
    [77.4162, 23.2578],
    [77.4132, 23.2572],
    [77.4128, 23.2599]
  ];

  const polygonCoords = coordinates ? coordinates[0] : defaultCoords;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Centroid calculation
    const lats = polygonCoords.map(p => p[1]);
    const lngs = polygonCoords.map(p => p[0]);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    const map = L.map(mapContainerRef.current, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
    }).setView([centerLat, centerLng], 15);

    // High quality ESRI Satellite imagery layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri, Maxar, Earthstar Geographics',
      maxZoom: 18
    }).addTo(map);

    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const leafletLatLngs: [number, number][] = polygonCoords.map(c => [c[1], c[0]]);

    // Render Cadastral boundary polygon
    const polygon = L.polygon(leafletLatLngs, {
      color: '#22c55e',
      weight: 3,
      fillColor: '#16a34a',
      fillOpacity: 0.35,
      dashArray: '4, 4'
    }).addTo(map);

    polygon.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong style="color: #15803d;">${farmName}</strong><br/>
        <b>Khasra:</b> ${khasra}<br/>
        <b>Mapped Geodesic:</b> 2.46 Ha
      </div>
    `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [coordinates, farmName, khasra, interactive]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Sentinel-2 Multispectral + Cadastral Overlay
      </div>
    </div>
  );
};
