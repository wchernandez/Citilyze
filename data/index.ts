/**
 * Consolidated mock data for all features.
 * Replaces analyticsMock.ts and mockData.ts.
 */

import type {
  Alert,
  TrendPoint,
  SpendingPoint,
  ComplaintPoint,
  Anomaly,
} from '../types';

// Dashboard data
export const dashboardScores = {
  stability: 72,
  integrity: 58,
} as const;

export const dashboardAlerts: Alert[] = [
  { id: 1, message: 'Power grid instability detected', level: 'high' },
  { id: 2, message: 'Minor civil unrest in sector 4', level: 'medium' },
  { id: 3, message: 'Water treatment plant offline', level: 'high' },
];

export const stabilityTrend: TrendPoint[] = [
  { date: '2025-12-01', value: 65 },
  { date: '2025-12-15', value: 68 },
  { date: '2026-01-01', value: 70 },
  { date: '2026-01-15', value: 72 },
  { date: '2026-02-01', value: 71 },
  { date: '2026-02-15', value: 72 },
  { date: '2026-03-01', value: 72 },
];

// Analytics data
export const spendingData: SpendingPoint[] = [
  { date: '2025-12-01', spending: 120000, incidents: 5 },
  { date: '2025-12-15', spending: 150000, incidents: 3 },
  { date: '2026-01-01', spending: 110000, incidents: 8 },
  { date: '2026-01-15', spending: 180000, incidents: 6 },
  { date: '2026-02-01', spending: 140000, incidents: 4 },
  { date: '2026-02-15', spending: 130000, incidents: 7 },
  { date: '2026-03-01', spending: 160000, incidents: 2 },
];

export const complaintTrend: ComplaintPoint[] = [
  { date: '2025-12-01', complaints: 200 },
  { date: '2025-12-15', complaints: 180 },
  { date: '2026-01-01', complaints: 220 },
  { date: '2026-01-15', complaints: 210 },
  { date: '2026-02-01', complaints: 190 },
  { date: '2026-02-15', complaints: 205 },
  { date: '2026-03-01', complaints: 195 },
];

export const procurementAnomalies: Anomaly[] = [
  { id: 1, item: 'Office chairs', score: 3.5 },
  { id: 2, item: 'Server hardware', score: 5.2 },
  { id: 3, item: 'Catering services', score: 2.1 },
];
