import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bot, 
  Layers, 
  Kanban, 
  Calculator, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Copy, 
  ExternalLink, 
  ArrowUpRight, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  Calendar, 
  RefreshCw, 
  Sliders, 
  UserCheck, 
  Briefcase, 
  Database, 
  Settings, 
  Sparkles, 
  Eye, 
  Trash2, 
  Check, 
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  Share2,
  Send,
  Play,
  Pause,
  Edit3,
  Megaphone,
  Radio,
  FileText,
  Workflow
} from 'lucide-react';

export interface InventoryItem {
  id: string;
  compound: string;
  type: string;
  beds: number;
  baths: number;
  sqm: number;
  price: number;
  owner: string;
  phone: string;
  status: 'Active' | 'Pending Review' | 'Rented' | 'Sold';
  source: string;
  syncPF: boolean;
  pfFeatured: boolean;
  hash: string;
}

export interface LeadItem {
  id: string;
  name: string;
  nationality: string;
  phone: string;
  budget: string;
  intent: string;
  target: string;
  score: number;
  stage: string;
  assigned: string;
  time: string;
  pfRef?: string;
}

export interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  schedule: string;
  lastRun: string;
  status: 'active' | 'paused';
  executionsToday: number;
  successRate: string;
}

export interface BotControlItem {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Busy' | 'Paused';
  rateLimit: string;
  todayVolume: number;
  persona: string;
}

export interface PFAdForm {
  titleEn: string;
  titleAr: string;
  compound: string;
  propertyType: string;
  priceEgp: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  isFeatured: boolean;
  descriptionAr: string;
  descriptionEn: string;
}

export default function AdminCommandCenterPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const [rawText, setRawText] = useState("Apartment for rent in Mivida Boulevard 191m 1st floor 3 bedrooms nanny room 4 bathrooms 110k EGP fully furnished owner Eng Heba 01010070444");
  const [parsedData, setParsedData] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [pfAdForm, setPfAdForm] = useState<PFAdForm>({
    titleEn: 'Luxury 3BR Apartment in Mivida Boulevard',
    titleAr: 'شقة فاخرة 3 غرف للإيجار في ميفيدا بوليفارد - التجمع الخامس',
    compound: 'Mivida Boulevard',
    propertyType: 'Apartment',
    priceEgp: 110000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 191,
    isFeatured: true,
    descriptionAr: 'شقة مفروشة بالكامل للإيجار بفيو مميز على البوليفارد. 191 متر، 3 غرف نوم + غرفة خادمة، 4 حمامات. تشطيب ألترا سوبر لوكس بالتكييفات والفرش.',
    descriptionEn: 'Exclusive fully furnished residence at Mivida Boulevard. Spanning 191 SQM with 3 bedrooms, nanny suite, 4 bathrooms, and panoramic view.',
  });
  const [publishingAd, setPublishingAd] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const [inventorySearch, setInventorySearch] = useState('');

  const handleParseText = () => {
    setIsParsing(true);
    setTimeout(() => {
      setParsedData({
        compound: 'Mivida Boulevard',
        type: 'Apartment',
        bedrooms: 3,
        bathrooms: 4,
        areaSqm: 191,
        floor: 1,
        priceEgp: 110000,
        furnishing: 'Fully Finished with Furniture',
        sbrCode: 'MV-3F-110K',
        syncHash: 'e92f8a12c4001b99a0d',
        ownerName: 'Eng. Heba',
        ownerPhone: '+201010070444',
        editorialEn: 'Exclusive Residence at Mivida Boulevard. Spanning 191 SQM of refined living space, this fully furnished 3-bedroom apartment includes a nanny suite and 4 premium bathrooms. Ideally located in Fifth Settlement.',
        pfAdAr: 'شقة مفروشة بالكامل للإيجار في ميفيدا بوليفارد - التجمع الخامس. المساحة: 191 متر | الدور الأول | 3 غرفة نوم + غرفة شغالة | 4 حمام. التشطيب ألترا سوبر لوكس. السعر: 110,000 ج.م/شهرياً. كود الوحدة: MV-3F-110K',
        waScript: '🔴 فرصة إيجار فاخرة في كمباوند ميفيدا (Mivida Boulevard)\n▪️ 191م2 بالفرش والتكييفات\n▪️ 3 نوم + غرفة خادمة + 4 حمام\n✨ السعر: 110 ألف شهرياً\nرمز الوحدة: MV-3F-110K'
      });
      setIsParsing(false);
    }, 600);
  };

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'MV-3F-110K', compound: 'Mivida Boulevard', type: 'Apartment', beds: 3, baths: 4, sqm: 191, price: 110000, owner: 'Eng. Heba', phone: '01010070444', status: 'Active', source: 'Direct Owner', syncPF: true, pfFeatured: true, hash: 'e92f8a12c4001b99a0d' },
    { id: 'HP-V5-45M', compound: 'Hyde Park', type: 'Villa', beds: 5, baths: 6, sqm: 450, price: 45000000, owner: 'Dr. Sherif', phone: '01223929712', status: 'Active', source: 'Direct Owner', syncPF: true, pfFeatured: false, hash: 'a88f12c900e23b11910' },
    { id: 'UC-2F-85K', compound: 'Uptown Cairo', type: 'Apartment', beds: 2, baths: 3, sqm: 155, price: 85000, owner: 'Sultan Bin Hareb', phone: '+971506456789', status: 'Active', source: 'Direct Owner', syncPF: false, pfFeatured: false, hash: 'c12f45100a982d33411' },
    { id: 'MV-2F-85K', compound: 'Mivida Avenues', type: 'Apartment', beds: 2, baths: 2, sqm: 140, price: 85000, owner: 'Eng. Heba', phone: '01010070444', status: 'Pending Review', source: 'Broker Network', syncPF: false, pfFeatured: false, hash: 'f99d812300b11c00223' },
    { id: 'PK-4V-89M', compound: 'Palm Hills PK2', type: 'Villa', beds: 6, baths: 7, sqm: 520, price: 89000000, owner: 'Mr. Naser', phone: '01004006170', status: 'Active', source: 'Direct Owner', syncPF: true, pfFeatured: true, hash: 'b33a12900c441a55672' },
  ]);

  const [leads, setLeads] = useState<LeadItem[]>([
    { id: 'L-1029', name: 'Alexander Volkov', nationality: 'Russian', phone: '+7 903 123 4567', budget: '$2,500/mo', intent: 'Rent Furnished', target: 'Mivida / Uptown', score: 96, stage: 'Viewing Scheduled', assigned: 'Ahmed Fawzy', time: '12m ago', pfRef: 'PF-REQ-9941' },
    { id: 'L-1030', name: 'Tarek Al-Mansoor', nationality: 'Saudi', phone: '+966 50 987 6543', budget: 'EGP 50M', intent: 'Investment Sale', target: 'Hyde Park / PK2', score: 92, stage: 'Golden Follow-up', assigned: 'Farida', time: '35m ago', pfRef: 'PF-REQ-9812' },
    { id: 'L-1031', name: 'Claire Dubois', nationality: 'French', phone: '+33 6 12 34 56 78', budget: 'EGP 120k/mo', intent: 'Rent Furnished', target: 'Uptown Cairo', score: 88, stage: 'Qualified Requirement', assigned: 'Sales Admin', time: '1h ago' },
    { id: 'L-1032', name: 'Mahmoud Hassan', nationality: 'Egyptian (Expat)', phone: '+971 52 444 8899', budget: 'EGP 30M', intent: 'Resale Buy', target: 'Mivida', score: 82, stage: 'New Unassigned', assigned: 'Unassigned', time: '2h ago' },
  ]);

  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    { id: 'wf-1', name: 'Daily Market Intelligence Report', trigger: 'Cron Daily 12:00 PM UTC', schedule: '0 12 * * *', lastRun: 'Today 12:00 UTC', status: 'active', executionsToday: 1, successRate: '100%' },
    { id: 'wf-2', name: 'Leila Arabic Lead Qualification & Scoring', trigger: 'Inbound WhatsApp Webhook', schedule: 'Realtime', lastRun: '5 mins ago', status: 'active', executionsToday: 42, successRate: '98.5%' },
    { id: 'wf-3', name: 'Property Finder Lead Ingestion & Decrypt', trigger: 'PF API Webhook', schedule: 'Realtime', lastRun: '12 mins ago', status: 'active', executionsToday: 18, successRate: '100%' },
    { id: 'wf-4', name: 'Site Viewing Booking & SMS Confirm', trigger: 'Stage-9 Closer Trigger', schedule: 'On Demand', lastRun: '1 hour ago', status: 'active', executionsToday: 6, successRate: '100%' },
    { id: 'wf-5', name: 'WhatsApp Queue Dispatcher Daemon', trigger: 'Cron 10-min Drain', schedule: '*/10 8-18 * * *', lastRun: '8 mins ago', status: 'active', executionsToday: 64, successRate: '99.1%' },
  ]);

  const [bots, setBots] = useState<BotControlItem[]>([
    { id: 'bot-1', name: 'Sierra Supply Bot', role: 'Owner Outreach & Inventory Verification', status: 'Online', rateLimit: '30 msgs / 2 hrs', todayVolume: 180, persona: 'Professional Property Agent' },
    { id: 'bot-2', name: 'Leila Demand Bot', role: 'Arabic Qualification & 3 Golden Questions', status: 'Online', rateLimit: 'Instant Webhook', todayVolume: 240, persona: 'Warm Levant Broker' },
    { id: 'bot-3', name: 'Stage-9 AI Closer Agent', role: 'Deal Negotiation & Proposal Generator', status: 'Online', rateLimit: 'On Demand', todayVolume: 24, persona: 'Senior Deal Strategist' },
    { id: 'bot-4', name: 'Property Finder Sync Daemon', role: 'Listing Upload & Lead Pulling', status: 'Online', rateLimit: 'Hourly Sync', todayVolume: 95, persona: 'API Daemon' },
  ]);

  const handlePublishAd = () => {
    setPublishingAd(true);
    setPublishStatus('Posting advertisement payload to Property Finder API v2...');
    setTimeout(() => {
      setPublishingAd(false);
      setPublishStatus('✅ Advertisement published successfully! Listing ID: PF-AD-2026-9901');

      const newAdUnit: InventoryItem = {
        id: `PF-${pfAdForm.compound.substring(0,2).toUpperCase()}-${Math.floor(pfAdForm.priceEgp/1000)}K`,
        compound: pfAdForm.compound,
        type: pfAdForm.propertyType,
        beds: pfAdForm.bedrooms,
        baths: pfAdForm.bathrooms,
        sqm: pfAdForm.areaSqm,
        price: pfAdForm.priceEgp,
        owner: 'Direct Admin Listing',
        phone: '+201010070444',
        status: 'Active',
        source: 'Property Finder Ad Studio',
        syncPF: true,
        pfFeatured: pfAdForm.isFeatured,
        hash: `hash_${Date.now().toString(16)}`,
      };

      setInventory([newAdUnit, ...inventory]);
      setTimeout(() => setPublishStatus(null), 5000);
    }, 1500);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setInventory(inventory.map((item: InventoryItem) => item.id === editingItem.id ? editingItem : item));
    setEditingItem(null);
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map((w: WorkflowItem) => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w));
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#0A1628] font-sans antialiased selection:bg-[#C9A84C] selection:text-white flex flex-col">
      <header className="bg-[#0A1628] text-white border-b border-[#C9A84C]/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9A84C] via-[#E8D18C] to-[#9B7B2C] flex items-center justify-center shadow-lg border border-[#C9A84C]/40">
              <ShieldCheck className="w-7 h-7 text-[#0A1628]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-serif text-2xl font-bold tracking-wide text-white">SIERRA BLU</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#BFDAF7]/20 text-[#BFDAF7] border border-[#BFDAF7]/30 font-bold tracking-wider uppercase">COMMAND CENTER OS</span>
              </div>
              <p className="text-[9px] tracking-widest text-[#C9A84C] uppercase font-semibold">Beyond Brokerage • Real Estate Intelligence & Automation</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-xs text-gray-300 border-x border-white/10 px-6 py-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Firestore: <strong>Live Single Source</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Property Finder: <strong>Connected API</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#BFDAF7]" />
              <span>Bots Gateway: <strong>Online</strong></span>
            </div>
          </div>
        </div>

        <div className="bg-[#16253B] border-t border-white/10 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 rtl:space-x-reverse text-xs py-2">
            {[
              { id: 'overview', label: '1. Executive Dashboard', icon: TrendingUp },
              { id: 'pf_hub', label: '2. Property Finder Studio & Ads', icon: Megaphone },
              { id: 'inventory', label: '3. Inventory Manager & Quick Edit', icon: Building2 },
              { id: 'crm', label: '4. CRM & 10-Stage Pipeline', icon: Kanban },
              { id: 'bots', label: '5. Bot Fleet Control', icon: Zap },
              { id: 'workflows', label: '6. Workflows & Automation Engine', icon: Workflow },
              { id: 'scribe', label: '7. Easy Listing (Scribe AI)', icon: Bot },
              { id: 'dedupe', label: '8. Dedupe Queue (sync_hash)', icon: Layers },
              { id: 'financials', label: '9. Financials & Commissions', icon: DollarSign },
              { id: 'roles', label: '10. RBAC Matrix', icon: UserCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-2 rtl:space-x-reverse ${
                    isActive 
                      ? 'bg-[#C9A84C] text-[#0A1628] shadow-md scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-[#0A1628]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Active Inventory</span>
                    <h3 className="text-3xl font-extrabold text-[#0A1628] mt-1">{inventory.length + 1019} Units</h3>
                  </div>
                  <div className="p-3 bg-[#BFDAF7]/20 text-[#0A1628] rounded-2xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Monthly Closed Deals</span>
                    <h3 className="text-3xl font-extrabold text-[#0A1628] mt-1">14 / 50 Deals</h3>
                  </div>
                  <div className="p-3 bg-[#C9A84C]/20 text-[#0A1628] rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Sierra & Leila Bots</span>
                    <h3 className="text-3xl font-extrabold text-indigo-900 mt-1">444 Msgs/Day</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Dedupe Queue</span>
                    <h3 className="text-3xl font-extrabold text-amber-600 mt-1">7 Alerts</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pf_hub' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#0A1628]">Property Finder Ad Studio & Listing Publisher</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-[#F4F0E8] p-6 rounded-3xl border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-[#0A1628]">Create New Property Finder Ad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Ad Title (English)</label>
                    <input type="text" value={pfAdForm.titleEn} onChange={(e) => setPfAdForm({ ...pfAdForm, titleEn: e.target.value })} className="w-full p-2.5 bg-white border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Ad Title (Arabic)</label>
                    <input type="text" value={pfAdForm.titleAr} onChange={(e) => setPfAdForm({ ...pfAdForm, titleAr: e.target.value })} className="w-full p-2.5 bg-white border rounded-xl rtl" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Asking Price (EGP)</label>
                    <input type="number" value={pfAdForm.priceEgp} onChange={(e) => setPfAdForm({ ...pfAdForm, priceEgp: Number(e.target.value) })} className="w-full p-2.5 bg-white border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Area (SQM)</label>
                    <input type="number" value={pfAdForm.areaSqm} onChange={(e) => setPfAdForm({ ...pfAdForm, areaSqm: Number(e.target.value) })} className="w-full p-2.5 bg-white border rounded-xl" />
                  </div>
                </div>

                <button onClick={handlePublishAd} disabled={publishingAd} className="w-full bg-[#0A1628] text-white py-3 rounded-xl text-xs font-bold shadow-lg">
                  {publishingAd ? 'Publishing...' : 'Publish Ad to Property Finder'}
                </button>
                {publishStatus && <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-mono">{publishStatus}</div>}
              </div>

              <div className="lg:col-span-5 bg-[#0A1628] text-white p-5 rounded-3xl space-y-3">
                <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider block">Inbound PF Leads Feed</span>
                {leads.filter(l => l.pfRef).map(lead => (
                  <div key={lead.id} className="p-3 bg-[#16253B] rounded-xl border border-white/10 text-xs">
                    <strong className="text-white block">{lead.name} ({lead.pfRef})</strong>
                    <span className="text-gray-300 text-[10px]">{lead.target} • {lead.budget}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#0A1628]">Workflows & Orchestration Engine</h2>
            <div className="space-y-4">
              {workflows.map(wf => (
                <div key={wf.id} className="p-4 bg-[#F4F0E8] rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-[#0A1628] block">{wf.name}</strong>
                    <span className="text-gray-600">Trigger: {wf.trigger} | Schedule: {wf.schedule}</span>
                  </div>
                  <button onClick={() => toggleWorkflowStatus(wf.id)} className="px-3 py-1.5 bg-[#0A1628] text-white rounded-lg font-bold">
                    {wf.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#0A1628]">Bot Fleet & Gateway Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {bots.map(b => (
                <div key={b.id} className="p-5 bg-[#F4F0E8] rounded-2xl space-y-2">
                  <strong className="text-[#0A1628] text-sm block">{b.name}</strong>
                  <p className="text-gray-600">{b.role}</p>
                  <p className="text-gray-500 font-mono text-[10px]">Volume Today: {b.todayVolume} msgs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
