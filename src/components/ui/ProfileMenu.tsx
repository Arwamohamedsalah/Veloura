import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import type { View, NavigateOptions } from '../../lib/types';
import { BRAND } from '../../lib/brand';

const USER = { name: BRAND.fullName, email: BRAND.email };

export function ProfileMenu({
  open, onClose, onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  if (typeof document === 'undefined') return null;

  const items = [
    { label: 'Store settings', icon: Settings, action: () => onNavigate('settings') },
    { label: 'Help & support', icon: HelpCircle, action: () => onNavigate('help') },
    { label: 'Sign out', icon: LogOut, action: () => onNavigate('overview') },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 'calc(var(--topbar-h) + 8px)',
              right: 'max(12px, env(safe-area-inset-right))',
              width: 'min(280px, calc(100vw - 24px))',
              borderRadius: 'var(--r-lg)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 510,
              overflow: 'hidden',
              background: '#141416',
              isolation: 'isolate',
            }}
          >
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: '#1c1d20',
            }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 'var(--t-body)' }}>{USER.name}</div>
              <div style={{ fontSize: 'var(--t-tiny)', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{USER.email}</div>
            </div>
            <div style={{ padding: 6, background: '#141416' }}>
              {items.map((x) => {
                const Icon = x.icon;
                return (
                  <button
                    key={x.label}
                    onClick={() => { x.action(); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '10px 12px',
                      borderRadius: 'var(--r-sm)',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 'var(--t-small)',
                      transition: 'background var(--dur-1)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={15} color="#34d399" /> {x.label}
                  </button>
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

export { USER };
