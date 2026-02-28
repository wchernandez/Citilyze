/**
 * Application-wide constants and configuration.
 */

// Navigation
export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Simulation', href: '/simulation' },
  { name: 'Reports', href: '/reports' },
  { name: 'Methodology', href: '/methodology' },
  { name: 'About', href: '/about' },
] as const;

// Score ranges
export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

// Simulation defaults
export const SIMULATION_DEFAULT_VALUE = 50;
export const SIMULATION_MIN = 0;
export const SIMULATION_MAX = 100;

// Anomaly detection
export const ANOMALY_THRESHOLD = 2; // standard deviations

// App metadata
export const APP_NAME = 'Citilyze';
export const APP_DESCRIPTION = 'Urban Stability and Governance Analytics Platform';
