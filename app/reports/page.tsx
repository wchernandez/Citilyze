'use client';

/**
 * Reports page - generates and exports summary reports.
 */

import { useRef } from 'react';
import { dashboardScores, dashboardAlerts, procurementAnomalies } from '../../data';
import { formatNumber } from '../../lib/utils';

export default function ReportsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const exportPdf = () => {
    // Client-side print-based PDF export
    window.print();
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <section>
        <h1 className="text-2xl font-bold mb-4">Urban Stability Report</h1>
        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Current Scores</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Urban Stability Index:</strong> {dashboardScores.stability}/100
          </li>
          <li>
            <strong>Institutional Integrity Index:</strong> {dashboardScores.integrity}/100
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Risk Analysis</h2>
        {dashboardAlerts.length === 0 ? (
          <p className="text-gray-500">No active alerts</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {dashboardAlerts.map((a) => (
              <li key={a.id}>
                <strong>[{a.level.toUpperCase()}]</strong> – {a.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Detected Anomalies</h2>
        {procurementAnomalies.length === 0 ? (
          <p className="text-gray-500">No anomalies detected</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-2">ID</th>
                  <th className="text-left py-2 px-2">Item</th>
                  <th className="text-right py-2 px-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {procurementAnomalies.map((a) => (
                  <tr key={a.id} className="border-b border-gray-200">
                    <td className="py-2 px-2">{a.id}</td>
                    <td className="py-2 px-2">{a.item}</td>
                    <td className="text-right py-2 px-2 font-mono">
                      {a.score.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Forecast Summary</h2>
        <p>
          Based on current trends and parameters, the Urban Stability Index is projected to remain
          stable around <strong>{dashboardScores.stability}</strong> for the next quarter.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Continued investment in infrastructure and governance improvements will be critical to
          maintain and improve stability metrics.
        </p>
      </section>

      <div className="pt-4 text-sm text-gray-600">
        <button
          onClick={exportPdf}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}

