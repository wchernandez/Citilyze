/**
 * Simulation logic for stability score calculations.
 */

import type { SimulationInputs } from '../types';
import { clamp } from './utils';

/**
 * Compute stability score from simulation inputs.
 * Uses weighted formula: 0.35*infrastructure + 0.25*governance + 0.2*transparency + 0.2*emergency_response
 */
export function computeStability(inputs: SimulationInputs): number {
  const {
    infrastructure,
    governance,
    transparency,
    emergencyResponse,
  } = inputs;

  const stability =
    0.35 * infrastructure +
    0.25 * governance +
    0.2 * transparency +
    0.2 * emergencyResponse;

  return clamp(stability, 0, 100);
}

