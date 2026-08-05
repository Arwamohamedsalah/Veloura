import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, Topbar } from './components/Shell';
import { Overview } from './components/Overview';
import { AIRecommendations } from './components/AIRecommendations';
import { Orders } from './components/Orders';
import { Analytics } from './components/Analytics';
import { Inventory } from './components/Inventory';
import { Settings } from './components/Settings';
import { HelpCenter } from './components/HelpCenter';
import { DesignSystem } from './components/DesignSystem';
import { Modal } from './components/ui/Modal';
import { Select } from './components/ui/Select';
import { useData } from './lib/data';
import type { View, NavigateOptions } from './lib/types';

const TITLES: Record<View, { title: string; shortTitle?: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Store performance at a glance' },
  ai: { title: 'AI Recommendations', shortTitle: 'AI Picks', subtitle: 'Merchandising intelligence, scored & ready' },
  orders: { title: 'Orders', subtitle: 'Fulfillment pipeline across channels' },
  analytics: { title: 'Analytics', shortTitle: 'Analytics', subtitle: 'Revenue, behavior & conversion insights' },
  inventory: { title: 'Inventory', subtitle: 'Stock health across every SKU' },
  settings: { title: 'Settings', subtitle: 'Store configuration & team' },
  help: { title: 'Help Center', shortTitle: 'Help', subtitle: 'Guides, FAQ & support' },
  design: { title: 'Design System', shortTitle: 'Design', subtitle: 'Tokens, components & patterns' },
};

export default function App() {
  const [view, setView] = useState<View>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('store');
  const [ordersFilter, setOrdersFilter] = useState<NavigateOptions['ordersFilter']>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { products, orders, recommendations, loading } = useData();
  const meta = TITLES[view];

  const navigate = useCallback((v: View, opts?: NavigateOptions) => {
    setView(v);
    if (opts?.settingsTab) setSettingsTab(opts.settingsTab);
    if (opts?.ordersFilter) setOrdersFilter(opts.ordersFilter);
    if (opts?.orderId !== undefined) setSelectedOrderId(opts.orderId);
    setSidebarOpen(false);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <Sidebar view={view} onNavigate={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="shell-main" style={{ paddingLeft: 'var(--sidebar-w)', position: 'relative', zIndex: 1, width: '100%', minWidth: 0, overflowX: 'hidden' }}>
        <Topbar
          title={meta.title}
          shortTitle={meta.shortTitle}
          subtitle={meta.subtitle}
          onMenu={() => setSidebarOpen(true)}
          onNavigate={navigate}
          onNewOrder={() => setNewOrderOpen(true)}
        />

        <main className="main-content" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'var(--s-8) clamp(16px, 4vw, 40px) var(--s-20)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              className="page-stack"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === 'overview' && (
                <Overview products={products} orders={orders} recommendations={recommendations} loading={loading} onNavigate={navigate} />
              )}
              {view === 'ai' && <AIRecommendations recommendations={recommendations} loading={loading} onNavigate={navigate} />}
              {view === 'orders' && (
                <Orders
                  orders={orders}
                  loading={loading}
                  initialFilter={ordersFilter}
                  initialOrderId={selectedOrderId}
                  onNavigate={navigate}
                />
              )}
              {view === 'analytics' && <Analytics products={products} loading={loading} onNavigate={navigate} />}
              {view === 'inventory' && <Inventory products={products} loading={loading} onNavigate={navigate} />}
              {view === 'settings' && <Settings activeTab={settingsTab} onTabChange={setSettingsTab} onNavigate={navigate} />}
              {view === 'help' && <HelpCenter onNavigate={navigate} />}
              {view === 'design' && <DesignSystem onNavigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <NewOrderModal open={newOrderOpen} onClose={() => setNewOrderOpen(false)} onCreated={() => navigate('orders')} />
    </div>
  );
}

function NewOrderModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [channel, setChannel] = useState('web');
  return (
    <Modal open={open} onClose={onClose} title="Create order" subtitle="Manual order entry for boutique & phone sales">
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        onSubmit={(e) => { e.preventDefault(); onClose(); onCreated(); }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Customer name</span>
          <input className="input" placeholder="Sophie Laurent" required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Email</span>
          <input className="input" type="email" placeholder="customer@email.com" />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="two-col">
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Channel</span>
            <Select
              value={channel}
              onChange={setChannel}
              options={[
                { value: 'web', label: 'Web' },
                { value: 'app', label: 'App' },
                { value: 'boutique', label: 'Boutique' },
              ]}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Total ($)</span>
            <input className="input" type="number" placeholder="0" min="0" required />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create order</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export type { View, NavigateOptions };
