import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/apiClient';
import { motion } from 'motion/react';
import {
  Bot, RefreshCw, RotateCcw, Zap, Power, PowerOff,
  Activity, Clock, AlertTriangle, CheckCircle,
  MessageSquare, Workflow, PenLine, Palette, Handshake, Heart,
  type LucideIcon,
} from 'lucide-react';

interface Bot {
  id: string;
  status: 'active' | 'syncing' | 'error' | 'idle' | 'offline';
  lastPulse?: string;
  lastError?: string;
  enabled?: boolean;
  lastCommand?: string;
  lastCommandAt?: string;
  config?: Record<string, any>;
  stats?: Record<string, any>;
}

interface BotsControlPageProps {
  T: (key: string) => string;
  isAr?: boolean;
}

const STATUS_CONFIG: Record<Bot['status'], { color: string; bg: string; ring: string; label: string; labelAr: string; icon: LucideIcon }> = {
  active:  { color: 'text-emerald-400', bg: 'bg-emerald-500/10',  ring: 'ring-emerald-500/20',  label: 'Online',  labelAr: 'متصل',     icon: CheckCircle },
  syncing: { color: 'text-blue-400',    bg: 'bg-blue-500/10',     ring: 'ring-blue-500/25',     label: 'Running', labelAr: 'يعمل',     icon: Activity },
  error:   { color: 'text-red-400',     bg: 'bg-red-500/10',      ring: 'ring-red-500/20',      label: 'Error',   labelAr: 'خطأ',      icon: AlertTriangle },
  idle:    { color: 'text-amber-400',   bg: 'bg-amber-500/10',    ring: 'ring-amber-500/25',    label: 'Idle',    labelAr: 'خامل',     icon: Clock },
  offline: { color: 'text-slate-500',   bg: 'bg-slate-700/30',    ring: 'ring-slate-600/40',    label: 'Offline', labelAr: 'غير متصل', icon: PowerOff },
};

const BOT_DESCRIPTIONS: Record<string, { en: string; ar: string; icon: LucideIcon }> = {
  'whatsapp-scraper': {
    en: 'Live broker-group lead ingestion bot',
    ar: 'بوت استخراج العملاء من مجموعات الوسطاء',
    icon: MessageSquare,
  },
  'n8n-orchestrator': {
    en: 'Workflow automation engine (Docker, port 5678)',
    ar: 'محرك أتمتة سير العمل',
    icon: Workflow,
  },
  'scribe-agent': {
    en: 'AI listing normalization (S1-S2)',
    ar: 'تطبيع قوائم الذكاء الاصطناعي',
    icon: PenLine,
  },
  'curator-agent': {
    en: 'AI portfolio curation (S3-S5)',
    ar: 'تنسيق محفظة الذكاء الاصطناعي',
    icon: Palette,
  },
  'closer-agent': {
    en: 'Fail-safe lead follow-up (Stage 9)',
    ar: 'متابعة العملاء الآمنة',
    icon: Handshake,
  },
  'matchmaker-agent': {
    en: 'Lead-to-property matching',
    ar: 'مطابقة العملاء بالعقارات',
    icon: Heart,
  },
};

export default function BotsControlPage({ T, isAr = false }: BotsControlPageProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { success, bots, error: apiError } = await api.get<{ success: boolean; bots: Bot[]; error?: string }>(
        '/api/admin/bots'
      );
      if (!success) throw new Error(apiError || 'Failed to fetch');
      setBots(bots || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
    // Auto-refresh every 30s
    const interval = setInterval(fetchBots, 30000);
    return () => clearInterval(interval);
  }, [fetchBots]);

  const sendCommand = async (botId: string, command: string) => {
    setActionLoading(`${botId}:${command}`);
    try {
      await api.post('/api/admin/bots', { botId, command });
      // Immediate refresh to show the pending command
      setTimeout(fetchBots, 500);
    } catch (err: any) {
      alert(`Command failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'التحكم بالبوتات' : 'Bots Control'}
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {isAr
              ? 'مراقبة وتحكم بالبوتات والوكلاء الآليين · تحديث تلقائي كل 30 ثانية'
              : 'Monitor and control background bots and AI agents · auto-refreshes every 30s'}
          </p>
        </div>
        <button
          onClick={fetchBots}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 h-8 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md text-[13px] font-medium transition disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
          <p className="text-[13px] text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Bots grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading && bots.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-2 text-slate-400" size={20} strokeWidth={1.75} />
            <p className="text-[13px]">{isAr ? 'جارٍ التحميل…' : 'Loading…'}</p>
          </div>
        ) : bots.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">
            <Bot className="mx-auto mb-2 text-slate-400" size={32} strokeWidth={1.5} />
            <p className="text-[13px]">{isAr ? 'لا توجد بوتات مسجلة' : 'No bots registered'}</p>
          </div>
        ) : (
          bots.map((bot) => {
            const config = STATUS_CONFIG[bot.status] || STATUS_CONFIG.offline;
            const StatusIcon = config.icon;
            const desc = BOT_DESCRIPTIONS[bot.id] || { en: bot.id, ar: bot.id, icon: Bot };
            const BotIcon = desc.icon;
            const enabled = bot.enabled !== false;

            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`bg-white dark:bg-slate-900 border rounded-lg p-4 transition-colors ${
                  bot.status === 'error'
                    ? 'border-red-200 dark:border-red-900/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <BotIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white font-mono truncate">
                        {bot.id}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate">
                        {isAr ? desc.ar : desc.en}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ring-1 ring-inset ${config.ring} shrink-0`}>
                    <StatusIcon className={`w-2.5 h-2.5 ${config.color}`} strokeWidth={2} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${config.color}`}>
                      {isAr ? config.labelAr : config.label}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-[11px] text-slate-500 space-y-1 mb-3 min-h-[40px]">
                  {bot.lastPulse && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={1.75} />
                      <span className="text-slate-400">
                        {new Date(bot.lastPulse).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {bot.lastError && (
                    <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.75} />
                      <span className="line-clamp-2">{bot.lastError.slice(0, 100)}</span>
                    </div>
                  )}
                  {bot.stats && Object.keys(bot.stats).length > 0 && (
                    <div className="font-mono text-slate-500 text-[10px] space-y-0.5">
                      {Object.entries(bot.stats).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span>{k}:</span>
                          <span className="text-slate-400">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => sendCommand(bot.id, 'run_now')}
                    disabled={actionLoading === `${bot.id}:run_now` || !enabled}
                    className="flex items-center gap-1 px-2 h-7 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md text-[11px] font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Run now"
                  >
                    <Zap className="w-3 h-3" strokeWidth={2} />
                    {isAr ? 'تشغيل' : 'Run'}
                  </button>
                  <button
                    onClick={() => sendCommand(bot.id, 'restart')}
                    disabled={actionLoading === `${bot.id}:restart`}
                    className="flex items-center gap-1 px-2 h-7 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md text-[11px] font-medium transition disabled:opacity-40"
                    title="Restart"
                  >
                    <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                    {isAr ? 'إعادة' : 'Restart'}
                  </button>
                  {enabled ? (
                    <button
                      onClick={() => sendCommand(bot.id, 'disable')}
                      disabled={actionLoading === `${bot.id}:disable`}
                      className="flex items-center gap-1 px-2 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md text-[11px] font-medium transition disabled:opacity-40"
                      title="Disable"
                    >
                      <PowerOff className="w-3 h-3" strokeWidth={1.75} />
                      {isAr ? 'إيقاف' : 'Disable'}
                    </button>
                  ) : (
                    <button
                      onClick={() => sendCommand(bot.id, 'enable')}
                      disabled={actionLoading === `${bot.id}:enable`}
                      className="flex items-center gap-1 px-2 h-7 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-medium transition disabled:opacity-40"
                      title="Enable"
                    >
                      <Power className="w-3 h-3" strokeWidth={1.75} />
                      {isAr ? 'تفعيل' : 'Enable'}
                    </button>
                  )}
                </div>

                {/* Last command */}
                {bot.lastCommand && (
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span>{isAr ? 'آخر أمر:' : 'Last:'}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{bot.lastCommand}</span>
                    {bot.lastCommandAt && (
                      <span className="text-slate-400">
                        · {new Date(bot.lastCommandAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
