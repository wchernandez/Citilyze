export interface SimulationInputs {
  infrastructure: number; // 0-100
  governance: number; // 0-100
  transparency: number; // 0-100
  emergencyResponse: number; // 0-100
}

/**
 * Compute stability score from components using provided weights.
 * Input values are expected 0-100 and result will also be 0-100.
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

  // clamp to 0-100
  return Math.max(0, Math.min(100, stability));
}
