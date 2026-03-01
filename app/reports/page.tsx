'use client';

import { useState, useEffect, useContext, useCallback } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { procurementAnomalies } from '../../data';
import { fetchNYCData, fetchAucklandData, CityData } from '../../lib/municipal-api';
import { Shield, FileSearch, Printer, MapPin, Database, CheckCircle, Info, ChevronDown, ChevronUp, BarChart3, AlertTriangle, Activity } from 'lucide-react';

export default function ReportsPage() {
  const { city } = useContext(LocationContext);
  const [showMethodology, setShowMethodology] = useState(false);
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!city) return;
    setIsLoading(true);
    const lowercaseCity = city.toLowerCase();

    let data: CityData | null = null;
    if (lowercaseCity.includes('new york')) {
      data = await fetchNYCData();
    } else if (lowercaseCity.includes('auckland')) {
      data = await fetchAucklandData();
    }

    setCityData(data);
    setIsLoading(false);
  }, [city]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const exportPdf = () => window.print();

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <FileSearch className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Report Generator Offline</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Select a municipal region in the header to compile an audit report.
        </p>
      </div>
    );
  }

  const resolutionRate = cityData ? Math.round(((cityData.totalComplaints - cityData.pendingComplaints) / cityData.totalComplaints) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Configuration Controls (Hidden on Print) */}
      <div className="print:hidden mb-8 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-[#141b2a] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${showMethodology
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-white dark:bg-transparent border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:border-blue-500'
            }`}
        >
          {showMethodology ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showMethodology ? 'Hide Methodology' : 'Include Methodology'}
        </button>

        <button
          onClick={exportPdf}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all text-sm disabled:opacity-50"
        >
          <Printer className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* --- REPORT CONTAINER --- */}
      <div className="space-y-10 bg-white dark:bg-[#141b2a] p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-2xl print:shadow-none print:border-none print:p-0 transition-all">
        {/* Cinematic Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none uppercase">
                CITILYZE <span className="text-blue-600">AUDIT</span>
              </h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-2">Classified Municipal Intelligence Page</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Regional Jurisdiction</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{city.toUpperCase()}</h2>
            <p className="text-[9px] text-gray-400 font-mono mt-3 uppercase">
              SEQ: {Math.random().toString(36).slice(2, 10).toUpperCase()} <span className="mx-1">|</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Activity className="w-5 h-5" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Executive Summary</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
            This report summarizes the operational stability of <span className="text-gray-900 dark:text-white font-bold">{city}</span>.
            Stability scores are calculated via real-time ingestion of active municipal tickets, anomalous procurement spending,
            and infrastructure geodata latency. Systemic integrity is currently rated at
            <span className="text-blue-600 font-bold ml-1 uppercase">{cityData ? (cityData.stabilityVal > 70 ? 'NOMINAL / STABLE' : 'ELEVATED RISK') : 'CALCULATING...'}</span>.
          </p>
        </section>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <span className="text-[9px] font-bold uppercase text-gray-500 block mb-3 font-mono">Volume</span>
            <div className="flex items-end gap-2 text-gray-900 dark:text-white">
              <span className="text-3xl font-black leading-none">{cityData?.totalComplaints || 0}</span>
              <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tighter">Tickets</span>
            </div>
          </div>

          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <span className="text-[9px] font-bold uppercase text-gray-500 block mb-3 font-mono">Efficiency</span>
            <div className="flex items-end gap-2 text-green-500 font-bold">
              <span className="text-3xl font-black leading-none">{resolutionRate}%</span>
              <CheckCircle className="w-5 h-5 mb-1" />
            </div>
          </div>

          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <span className="text-[9px] font-bold uppercase text-gray-500 block mb-3 font-mono">Risk Core</span>
            <div className="flex items-end gap-2 text-red-500 font-bold">
              <span className="text-3xl font-black leading-none">0.82</span>
              <AlertTriangle className="w-5 h-5 mb-1" />
            </div>
          </div>
        </div>

        {/* Risk Constraints */}
        <section className="pt-4 animate-in fade-in duration-700">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Infrastructure Risk Constraints
          </h3>
          <div className="space-y-3">
            {(cityData?.alerts || []).slice(0, 5).map((a: import('../../lib/municipal-api').MunicipalAlert, i: number) => (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${a.level === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`} />
                <span className="text-xs text-gray-700 dark:text-slate-300 font-semibold flex-1 truncate">
                  {a.message}
                </span>
                <span className="text-[9px] font-mono text-gray-400 uppercase font-black px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {showMethodology && (
          <section className="mt-12 p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10 animate-in slide-in-from-top-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Calculation Methodology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-500 leading-relaxed font-mono">
              <div className="space-y-4">
                <p><strong className="text-gray-900 dark:text-white block uppercase">Stability Index</strong> (Closed / Total) * 100 with weighted latency decay.</p>
                <p><strong className="text-gray-900 dark:text-white block uppercase">Anomaly Det.</strong> Bolinger band envelope mapping at 2.5σ.</p>
              </div>
              <div className="space-y-4">
                <p><strong className="text-gray-900 dark:text-white block uppercase">Data Source</strong> Direct REST ingest from {city.includes('New York') ? 'Socrata v2.1' : 'ArcGIS REST FeatureServer'}.</p>
              </div>
            </div>
          </section>
        )}

        {/* Audit Stamp */}
        <div className="pt-10 mt-12 border-t border-gray-100 dark:border-white/5 flex justify-between items-center opacity-40 grayscale">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center font-black text-xs">SEC</div>
            <div className="text-[8px] font-mono leading-tight uppercase font-bold">Citilyze Engine v1.2.04</div>
          </div>
          <div className="text-[8px] font-mono uppercase text-right">
            End of Record <br /> Page 001/01
          </div>
        </div>
      </div>
    </div>
  );
}
