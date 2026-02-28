"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// leaflet.heat registers itself on the L namespace when imported
import 'leaflet.heat';

// risk point coming from props or external source
export interface RiskPoint {
  location: string;
  lat: number;
  lng: number;
  score: number; // 0 - 100
  category: string;
}

interface HeatmapProps {
  data?: RiskPoint[]; // optional: if omitted component could fetch itself
  // allow custom center/zoom if needed
  center?: [number, number];
  zoom?: number;
}

// small helper for color; green low, red high
function scoreToColor(score: number) {
  const hue = ((100 - score) * 120) / 100; // 0 = red, 120 = green
  return `hsl(${hue},100%,50%)`;
}

// component that adds the heat layer once the map is available
function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.0: 'blue', 0.5: 'lime', 1.0: 'red' },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function InfrastructureHeatmap({ data = [], center, zoom = 13 }: HeatmapProps) {
  // if no data is passed, attempt to fetch a local JSON file (mock)
  useEffect(() => {
    if (data.length === 0) {
      fetch('/data/infrastructureRisks.json')
        .then((res) => res.json())
        .then((d) => {
          // no-op; parent should supply data or replace this hook
        })
        .catch(() => {
          /* ignore */
        });
    }
  }, [data]);

  const heatPoints = data.map((d) => [d.lat, d.lng, d.score / 100] as [number, number, number]);

  // default map center is mean of points or provided
  const defaultCenter: [number, number] =
    center ||
    (data.length
      ? [
          data.reduce((s, p) => s + p.lat, 0) / data.length,
          data.reduce((s, p) => s + p.lng, 0) / data.length,
        ]
      : [0, 0]);

  return (
    <div className="h-96 w-full">
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer points={heatPoints} />

        {data.map((d, i) => (
          <CircleMarker
            key={i}
            center={[d.lat, d.lng]}
            radius={8}
            pathOptions={{
              color: scoreToColor(d.score),
              fillColor: scoreToColor(d.score),
              fillOpacity: 0.6,
            }}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={0.9} permanent={false}>
              <div className="text-sm">
                <strong>{d.location}</strong>
                <br />
                Score: {d.score}
                <br />
                Category: {d.category}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
