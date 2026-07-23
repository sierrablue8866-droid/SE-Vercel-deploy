import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  T: (key: string) => string;
  tab: string;
  setTab: (t: string) => void;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: (() => void) | null;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  langKey: string;
  setLangKey: React.Dispatch<React.SetStateAction<string>>;
}

const NAV_ITEMS = (T: any) => [
  {id:'overview',label:T('overview'),icon:'🏠',section:T('main')},
  {id:'agents',label:T('agents'),icon:'🤖',section:T('main'),badge:'6',badgeCls:'nb-green'},
  {id:'workflows',label:T('workflows'),icon:'⚡',section:T('main'),badge:'8',badgeCls:'nb-blue'},
  {id:'automations',label:T('lang')==='ar'?'الأتمتة':'Automations',icon:'🪄',section:T('main'),badge:'3',badgeCls:'nb-green'},
  {id:'openclaw',label:T('openclaw'),icon:'⚙️',section:T('main')},
  {id:'nexus',label:T('nexus'),icon:'📡',section:T('main'),badge:'LIVE',badgeCls:'nb-green'},
  {id:'leads',label:T('leads'),icon:'👥',section:T('operations'),badge:'23',badgeCls:'nb-red'},
  {id:'pipeline',label:T('lang')==='ar'?'الصفقات':'Pipeline',icon:'💼',section:T('operations')},
  {id:'tasks',label:T('lang')==='ar'?'المهام':'Tasks',icon:'✅',section:T('operations'),badge:'5',badgeCls:'nb-blue'},
  {id:'listings',label:T('listings'),icon:'🏘️',section:T('operations')},
  {id:'curator',label:T('curator'),icon:'🎨',section:T('operations')},
  {id:'scribe',label:T('scribe'),icon:'✍️',section:T('operations')},
  {id:'closer',label:T('closer'),icon:'💼',section:T('operations')},
  {id:'reports',label:T('reports'),icon:'📊',section:T('analytics')},
  {id:'settings',label:T('settings'),icon:'🔧',section:T('system')},
];

const CollapseIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;

function ShieldLogo({size=24}: {size?: number}) {
  return (
    <div style={{ width: size, height: size, background: 'var(--gold)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
      SE
    </div>
  );
}

export default function Sidebar({
  T,
  tab,
  setTab,
  collapsed,
  setCollapsed,
  onClose,
  theme,
  setTheme,
  langKey,
  setLangKey,
}: SidebarProps) {
  const navItems = NAV_ITEMS(T);
  const sections = [...new Set(navItems.map(n => n.section))];

  const handleSignOut = async () => {
    if (confirm(T('lang') === 'ar' ? 'تسجيل الخروج من لوحة التحكم؟' : 'Sign out of admin session?')) {
      await signOut(auth);
    }
  };

  return (
    <aside id="sidebar" className={collapsed ? 'collapsed' : ''}>
      <div className="brand">
        <ShieldLogo size={28}/>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-name">{T('brand') || 'SIERRA ESTATES'}</div>
            <div className="brand-sub">{T('brandSub') || 'INTELLIGENCE OS'}</div>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} style={{marginInlineStart:'auto',background:'none',border:'none',color:'var(--tx-f)',cursor:'pointer'}}>
            <XIcon/>
          </button>
        )}
      </div>
      
      <div style={{flex:1,overflowY:'auto',paddingBottom:8}}>
        {sections.map(sec => (
          <div key={sec}>
            {!collapsed && <div className="nav-section">{sec}</div>}
            {navItems.filter(n => n.section===sec).map(n => (
              <div 
                key={n.id} 
                className={`nav-item ${tab===n.id?'active':''}`} 
                onClick={()=>{
                  setTab(n.id);
                  if (onClose) onClose();
                }} 
                title={n.label}
              >
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
                {n.badge && !collapsed && <span className={`nav-badge ${n.badgeCls}`}>{n.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {!onClose && (
        <div style={{borderTop:'1px solid var(--bd)',padding:'10px 8px'}}>
          <div className="nav-item" onClick={()=>setTheme(prev => prev === 'dark' ? 'light' : 'dark')} title={T('theme')}>
            <span className="nav-icon">🌓</span>
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </div>
          <div className="nav-item" onClick={handleSignOut} title={T('signOut') || 'Sign Out'}>
            <span className="nav-icon">🚪</span>
            {!collapsed && <span>{T('lang') === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>}
          </div>
          <div className="nav-item" onClick={()=>setCollapsed(c=>!c)} title={T('collapse') || 'Collapse'}>
            <span className="nav-icon" style={{transform:collapsed?'rotate(180deg)':'none',transition:'transform 300ms'}}>
              <CollapseIcon/>
            </span>
            {!collapsed && <span>{T('collapse') || 'Collapse'}</span>}
          </div>
        </div>
      )}
    </aside>
  );
}
