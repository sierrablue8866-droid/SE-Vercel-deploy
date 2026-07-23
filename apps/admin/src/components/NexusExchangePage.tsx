'use client';
// @ts-nocheck
/* eslint-disable */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sierra Estates — Nexus Exchange Page
 * ═══════════════════════════════════════════════════════════════════════════
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Bot, Zap, Settings, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
    running:   'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse',
    done:      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    error:     'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-muted/10 text-muted border-border',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-widest ${colors[status] ?? colors.pending}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    agent_task:     <Bot className="w-3 h-3 text-blue-400" />,
    workflow_run:   <Zap className="w-3 h-3 text-amber-400" />,
    admin_signal:   <Settings className="w-3 h-3 text-slate-400" />,
    crm_event:      <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
    error:          <AlertCircle className="w-3 h-3 text-red-400" />
  };
  
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted font-mono">
      {icons[type] ?? <Clock className="w-3 h-3 text-muted" />} 
      {type.replace('_', ' ')}
    </span>
  );
}

export default function NexusExchangePage({ T, isAr }: { T?: any, isAr?: boolean }) {
  const [tab, setTab] = useState<'all' | 'agents' | 'workflows' | 'signals'>('all');
  const [signalPayload, setSignalPayload] = useState('');
  const [agentId, setAgentId] = useState('');
  const [sending, setSending] = useState(false);
  const [lastSignalId, setLastSignalId] = useState<string | null>(null);

  const [records] = useState<any[]>([
    { id: 'ex_9201', type: 'agent_task', status: 'done', stepName: 'Scribe NLP Ingestion', progress: 100 },
    { id: 'ex_9202', type: 'workflow_run', status: 'running', stepName: 'Curator Valuation Sync', progress: 65 },
    { id: 'ex_9203', type: 'admin_signal', status: 'done', stepName: 'Stage-9 Auto Closer', progress: 100 },
  ]);

  const handleSendSignal = useCallback(async () => {
    if (!signalPayload.trim()) return;
    setSending(true);
    setTimeout(() => {
      setLastSignalId(`sig_${Math.floor(Math.random() * 90000 + 10000)}`);
      setSignalPayload('');
      setAgentId('');
      setSending(false);
    }, 600);
  }, [signalPayload]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Nexus Telemetry & Agent Signals</h1>
        <p className="text-xs text-muted mt-1">Real-time inter-agent messaging and task execution bus</p>
      </div>

      {/* Dispatch Signal Card */}
      <div className="bg-surface border border-accent/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        <h2 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-3">
          {isAr ? 'إرسال إشارة للوكلاء' : 'Dispatch Admin Signal'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            placeholder={isAr ? 'معرف الوكيل (اختياري)' : 'Target Agent ID (optional)'}
            className="bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-xs text-foreground w-full sm:w-56 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            value={signalPayload}
            onChange={e => setSignalPayload(e.target.value)}
            placeholder={isAr ? 'الإجراء (مثال: start_closer)' : 'Action payload (e.g. start_closer)'}
            className="flex-1 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={e => e.key === 'Enter' && handleSendSignal()}
          />
          <button
            onClick={handleSendSignal}
            disabled={sending || !signalPayload.trim()}
            className="px-6 py-2.5 bg-accent text-accent-text font-bold text-xs rounded-xl hover:opacity-90 disabled:opacity-40 transition shadow-md"
          >
            {sending ? '...' : (isAr ? 'إرسال' : 'Dispatch')}
          </button>
        </div>
        {lastSignalId && (
          <p className="text-emerald-500 text-xs mt-3 font-mono">
            ✅ Signal dispatched successfully — ID: {lastSignalId}
          </p>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="p-4 bg-surface border border-border rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TypeBadge type={record.type} />
              <span className="font-mono text-xs font-bold text-foreground">#{record.id}</span>
              <span className="text-xs text-muted">{record.stepName}</span>
            </div>
            <StatusBadge status={record.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
