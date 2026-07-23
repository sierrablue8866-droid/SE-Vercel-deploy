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

interface NavItem {
  id: string;
  label: string;
  labelAr: string;
  icon: LucideIcon;
  section: 'core' | 'automation' | 'integrations' | 'system';
  badge?: string;
  badgeTone?: 'success' | 'info';
}

// Professional nav items — Lucide icons, no emojis.
// Each item carries EN + AR labels so the sidebar re-renders cleanly on
// language switch without re-deriving the labels via the T() lookup.
export const NAV_ITEMS: NavItem[] = [
  // ── Core operations ────────────────────────────────────────────────
  { id: 'overview',       label: 'Live Dashboard',    labelAr: 'لوحة التحكم',           icon: LayoutDashboard, section: 'core' },
  { id: 'commandCenter',  label: 'Command Center OS', labelAr: 'مركز القيادة',          icon: Zap,             section: 'core', badge: 'v4.0', badgeTone: 'success' },
  { id: 'leads',          label: 'Leads & CRM',       labelAr: 'العملاء و CRM',         icon: Users,           section: 'core' },
  { id: 'listings',       label: 'Property Inventory',labelAr: 'العقارات',              icon: Building2,       section: 'core' },
  { id: 'followups',      label: 'Follow-ups',        labelAr: 'المتابعات',             icon: CalendarCheck,   section: 'core' },
  { id: 'searchInsights', label: 'Search Insights',   labelAr: 'تحليلات البحث',         icon: BarChart3,       section: 'core' },
  { id: 'pageEditor',     label: 'Page Editor',       labelAr: 'محرر الصفحات',          icon: FileText,        section: 'core' },
  // ── Automation & agents ────────────────────────────────────────────
  { id: 'bots',           label: 'Bots Control',      labelAr: 'التحكم بالبوتات',       icon: Bot,             section: 'automation' },
  { id: 'agents',         label: 'AI Agents',         labelAr: 'وكلاء الذكاء',          icon: Bot,             section: 'automation', badge: '6', badgeTone: 'success' },
  { id: 'memoryEngine',   label: 'Memory Engine & Vault', labelAr: 'محرك الذاكرة',     icon: Brain,           section: 'automation', badge: 'Vault', badgeTone: 'info' },
  { id: 'workflows',      label: 'Workflows',         labelAr: 'سير العمل',             icon: Workflow,        section: 'automation', badge: '8', badgeTone: 'info' },
  // ── Integrations ───────────────────────────────────────────────────
  { id: 'easyListing',    label: 'Easy Listing',      labelAr: 'إدراج سريع',            icon: Zap,             section: 'integrations' },
  { id: 'automation',     label: 'Automation Portal', labelAr: 'بوابة الأتمتة',         icon: Settings,        section: 'integrations' },
  { id: 'dataSync',       label: 'Data Sync',         labelAr: 'مزامنة البيانات',       icon: RefreshCw,       section: 'integrations' },
  // ── System ─────────────────────────────────────────────────────────
  { id: 'dbEditor',       label: 'DB Editor',         labelAr: 'محرر قاعدة البيانات',   icon: Database,        section: 'system' },
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
