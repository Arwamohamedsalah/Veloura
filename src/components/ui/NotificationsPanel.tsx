import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Bell, Package, Sparkles, TrendingUp, X, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import type { View, NavigateOptions } from '../../lib/types';

const NOTIFICATIONS: { id: string; type: 'order' | 'ai' | 'stock' | 'metric'; title: string; body: string; time: string; unread: boolean; target: View; opts?: NavigateOptions }[] = [
  { id: 'n1', type: 'order', title: 'New order VL-28501', body: 'Sophie Laurent placed a $1,240 order via web.', time: '2m ago', unread: true, target: 'orders', opts: { orderId: 'o1' } },
  { id: 'n2', type: 'ai', title: '3 AI picks ready', body: 'New merchandising recommendations scored above 85% confidence.', time: '18m ago', unread: true, target: 'ai' },
  { id: 'n3', type: 'stock', title: 'Low stock alert', body: 'Scented Candle Collection down to 12 units.', time: '1h ago', unread: true, target: 'inventory' },
  { id: 'n4', type: 'metric', title: 'Revenue milestone', body: 'Monthly revenue crossed $1.2M — 18% above forecast.', time: '3h ago', unread: false, target: 'analytics' },
  { id: 'n5', type: 'order', title: 'Order shipped', body: 'VL-28492 is en route to Singapore.', time: '5h ago', unread: false, target: 'orders', opts: { orderId: 'o2' } },
];

const ICONS = { order: Package, ai: Sparkles, stock: Package, metric: TrendingUp };

const TYPE_STYLE = {
  order: { icon: '#34d399', bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.35)' },
  ai: { icon: '#fb923c', bg: 'rgba(249,115,22,0.18)', border: 'rgba(249,115,22,0.35)' },
  stock: { icon: '#fb923c', bg: 'rgba(249,115,22,0.18)', border: 'rgba(249,115,22,0.35)' },
  metric: { icon: '#34d399', bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.35)' },
};

export function NotificationsPanel({
  open, onClose, onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleClick = (n: typeof NOTIFICATIONS[0]) => {
    setItems((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x));
    onNavigate(n.target, n.opts);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 'calc(var(--topbar-h) + 8px)',
              right: 24,
              width: 'min(380px, calc(100vw - 32px))',
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
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#1c1d20',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} color="#34d399" />
                <span style={{ fontWeight: 700, color: '#fff' }}>Notifications</span>
                {unread > 0 && <span className="badge badge-emerald">{unread} new</span>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {unread > 0 && (
                  <button className="btn-icon-sm btn-ghost" onClick={markAllRead} aria-label="Mark all read"><CheckCheck size={15} /></button>
                )}
                <button className="btn-icon-sm btn-ghost" onClick={onClose} aria-label="Close"><X size={15} /></button>
              </div>
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto', background: '#141416' }}>
              {items.map((n, i) => {
                const Icon = ICONS[n.type];
                const style = TYPE_STYLE[n.type];
                return (
                  <motion.button
                    key={n.id}
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleClick(n)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: n.unread ? 'rgba(16,185,129,0.1)' : '#141416',
                      borderLeft: n.unread ? '3px solid #10b981' : '3px solid transparent',
                      display: 'flex', gap: 12, cursor: 'pointer', width: '100%', textAlign: 'left',
                      transition: 'background var(--dur-1)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = n.unread ? 'rgba(16,185,129,0.16)' : 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? 'rgba(16,185,129,0.1)' : '#141416')}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: style.bg, border: `1px solid ${style.border}`,
                      display: 'grid', placeItems: 'center',
                    }}>
                      <Icon size={16} color={style.icon} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--t-small)', color: '#fff' }}>{n.title}</span>
                        {n.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#10b981', flexShrink: 0, marginTop: 4, boxShadow: '0 0 0 2px #141416' }} />}
                      </div>
                      <p style={{ fontSize: 'var(--t-small)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>{n.body}</p>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, display: 'block' }}>{n.time}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
