'use client';

import { useRef } from 'react';
import { stabilityScore, integrityScore, activeAlerts } from '../../data/mockData';
import { procurementAnomalies } from '../../data/analyticsMock';
import TrendChart from '../../components/TrendChart';

export default function ReportsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const exportPdf = () => {
    // simple print-based PDF export
    window.print();
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <section>
        <h2 className="text-lg font-semibold mb-2">Current Scores</h2>
        <ul className="list-disc list-inside">
          <li>Urban Stability: {stabilityScore}</li>
          <li>Institutional Integrity: {integrityScore}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Risk Analysis</h2>
        <ul className="list-disc list-inside">
          {activeAlerts.map((a) => (
            <li key={a.id}>
              <strong>{a.level.toUpperCase()}</strong> – {a.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Detected Anomalies</h2>
        <table className="w-full bg-white dark:bg-gray-800 shadow rounded">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {procurementAnomalies.map((a) => (
              <tr key={a.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{a.id}</td>
                <td className="px-4 py-2">{a.item}</td>
                <td className="px-4 py-2">{a.score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Forecast Summary</h2>
        <p>Based on current trends, stability is expected to remain around {stabilityScore} for the next quarter.</p>
      </section>

      <button
        onClick={exportPdf}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Export as PDF
      </button>
    </div>
  );
}
