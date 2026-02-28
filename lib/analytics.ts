/**
 * Calculate a weighted average of numbers.
 * weights array must be same length as values; if not, equal weights assumed.
 */
export function weightedScore(values: number[], weights?: number[]): number {
  if (!values.length) return 0;
  if (!weights || weights.length !== values.length) {
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  return weightedSum / totalWeight;
}

/**
 * Detect anomalies in a numeric array by finding values that are more than
 * `threshold` standard deviations away from the mean.
 * Returns an array of {index, value} pairs.
 */
export function anomalyDetection(
  data: number[],
  threshold = 2
): Array<{ index: number; value: number }> {
  if (!data.length) return [];
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance =
    data.reduce((acc, v) => acc + (v - mean) ** 2, 0) / data.length;
  const std = Math.sqrt(variance);
  const results: Array<{ index: number; value: number }> = [];
  data.forEach((v, i) => {
    if (Math.abs(v - mean) > threshold * std) {
      results.push({ index: i, value: v });
    }
  });
  return results;
}
