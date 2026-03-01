"use client";

import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { LocationContext } from '../../components/ClientLayout';
import { getTrendData } from '../../lib/dashboard';
import HeatmapClient from './components/HeatmapClient';
import { GaugeChart } from '../../components/GaugeChart';
import { DashboardCard } from './components/DashboardCard';
import { fetchNYCData, fetchAucklandData, CityData } from '../../lib/municipal-api';
import {
  AlertTriangle, TrendingUp, Play, Users, CheckCircle,
  ChevronRight, MapPin, Info, Database, BarChart3
} from "lucide-react";

import { BarChart, Bar, LineChart, Line, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export default function DashboardPage() {
  const { city, timezone } = useContext(LocationContext);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [cityData, setCityData] = useState<CityData | null>(null);

  const loadData = useCallback(async () => {
    if (!city) return;

    setDataLoaded(false);
    const lowercaseCity = city.toLowerCase();

    let data: CityData | null = null;
    if (lowercaseCity.includes('new york')) {
      data = await fetchNYCData();
    } else if (lowercaseCity.includes('auckland')) {
      data = await fetchAucklandData();
    }

    if (data) {
      setCityData(data);
      setDataLoaded(true);
    }
  }, [city]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resolutionRate = useMemo(() => {
    if (!cityData || cityData.totalComplaints === 0) return 0;
    return Math.round(((cityData.totalComplaints - cityData.pendingComplaints) / cityData.totalComplaints) * 100);
  }, [cityData]);

  const isSupported = useMemo(() => {
    const l = city?.toLowerCase() || "";
    return l.includes('new york') || l.includes('auckland');
  }, [city]);

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Initialize Region</h2>
        <p className="text-gray-500 text-sm">Select a city to link municipal data feeds.</p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Feed Unsupported</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          No live Socrata or ArcGIS REST mapping found for <b>{city}</b>.<br /><br />
          Try <b>Auckland</b> or <b>New York</b> for live demonstration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 max-w-[1600px] mx-auto pb-8 relative">
      {/* Left Column */}
      <div className="col-span-1 flex flex-col gap-5">
        <DashboardCard
          id="stability"
          title="Urban Stability"
          expanded={expandedCard === 'stability'}
          onExpand={setExpandedCard}
          expandedView={
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">Total Submissions</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{cityData?.totalComplaints || 0}</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">Resolution Rate</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{resolutionRate}%</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic font-mono leading-relaxed">
                Rolling 24h analytical delta from municipal feeds.
              </p>
            </div>
          }
        >
          <GaugeChart
            value={dataLoaded ? (cityData?.stabilityVal || 0) : 0}
            label={(cityData?.stabilityVal || 0) < 40 ? "Critical" : (cityData?.stabilityVal || 0) < 70 ? "Elevated Risk" : "Resilient"}
            pillColor={(cityData?.stabilityVal || 0) < 40 ? "bg-red-500" : (cityData?.stabilityVal || 0) < 70 ? "bg-orange-500" : "bg-green-500"}
            pillTextColor="text-white"
          />
        </DashboardCard>

        <DashboardCard
          id="integrity"
          title="Institutional Integrity"
          expanded={expandedCard === 'integrity'}
          onExpand={setExpandedCard}
          expandedView={
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">Critical Nodes</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{cityData?.seriousCount || 0}</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block mb-1">System Health</span>
                  <span className="text-2xl font-black text-blue-500">{cityData?.integrityVal || 0}%</span>
                </div>
              </div>
            </div>
          }
        >
          <GaugeChart
            value={dataLoaded ? (cityData?.integrityVal || 0) : 0}
            label={(cityData?.integrityVal || 0) < 40 ? "Systemic Risk" : (cityData?.integrityVal || 0) < 70 ? "Degraded" : "Operational"}
            pillColor={(cityData?.integrityVal || 0) < 40 ? "bg-red-500" : (cityData?.integrityVal || 0) < 70 ? "bg-orange-500" : "bg-green-500"}
            pillTextColor="text-white"
          />
        </DashboardCard>

        <DashboardCard
          id="sentiment"
          title="Sentiment Divergence"
          expanded={expandedCard === 'sentiment'}
          onExpand={setExpandedCard}
          className="flex-1"
          expandedView={
            <div className="h-48 w-full bg-gray-50 dark:bg-black/20 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData?.sentimentData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Bar dataKey="uv" radius={[4, 4, 0, 0]}>{cityData?.sentimentData.map((_e, i) => <Cell key={i} fill={(cityData?.sentimentData || [])[i].fill} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          }
        >
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData?.sentimentData || []}>
                <XAxis dataKey="name" hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#3b82f6' }}
                  labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="uv" radius={[2, 2, 0, 0]}>{(cityData?.sentimentData || []).map((_e, i) => <Cell key={i} fill={(cityData?.sentimentData || [])[i].fill} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Center Column (Map) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl overflow-hidden relative flex-1">
          <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live {city} Municipal Nodes
            </h3>
          </div>
          <div className="w-full h-full min-h-[400px]">
            {dataLoaded && cityData ? (
              <HeatmapClient
                key={city}
                center={city.toLowerCase().includes('auckland') ? [-36.8485, 174.7633] : [40.7128, -74.0060]}
                data={cityData.mapRisks}
                zoom={city.toLowerCase().includes('auckland') ? 12 : 11}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                Initializing Cross-City Sync...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 h-48">
          <DashboardCard
            id="convergence"
            title="Historical Convergence"
            expanded={expandedCard === 'convergence'}
            onExpand={setExpandedCard}
          >
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getTrendData()}>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard
            id="variance"
            title="Budget Variance"
            expanded={expandedCard === 'variance'}
            onExpand={setExpandedCard}
          >
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData?.varianceData || []}>
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#3b82f6' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="val" radius={[2, 2, 0, 0]}>{(cityData?.varianceData || []).map((_e, i) => <Cell key={i} fill={(cityData?.varianceData || [])[i].fill} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Right Column (Alerts) */}
      <div className="col-span-1 flex flex-col gap-5">
        <div className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl flex flex-col group transition-all duration-500 overflow-hidden ${expandedCard === 'alerts' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[700px] h-[80vh] z-[1002]' : 'flex-1 h-[500px]'}`}>
          <div
            onClick={() => setExpandedCard(expandedCard === 'alerts' ? null : 'alerts')}
            className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 cursor-pointer"
          >
            <div className="flex flex-col">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Regional Alerts</h2>
              {expandedCard === 'alerts' && <span className="text-[9px] text-blue-500 font-mono mt-1">SECURE LIVE FEED ACTIVE</span>}
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-3 h-3 text-blue-500" />
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedCard === 'alerts' ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-white/5 custom-scrollbar">
            {(cityData?.alerts || []).slice(0, expandedCard === 'alerts' ? 100 : 10).map((a: import('../../lib/municipal-api').MunicipalAlert) => (
              <div key={a.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group/item">
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${a.level === 'high' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 group-hover/item:text-blue-500 dark:group-hover/item:text-white transition-colors leading-tight">
                        {a.message}
                      </span>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {new Date(a.created).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: timezone || undefined
                          })}
                        </span>
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${a.status?.toLowerCase() === 'open' || a.status?.toLowerCase() === 'active' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                    {expandedCard === 'alerts' && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                          {a.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono pt-1">
                          <span className="text-blue-500 uppercase font-black px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">Agency: {a.agency}</span>
                          <span className="text-gray-400 uppercase">Node ID: {a.id}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div onClick={() => setExpandedCard('stress')} className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl p-4 cursor-pointer group transition-all ${expandedCard === 'stress' ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] z-[1002]' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">System Stress</h2>
            <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-red-500">{dataLoaded ? (100 - (cityData?.stabilityVal || 0)) : 0}%</span>
            <TrendingUp className="text-red-500 w-6 h-6 mb-1" />
          </div>
        </div>
      </div>

      {/* Metric Bottom Bar */}
      <div className="lg:col-span-4 bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 md:border-r md:border-gray-100 dark:md:border-white/5 md:pr-6 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Daily Volume</span>
            <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{cityData?.totalComplaints || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Open Cases</span>
            <span className="text-xl font-black text-orange-500 leading-none">{cityData?.pendingComplaints || 0}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase tracking-[0.2em] truncate">
            Feed: {city.toUpperCase()} Regional Access Tunnel active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{dataLoaded ? 'Sync Nominal' : 'Searching...'}</span>
          <div className={`w-2 h-2 rounded-full ${dataLoaded ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-gray-300 animate-pulse'}`} />
        </div>
      </div>
    </div>
  );
}
