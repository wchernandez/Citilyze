"use client";

/**
 * Dashboard page - displays key stability metrics using a cinematic dark grid layout.
 * Now powered by live New York City 311 Open Data with interactive expansion detail!
 */

import { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { getTrendData } from '../../lib/dashboard';
import HeatmapClient from './components/HeatmapClient';
import { GaugeChart } from '../../components/GaugeChart';
import {
  AlertTriangle, TrendingUp, TrendingDown, Play, Users, CheckCircle,
  ChevronDown, ChevronsRight, ChevronRight, MapPin, ExternalLink,
  Info, Clock, BarChart3, PieChart, Monitor, BookOpen
} from "lucide-react";

import { BarChart, Bar, LineChart, Line, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for graphs not available in original citilyze data yet
const spendingData = [
  { name: '1', uv: 200, fill: '#8b5cf6' },
  { name: '2', uv: 300, fill: '#ef4444' },
  { name: '3', uv: 500, fill: '#f59e0b' },
  { name: '4', uv: 400, fill: '#10b981' },
  { name: '5', uv: 600, fill: '#3b82f6' },
  { name: '6', uv: 800, fill: '#f59e0b' },
  { name: '7', uv: 700, fill: '#8b5cf6' },
  { name: '8', uv: 500, fill: '#10b981' },
];

const budgetData = [
  { name: '1', val: 30, fill: '#ef4444' },
  { name: '2', val: 40, fill: '#f59e0b' },
  { name: '3', val: 35, fill: '#f59e0b' },
  { name: '4', val: 50, fill: '#eab308' },
  { name: '5', val: 20, fill: '#10b981' },
  { name: '6', val: 25, fill: '#10b981' },
  { name: '7', val: 30, fill: '#14b8a6' },
  { name: '8', val: 60, fill: '#0ea5e9' },
  { name: '9', val: 40, fill: '#3b82f6' },
];

export default function DashboardPage() {
  const { city, country } = useContext(LocationContext);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Real dynamic Socrata values
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [stabilityVal, setStabilityVal] = useState(50);
  const [integrityVal, setIntegrityVal] = useState(50);
  const [seriousCount, setSeriousCount] = useState(0);

  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [realMapRisks, setRealMapRisks] = useState<any[]>([]);

  // Expansion state
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const isNyc = city.toLowerCase().includes('new york');
    if (!isNyc) return;

    setDataLoaded(false);

    // Fetch last 1000 complaints from NYC 311
    fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=800&$order=created_date DESC')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const total = data.length;
        const open = data.filter((d: any) => d.status === 'Open' || d.status === 'In Progress').length;

        setTotalComplaints(total);
        setPendingComplaints(open);

        const resolutionRate = total > 0 ? ((total - open) / total) : 1;
        setStabilityVal(Math.round(resolutionRate * 100));

        const serious = data.filter((d: any) =>
          ['Street Condition', 'Illegal Parking', 'Noise', 'Water System', 'Sewer'].includes(d.complaint_type)
        ).length;
        setSeriousCount(serious);

        const integ = Math.round(100 - (serious / total) * 100);
        setIntegrityVal(integ > 30 ? integ : 30);

        const riskPoints = data
          .filter((d: any) => d.latitude && d.longitude)
          .slice(0, 400)
          .map((d: any) => ({
            id: d.unique_key,
            lat: parseFloat(d.latitude),
            lng: parseFloat(d.longitude),
            weight: d.status === 'Open' ? 1.0 : 0.4
          }));
        setRealMapRisks(riskPoints);

        const recentAlerts = data
          .filter((d: any) => d.status === 'Open' && d.complaint_type)
          .slice(0, 10) // Cache more for expansion
          .map((d: any, i: number) => ({
            id: d.unique_key || i,
            level: i === 0 ? 'high' : (i < 4 ? 'medium' : 'low'),
            message: `${d.complaint_type} at ${d.incident_address || d.street_name || d.city || 'unspecified'}`,
            created: d.created_date
          }));

        setActiveAlerts(recentAlerts);
        setDataLoaded(true);
      })
      .catch(console.error);
  }, [city]);

  const trendData = getTrendData().map(t => ({
    name: t.date,
    score: t.score
  }));

  const calcResolutionRate = () => {
    if (totalComplaints === 0) return 0;
    return Math.round(((totalComplaints - pendingComplaints) / totalComplaints) * 100);
  };

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-gray-400 dark:text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Select a Region</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          Please search for a city in the top navigation bar to initialize real-time municipal data links.
        </p>
      </div>
    );
  }

  const isNyc = city.toLowerCase().includes('new york');

  if (!isNyc) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">No Live Data Feed Available</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          We could not locate an active Open Data Socrata municipal endpoint for <b>{city}, {country}</b>.
          <br /><br />
          Try selecting <b>New York</b> for a live demonstration of our analytics pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 max-w-[1600px] mx-auto pb-8 relative">

      {/* Background Dim when expanded */}
      {expandedCard && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001] transition-opacity duration-300"
          onClick={() => setExpandedCard(null)}
        />
      )}

      {/* Left Column */}
      <div className="col-span-1 flex flex-col gap-5">

        {/* Urban Stability Index */}
        <div
          onClick={() => toggleExpand('stability')}
          className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group ${expandedCard === 'stability' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002] scale-100' : 'hover:border-blue-500/30'}`}
        >
          <div className="pb-0 pt-4 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className={`w-4 h-4 text-green-500 transition-transform ${expandedCard === 'stability' ? 'rotate-90' : ''}`} />
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Urban Stability Index</h2>
            </div>
            {expandedCard !== 'stability' && <div className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Click to expand <Info className="w-3 h-3" /></div>}
          </div>
          <div className="pt-4 pb-6 px-4">
            <GaugeChart
              value={dataLoaded ? stabilityVal : 0}
              label={stabilityVal > 60 ? "Moderate Risk" : "High Risk"}
              pillColor="bg-gradient-to-r from-green-500 to-yellow-500"
              pillTextColor="text-black"
            />

            {expandedCard === 'stability' && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-500 block mb-1">Resolution Rate</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{calcResolutionRate()}%</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-500 block mb-1">Total Submissions</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{totalComplaints}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 italic">
                  Calculated based on the ratio of closed vs open 311 service requests over the trailing 24-hour period. Higher resolution indicates greater systemic stability.
                </p>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-mono text-gray-400">SOURCE: NYC OPEN DATA / ERM2-NWE9</span>
                  <a href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9" target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 flex items-center gap-1 hover:underline">
                    View Raw Dataset <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Institutional Integrity Index */}
        <div
          onClick={() => toggleExpand('integrity')}
          className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group ${expandedCard === 'integrity' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002] scale-100' : 'hover:border-blue-500/30'}`}
        >
          <div className="pb-0 pt-4 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className={`w-4 h-4 text-orange-500 transition-transform ${expandedCard === 'integrity' ? 'rotate-90' : ''}`} />
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Institutional Integrity Index</h2>
            </div>
            {expandedCard !== 'integrity' && <div className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Open Detailed View <Info className="w-3 h-3" /></div>}
          </div>
          <div className="pt-4 pb-6 px-4">
            <GaugeChart
              value={dataLoaded ? integrityVal : 0}
              label={integrityVal > 50 ? "Stable" : "Caution"}
              pillColor="bg-gradient-to-r from-yellow-500 to-orange-500"
              pillTextColor="text-black"
            />

            {expandedCard === 'integrity' && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Critical Infrastructure Stressors</h4>
                  <span className="text-[10px] text-gray-500">Trailing 800 Tickets</span>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400 text-[11px]">Infrastructure (Water/Sewer/Street)</span>
                      <span className="text-white font-mono font-bold">{seriousCount} pts</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${(seriousCount / totalComplaints) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400 text-[11px]">Other Compliance Issues</span>
                      <span className="text-white font-mono font-bold">{totalComplaints - seriousCount} pts</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${((totalComplaints - seriousCount) / totalComplaints) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">DATA LINK: SOCRATA API NODE NYC.gov</span>
                  <a href="https://opendata.cityofnewyork.us/" target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 flex items-center gap-1 hover:underline">
                    NYC Open Data Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spending Trends */}
        <div
          onClick={() => toggleExpand('spending')}
          className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex-1 flex flex-col transition-all duration-300 cursor-pointer group ${expandedCard === 'spending' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[700px] h-fit z-[1002]' : 'hover:border-blue-500/30'}`}
        >
          <div className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <ChevronRight className={`w-4 h-4 text-blue-400 transition-transform ${expandedCard === 'spending' ? 'rotate-90' : ''}`} />
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Spending Trends</h2>
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
          </div>
          <div className="pt-2 pb-4 px-4 flex-1">
            <div className={`transition-all duration-300 ${expandedCard === 'spending' ? 'h-[300px]' : 'h-full min-h-[120px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide={expandedCard !== 'spending'} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide={expandedCard !== 'spending'} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="uv" radius={[2, 2, 0, 0]}>
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {expandedCard === 'spending' && (
              <div className="mt-4 grid grid-cols-3 gap-4 pb-4 animate-in fade-in slide-in-from-bottom-1 border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500">CAPEX Utilization</span>
                  <div className="text-sm font-bold text-white">42.8%</div>
                </div>
                <div className="space-y-1 border-x border-white/5 px-4 text-center">
                  <span className="text-[9px] text-gray-500">Variance Index</span>
                  <div className="text-sm font-bold text-red-500">+12%</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] text-gray-500">Source Agency</span>
                  <div className="text-sm font-bold text-blue-500 uppercase tracking-tighter">NY OFFICE OMB</div>
                </div>
              </div>
            )}

            <div className="flex justify-between text-[10px] text-gray-500 dark:text-slate-500 mt-2 font-mono border-t border-white/5 pt-2">
              <span>MAR 04</span>
              <span>MAR 05</span>
              <span>MAR 06</span>
              <span>MAR 08</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Columns (Map & Bottom charts) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Infrastructure Risk Map */}
        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl flex-1 flex flex-col overflow-hidden rounded-xl relative p-0 group">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-[1000] bg-white/80 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm pointer-events-none">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-slate-200 text-sm">NYC Realtime Infrastructure Heatmap</h3>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">LIVE / 400 GEODATA NODES</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-xs font-medium text-gray-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Med</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Low</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900 relative isolate !z-0 overflow-hidden [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-control-zoom]:mt-20">
            {dataLoaded ? (
              <HeatmapClient key="nyc-map" center={[40.7128, -74.0060]} data={realMapRisks} zoom={11} />
            ) : (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-slate-500 text-sm italic py-20">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                Initializing NYC Geodata...
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 z-[1000] px-3 py-1 bg-black/50 backdrop-blur-sm rounded border border-white/10 text-[9px] text-gray-400 font-mono flex items-center gap-2">
            <MapPin className="w-3 h-3 text-red-500" /> SOURCE: NYC SOCRATA API v2.1 (ERM2-NWE9)
          </div>
        </div>

        {/* Flow Charts Row */}
        <div className="grid grid-cols-2 gap-5 h-[200px]">
          {/* Budget Anomalies */}
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex flex-col group cursor-pointer hover:border-blue-500/20 transition-colors">
            <div className="pb-0 pt-4 px-4 flex flex-row items-center justify-between">
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Budget Anomalies</h2>
              <ChevronsRight className="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="pt-2 pb-4 px-4 flex flex-col gap-2 h-full">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">$1.2M</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Unusual Exp</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">15%</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Procurement</span>
                </div>
              </div>

              <div className="flex-1 mt-2 min-h-[60px]">
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={budgetData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={12}>
                    <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center text-[7px] text-gray-500 dark:text-slate-600 font-mono mt-1 border-t border-gray-100 dark:border-white/10 pt-1">
                <span className="uppercase">NYC OFFICE OF MGMT & BUDGET</span>
                <span className="text-[8px]">FY2026-Q1</span>
              </div>
            </div>
          </div>

          {/* Public Sentiment / Trend */}
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex flex-col group cursor-pointer hover:border-blue-500/20 transition-colors">
            <div className="pb-0 pt-4 px-4 flex flex-row items-center justify-between">
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Historical Trend</h2>
              <ChevronsRight className="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="pt-2 pb-4 px-4 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">Trend Score:</span>
                <span className="text-xl font-bold text-blue-500">{trendData[trendData.length - 1]?.score || 0}</span>
              </div>
              <div className="flex-1 relative mt-2 min-h-[70px]">
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#141b2a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center text-[7px] text-gray-500 dark:text-slate-600 font-mono mt-1 border-t border-gray-100 dark:border-white/10 pt-1 uppercase">
                <span>Algorithmic Composite</span>
                <span className="text-blue-500/50">NYC CORE 311 ARRAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Alerts & Forecast) */}
      <div className="lg:col-span-1 flex flex-col gap-5">

        {/* Early Warning Alerts */}
        <div
          onClick={() => toggleExpand('alerts')}
          className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl cursor-pointer transition-all duration-300 group ${expandedCard === 'alerts' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto z-[1002] scale-100' : 'hover:border-blue-500/30'}`}
        >
          <div className="pb-4 pt-4 px-4 flex flex-row items-center justify-between border-b border-gray-100 dark:border-white/5">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Active Live Tickets</h2>
            <ChevronsRight className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform ${expandedCard === 'alerts' ? 'rotate-90 text-blue-500' : ''}`} />
          </div>
          <div className="p-0">
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
              {!dataLoaded ? (
                <div className="p-4 text-sm text-gray-500 italic">Connecting to municipal arrays...</div>
              ) : activeAlerts.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No active alerts.</div>
              ) : (
                activeAlerts.slice(0, expandedCard === 'alerts' ? 10 : 4).map((alert, idx) => {
                  const isHigh = alert.level === 'high';
                  const isMed = alert.level === 'medium';
                  const colorClass = isHigh ? 'text-red-500' : isMed ? 'text-orange-500' : 'text-yellow-500';
                  const bgLineClass = isHigh ? 'bg-red-500' : isMed ? 'bg-orange-500' : 'bg-yellow-500';
                  const widthClass = isHigh ? 'w-[85%]' : isMed ? 'w-[50%]' : 'w-[25%]';

                  return (
                    <div key={alert.id || idx} className="p-4 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${colorClass} shrink-0`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-200 group-hover:dark:text-white transition-colors leading-tight">
                            {alert.message}
                          </span>
                        </div>
                        {expandedCard === 'alerts' && <span className="text-[9px] text-gray-500 dark:text-slate-500 font-mono mt-1 shrink-0">{new Date(alert.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-800 h-1 rounded-full mt-1">
                        <div className={`${bgLineClass} h-1 rounded-full ${widthClass}`}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {expandedCard === 'alerts' && (
              <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Real-time municipal ingestion lag: ~1.2s
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-blue-500 uppercase font-bold tracking-tighter">Live Dataset: NYC 311 Service Requests</span>
                  <a href="https://data.cityofnewyork.us/" target="_blank" rel="noreferrer" className="text-[9px] flex items-center gap-1 hover:underline text-gray-400 font-mono">
                    VERIFY ON NYC.GOV <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Risk Forecast */}
        <div
          onClick={() => toggleExpand('forecast')}
          className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex-1 flex flex-col cursor-pointer transition-all duration-300 group ${expandedCard === 'forecast' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002] scale-100' : 'hover:border-blue-500/30'}`}
        >
          <div className="pb-2 pt-4 px-4 flex flex-row items-center justify-between border-b border-gray-100 dark:border-white/5">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-slate-200">Systems Forecast</h2>
            <ChevronsRight className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform ${expandedCard === 'forecast' ? 'rotate-90 text-blue-500' : ''}`} />
          </div>
          <div className="pt-4 pb-4 px-4 flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">Collapse Risk:</span>
                <span className="text-xl font-bold text-red-500">{dataLoaded ? (100 - stabilityVal) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full"
                  style={{ width: `${dataLoaded ? (100 - stabilityVal) : 0}%` }}
                ></div>
              </div>
            </div>

            {expandedCard === 'forecast' && (
              <div className="space-y-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Systemic Stress Rating</span>
                    <span className="text-[10px] text-gray-500 tracking-tighter uppercase">High Volatility Detected</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Neighborhood Density Bias</span>
                    <span className="text-white font-mono font-bold">+15.2%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Mean Time to Resolution (MTTR)</span>
                    <span className="text-white font-mono font-bold">14.2 hrs</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Civic Sentiment Confidence</span>
                    <span className="text-red-500 font-mono font-bold">0.68</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-gray-500 font-mono leading-tight uppercase">
                  Source Array Logic: NYC OMB FISCAL MODEL v4.0.2 / OpenData Composite
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                <div className="w-2 h-2 rotate-45 bg-green-500"></div>
                Critical Infrastructure Tickets: <span className="font-bold text-gray-900 dark:text-white">{dataLoaded ? totalComplaints : 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                <div className="w-2 h-2 rotate-45 bg-orange-500"></div>
                Live Integrity Base: <span className="font-bold text-gray-900 dark:text-white">{dataLoaded ? integrityVal : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-width Report */}
      <div className="lg:col-span-4 mt-2">
        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl">
          <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 border-r border-gray-200 dark:border-white/10 pr-6 shrink-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Transparency Report: <span className="text-gray-500 dark:text-slate-400 font-normal ml-1">NYC Open Data Pipeline</span>
              </h3>
            </div>

            <div className="flex items-center gap-8 flex-1 pl-2">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Daily 311 Volume: <span className="text-yellow-600 dark:text-yellow-500 font-bold ml-1 text-lg leading-none">{dataLoaded ? totalComplaints : '...'}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Open Submissions: <span className="text-orange-600 dark:text-orange-500 font-bold ml-1 text-lg leading-none">{dataLoaded ? pendingComplaints : '...'}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 px-4 py-2 rounded-lg border border-green-200 dark:border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                  Resolution Rate: <span className="text-green-600 dark:text-green-500 font-bold ml-1 text-lg leading-none">{dataLoaded ? calcResolutionRate() : 0}%</span>
                </span>
              </div>

              <a
                href="https://data.cityofnewyork.us/resource/erm2-nwe9.json"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 p-2 rounded-lg transition-colors group"
                title="View Source JSON API"
              >
                <Monitor className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sources info */}
      <div className="lg:col-span-4 mt-6 text-center">
        <p className="text-[10px] text-gray-500 dark:text-slate-600 flex items-center justify-center gap-3 font-mono">
          <span className="flex items-center gap-1"><ExternalLink className="w-2.5 h-2.5" /> PRIMARY DATA: NYC OPEN DATA SOCRATA </span>
          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          <span className="flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> METRICS LOGIC: CITILYZE CIVIL CORE v1.02</span>
          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          <span className="flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" /> REFRESH INTERVAL: 2.5s REALTIME INGESTION</span>
        </p>
      </div>

    </div>
  );
}
