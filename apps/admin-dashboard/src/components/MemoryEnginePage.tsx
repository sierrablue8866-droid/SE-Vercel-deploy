import React, { useState } from 'react';
import {
  Brain,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Layers,
  FileText,
  Terminal,
  Cpu,
  Share2,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MemoryEnginePageProps {
  T?: (key: string) => string;
  isAr?: boolean;
}

interface MemoryNode {
  id: string;
  title: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  summary: string;
}

const INITIAL_NODES: MemoryNode[] = [
  {
    id: 'vault-1',
    title: 'Sourcing Pipeline & Lead Aggregator',
    category: 'Obsidian Vault',
    tags: ['sourcing', 'leads', 'n8n', 'property-finder'],
    lastUpdated: '2026-07-23 04:30',
    summary: 'Central engine architecture for aggregating leads from WhatsApp, Property Finder, and web hooks into unified Firestore pipelines.',
  },
  {
    id: 'vault-2',
    title: 'WhatsApp CRM & Hand-off Pipeline',
    category: 'Obsidian Vault',
    tags: ['whatsapp', 'crm', 'leila-agent', 'stage-9'],
    lastUpdated: '2026-07-23 03:15',
    summary: 'Conversational broker routing rules, automated Arabic qualification, and human agent takeover triggers.',
  },
  {
    id: 'vault-3',
    title: 'Market Valuation Models & AVM per SqM',
    category: 'Obsidian Vault',
    tags: ['avm', 'pricing', 'new-cairo', 'valuation'],
    lastUpdated: '2026-07-22 18:40',
    summary: 'Hedonic pricing formulas for New Cairo compounds, price-per-meter regression curves, and luxury finish multipliers.',
  },
  {
    id: 'ecc-1',
    title: 'ECC Central Agent Bus (Pub/Sub)',
    category: 'ECC Memory Engine',
    tags: ['ecc', 'agent-bus', 'pubsub', 'orchestrator'],
    lastUpdated: 'Just now',
    summary: 'Unified event backbone managing state synchronization across 47 specialists, Stage-9 Closer, and Leila agent instances.',
  },
  {
    id: 'ecc-2',
    title: 'SOUL Intelligence & Safety Governance',
    category: 'ECC Memory Engine',
    tags: ['ecc', 'soul', 'safety', 'compliance'],
    lastUpdated: '2026-07-23 01:10',
    summary: 'Core identity rules, anti-hallucination guardrails, and non-destructive transaction check protocols.',
  },
];

const AGENT_BUS_LOGS = [
  { time: '05:08:12', topic: 'agent:stage-9-closer', event: 'Lead #L-8942 qualified for viewing booking' },
  { time: '05:05:44', topic: 'sync:obsidian', event: 'Obsidian Memory Vault graph re-indexed (18 nodes)' },
  { time: '04:59:01', topic: 'inventory:property-finder', event: 'Synced 145 active listings from Property Finder API' },
  { time: '04:42:30', topic: 'agent:leila-arabic', event: 'Parsed Arabic inbound audio transcript via Scribe' },
];

export default function MemoryEnginePage({ isAr = false }: MemoryEnginePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncVault = () => {
    setIsSyncing(true);
    setSyncStatus(isAr ? 'جاري مزامنة Vault مع ذاكرة ECC...' : 'Syncing Vault with ECC Memory...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(isAr ? 'تمت المزامنة بنجاح! 18 node محدثة' : 'Sync complete! 18 nodes updated.');
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1800);
  };

  const filteredNodes = INITIAL_NODES.filter((node) => {
    const matchesCat = selectedCategory === 'all' || node.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                {isAr ? 'محرك الذاكرة الموحد ECC & Obsidian Vault' : 'ECC & Obsidian Memory Engine'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'النظام العصبي المركزي لربط وكلاء الذكاء الاصطناعي بنشاط Vault ورسائل Pub/Sub'
                : 'Central neural memory connecting AI Agents, Obsidian Knowledge Graph & Agent Pub/Sub Bus'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncVault}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing
              ? (isAr ? 'جاري المزامنة...' : 'Syncing...')
              : (isAr ? 'مزامنة Memory Vault' : 'Sync Memory Vault')}
          </button>
        </div>
      </div>

      {syncStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          {syncStatus}
        </motion.div>
      )}

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isAr ? 'وكلاء ECC النشطون' : 'ECC Active Agents'}</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">47</div>
          <span className="text-[11px] text-emerald-400 font-mono">100% Operational</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isAr ? 'عقد Obsidian Vault' : 'Obsidian Vault Nodes'}</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">18</div>
          <span className="text-[11px] text-slate-400 font-mono">Graph Connected</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isAr ? 'المهارات المسجلة' : 'Registered Skills'}</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">135+</div>
          <span className="text-[11px] text-purple-400 font-mono">Auto-loaded</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isAr ? 'قنوات Agent Bus' : 'Agent Bus Channels'}</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">12</div>
          <span className="text-[11px] text-emerald-400 font-mono">Pub/Sub Streaming</span>
        </div>
      </div>

      {/* Main Content Layout: Knowledge Nodes + Agent Bus Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Knowledge Graph & Memory Store (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 border border-slate-800 rounded-xl">
            {/* Category selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  selectedCategory === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedCategory('Obsidian Vault')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  selectedCategory === 'Obsidian Vault' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Obsidian Vault
              </button>
              <button
                onClick={() => setSelectedCategory('ECC Memory Engine')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  selectedCategory === 'ECC Memory Engine' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                ECC Memory Engine
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في الذاكرة...' : 'Search memory nodes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Nodes List */}
          <div className="space-y-3">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                        {node.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{node.lastUpdated}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                      {node.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{node.summary}</p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
                  {node.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: ECC Agent Bus Live Event Stream */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {isAr ? 'بث Agent Bus المباشر' : 'Agent Bus Event Stream'}
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-3 font-mono text-xs max-h-[380px] overflow-y-auto pr-1">
              {AGENT_BUS_LOGS.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-slate-300 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 font-semibold">{log.topic}</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{log.event}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={isAr ? 'بث حدث لشبكة ECC...' : 'Emit event to ECC bus...'}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
                />
                <button className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
