/**
 * Utility functions and constants used across the application.
 */

import type { AlertLevel } from '../types';

/** Get Tailwind color class for alert level */
export const getAlertColor = (level: AlertLevel): string => {
  const colors: Record<AlertLevel, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };
  return colors[level];
};

/** Format large numbers with commas */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/** Calculate percentage of a value relative to max */
export const calculatePercentage = (value: number, max: number): number => {
  return Math.round((value / max) * 100);
};

/** Clamp a number between min and max */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, num));
};

/** Generate a simple unique ID (for demo purposes) */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
