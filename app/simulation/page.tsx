'use client';

import { useState, useEffect } from 'react';
import TrendChart from '../../components/TrendChart';
import { computeStability, SimulationInputs } from '../../lib/simulation';

export default function SimulationPage() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    infrastructure: 50,
    governance: 50,
    transparency: 50,
    emergencyResponse: 50,
  });
  const [baseline, setBaseline] = useState<number>(
    computeStability(inputs)
  );
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    // recalc baseline if inputs reset
    setBaseline(computeStability(inputs));
  }, []); // only once

  const handleChange = (key: keyof SimulationInputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setInputs((prev) => ({ ...prev, [key]: value }));
    };

  const run = () => {
    const newScore = computeStability(inputs);
    setResult(newScore);
  };

  const chartData = result !== null
    ? [
        { date: 'before', value: baseline },
        { date: 'after', value: result },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Simulation Inputs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Slider
            label="Infrastructure Budget"
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
        <button
          onClick={run}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Run Simulation
        </button>
      </section>

      {result !== null && (
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Stability Comparison
          </h2>
          <TrendChart data={chartData} />
        </section>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Slider({ label, value, onChange }: SliderProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <span className="text-xs text-gray-600">{value}</span>
    </div>
  );
}
