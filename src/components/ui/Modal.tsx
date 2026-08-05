import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({
  open, onClose, title, subtitle, children, width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

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
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            }}
            aria-hidden
          />
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 510,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16, pointerEvents: 'none',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: `min(${width}px, 100%)`,
                maxHeight: 'calc(100vh - 32px)',
                overflow: 'visible',
                pointerEvents: 'auto',
                borderRadius: 'var(--r-xl)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'var(--shadow-xl)',
                background: '#141416',
                isolation: 'isolate',
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
                background: '#1c1d20',
                position: 'sticky', top: 0, zIndex: 1,
              }}>
                <div>
                  <h2 id="modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{title}</h2>
                  {subtitle && <p style={{ fontSize: 'var(--t-small)', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{subtitle}</p>}
                </div>
                <button type="button" className="btn-icon-sm btn-ghost" onClick={onClose} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: '24px', background: '#141416', overflow: 'visible' }}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
