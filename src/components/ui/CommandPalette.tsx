import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Search, LayoutDashboard, Sparkles, ShoppingCart, BarChart3, Package, Settings, HelpCircle, Palette } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { View, NavigateOptions } from '../../lib/types';

const COMMANDS: { id: View; label: string; hint: string; icon: typeof LayoutDashboard; group: string }[] = [
  { id: 'overview', label: 'Overview', hint: 'Store at a glance', icon: LayoutDashboard, group: 'Navigate' },
  { id: 'ai', label: 'AI Recommendations', hint: 'Merchandising intelligence', icon: Sparkles, group: 'Navigate' },
  { id: 'orders', label: 'Orders', hint: 'Fulfillment pipeline', icon: ShoppingCart, group: 'Navigate' },
  { id: 'analytics', label: 'Analytics', hint: 'Revenue & behavior', icon: BarChart3, group: 'Navigate' },
  { id: 'inventory', label: 'Inventory', hint: 'Stock & products', icon: Package, group: 'Navigate' },
  { id: 'settings', label: 'Settings', hint: 'Store configuration', icon: Settings, group: 'Account' },
  { id: 'help', label: 'Help Center', hint: 'Guides & support', icon: HelpCircle, group: 'Account' },
  { id: 'design', label: 'Design System', hint: 'Components & tokens', icon: Palette, group: 'Account' },
];

export function CommandPalette({
  open, onClose, onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) { setQuery(''); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof COMMANDS>();
    for (const c of filtered) {
      const arr = map.get(c.group) || [];
      arr.push(c);
      map.set(c.group, arr);
    }
    return map;
  }, [filtered]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            }}
          />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)',
              width: 'min(560px, calc(100vw - 32px))',
              borderRadius: 'var(--r-xl)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 510,
              overflow: 'hidden',
              background: '#141416',
              isolation: 'isolate',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: '#1c1d20',
            }}>
              <Search size={18} color="#34d399" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, actions…"
                style={{
                  flex: 1, fontSize: 'var(--t-body)',
                  background: 'none', border: 'none', outline: 'none',
                  color: '#fff',
                }}
              />
              <kbd style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 6px' }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8, background: '#141416' }}>
              {filtered.length === 0 ? (
                <p style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--t-small)' }}>No results for "{query}"</p>
              ) : (
                [...groups.entries()].map(([group, items]) => (
                  <div key={group} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 'var(--t-tiny)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 12px 4px' }}>{group}</div>
                    {items.map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => { onNavigate(cmd.id); onClose(); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                            padding: '10px 12px', borderRadius: 'var(--r-md)', textAlign: 'left',
                            transition: 'background var(--dur-1)', color: '#fff',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                            display: 'grid', placeItems: 'center',
                          }}>
                            <Icon size={16} color="#34d399" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 'var(--t-small)' }}>{cmd.label}</div>
                            <div style={{ fontSize: 'var(--t-tiny)', color: 'rgba(255,255,255,0.5)' }}>{cmd.hint}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
