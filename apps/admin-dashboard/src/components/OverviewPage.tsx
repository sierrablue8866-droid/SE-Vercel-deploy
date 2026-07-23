import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { api } from '../lib/apiClient';
import { Lead, Agent, SearchLog } from '../types';
import { ComposedChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardWidgets from './DashboardWidgets';
import AgentLeaderboard from './AgentLeaderboard';
import ActivityFeed from './ActivityFeed';

const CHART_DATA = [
  { month: 'Jan', deals: 35, revenue: 1.1 },
  { month: 'Feb', deals: 42, revenue: 1.4 },
  { month: 'Mar', deals: 38, revenue: 1.2 },
  { month: 'Apr', deals: 65, revenue: 2.1 },
  { month: 'May', deals: 55, revenue: 1.8 },
  { month: 'Jun', deals: 82, revenue: 2.6 },
  { month: 'Jul', deals: 97, revenue: 3.2 },
];

interface OverviewPageProps {
  T: (key: string) => string;
}

export default function OverviewPage({ T }: OverviewPageProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [listingsCount, setListingsCount] = useState<number>(1547);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchLog[]>([]);
  const [searchRange, setSearchRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [loading, setLoading] = useState(true);

  const CustomSearchTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isNew = data.changeText === 'New';
      const isPositive = !isNew && data.pctChange >= 0;
      
      const currentLabel = searchRange === '7d' ? '0-7d' : searchRange === '30d' ? '0-30d' : 'Recent';
      const previousLabel = searchRange === '7d' ? '7-14d' : searchRange === '30d' ? '30-60d' : 'Older';

      return (
        <div className="bg-[#0a0f1d]/95 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-mono text-[9px] text-[#22d3ee] uppercase tracking-widest mb-1 select-none font-bold">
            Analytics Tooltip
          </p>
          <p className="text-sm font-semibold text-slate-100 capitalize mb-2 border-b border-slate-800 pb-1.5">
            "{data.term}"
          </p>
          <div className="space-y-1.5 font-sans text-xs">
            <div className="flex justify-between items-center gap-8">
              <span className="text-slate-400">Current ({currentLabel}):</span>
              <span className="font-semibold text-[#22d3ee] font-mono">{data.count} searches</span>
            </div>
            <div className="flex justify-between items-center gap-8 border-b border-slate-800/40 pb-1.5 mb-1.5">
              <span className="text-slate-400">Previous ({previousLabel}):</span>
              <span className="font-semibold text-slate-350 font-mono">{data.previousCount} searches</span>
            </div>
            <div className="flex justify-between items-center gap-8">
              <span className="text-slate-400">Period Change:</span>
              {isNew ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono bg-[#22d3ee]/10 text-[#22d3ee]">
                  ★ {data.changeText}
                </span>
              ) : isPositive ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono bg-emerald-500/10 text-emerald-400 font-bold">
                  ▲ {data.changeText}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono bg-rose-500/10 text-rose-400 font-bold">
                  ▼ {data.changeText}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    // Fetch all searches for dynamic date filtering (7d, 30d, all-time)
    const qSearches = collection(db, 'searches');
    const unsubSearches = onSnapshot(
      qSearches,
      (snap) => {
        const loaded: SearchLog[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          loaded.push({
            id: doc.id,
            query: d.query,
            scope: d.scope,
            timestamp: d.timestamp?.toDate ? d.timestamp.toDate() : new Date(),
            userId: d.userId,
            isVoice: d.isVoice,
          });
        });
        setRecentSearches(loaded);
      },
      (err) => console.error('Error fetching searches:', err)
    );

    return () => {
      unsubSearches();
    };
  }, []);

  // Backend-polled leads/listings-count/agents (replaces Firestore onSnapshot — see ARCHITECTURE_INTEGRATION.md).
  useEffect(() => {
    const refresh = async () => {
      try {
        const [{ leads: loadedLeads }, { listings }, { agents: loadedAgents }] = await Promise.all([
          api.get<{ leads: any[] }>('/api/admin/leads'),
          api.get<{ listings: any[] }>('/api/admin/listings'),
          api.get<{ agents: any[] }>('/api/admin/agents'),
        ]);
        setLeads(
          loadedLeads.map((d) => ({
            ...d,
            createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
            updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
          }))
        );
        setListingsCount(listings.length || 1547);
        setAgents(loadedAgents.map((d) => ({ ...d, updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date() })));
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    refresh();
    const interval = setInterval(refresh, 20000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const activeLeadsCount = leads.length;
  const hotLeads = leads.filter(l => l.hot);

  // Sparkline generator
  const renderSparkline = (spark: number[], color: string) => {
    const max = Math.max(...spark, 1);
    return (
      <div className="flex items-end gap-[2px] h-6 mt-2">
        {spark.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm min-h-[3px] transition-all duration-300"
            style={{
              height: `${(v / max) * 100}%`,
              backgroundColor: i === spark.length - 1 ? color : `${color}40`
            }}
          />
        ))}
      </div>
    );
  };

  const CARD_STATS = [
    { val: listingsCount.toString(), lbl: T('totalListings'), delta: '+12% this week', up: true, color: 'var(--blue)', spark: [42, 55, 48, 70, 62, 85, 95] },
    { val: activeLeadsCount.toString(), lbl: T('activeLeads'), delta: `+${hotLeads.length} hot today`, up: true, color: 'var(--gold)', spark: [30, 45, 38, 55, 48, 70, 80] },
    { val: 'EGP 6.2M', lbl: T('avgDeal'), delta: '+5% MoM', up: true, color: 'var(--emerald)', spark: [55, 60, 52, 68, 65, 78, 88] },
    { val: '97', lbl: T('dealsClosed'), delta: 'This month', up: true, color: 'var(--purple)', spark: [20, 35, 28, 48, 42, 65, 75] },
  ];

  const searchTermsData = useMemo(() => {
    const now = new Date();
    
    const currentCounts: Record<string, number> = {};
    const previousCounts: Record<string, number> = {};

    recentSearches.forEach(search => {
      if (!search.query) return;
      const term = search.query.toLowerCase().trim();
      if (!term) return;

      const searchTime = search.timestamp instanceof Date ? search.timestamp : new Date(search.timestamp);
      
      if (searchRange === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        if (searchTime >= sevenDaysAgo) {
          currentCounts[term] = (currentCounts[term] || 0) + 1;
        } else if (searchTime >= fourteenDaysAgo) {
          previousCounts[term] = (previousCounts[term] || 0) + 1;
        }
      } else if (searchRange === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        if (searchTime >= thirtyDaysAgo) {
          currentCounts[term] = (currentCounts[term] || 0) + 1;
        } else if (searchTime >= sixtyDaysAgo) {
          previousCounts[term] = (previousCounts[term] || 0) + 1;
        }
      }
    });

    if (searchRange === 'all') {
      const sorted = [...recentSearches]
        .filter(s => s.query && s.query.trim())
        .sort((a, b) => {
          const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return tb - ta;
        });
      const mid = Math.ceil(sorted.length / 2);
      sorted.forEach((search, idx) => {
        const term = search.query.toLowerCase().trim();
        if (idx < mid) {
          currentCounts[term] = (currentCounts[term] || 0) + 1;
        } else {
          previousCounts[term] = (previousCounts[term] || 0) + 1;
        }
      });
    }

    return Object.entries(currentCounts)
      .map(([term, currentCount]) => {
        const previousCount = previousCounts[term] || 0;
        let pctChange = 0;
        let changeText = 'New';
        
        if (previousCount > 0) {
          const rawPct = ((currentCount - previousCount) / previousCount) * 100;
          pctChange = parseFloat(rawPct.toFixed(1));
          changeText = pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`;
        }

        return {
          term,
          count: currentCount,
          previousCount,
          pctChange,
          changeText,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [recentSearches, searchRange]);

  const isAr = T('lang') === 'ar';
  const chips = isAr ? ['لخّص الصفقات الجارية', 'ما أولويات اليوم؟', 'اكتب رسالة متابعة', 'الصفقات المعرّضة للخطر'] : ['Summarize my pipeline', 'What should I focus on today?', 'Draft a follow-up (AR/EN)', 'Find deals at risk'];

  return (
    <div className="fade-up space-y-6">
      {/* AI Hero Section */}
      <div className="ai-hero">
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          {(isAr ? 'مساعد سييرا · ' : 'Sierra Copilot · ') + new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h2 style={{ fontFamily: isAr ? "'Cairo',sans-serif" : "'Cormorant Garamond',serif", fontSize: '1.9rem', fontWeight: isAr ? 700 : 500, color: 'var(--tx-s)', lineHeight: 1.15, marginBottom: 6 }}>
          {isAr ? 'كيف تساعدك سييرا في الإغلاق اليوم؟' : 'How can Sierra help you close today?'}
        </h2>
        <p style={{ fontSize: 12.5, color: 'var(--tx-m)', maxWidth: 520, marginBottom: 14 }}>
          {isAr ? 'مساعد المبيعات الذكي يدير خط الصفقات، يصيغ الرسائل، ويبرز ما يحتاج انتباهك — اسأل فقط.' : 'Your AI sales copilot runs the pipeline, drafts bilingual outreach, and surfaces what needs attention — just ask.'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {chips.map((c, i) => <button key={i} className="ai-chip">{c}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={{ padding: '10px 20px', border: 'none', borderRadius: 11, background: 'linear-gradient(135deg,var(--gold),var(--gold-lt))', color: '#071422', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
            ✦ {isAr ? 'تحدث مع سييرا' : 'Chat with Sierra'} →
          </button>
          <button style={{ padding: '10px 18px', borderRadius: 11, border: '1px solid var(--bd-s)', background: 'var(--bg-e)', color: 'var(--tx)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            ⚡ {isAr ? 'تصرّف الآن' : 'Act Now'}
          </button>
          <span style={{ alignSelf: 'center', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tx-f)' }}>
            ● {hotLeads.length} {isAr ? 'عميل نشط' : 'active hot leads'}
          </span>
        </div>
      </div>

      {/* Cards stats grid */}
      <div className="kpi-grid">
        {CARD_STATS.map((k, i) => (
          <div
            key={i}
            className="kpi-card"
          >
            <div
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: k.color, borderRadius: '16px 0 0 16px' }}
            />
            <div className="kpi-val text-white">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className={`kpi-delta ${k.up ? 'up' : 'dn'}`}>
              {k.up ? '↑' : '↓'} {k.delta}
            </div>
            {renderSparkline(k.spark, k.color)}
          </div>
        ))}
      </div>

      <div className="grid-3">
        {/* Step Funnel Chart */}
        <div className="card">
          <div className="card-hd"><span className="card-title">{T('pipelineTitle')}</span></div>
          <div className="card-body">
            <div className="bar-chart">
              {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'].map((s, i) => {
                const h = [95, 88, 82, 79, 74, 68, 61, 55, 42, 28][i];
                const c = ['#00AEFF', '#5FC9FF', '#1E88D9', '#34D399', '#7C3AED', '#E63946', '#00AEFF', '#1E88D9', '#34D399', '#00AEFF'][i];
                return (
                  <div key={s} className="bar-col">
                    <div className="bar-fill" style={{ height: `${h}%`, background: `linear-gradient(180deg,${c},${c}44)` }} />
                    <span className="bar-lbl">{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hot Leads Section */}
        <div className="card">
          <div className="card-hd">
            <span className="card-title">{T('hotLeads')}</span>
            <span className="chip chip-red">{hotLeads.length} urgent</span>
          </div>
          <div style={{ maxHeight: 160, overflowY: 'auto' }}>
            {loading ? (
              <div className="p-4 text-center font-mono text-[10px] text-slate-500">LOADING LEADS...</div>
            ) : hotLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No hot leads active currently.</div>
            ) : (
              hotLeads.slice(0, 5).map((l, i) => (
                <div key={i} className="lead-row">
                  <div className="lead-avatar" style={{ background: l.color || '#00AEFF' }}>
                    {l.name[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--tx-f)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.interest}
                    </div>
                  </div>
                  <span className="chip chip-amber">{l.stage}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agent Activity Tracker */}
        <div className="card">
          <div className="card-hd"><span className="card-title">{T('agentStatus')}</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agents.slice(0, 4).map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{a.name}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: a.status === 'Idle' ? 'var(--tx-f)' : 'var(--emerald)' }}>
                      {a.status}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${a.load}%`, background: a.color || '#00AEFF' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recharts Dual-Axis Visualization */}
        <div className="lg:col-span-2 card">
          <div className="card-hd">
            <span className="card-title">{T('pipelineAndRevenueTrends') || 'PIPELINE & REVENUE TRENDS'}</span>
          </div>
          <div className="card-body" style={{ height: 300, padding: '20px 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CHART_DATA}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="var(--bd)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--tx-m)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--tx-m)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--tx-m)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-e)', borderColor: 'var(--bd)', fontSize: '12px', color: 'var(--tx)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--blue)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="deals" name="Monthly Deals Closed" fill="var(--blue)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue Pipeline (M)" stroke="var(--emerald)" strokeWidth={3} dot={{ r: 4, fill: 'var(--emerald)', strokeWidth: 2, stroke: 'var(--bg-e)' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Popular Search Terms Chart */}
        <div className="card">
          <div className="card-hd">
            <span className="card-title">
              {searchRange === '7d' 
                ? (T('popularSearches7d') || 'TOP SEARCH TERMS (LAST 7 DAYS)') 
                : searchRange === '30d' 
                ? (T('popularSearches30d') || 'TOP SEARCH TERMS (LAST 30 DAYS)') 
                : (T('popularSearchesAll') || 'TOP SEARCH TERMS (ALL TIME)')}
            </span>
            <select
              id="overview-search-range-select"
              value={searchRange}
              onChange={(e) => setSearchRange(e.target.value as any)}
              className="f-in"
              style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="card-body" style={{ height: 300, padding: '20px 0' }}>
            {searchTermsData.length === 0 ? (
              <div className="h-full flex items-center justify-center font-mono text-[10px] text-slate-500">
                NO RECENT SEARCHES...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={searchTermsData}
                  layout="vertical"
                  margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
                >
                  <CartesianGrid stroke="var(--bd)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--tx-m)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="term" type="category" stroke="var(--tx-m)" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    content={<CustomSearchTooltip />}
                  />
                  <Bar dataKey="count" name="Search Frequency" fill="var(--blue)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Leads by source & Property Scatter */}
      <DashboardWidgets />

      {/* Agent Leaderboard */}
      <AgentLeaderboard />
    </div>
  );
}
