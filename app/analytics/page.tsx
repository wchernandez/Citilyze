'use client';

/**
 * Analytics page - displays infrastructure analysis and anomaly detection.
 * Reacts to selected city from LocationContext.
 */

import { useContext } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { spendingData, complaintTrend, procurementAnomalies } from '../../data';
import { weightedScore, anomalyDetection } from '../../lib/analytics';
import { MapPin, AlertTriangle, TrendingUp, BarChart3, Database } from 'lucide-react';
import SpendingIncidentChart from '../../components/SpendingIncidentChart';
import TrendChart from '../../components/TrendChart';

export default function AnalyticsPage() {
  const { city, country } = useContext(LocationContext);

  // Demonstrate analytical functions
  const spendingValues = spendingData.map((d) => d.spending);
  const incidentValues = spendingData.map((d) => d.incidents);
  const spendingIncidentsScore = weightedScore(spendingValues, incidentValues);
  const detectedAnomalies = anomalyDetection(spendingValues);

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-gray-400 dark:text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Analytics Locked</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          Please select a city in the header to unlock the infrastructure analytics and anomaly detection engine.
        </p>
      </div>
    );
  }

  const isNyc = city.toLowerCase().includes('new york');

  if (!isNyc) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Database className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">No Analytical Data</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          The Citilyze Engine has not yet indexed a spending dataset for <b>{city}</b>.
          <br /><br />
          Switch to <b>New York</b> to view the full civil analytics demonstration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 italic">Advanced anomaly detection and incident correlations</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-3 h-3" /> Real-time
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            Infrastructure Spending vs Incidents
          </h2>
          <div className="h-[300px]">
            <SpendingIncidentChart data={spendingData} />
          </div>
        </section>

        <section className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            Complaint Volume Trend
          </h2>
          <div className="h-[300px]">
            <TrendChart
              data={complaintTrend.map((d) => ({ date: d.date, value: d.complaints }))}
              dataKey="value"
              strokeColor="#3b82f6"
            />
          </div>
        </section>
      </div>

      <section className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 p-6 rounded-2xl shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
          Procurement Anomaly Detection
        </h2>
        {procurementAnomalies.length === 0 ? (
          <p className="text-gray-500 italic">No anomalies detected in the current procurement batch.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/5">
            <table className="w-full text-sm border-collapse bg-white dark:bg-transparent">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-left">
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Entity ID</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Asset Class</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Anomaly Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {procurementAnomalies.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold">{a.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-medium">{a.item}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${a.score * 10}%` }}></div>
                        </div>
                        <span className="font-mono font-bold text-red-500 text-xs w-8">{a.score.toFixed(2)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-xs text-gray-600 dark:text-slate-400 font-medium italic">Spending/Incident Correlation Score: <span className="text-gray-900 dark:text-white font-bold ml-1">{spendingIncidentsScore.toFixed(2)}</span></span>
        </div>
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Engine: Citilyze Analytics v4.2</div>
      </section>
    </div>
  );
}
