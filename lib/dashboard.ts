import {
  stabilityScore,
  integrityScore,
  activeAlerts,
  stabilityTrend,
  Alert,
  TrendPoint,
} from '../data/mockData';

export function getStabilityScore(): number {
  // Placeholder for more complex logic
  return stabilityScore;
}

export function getIntegrityScore(): number {
  return integrityScore;
}

export function getActiveAlerts(): Alert[] {
  return activeAlerts;
}

export function getTrendData(): TrendPoint[] {
  return stabilityTrend;
}
