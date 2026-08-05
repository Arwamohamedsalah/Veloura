import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sparkles, ShoppingCart, BarChart3, Package,
  Search, Bell, Plus, ChevronDown, Menu, Filter,
  Settings, HelpCircle, Store,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { View, NavigateOptions } from '../lib/types';
import { CommandPalette } from './ui/CommandPalette';
import { NotificationsPanel } from './ui/NotificationsPanel';
import { Avatar } from './ui/Avatar';
import { ProfileMenu, USER } from './ui/ProfileMenu';
import { BRAND } from '../lib/brand';

export type { View };

const NAV: { id: View; label: string; icon: typeof LayoutDashboard; hint: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, hint: 'Store at a glance' },
  { id: 'ai', label: 'AI Recommendations', icon: Sparkles, hint: 'Merchandising intelligence' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, hint: 'Fulfillment pipeline' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, hint: 'Revenue & behavior' },
  { id: 'inventory', label: 'Inventory', icon: Package, hint: 'Stock & products' },
];

export function Sidebar({
  view, onNavigate, open, setOpen,
}: { view: View; onNavigate: (v: View, opts?: NavigateOptions) => void; open: boolean; setOpen: (o: boolean) => void }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      <aside
        className="glass sidebar-aside"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: 'var(--sidebar-w)',
          borderRight: '1px solid var(--line)', zIndex: 50, display: 'flex', flexDirection: 'column',
        }}
        data-open={open}
      >
        <button
          onClick={() => onNavigate('overview')}
          className="sidebar-brand"
          style={{ padding: '24px 24px 20px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--emerald-500), var(--emerald-700))',
            display: 'grid', placeItems: 'center', boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
          }}>
            <Store size={20} color="#0a0a0b" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{BRAND.name}</span>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{BRAND.tagline}</span>
          </div>
        </button>

        <nav style={{ padding: '8px 14px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '12px 12px 8px' }}>Workspace</div>
          {NAV.map((item) => {
            const active = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setOpen(false); }}
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '11px 12px', borderRadius: 'var(--r-md)',
                  color: active ? 'var(--text)' : 'var(--text-2)', marginBottom: 2,
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'background var(--dur-2) var(--ease), color var(--dur-2)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: 20, borderRadius: 999, background: 'var(--emerald-400)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={active ? 2.3 : 2} color={active ? 'var(--emerald-400)' : undefined} />
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, lineHeight: 1.1 }}>
                  <span style={{ fontWeight: active ? 600 : 500, fontSize: 'var(--t-body)' }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)' }}>{item.hint}</span>
                </span>
              </button>
            );
          })}

          <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '20px 12px 8px' }}>Account</div>
          {([
            { label: 'Settings', icon: Settings, id: 'settings' as View },
            { label: 'Help Center', icon: HelpCircle, id: 'help' as View },
          ]).map((x) => {
            const Icon = x.icon;
            const active = view === x.id;
            return (
              <button
                key={x.label}
                onClick={() => { onNavigate(x.id); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '11px 12px', borderRadius: 'var(--r-md)', marginBottom: 2,
                  color: active ? 'var(--text)' : 'var(--text-2)',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'background var(--dur-2)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} strokeWidth={2} color={active ? 'var(--emerald-400)' : undefined} />
                <span style={{ fontWeight: active ? 600 : 500 }}>{x.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 14px 18px' }}>
          <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 100% 0%, rgba(249,115,22,0.18), transparent 60%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={14} color="var(--orange-400)" />
                <span style={{ fontSize: 'var(--t-tiny)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange-300)' }}>{BRAND.plan}</span>
              </div>
              <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)', lineHeight: 1.4, marginBottom: 12 }}>
                Unlock predictive demand forecasting across all channels.
              </p>
              <button className="btn btn-accent btn-sm" style={{ width: '100%' }} onClick={() => onNavigate('settings', { settingsTab: 'billing' })}>
                Upgrade plan
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  title, shortTitle, subtitle, onMenu, onNavigate, onNewOrder,
}: {
  title: string;
  shortTitle?: string;
  subtitle: string;
  onMenu: () => void;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
  onNewOrder: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="glass topbar-header">
      <MobileMenuButton onMenu={onMenu} />

      <div className="topbar-title-wrap">
        <h1 className="topbar-title-full">{title}</h1>
        <h1 className="topbar-title-short">{shortTitle ?? title}</h1>
        <span className="topbar-subtitle hide-sm">{subtitle}</span>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
      <button
        className="glass hide-sm topbar-search"
        onClick={() => setCmdOpen(true)}
      >
        <Search size={16} color="var(--text-3)" />
        <span>Search products, orders…</span>
        <kbd>⌘K</kbd>
      </button>

      <button className="btn-icon-sm btn-ghost hide-xs" aria-label="Filter orders" onClick={() => onNavigate('orders')}>
        <Filter size={16} />
      </button>

      <button className="btn-icon-sm btn-ghost" aria-label="Notifications" style={{ position: 'relative' }} onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}>
        <Bell size={16} />
        <span className="notif-dot" />
      </button>

      <NewButton onClick={onNewOrder} />

      <div style={{ position: 'relative' }}>
        <button className="topbar-profile-btn" onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}>
          <Avatar name={USER.name} size={30} round />
          <ChevronDown size={14} color="var(--text-3)" className="profile-chevron" />
        </button>
        <ProfileMenu open={profileOpen} onClose={() => setProfileOpen(false)} onNavigate={onNavigate} />
      </div>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={onNavigate} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} onNavigate={onNavigate} />
    </header>
  );
}

function MobileMenuButton({ onMenu }: { onMenu: () => void }) {
  return (
    <button className="btn-icon-sm btn-ghost mobile-only" onClick={onMenu} aria-label="Open menu">
      <Menu size={18} />
    </button>
  );
}

function NewButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-primary btn-sm desktop-only" onClick={onClick}>
      <Plus size={16} /> New order
    </button>
  );
}
