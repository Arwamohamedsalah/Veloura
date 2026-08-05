import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Mail, CreditCard, Package, Truck, Clock } from 'lucide-react';
import { type Order } from '../../lib/types';
import { formatCurrency } from '../../lib/data';
import { StatusBadge } from '../Overview';

const TIMELINE: Record<Order['status'], { label: string; done: boolean }[]> = {
  pending: [
    { label: 'Order placed', done: true },
    { label: 'Payment confirmed', done: false },
    { label: 'Processing', done: false },
    { label: 'Shipped', done: false },
    { label: 'Delivered', done: false },
  ],
  processing: [
    { label: 'Order placed', done: true },
    { label: 'Payment confirmed', done: true },
    { label: 'Processing', done: true },
    { label: 'Shipped', done: false },
    { label: 'Delivered', done: false },
  ],
  shipped: [
    { label: 'Order placed', done: true },
    { label: 'Payment confirmed', done: true },
    { label: 'Processing', done: true },
    { label: 'Shipped', done: true },
    { label: 'Delivered', done: false },
  ],
  delivered: [
    { label: 'Order placed', done: true },
    { label: 'Payment confirmed', done: true },
    { label: 'Processing', done: true },
    { label: 'Shipped', done: true },
    { label: 'Delivered', done: true },
  ],
  cancelled: [
    { label: 'Order placed', done: true },
    { label: 'Cancelled', done: true },
  ],
};

export function OrderDetailPanel({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const timeline = order ? TIMELINE[order.status] : [];

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55, backdropFilter: 'blur(4px)' }}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="glass"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)',
              borderLeft: '1px solid var(--line)', zIndex: 65, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(20,20,22,0.95)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order detail</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: 2 }}>{order.order_no}</h2>
              </div>
              <button className="btn-icon-sm btn-ghost" onClick={onClose} aria-label="Close"><X size={16} /></button>
            </div>

            <div style={{ padding: 'var(--s-6) var(--s-8)', display: 'flex', flexDirection: 'column', gap: 'var(--s-6)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusBadge status={order.status} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }} className="mono-num">{formatCurrency(Number(order.total))}</span>
              </div>

              <div className="card" style={{ padding: 'var(--s-5)' }}>
                <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Customer</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Row icon={Package} label={order.customer} />
                  {order.email && <Row icon={Mail} label={order.email} />}
                  {order.location && <Row icon={MapPin} label={order.location} />}
                  <Row icon={CreditCard} label={`${order.items} item${order.items > 1 ? 's' : ''} · ${order.channel} channel`} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Fulfillment timeline</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {timeline.map((step, i) => (
                    <div key={step.label} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                      {i < timeline.length - 1 && (
                        <div style={{ position: 'absolute', left: 11, top: 24, bottom: -4, width: 2, background: step.done ? 'var(--emerald-500)' : 'rgba(255,255,255,0.08)' }} />
                      )}
                      <div style={{
                        width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                        background: step.done ? 'var(--emerald-500)' : 'rgba(255,255,255,0.06)',
                        border: step.done ? 'none' : '1px solid var(--line)',
                        display: 'grid', placeItems: 'center',
                      }}>
                        {step.done ? <Truck size={11} color="var(--ink)" /> : <Clock size={11} color="var(--text-4)" />}
                      </div>
                      <div style={{ paddingBottom: 20 }}>
                        <div style={{ fontWeight: step.done ? 600 : 500, fontSize: 'var(--t-small)', color: step.done ? 'var(--text)' : 'var(--text-3)' }}>{step.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 'var(--s-4)' }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Update status</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Print invoice</button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ icon: Icon, label }: { icon: typeof Mail; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-small)', color: 'var(--text-2)' }}>
      <Icon size={15} color="var(--text-3)" />
      <span>{label}</span>
    </div>
  );
}
