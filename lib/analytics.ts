/**
 * Analytics functions for data analysis.
 * Includes weighted scoring and anomaly detection.
 */

/**
 * Calculate a weighted average of numbers.
 * If weights are not provided, equal weights are used.
 */
export function weightedScore(values: number[], weights?: number[]): number {
  if (!values.length) return 0;

  if (!weights || weights.length !== values.length) {
    // Equal weights
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  return weightedSum / totalWeight;
}

/**
 * Detect anomalies using standard deviation threshold.
 * Returns array of {index, value} pairs for values that deviantly
 * by more than `threshold` standard deviations from the mean.
 */
export function anomalyDetection(
  data: number[],
  threshold = 2
): Array<{ index: number; value: number }> {
  if (!data.length) return [];

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((acc, v) => acc + (v - mean) ** 2, 0) / data.length;
  const std = Math.sqrt(variance);

  const results: Array<{ index: number; value: number }> = [];
  data.forEach((v, i) => {
    if (Math.abs(v - mean) > threshold * std) {
      results.push({ index: i, value: v });
    }
  });
  return results;
}

