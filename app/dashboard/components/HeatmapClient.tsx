"use client";

import dynamic from 'next/dynamic';

// dynamic load the actual map component without SSR
const InfrastructureHeatmap = dynamic(
  () => import('./InfrastructureHeatmap'),
  { ssr: false }
);

export default InfrastructureHeatmap;
