/**
 * Analytics page - displays infrastructure analysis and anomaly detection.
 */

import { spendingData, complaintTrend, procurementAnomalies } from '../../data';
import { weightedScore, anomalyDetection } from '../../lib/analytics';
import { formatNumber } from '../../lib/utils';
import SpendingIncidentChart from '../../components/SpendingIncidentChart';
import TrendChart from '../../components/TrendChart';

export default function AnalyticsPage() {
  // Demonstrate analytical functions
  const spendingValues = spendingData.map((d) => d.spending);
  const incidentValues = spendingData.map((d) => d.incidents);
  const spendingIncidentsScore = weightedScore(spendingValues, incidentValues);
  const detectedAnomalies = anomalyDetection(spendingValues);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Infrastructure Spending vs Incidents
        </h2>
        <SpendingIncidentChart data={spendingData} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Complaint Trend</h2>
        <TrendChart
          data={complaintTrend.map((d) => ({ date: d.date, value: d.complaints }))}
          dataKey="value"
          strokeColor="#f59e0b"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Procurement Anomalies</h2>
        {procurementAnomalies.length === 0 ? (
          <p className="text-gray-500">No anomalies detected</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 shadow rounded text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {procurementAnomalies.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{a.id}</td>
                    <td className="px-4 py-2">{a.item}</td>
                    <td className="px-4 py-2 font-mono">{a.score.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="text-sm text-gray-600 dark:text-gray-400">
        <details className="cursor-pointer">
          <summary className="font-semibold">Analytics Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-auto text-xs">
            {JSON.stringify(
              { spendingIncidentsScore, detectedAnomalies },
              null,
              2
            )}
          </pre>
        </details>
      </section>
    </div>
  );
}

