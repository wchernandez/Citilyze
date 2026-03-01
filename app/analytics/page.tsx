'use client';

import { useContext, useMemo } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { spendingData, complaintTrend, procurementAnomalies } from '../../data';
import { weightedScore, anomalyDetection } from '../../lib/analytics';
import { MapPin, TrendingUp, BarChart3, Database, Info, ShieldAlert } from 'lucide-react';
import SpendingIncidentChart from '../../components/SpendingIncidentChart';
import TrendChart from '../../components/TrendChart';

export default function AnalyticsPage() {
  const { city } = useContext(LocationContext);

  const analytics = useMemo(() => {
    const spendingValues = spendingData.map(d => d.spending);
    const incidentValues = spendingData.map(d => d.incidents);
    return {
      score: weightedScore(spendingValues, incidentValues),
      anomalies: anomalyDetection(spendingValues)
    };
  }, []);

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Analytics Locked</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Please select a city in the header to unlock the analytical engine.
        </p>
      </div>
    );
  }

  const isNyc = city.toLowerCase().includes('new york');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
          <p className="text-sm text-gray-500 italic">Predictive modeling and infrastructure correlations for {city}</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-3 h-3" /> Real-time
          </div>
          <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        </div>
      </div>

      {!isNyc && (
        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-4 mb-6">
          <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Demo Mode Active</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Historical procurement data for <b>{city}</b> is currently simulated. Full live cross-ref analysis is available for <b>New York</b>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-[#141b2a] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-xl">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 font-mono">
            Infrastructure Spending vs Incidents
          </h2>
          <div className="h-[300px]">
            <SpendingIncidentChart data={spendingData} />
          </div>
        </section>

        <section className="bg-white dark:bg-[#141b2a] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-xl">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 font-mono">
            Complaint Volume Trend
          </h2>
          <div className="h-[300px]">
            <TrendChart
              data={complaintTrend.map(d => ({ date: d.date, value: d.complaints }))}
              dataKey="value"
              strokeColor="#3b82f6"
            />
          </div>
        </section>
      </div>

      <section className="bg-white dark:bg-[#141b2a] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-xl">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-6 font-mono">
          Procurement Anomaly Detection
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-left">
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[9px] tracking-widest">Entity ID</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[9px] tracking-widest">Asset Class</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[9px] tracking-widest">Anomaly Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {procurementAnomalies.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold">{a.id}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-medium">{a.item}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${a.score * 10}%` }}></div>
                      </div>
                      <span className="font-mono font-bold text-red-500 text-xs w-8">{a.score.toFixed(2)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            Correlation Matrix Score: <span className="text-gray-900 dark:text-white font-bold ml-1">{analytics.score.toFixed(2)}</span>
          </span>
        </div>
        <div className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.2em]">Engine: Citilyze Analytics v4.2</div>
      </div>
    </div>
  );
}
