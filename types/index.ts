/**
 * Central type definitions for the entire application.
 * Consolidates all interfaces and types to prevent duplication.
 */

export type AlertLevel = 'low' | 'medium' | 'high';

export interface MunicipalAlert {
  id: string | number;
  level: 'high' | 'medium';
  message: string;
  description: string;
  agency: string;
  status: string;
  created: string;
}

export interface MapRisk {
  id: string | number;
  lat: number;
  lng: number;
  location: string;
  category: string;
  score: number;
}

export interface CityData {
  totalComplaints: number;
  pendingComplaints: number;
  stabilityVal: number;
  integrityVal: number;
  seriousCount: number;
  mapRisks: MapRisk[];
  sentimentData: any[];
  varianceData: any[];
  alerts: MunicipalAlert[];
}

export interface TrendPoint {
  date: string;
  [key: string]: number | string;
}

export interface SimpleScore {
  value: number;
}

// Dashboard/Analytics types
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

// Simulation types
export interface SimulationInputs {
  infrastructure: number;
  governance: number;
  transparency: number;
  emergencyResponse: number;
}

// Chart data types
export interface ChartDataPoint {
  [key: string]: string | number;
}
