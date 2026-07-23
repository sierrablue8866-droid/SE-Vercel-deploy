import React, { useRef } from 'react';
import { Mic, Search, X } from 'lucide-react';
import AdminHealthMonitor from './AdminHealthMonitor';
import GlobalProgressTracker from './GlobalProgressTracker';

interface TopbarProps {
  T: (key: string) => string;
  langKey: string;
  activeTitle: string;
  toggleVoiceSearch: () => void;
  isListening: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  pendingVoiceTranscript: string;
  voiceCountdown: number;
  speechError: string;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Topbar({
  T,
  langKey,
  activeTitle,
  toggleVoiceSearch,
  isListening,
  searchQuery,
  setSearchQuery,
  pendingVoiceTranscript,
  voiceCountdown,
  speechError,
  collapsed,
  setCollapsed
}: TopbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isAr = langKey === 'ar';

  return (
    <header id="topbar">
      <button 
        className="hamburger-btn" 
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle Sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div className="topbar-title">{activeTitle}</div>
      
      <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AdminHealthMonitor />
        <GlobalProgressTracker />

        <button
          onClick={toggleVoiceSearch}
          className="topbar-pill"
          style={isListening ? { borderColor: 'var(--red)', color: 'var(--red)' } : {}}
          title={T('voiceSearch') || 'Voice Search'}
        >
          <Mic className="w-3.5 h-3.5" />
        </button>

        <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search className="w-3.5 h-3.5" style={{ position: 'absolute', left: 10, color: 'var(--tx-f)' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={pendingVoiceTranscript ? (T('listening') || 'Listening...') : (isAr ? 'بحث...' : 'Search...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="f-in"
            style={{ width: 220, paddingLeft: 30, paddingRight: 30 }}
          />
          {searchQuery && !pendingVoiceTranscript && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-f)' }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
