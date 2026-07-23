import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Mic, Search, X } from 'lucide-react';
import { auth, db, createSierraNotification } from './firebase';
import { api } from './lib/apiClient';
import { seedFirestore } from './seed';
import { motion, AnimatePresence } from 'motion/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Modular Component Imports
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
// NAV_ITEMS is now a static array (Lucide icons, bilingual labels baked in).
// langKey drives which label is shown — the T() function is still used by
// child components for backwards compatibility.
import OverviewPage from './components/OverviewPage';
import AgentsPage from './components/AgentsPage';
import WorkflowsPage from './components/WorkflowsPage';
import OpenClawPage from './components/OpenClawPage';
import LeadsPage from './components/LeadsPage';
import ListingsHubPage from './components/ListingsHubPage';
import CuratorPage from './components/CuratorPage';
import ScribePage from './components/ScribePage';
import NexusAIPage from './components/NexusAIPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import Stage9CloserPage from './components/Stage9CloserPage';
import NotificationCenter from './components/NotificationCenter';
import AutomationToolsPage from './components/AutomationToolsPage';
import EasyListingPage from './components/EasyListingPage';
import DataSyncHubPage from './components/DataSyncHubPage';
import ClientHub from './components/ClientHub';
import SearchInsightsPage from './components/SearchInsightsPage';
import DBEditorPage from './components/DBEditorPage';
import PageEditorPage from './components/PageEditorPage';
import FollowupsPage from './components/FollowupsPage';
import BotsControlPage from './components/BotsControlPage';
import MemoryEnginePage from './components/MemoryEnginePage';

import GlobalProgressTracker from './components/GlobalProgressTracker';
import AdminHealthMonitor from './components/AdminHealthMonitor';

// Text translations conforming to standard arabic/english requirements
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    brand: 'SIERRA ESTATES 3.0',
    brandSub: 'INTELLIGENCE OS',
    overview: 'Intelligence OS',
    agents: 'Agents & Bots',
    workflows: 'Workflows',
    openclaw: 'OpenClaw Terminal',
    nexus: 'Nexus-AI Telemetry',
    leads: 'CRM · Leads',
    listings: 'Listings Hub',
    curator: 'The Curator',
    scribe: 'The Scribe',
    closer: 'Stage-9 Closer',
    reports: 'Reports',
    searchInsights: 'Search Insights',
    followups: 'Follow-ups',
    bots: 'Bots Control',
    pageEditor: 'Page Editor (CMS)',
    dbEditor: 'DB Editor (Raw)',
    settings: 'System Config',
    main: 'Main',
    operations: 'Operations',
    analytics: 'Analytics',
    system: 'System',
    collapse: 'Collapse',
    livesite: 'Live Site',
    theme: 'Theme',
    lang: 'Language',
    addLead: '+ Add Lead',
    exportCSV: 'Export CSV',
    importCSV: 'Import CSV',
    search: 'Search…',
    totalListings: 'Total Listings',
    activeLeads: 'Active Leads',
    avgDeal: 'Avg Deal Value',
    dealsClosed: 'Deals Closed',
    avgResponse: 'Avg Response',
    aiMatch: 'AI Match Rate',
    pending: 'Pending Reviews',
    eliteBrokers: 'Elite Brokers',
    pipelineTitle: 'Pipeline · S1→S10',
    hotLeads: '🔥 Hot Leads',
    agentStatus: 'Agent Status',
    viewingScheduled: 'Viewing Scheduled',
    aiMatched: 'AI Matched',
    contractDraft: 'Contract Draft',
    initialContact: 'Initial Contact',
    negotiating: 'Negotiating',
    online: 'Online',
    running: 'Running',
    idle: 'Idle',
    load: 'Load',
    totalTasks: 'Total tasks',
    config: 'Config',
    logs: 'Logs',
    restart: 'Restart',
    sendMsg: 'Send',
    curator_title: 'The Curator · S3–S5 Inventory & Valuation',
    scribe_title: 'The Scribe · S1–S2 Ingestion Parser',
    avm: 'AVM Engine',
    priceAdj: 'Price Adjustment',
    qualityScore: 'Quality Score',
    rawInput: 'Raw Listing Input (WhatsApp / Prop Finder text)',
    parsedOutput: 'Parsed & Structured Output',
    parseBtn: 'Parse with Scribe',
    compound: 'Compound',
    type: 'Type',
    area: 'Area',
    price: 'Price',
    beds: 'Beds',
    status: 'Status',
    phone: 'Phone',
    interest: 'Interest',
    stage: 'Stage',
    actions: 'Actions',
    client: 'Client',
    view: 'View',
    whatsapp: 'WhatsApp',
    monthlyDeals: '📊 Monthly Deals Closed',
    revPipeline: '💰 Revenue Pipeline',
    perfByCompound: '🗺️ Performance by Compound',
    saveConfig: 'Save Configuration',
    saved: '✓ Saved!',
    githubIntegration: '🔗 GitHub Integration',
    pullLatest: 'Pull Latest',
    openRepo: 'Open Repo',
    pushChanges: 'Push Changes',
    voiceSearch: 'Voice Search',
    listening: 'Listening...',
    speechNotSupported: 'Speech Recognition not supported in this browser.',
  },
  ar: {
    brand: 'سييرا إيستيتس 3.0',
    brandSub: 'نظام التشغيل الذكي',
    overview: 'لوحة التحكم والذكاء',
    agents: 'الوكلاء والبوتات',
    workflows: 'سير العمل',
    openclaw: 'طرفية أوبن كلو',
    nexus: 'نيكسوس · البث المباشر',
    leads: 'إدارة العملاء',
    listings: 'قاعدة العقارات',
    curator: 'المنظم المالي',
    scribe: 'الكاتب اللغوي',
    closer: 'المغلق · المرحلة 9',
    reports: 'التقارير التحليلية',
    searchInsights: 'تحليلات البحث',
    followups: 'المتابعات',
    bots: 'التحكم بالبوتات',
    pageEditor: 'محرر الصفحات',
    dbEditor: 'محرر قاعدة البيانات',
    settings: 'إعدادات النظام',
    main: 'رئيسي',
    operations: 'العمليات',
    analytics: 'التحليلات والمحاسبة',
    system: 'النظام المستقر',
    collapse: 'طي القائمة',
    livesite: 'موقع المعاينة',
    theme: 'المظهر والسمات',
    lang: 'اللغة الحالية',
    addLead: '+ إضافة عميل جديد',
    exportCSV: 'تصدير جدول CSV',
    importCSV: 'استيراد CSV',
    search: 'بحث…',
    totalListings: 'إجمالي العقارات',
    activeLeads: 'العملاء النشطين',
    avgDeal: 'متوسط قيمة الصفقة',
    dealsClosed: 'الصفقات المغلقة',
    avgResponse: 'متوسط الاستجابة بالثانية',
    aiMatch: 'دقة الذكاء الاصطناعي',
    pending: 'قيد المراجعة',
    eliteBrokers: 'الوسطاء النخبة',
    pipelineTitle: 'مراحل خط الأنابيب',
    hotLeads: '🔥 العملاء الساخنين',
    agentStatus: 'نشاط الوكلاء',
    viewingScheduled: 'معاينة مجدولة',
    aiMatched: 'مطابقة ذكية',
    contractDraft: 'مسودة عقد',
    initialContact: 'تواصل أولي',
    negotiating: 'مفاوضات هامة',
    online: 'متصل وجاهز',
    running: 'قيد التشغيل',
    idle: 'مستقر خامل',
    load: 'الحمل الفعلي',
    totalTasks: 'إجمالي المهام المنجزة',
    config: 'إعداد المعايير',
    logs: 'السجلات السرية',
    restart: 'إعادة التشغيل',
    sendMsg: 'إرسال',
    curator_title: 'المنظم المالي · مخزون ميفيدا وبالم هيلز',
    scribe_title: 'الكاتب اللغوي · إدخال وتحليل نصوص واتس اب',
    avm: 'محرك التقييم الآلي AVM',
    priceAdj: 'تعديل أسعار السوق',
    qualityScore: 'نقاط الجودة والتقييم',
    rawInput: 'نص إدخال الواتساب الخام',
    parsedOutput: 'المخرجات المنظمة بقاعدة البيانات',
    parseBtn: 'تحليل النص بالكاتب',
    compound: 'المجمع السكني',
    type: 'نوع العقار',
    area: 'المساحة الإجمالية',
    price: 'سعر السوق المطلوب',
    beds: 'غرف النوم',
    status: 'حالة الإعلان',
    phone: 'رقم هاتف العميل',
    interest: 'تفاصيل الاهتمام',
    stage: 'المرحلة الحالية',
    actions: 'إجراءات لوحة التحكم',
    client: 'العميل المستهدف',
    view: 'عرض التفاصيل',
    whatsapp: 'واتساب',
    monthlyDeals: '📊 الصفقات الشهرية المغلقة',
    revPipeline: '💰 خط الإيرادات المالية',
    perfByCompound: '🗺️ الأداء حسب المجمع السكني',
    saveConfig: 'حفظ الإعدادات الفنية',
    saved: '✓ تم الحفظ بنجاح!',
    githubIntegration: '🔗 تكامل مستودع GitHub',
    pullLatest: 'سحب آخر التحديثات',
    openRepo: 'فتح المستودع الفرعي',
    pushChanges: 'رفع التغييرات الفورية',
    voiceSearch: 'البحث الصوتي',
    listening: 'جاري الاستماع...',
    speechNotSupported: 'البحث الصوتي غير مدعوم في هذا المتصفح',
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  // App layouts states
  const [tab, setTab] = useState<string>(() => localStorage.getItem('sierra_admin_tab') || 'overview');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('sierra_admin_theme') || 'dark');
  const [langKey, setLangKey] = useState<string>(() => localStorage.getItem('sierra_admin_lang') || 'en');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<'all' | 'leads' | 'listings' | 'agents' | 'workflows'>('all');
  const [showScopeDropdown, setShowScopeDropdown] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [pendingVoiceTranscript, setPendingVoiceTranscript] = useState<string | null>(null);
  const [voiceCountdown, setVoiceCountdown] = useState<number>(2);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts hook (CMD+K / CTRL+K for search, '/' to toggle sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. CMD+K / CTRL+K: Focus search input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }

      // 2. '/': Toggle sidebar, unless inside focused text/input fields
      if (e.key === '/') {
        const activeEl = document.activeElement;
        const isInputField = activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' || 
          activeEl.getAttribute('contenteditable') === 'true'
        );
        if (!isInputField) {
          e.preventDefault();
          setCollapsed((prev) => !prev);
        }
      }

      // 3. 'Escape' key: blur focus from inputs
      if (e.key === 'Escape') {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          activeEl.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Translate handler callback
  const T = useCallback((key: string) => TRANSLATIONS[langKey]?.[key] || key, [langKey]);
  const isAr = langKey === 'ar';

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = false;
      rec.interimResults = false;
      setRecognition(rec);
    }
  }, []);

  const toggleVoiceSearch = useCallback(() => {
    if (!recognition) {
       setSpeechError(T('speechNotSupported'));
       setTimeout(() => setSpeechError(null), 3000);
       return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    recognition.lang = langKey === 'ar' ? 'ar-EG' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setPendingVoiceTranscript(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechError(isAr ? 'الرجاء تمكين الميكروفون لاستخدام هذه الميزة' : 'Please enable microphone access.');
      } else {
        setSpeechError(event.error);
      }
      setTimeout(() => setSpeechError(null), 3500);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start SpeechRecognition:', e);
      setIsListening(false);
    }
  }, [recognition, isListening, langKey, T, isAr, setPendingVoiceTranscript]);

  const handleSelectScope = useCallback((scope: 'all' | 'leads' | 'listings' | 'agents' | 'workflows') => {
    setSearchScope(scope);
    setShowScopeDropdown(false);
    if (scope !== 'all') {
      setTab(scope);
    }
  }, []);

  useEffect(() => {
    // Core document layouts configuration updates
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    localStorage.setItem('sierra_admin_theme', theme);
    localStorage.setItem('sierra_admin_lang', langKey);
  }, [theme, langKey, isAr]);

  useEffect(() => {
    localStorage.setItem('sierra_admin_tab', tab);
    setSearchQuery(''); // Reset search input on navigation change
    if (['leads', 'listings', 'agents', 'workflows'].includes(tab)) {
      setSearchScope(tab as any);
    } else {
      setSearchScope('all');
    }
  }, [tab]);

  // Voice command delay, visual countdown and cancellation handling
  useEffect(() => {
    if (!pendingVoiceTranscript) return;

    setVoiceCountdown(2);

    const interval = setInterval(() => {
      setVoiceCountdown((prev) => {
        if (prev <= 1) {
          localStorage.setItem('sierra_voice_search_pending', 'true');
          setSearchQuery(pendingVoiceTranscript);
          setPendingVoiceTranscript(null);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingVoiceTranscript]);

  // Synchronize debounced searches into Firestore as analytical logs
  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) return;
    const qRaw = searchQuery.trim();
    if (qRaw.length < 2) return; // Skip extremely short partial typings
    
    // De-duplicate immediately identical sequential search queries
    const lastSearch = localStorage.getItem('sierra_last_logged_search');
    if (lastSearch === qRaw) return;

    const isVoice = localStorage.getItem('sierra_voice_search_pending') === 'true';

    const timer = setTimeout(async () => {
      try {
        await addDoc(collection(db, 'searches'), {
          query: qRaw.substring(0, 200),
          scope: searchScope,
          timestamp: new Date(),
          userId: currentUser?.uid || 'anonymous',
          isVoice: isVoice
        });
        localStorage.removeItem('sierra_voice_search_pending');
        localStorage.setItem('sierra_last_logged_search', qRaw);
      } catch (err) {
        console.error('Failed to log search telemetry:', err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchScope, currentUser]);

  // Auth changes listener — admin status now comes from the backend's
  // users/{uid}.role check (verifyAdminRequest), not a local Firestore lookup.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        let passesAdminRule = false;
        const emailLower = user.email?.toLowerCase();
        const isAllowedEmail = emailLower === 'a.fawzy8866@gmail.com' || emailLower === 'emeraldestatesegypt@gmail.com';

        // Immediately grant access for bootstrapped owner emails — no API round-trip needed
        if (isAllowedEmail) {
          passesAdminRule = true;
        } else {
          // API verify call with 5s timeout so it can never hang the UI
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const result = await api.get<{ isAdmin: boolean }>('/api/admin/auth/verify');
            clearTimeout(timeoutId);
            passesAdminRule = !!result.isAdmin;
          } catch (e) {
            console.warn('Admin verification check failed (non-owner):', e);
          }
        }

        setIsAdminUser(passesAdminRule);

        if (passesAdminRule) {
          // Seed Firestore only ONCE per device — never block login with repeated seeds
          const seedKey = `sierra_seeded_${user.uid}`;
          if (!localStorage.getItem(seedKey)) {
            try {
              await seedFirestore();
              localStorage.setItem(seedKey, '1');
            } catch (seedErr) {
              console.warn("Seeding process skipped or failed:", seedErr);
            }
          }
        } else {
          // Fire-and-forget — don't await this, it should not block the UI
          createSierraNotification(
            'error',
            'Intrusion Warning: Access Denied',
            `Unauthorized login attempt from ${user.email || 'anonymous-user'}. Resource access blocked.`,
            'تحذير اختراق: تم رفض الدخول',
            `محاولة دخول غير مصرح بها من ${user.email || 'مجهول'}. تم حجب الوصول بنجاح.`
          ).catch(console.warn);
        }
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const renderActiveProductPage = () => {
    switch (tab) {
      case 'overview':
        return <OverviewPage T={T} />;
      case 'leads':
        return <LeadsPage T={T} isAr={isAr} searchQuery={searchQuery} />;
      case 'listings':
        return <ListingsHubPage T={T} searchQuery={searchQuery} />;
      case 'agents':
        return <AgentsPage T={T} searchQuery={searchQuery} />;
      case 'workflows':
        return <WorkflowsPage T={T} isAr={isAr} searchQuery={searchQuery} />;
      case 'easyListing':
        return <EasyListingPage />;
      case 'automation':
        return <AutomationToolsPage />;
      case 'dataSync':
        return <DataSyncHubPage />;
      case 'searchInsights':
        return <SearchInsightsPage T={T} isAr={isAr} />;
      case 'followups':
        return <FollowupsPage T={T} isAr={isAr} />;
      case 'bots':
        return <BotsControlPage T={T} isAr={isAr} />;
      case 'memoryEngine':
        return <MemoryEnginePage isAr={isAr} />;
      case 'pageEditor':
        return <PageEditorPage T={T} isAr={isAr} />;
      case 'dbEditor':
        return <DBEditorPage T={T} isAr={isAr} />;
      default:
        return <OverviewPage T={T} />;
    }
  };

  // NAV_ITEMS is now a static array (Lucide icons + bilingual labels baked in)
  const activeItem = NAV_ITEMS.find((n) => n.id === tab);
  const activeTitle = activeItem
    ? (langKey === 'ar' ? activeItem.labelAr : activeItem.label)
    : (langKey === 'ar' ? 'لوحة سييرا إستيتس' : 'Sierra Estates Console');

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05080f] text-white">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/15 border-t-cyan-500 animate-spin mb-4" />
        <p className="font-mono text-xs tracking-widest text-slate-500 select-none uppercase">Booting SIERRA OS...</p>
      </div>
    );
  }

  // Admin Portal View
  const AdminPortal = () => {
    if (!currentUser || !isAdminUser) {
      return (
        <LoginPage
          onLoginSuccess={() => setTab('overview')}
          isAdminUser={isAdminUser}
          currentUser={currentUser}
          loading={loading}
        />
      );
    }

    return (
      <div className="admin-body" dir={isAr ? 'rtl' : 'ltr'} data-theme={theme}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          tab={tab}
          setTab={setTab}
          langKey={langKey}
          setLangKey={setLangKey}
          theme={theme}
          setTheme={setTheme}
          T={T}
        />
        
        <div id="main">
          <Topbar
            T={T}
            langKey={langKey}
            activeTitle={activeTitle}
            toggleVoiceSearch={toggleVoiceSearch}
            isListening={isListening}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            pendingVoiceTranscript={pendingVoiceTranscript}
            voiceCountdown={voiceCountdown}
            speechError={speechError}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <div id="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ height: '100%' }}
              >
                {renderActiveProductPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<AdminPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route 
          path="/client" 
          element={
            <ClientHub
              T={T}
              langKey={langKey}
              theme={theme}
              setTheme={setTheme}
              setTab={setTab}
              onEnterAdminSession={() => navigate('/')}
            />
          } 
        />
      </Routes>
      <SpeedInsights />
    </>
  );
}
