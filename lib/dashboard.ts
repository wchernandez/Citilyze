/**
 * Dashboard data logic.
 * Fetches and transforms data for dashboard display.
 */

import {
  dashboardScores,
  dashboardAlerts,
  stabilityTrend,
} from '../data';
import type { Alert, TrendPoint } from '../types';

export function getStabilityScore(): number {
  return dashboardScores.stability;
}

export function getIntegrityScore(): number {
  return dashboardScores.integrity;
}

export function getActiveAlerts(): Alert[] {
  return dashboardAlerts;
}

export function getTrendData(): TrendPoint[] {
  return stabilityTrend;
}

