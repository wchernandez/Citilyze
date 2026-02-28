/**
 * Dashboard page - displays key stability metrics.
 */

import { getStabilityScore, getIntegrityScore, getActiveAlerts, getTrendData } from '../../lib/dashboard';
import ScoreCard from '../../components/ScoreCard';
import RiskAlertCard from '../../components/RiskAlertCard';
import TrendChart from '../../components/TrendChart';

export default function DashboardPage() {
  const stability = getStabilityScore();
  const integrity = getIntegrityScore();
  const alerts = getActiveAlerts();
  const trend = getTrendData();

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard title="Urban Stability Index" score={stability} />
        <ScoreCard title="Institutional Integrity" score={integrity} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Active Risk Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500">No active alerts</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((a) => (
              <RiskAlertCard key={a.id} message={a.message} level={a.level} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Stability Over Time</h2>
        <TrendChart data={trend} />
      </section>
    </div>
  );
}

