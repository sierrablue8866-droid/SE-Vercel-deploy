'use client';
// @ts-nocheck
/* eslint-disable */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sierra Estates — Requests Ticket Page
 * ═══════════════════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageCircle, Send, User, Bot, Headphones, CheckCircle2,
  Loader2, AlertCircle, X, Phone, MapPin, BedDouble, Tag,
} from 'lucide-react';
import {
  fetchRequests, fetchRequestById, escalateToAgent, closeRequest, appendChatMessage,
} from '../services/firebaseUtils';
import type { Request, RequestStatus, ChatMessage } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  bot_handling: {
    label: 'Bot Handling',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    icon: Bot,
  },
  ready_for_agent: {
    label: 'Ready for Agent',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    icon: Headphones,
  },
  closed: {
    label: 'Closed',
    color: 'bg-muted/10 text-muted border-border',
    icon: CheckCircle2,
  },
};

export default function RequestsTicketPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'open'>('open');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRequests({
        status: filterStatus === 'open' ? undefined : filterStatus,
        limitCount: 50,
      });
      const filtered = filterStatus === 'open'
        ? data.filter(r => r.status === 'bot_handling' || r.status === 'ready_for_agent')
        : data;
      setRequests(filtered);
      if (filtered.length > 0 && !selectedId) {
        setSelectedId(filtered[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, selectedId]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedRequest(null);
      return;
    }
    fetchRequestById(selectedId).then(req => {
      setSelectedRequest(req);
    }).catch(err => setError(err.message));
  }, [selectedId]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left List */}
      <div className="w-80 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-extrabold mb-3">Support Tickets</h1>
          <div className="flex gap-1 bg-surface-secondary p-1 rounded-xl">
            {(['open', 'bot_handling', 'ready_for_agent', 'closed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  filterStatus === s ? 'bg-surface shadow text-foreground' : 'text-muted'
                }`}
              >
                {s === 'open' ? 'Open' : s.split('_')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted">
              <Loader2 className="animate-spin mr-2" size={16} /> Loading...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted text-xs">
              <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
              No active tickets
            </div>
          ) : (
            requests.map(req => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.bot_handling;
              const Icon = cfg.icon;
              const lastMsg = req.bot_chat_history?.[req.bot_chat_history.length - 1];
              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedId(req.id)}
                  className={`w-full text-left p-3.5 border-b border-border/50 hover:bg-surface-hover/50 transition ${
                    selectedId === req.id ? 'bg-accent/10 border-l-4 border-l-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} className="text-accent" />
                    <span className="text-xs font-bold text-muted">{cfg.label}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground truncate">
                    {req.client_id?.substring(0, 12)}
                  </div>
                  {lastMsg && (
                    <div className="text-xs text-muted truncate mt-1">
                      {lastMsg.text}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Details */}
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 text-xs text-red-500 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}
        {!selectedRequest ? (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <MessageCircle size={44} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a ticket to view conversation history</p>
            </div>
          </div>
        ) : (
          <TicketDetail
            request={selectedRequest}
            onUpdate={() => {
              fetchRequestById(selectedRequest.id).then(setSelectedRequest);
              loadRequests();
            }}
          />
        )}
      </div>
    </div>
  );
}

function TicketDetail({ request, onUpdate }: { request: Request; onUpdate: () => void; }) {
  const [agentReply, setAgentReply] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [request.bot_chat_history?.length]);

  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.bot_handling;
  const StatusIcon = cfg.icon;

  const handleSendReply = async () => {
    if (!agentReply.trim()) return;
    setSending(true);
    try {
      const message: ChatMessage = {
        sender: 'agent',
        text: agentReply.trim(),
        timestamp: new Date().toISOString(),
      };
      await appendChatMessage(request.id, message);
      setAgentReply('');
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleEscalate = async () => {
    setActionLoading(true);
    try {
      await escalateToAgent(request.id, 'admin-agent');
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!confirm('Close ticket?')) return;
    setActionLoading(true);
    try {
      await closeRequest(request.id);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon size={15} className="text-accent" />
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          <h2 className="text-base font-extrabold">Ticket #{request.id?.substring(0, 10)}</h2>
        </div>
        <div className="flex gap-2">
          {request.status === 'bot_handling' && (
            <button onClick={handleEscalate} disabled={actionLoading} className="px-3 py-1.5 bg-accent text-accent-text rounded-xl text-xs font-bold">
              Take Over
            </button>
          )}
          {request.status !== 'closed' && (
            <button onClick={handleClose} disabled={actionLoading} className="px-3 py-1.5 bg-surface-secondary border border-border text-foreground rounded-xl text-xs font-bold">
              Close Ticket
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-background/50">
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {request.bot_chat_history?.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {request.status !== 'closed' && (
            <div className="p-4 bg-surface border-t border-border flex gap-2">
              <input
                type="text"
                value={agentReply}
                onChange={e => setAgentReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                placeholder="Type response to client..."
                className="flex-1 px-4 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button onClick={handleSendReply} disabled={sending || !agentReply.trim()} className="px-4 py-2.5 bg-accent text-accent-text rounded-xl text-xs font-bold">
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isClient = message.sender === 'client';
  return (
    <div className={`flex gap-2 ${isClient ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${
        isClient ? 'bg-surface border border-border text-foreground' : 'bg-accent text-accent-text'
      }`}>
        {message.text}
      </div>
    </div>
  );
}
