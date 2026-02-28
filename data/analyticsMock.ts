export interface SpendingPoint {
  date: string;
  spending: number;
  incidents: number;
}

export interface ComplaintPoint {
  date: string;
  complaints: number;
}

export interface Anomaly {
  id: number;
  item: string;
  score: number;
}

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
