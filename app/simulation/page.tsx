'use client';

/**
 * Advanced City Governance Simulation - "Mayor Mode"
 * High-fidelity interactive dashboard for systemic impact forecasting.
 * Fully functional with reactive Distribution and Heat-map logic.
 */

import { useState, useEffect, useContext, useMemo } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import {
  Shield,
  Settings2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Box,
  Zap,
  Database,
  Fingerprint,
  Cpu,
  RefreshCw,
  Search,
  MapPin,
  ChevronRight,
  ChevronDown,
  Layout,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// --- Simulation Logic ---

interface SimState {
  infra: number;
  transparency: number;
  services: number;
  corruption: number;
}

const INITIAL_STATE: SimState = {
  infra: 65,
  transparency: 40,
  services: 55,
  corruption: 30,
};

export default function SimulationPage() {
  const { city, country } = useContext(LocationContext);
  const [params, setParams] = useState<SimState>(INITIAL_STATE);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'distribution'>('forecast');

  // Derive Metrics
  const metrics = useMemo(() => {
    const stability = (params.infra * 0.4 + params.services * 0.3 + params.corruption * 0.2 + params.transparency * 0.1);
    const integrity = (params.corruption * 0.5 + params.transparency * 0.4 + params.infra * 0.1);
    const trust = (params.transparency * 0.4 + params.services * 0.4 + params.corruption * 0.2);
    const crime = Math.max(0, 100 - (params.corruption * 0.6 + params.services * 0.4));
    const efficiency = (params.transparency * 0.3 + params.infra * 0.4 + (100 - params.corruption) * 0.3);

    return {
      stability: Math.round(stability),
      integrity: Math.round(integrity),
      trust: Math.round(trust),
      crime: Math.round(crime),
      efficiency: Math.round(efficiency),
    };
  }, [params]);

  // Generate Forecast Data (10 years)
  const forecastData = useMemo(() => {
    const data = [];
    const baseSlope = -0.5; // Baseline is slightly degrading
    const simImpact = (metrics.stability - 50) / 20; // Impact of simulation parameters

    for (let i = 0; i <= 10; i++) {
      const year = 2026 + i;
      const baseline = Math.max(20, Math.min(90, 70 + (baseSlope * i)));
      const simulated = Math.max(10, Math.min(95, 70 + (baseSlope * i) + (simImpact * i)));

      // Uncertainty bands
      const variance = i * 1.5;

      data.push({
        year: `'${year.toString().slice(2)}`,
        baseline,
        simulated,
        upper: simulated + variance,
        lower: Math.max(0, simulated - variance),
      });
    }
    return data;
  }, [metrics.stability]);

  // Generate Probability Distribution (Bell Curve)
  const distributionData = useMemo(() => {
    const data = [];
    const mean = metrics.stability;
    const stdDev = 15; // Width of the curve

    for (let x = 0; x <= 100; x += 2) {
      // Normal distribution formula: f(x) = (1 / (σ * sqrt(2π))) * e^(-0.5 * ((x-μ)/σ)^2)
      // We'll scale it for visualization
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      const y = Math.exp(exponent) * 100;
      data.push({ x, probability: y });
    }
    return data;
  }, [metrics.stability]);

  // Reactive Grid for Heatmap
  const gridCells = useMemo(() => {
    // Deterministic random based on parameters
    const seed = metrics.stability + metrics.integrity;
    return Array.from({ length: 72 }).map((_, i) => {
      const noise = Math.sin(seed + i * 0.1) * 20;
      const combined = metrics.stability + noise;
      // High stability = blue, Low stability = red
      return combined > 60 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    });
  }, [metrics.stability, metrics.integrity]);

  // Handle parameter change with slight "simulation lag" effect
  const handleParamChange = (key: keyof SimState, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 300);
  };

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-dashed border-gray-300 dark:border-white/10">
          <Cpu className="w-10 h-10 text-gray-400 dark:text-slate-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Initialize Mayor Mode</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          Please select a municipal jurisdiction to load civil simulation parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#141b2a] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none"></div>
        <div className="z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Citilyze <span className="text-blue-500">Mayor Mode</span></h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-mono flex items-center gap-2">
            <Fingerprint className="w-3 h-3 text-blue-500" /> SYSTEM ID: {city.toUpperCase()}-SIM-001 <span className="text-gray-300 dark:text-slate-700">|</span> v4.2 PROJECTION ENGINE
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-4 z-10">
          <div className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-3 border-transparent ${isSimulating ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/10 text-green-500'}`}>
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-widest">{isSimulating ? 'Recalculating...' : 'System Nominal'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Controllers */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex-1">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-500" /> Control Parameters
              </h3>
              <span className="text-[10px] font-mono text-gray-500">Manual Override</span>
            </div>

            <div className="space-y-10">
              {/* Infrastructure Budget */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">Infrastructure Budget</label>
                  <span className="text-xl font-black text-blue-500 font-mono leading-none">{params.infra}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="100"
                  value={params.infra}
                  onChange={(e) => handleParamChange('infra', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Transparency Funding */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">Transparency Funding</label>
                  <span className="text-xl font-black text-cyan-400 font-mono leading-none">{params.transparency}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="100"
                  value={params.transparency}
                  onChange={(e) => handleParamChange('transparency', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Public Service Investment */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">Public Service Investment</label>
                  <span className="text-xl font-black text-green-500 font-mono leading-none">{params.services}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="100"
                  value={params.services}
                  onChange={(e) => handleParamChange('services', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              {/* Anti-Corruption Level */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">Anti-Corruption Level</label>
                  <span className="text-xl font-black text-purple-500 font-mono leading-none">{params.corruption}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="100"
                  value={params.corruption}
                  onChange={(e) => handleParamChange('corruption', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            <div className="mt-12 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Real-time impact propagation active</span>
              </div>
              <button
                onClick={() => setParams(INITIAL_STATE)}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                Reset to Baseline
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Visualizations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Forecast / Distribution Graph */}
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  {activeTab === 'forecast' ? '10-Year Systemic Risk Projection' : 'Stability Probability Distribution'}
                </h3>
                <p className="text-[10px] text-gray-500">
                  {activeTab === 'forecast' ? 'Calculated composite stability forecast vs baseline' : 'Shaded statistical uncertainty bands based on parameters'}
                </p>
              </div>
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/5">
                <button
                  onClick={() => setActiveTab('forecast')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'forecast' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 active:scale-95'}`}
                >
                  Trend Lines
                </button>
                <button
                  onClick={() => setActiveTab('distribution')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'distribution' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 active:scale-95'}`}
                >
                  Distribution
                </button>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'forecast' ? (
                  <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUncertainty" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e293b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e293b" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#colorUncertainty)" />
                    <Area type="monotone" dataKey="lower" stroke="transparent" fill="#141b2a" />
                    <Area type="monotone" dataKey="simulated" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSim)" />
                    <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                ) : (
                  <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="probability" stroke="#10b981" fill="url(#colorProb)" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-2 -mt-2 text-blue-500"><Shield className="w-12 h-12" /></div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Urban Stability</span>
              <div className="flex items-end gap-1"><span className="text-3xl font-black text-gray-900 dark:text-white">{metrics.stability}</span></div>
              <div className={`mt-2 text-[10px] font-bold ${metrics.stability > 60 ? 'text-green-500' : 'text-orange-500'}`}>{metrics.stability > 60 ? 'POSITIVE' : 'CRITICAL'}</div>
            </div>

            <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-2 -mt-2 text-purple-500"><Fingerprint className="w-12 h-12" /></div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Integrity Score</span>
              <div className="flex items-end gap-1"><span className="text-3xl font-black text-gray-900 dark:text-white">{metrics.integrity}</span></div>
              <div className="mt-2 text-[10px] font-bold text-purple-500">NOMINAL</div>
            </div>

            <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-2 -mt-2 text-cyan-400"><Users className="w-12 h-12" /></div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Public Trust</span>
              <div className="flex items-end gap-1"><span className="text-3xl font-black text-gray-900 dark:text-white">{metrics.trust}%</span></div>
              <div className="mt-2 text-[10px] font-bold text-cyan-500">SOCIAL OK</div>
            </div>

            <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-2 -mt-2 text-red-500"><Activity className="w-12 h-12" /></div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Crime Projection</span>
              <div className="flex items-end gap-1 text-red-500"><span className="text-3xl font-black">{metrics.crime}</span></div>
              <div className="mt-2 text-[10px] font-bold text-slate-500">LOAD LEVEL</div>
            </div>

            <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-2 -mt-2 text-orange-500"><Zap className="w-12 h-12" /></div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Efficient Spend</span>
              <div className="flex items-end gap-1"><span className="text-3xl font-black text-gray-900 dark:text-white">{metrics.efficiency}</span></div>
              <div className="mt-2 text-[10px] font-bold text-orange-500">ROI OPTIM</div>
            </div>
          </div>

          {/* Reactive Heat Zones */}
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 z-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Simulation Heat Zone Map</h3>
                <p className="text-[10px] text-gray-500">Reactive propagation matching current simulation parameters</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-red-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> OVERLOAD
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> OPTIMAL
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[250px] relative rounded-xl bg-slate-100 dark:bg-black/40 border border-gray-200 dark:border-white/5 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full grid grid-cols-12 grid-rows-6">
                  {gridCells.map((color, i) => (
                    <div
                      key={i}
                      className="border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-700 ease-in-out"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">Propagating Sector: {city.toUpperCase()}</span>
                  <span className="text-xs font-bold text-white uppercase">{metrics.stability}% Node health</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Timeline Footer */}
      <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-6 overflow-hidden relative">
        <div className="flex-none flex items-center gap-3 border-r border-gray-100 dark:border-white/5 pr-6">
          <Layout className="w-5 h-5 text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Timeline Projection</span>
        </div>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {forecastData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[60px] relative group cursor-pointer">
              <span className={`text-[10px] font-bold ${i === 0 ? 'text-blue-500' : 'text-slate-500'}`}>{d.year}</span>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-700'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
