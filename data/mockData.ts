export interface Alert {
  id: number;
  message: string;
  level: 'low' | 'medium' | 'high';
}

export interface TrendPoint {
  date: string; // ISO string or simple label
  value: number;
}

export const stabilityScore = 72; // out of 100
export const integrityScore = 58; // out of 100

export const activeAlerts: Alert[] = [
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
