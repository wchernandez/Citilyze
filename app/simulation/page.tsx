'use client';

/**
 * Simulation page - allows users to adjust parameters and see stability impact.
 */

import { useState } from 'react';
import type { SimulationInputs } from '../../types';
import { computeStability } from '../../lib/simulation';
import Slider from '../../components/Slider';
import TrendChart from '../../components/TrendChart';

const INITIAL_INPUTS: SimulationInputs = {
  infrastructure: 50,
  governance: 50,
  transparency: 50,
  emergencyResponse: 50,
};

export default function SimulationPage() {
  const [inputs, setInputs] = useState<SimulationInputs>(INITIAL_INPUTS);
  const [baseline] = useState<number>(computeStability(INITIAL_INPUTS));
  const [result, setResult] = useState<number | null>(null);

  const handleChange = (key: keyof SimulationInputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setInputs((prev) => ({ ...prev, [key]: value }));
    };

  const run = () => {
    const newScore = computeStability(inputs);
    setResult(newScore);
  };

  const reset = () => {
    setInputs(INITIAL_INPUTS);
    setResult(null);
  };

  const chartData = result !== null
    ? [
        { date: 'baseline', value: baseline },
        { date: 'simulated', value: result },
      ]
    : [];

  const change = result !== null ? ((result - baseline) / baseline * 100).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Simulation Parameters</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Slider
            label="Infrastructure Budget (0-100)"
            value={inputs.infrastructure}
            onChange={handleChange('infrastructure')}
          />
          <Slider
            label="Governance (audit frequency)"
            value={inputs.governance}
            onChange={handleChange('governance')}
          />
          <Slider
            label="Transparency Score"
            value={inputs.transparency}
            onChange={handleChange('transparency')}
          />
          <Slider
            label="Emergency Response Speed"
            value={inputs.emergencyResponse}
            onChange={handleChange('emergencyResponse')}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={run}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Run Simulation
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </section>

      {result !== null && (
        <section>
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <p className="text-sm text-gray-500">Baseline</p>
                <p className="text-2xl font-bold">{baseline.toFixed(1)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <p className="text-sm text-gray-500">Simulated</p>
                <p className="text-2xl font-bold">{result.toFixed(1)}</p>
              </div>
              <div
                className={`bg-white dark:bg-gray-800 p-4 rounded shadow ${
                  parseFloat(change!) > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <p className="text-sm text-gray-500">Change</p>
                <p className="text-2xl font-bold">
                  {parseFloat(change!) > 0 ? '+' : ''}{change}%
                </p>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-3">Stability Comparison</h2>
          <TrendChart data={chartData} height={300} />
        </section>
      )}
    </div>
  );
}

