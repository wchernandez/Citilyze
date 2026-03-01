"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

export interface RiskPoint {
  location: string;
  lat: number;
  lng: number;
  score: number; // 0 - 100
  category: string;
}

interface HeatmapProps {
  data?: RiskPoint[];
  center?: [number, number];
  zoom?: number;
}

/**
 * Returns a vivid color based on risk score.
 * Low score (40) = Cyan/Blue
 * High score (100) = Red/Orange
 */
function scoreToColor(score: number) {
  if (score >= 90) return '#ef4444'; // Bright Red
  if (score >= 70) return '#f97316'; // Orange
  if (score >= 50) return '#eab308'; // Yellow
  return '#06b6d4'; // Cyan
}

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Create the heat layer with a vibrant classic gradient
    const heat = (L as any).heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 15,
      max: 1.0,
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      if (map) map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function InfrastructureHeatmap({ data = [], center, zoom = 13 }: HeatmapProps) {
  const heatPoints = data.map((d) => [d.lat, d.lng, d.score / 100] as [number, number, number]);

  const defaultCenter: [number, number] =
    center ||
    (data.length
      ? [
        data.reduce((s, p) => s + p.lat, 0) / data.length,
        data.reduce((s, p) => s + p.lng, 0) / data.length,
      ]
      : [40.7128, -74.0060]);

  return (
    <div className="h-full w-full bg-[#0f172a]">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Brighter, more vibrant Voyager map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <HeatLayer points={heatPoints} />

        {data.map((d, i) => (
          <CircleMarker
            key={d.location + i}
            center={[d.lat, d.lng]}
            radius={6}
            pathOptions={{
              color: '#1e293b', // Darker border for contrast on brighter tiles
              weight: 1.5,
              fillColor: scoreToColor(d.score),
              fillOpacity: 1.0, // Solid fill for max legibility
            }}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={1.0} className="custom-map-tooltip">
              <div className="p-2 min-w-[150px] bg-slate-900 text-white border-none shadow-2xl rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Municipal Node</div>
                <div className="text-xs font-bold mb-1 leading-tight">{d.location}</div>
                <div className="h-[1px] bg-white/10 my-2"></div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-semibold">{d.category}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] mt-1">
                  <span className="text-gray-400">Risk Score</span>
                  <span className={`font-bold ${d.score > 70 ? 'text-red-500' : 'text-cyan-400'}`}>{d.score}</span>
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc !important;
        }
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-map-tooltip:before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
