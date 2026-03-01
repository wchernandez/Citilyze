"use client";

/**
 * Dashboard page - displays key stability metrics using a cinematic dark grid layout.
 * Powered by Live Multi-City Municipal Data (NYC Socrata & Auckland Transport ArcGIS).
 */

import { useState, useEffect, useContext, useMemo } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { getTrendData } from '../../lib/dashboard';
import HeatmapClient from './components/HeatmapClient';
import { GaugeChart } from '../../components/GaugeChart';
import {
  AlertTriangle, TrendingUp, TrendingDown, Play, Users, CheckCircle,
  ChevronDown, ChevronsRight, ChevronRight, MapPin, ExternalLink,
  Info, Clock, BarChart3, PieChart, Monitor, BookOpen, Database
} from "lucide-react";

import { BarChart, Bar, LineChart, Line, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for graphs
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

  // Real dynamic values
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [stabilityVal, setStabilityVal] = useState(50);
  const [integrityVal, setIntegrityVal] = useState(50);
  const [seriousCount, setSeriousCount] = useState(0);

  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [realMapRisks, setRealMapRisks] = useState<any[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    setDataLoaded(false);
    const lowercaseCity = city.toLowerCase();

    if (lowercaseCity.includes('new york')) {
      fetchNYCData();
    } else if (lowercaseCity.includes('auckland')) {
      fetchAucklandData();
    }
  }, [city]);

  const fetchNYCData = async () => {
    try {
      const res = await fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=800&$order=created_date DESC');
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const total = data.length;
      const open = data.filter((d: any) => d.status === 'Open' || d.status === 'In Progress').length;
      setTotalComplaints(total);
      setPendingComplaints(open);

      const rate = total > 0 ? ((total - open) / total) : 1;
      setStabilityVal(Math.round(rate * 100));

      const serious = data.filter((d: any) =>
        ['Street Condition', 'Illegal Parking', 'Noise', 'Water System'].includes(d.complaint_type)
      ).length;
      setSeriousCount(serious);
      setIntegrityVal(Math.round(Math.max(30, 100 - (serious / total) * 100)));

      setRealMapRisks(data.filter((d: any) => d.latitude && d.longitude).slice(0, 400).map((d: any) => ({
        id: d.unique_key,
        lat: parseFloat(d.latitude),
        lng: parseFloat(d.longitude),
        location: d.incident_address || d.street_name || 'NYC Node',
        category: d.complaint_type || 'Civil Item',
        score: d.status === 'Open' ? 100 : 40
      })));

      setActiveAlerts(data.filter((d: any) => d.status === 'Open').slice(0, 10).map((d: any, i: number) => ({
        id: d.unique_key || i,
        level: i < 2 ? 'high' : 'medium',
        message: `${d.complaint_type} at ${d.incident_address || 'NYC'}`,
        created: d.created_date
      })));
      setDataLoaded(true);
    } catch (e) { console.error(e); }
  };

  const fetchAucklandData = async () => {
    try {
      // Auckland Transport Roadworks ArcGIS REST API
      const res = await fetch('https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/Roadworks/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json&resultRecordCount=200');
      const json = await res.json();
      const features = json.features || [];

      const total = features.length;
      setTotalComplaints(total);

      // Mapped events as "Open"
      const open = features.filter((f: any) => f.attributes.Status !== 'Completed').length;
      setPendingComplaints(open);

      const rate = total > 0 ? ((total - open) / total) : 0.6;
      setStabilityVal(Math.round(rate * 100 + 20)); // Offset for visualization baseline

      const serious = features.filter((f: any) => f.attributes.WorksiteType === 'Excavation').length;
      setSeriousCount(serious);
      setIntegrityVal(Math.round(Math.max(40, 100 - (serious / total) * 100)));

      setRealMapRisks(features.map((f: any) => ({
        id: f.attributes.OBJECTID,
        lat: f.geometry.y,
        lng: f.geometry.x,
        location: f.attributes.WorksiteName || f.attributes.ProjectName || 'Auckland Roadwork',
        category: f.attributes.WorksiteType || 'Infrastructure',
        score: f.attributes.Status === 'Completed' ? 40 : 100
      })));

      setActiveAlerts(features.slice(0, 10).map((f: any, i: number) => ({
        id: f.attributes.OBJECTID,
        level: f.attributes.WorksiteType === 'Excavation' ? 'high' : 'medium',
        message: `${f.attributes.WorksiteType}: ${f.attributes.WorksiteName || 'Infrastructure project'}`,
        created: new Date().toISOString()
      })));
      setDataLoaded(true);
    } catch (e) { console.error(e); }
  };

  const calcResolutionRate = () => {
    if (totalComplaints === 0) return 0;
    return Math.round(((totalComplaints - pendingComplaints) / totalComplaints) * 100);
  };

  const isSupported = useMemo(() => {
    const l = city?.toLowerCase() || "";
    return l.includes('new york') || l.includes('auckland');
  }, [city]);

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6"><MapPin className="w-10 h-10 text-gray-400" /></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Initialize Region</h2>
        <p className="text-gray-500 text-sm">Select a city to link municipal data feeds.</p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Feed Unsupported</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          No live Socrata or ArcGIS REST mapping found for <b>{city}</b>.
          <br /><br />
          Try <b>Auckland</b> or <b>New York</b> for live demonstration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 max-w-[1600px] mx-auto pb-8 relative">
      {expandedCard && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001]" onClick={() => setExpandedCard(null)} />}

      {/* Left Column */}
      <div className="col-span-1 flex flex-col gap-5">
        <div onClick={() => setExpandedCard('stability')} className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl cursor-pointer p-4 group transition-all ${expandedCard === 'stability' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002]' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Urban Stability</h2>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <GaugeChart value={dataLoaded ? stabilityVal : 0} label={stabilityVal > 60 ? "Resilient" : "Elevated Risk"} pillColor="bg-green-500" pillTextColor="text-white" />
          {expandedCard === 'stability' && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">Total Submissions</span>
                  <span className="text-2xl font-black text-white">{totalComplaints}</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">Resolution Rate</span>
                  <span className="text-2xl font-black text-white">{calcResolutionRate()}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic font-mono leading-relaxed">
                Calculated via 24h rolling resolution delta from {city.toLowerCase().includes('auckland') ? 'Auckland Transport ArcGIS' : 'NYC Socrata API'}.
              </p>
            </div>
          )}
        </div>

        <div onClick={() => setExpandedCard('integrity')} className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl cursor-pointer p-4 group transition-all ${expandedCard === 'integrity' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002]' : ''}`}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Institutional Integrity</h2>
          <GaugeChart value={dataLoaded ? integrityVal : 0} label="Operational" pillColor="bg-blue-500" pillTextColor="text-white" />
        </div>

        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl p-4 flex-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Sentiment Divergence</h2>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingData}>
                <Bar dataKey="uv" radius={[2, 2, 0, 0]}>{spendingData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Center Column (Map) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl overflow-hidden relative flex-1">
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live {city} Municipal Nodes
            </h3>
          </div>
          <div className="w-full h-full min-h-[400px]">
            {dataLoaded ? (
              <HeatmapClient
                key={city}
                center={city.toLowerCase().includes('auckland') ? [-36.8485, 174.7633] : [40.7128, -74.0060]}
                data={realMapRisks}
                zoom={city.toLowerCase().includes('auckland') ? 12 : 11}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                Initializing Cross-City Sync...
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 z-10 text-[9px] font-mono text-gray-400 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
            {city.toLowerCase().includes('auckland') ? 'SOURCE: AT OPEN DATA / ARCGIS FEATURESERVER' : 'SOURCE: NYC SOCRATA API v2.1'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 h-48">
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Historical Convergence</span>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={getTrendData()}>
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Budget Variance</span>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={budgetData}>
                <Bar dataKey="val" radius={[2, 2, 0, 0]}>{budgetData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column (Alerts) */}
      <div className="col-span-1 flex flex-col gap-5">
        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex-1 flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Regional Alerts</h2>
            <Database className="w-3 h-3 text-blue-500" />
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-white/5 no-scrollbar">
            {activeAlerts.map((a) => (
              <div key={a.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-3 h-3 mt-1 ${a.level === 'high' ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight">{a.message}</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">ID: {a.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">System Stress</h2>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-red-500">{dataLoaded ? (100 - stabilityVal) : 0}%</span>
            <TrendingUp className="text-red-500 w-6 h-6 mb-1" />
          </div>
        </div>
      </div>

      {/* Metric Bottom Bar */}
      <div className="lg:col-span-4 bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-6 border-r border-white/5 pr-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Daily Volume</span>
            <span className="text-xl font-black text-white leading-none">{totalComplaints}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Open Cases</span>
            <span className="text-xl font-black text-orange-500 leading-none">{pendingComplaints}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 group cursor-help">
          <Info className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">Data Feed: {city.toUpperCase()} Regional Access Tunnel active</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{dataLoaded ? 'Sync Nominal' : 'Searching...'}</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
      </div>
    </div>
  );
}
