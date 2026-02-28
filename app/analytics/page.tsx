import { spendingData, complaintTrend, procurementAnomalies } from '../../data/analyticsMock';
import { weightedScore, anomalyDetection } from '../../lib/analytics';
import SpendingIncidentChart from '../../components/SpendingIncidentChart';
import TrendChart from '../../components/TrendChart';

export default function AnalyticsPage() {
  // example usage of analytical functions
  const spendingValues = spendingData.map((d) => d.spending);
  const incidentValues = spendingData.map((d) => d.incidents);
  const spendingIncidentsScore = weightedScore(spendingValues, incidentValues);
  const detectedAnomalies = anomalyDetection(spendingValues);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Infrastructure Spending vs Incidents
        </h2>
        <SpendingIncidentChart data={spendingData} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Complaint Trend</h2>
        {/* reuse TrendChart by mapping complaint data to expected shape */}
        <TrendChart
          data={complaintTrend.map((d) => ({ date: d.date, value: d.complaints }))}
          dataKey="value"
          strokeColor="#f59e0b"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">
          Procurement Anomalies
        </h2>
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

      {/* demonstrates analytic functions results in console */}
      <pre className="hidden">
        spendingIncidentsScore: {spendingIncidentsScore}
        anomalies (spending): {JSON.stringify(detectedAnomalies)}
      </pre>
    </div>
  );
}
