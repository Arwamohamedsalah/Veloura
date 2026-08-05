import { motion } from 'framer-motion';
import {
  Search, BookOpen, MessageCircle, Video, ChevronRight,
  Sparkles, ShoppingCart, BarChart3, Package, Palette, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { useReveal } from '../lib/hooks';
import { GUIDE_ROUTES } from '../lib/mockData';
import type { View, NavigateOptions } from '../lib/types';
import { BRAND } from '../lib/brand';

const GUIDES = [
  { id: 'getting-started', title: `Getting started with ${BRAND.name}`, desc: 'Set up your store, connect channels, and launch in under an hour.', time: '8 min read', icon: BookOpen, category: 'Basics' },
  { id: 'ai-picks', title: 'Understanding AI recommendations', desc: 'How lift scores work, when to accept picks, and training the model.', time: '6 min read', icon: Sparkles, category: 'AI' },
  { id: 'orders', title: 'Order fulfillment workflow', desc: 'From pending to delivered — status transitions and bulk actions.', time: '5 min read', icon: ShoppingCart, category: 'Operations' },
  { id: 'analytics', title: 'Reading your analytics dashboard', desc: 'Revenue trends, funnels, and regional performance explained.', time: '10 min read', icon: BarChart3, category: 'Analytics' },
  { id: 'inventory', title: 'Inventory management best practices', desc: 'Stock thresholds, low-stock alerts, and catalog organization.', time: '7 min read', icon: Package, category: 'Operations' },
];

const FAQ = [
  { q: `How often does ${BRAND.ai} refresh recommendations?`, a: 'The merchandising engine re-scores picks every 4 hours based on live store signals. High-velocity events trigger immediate re-runs.' },
  { q: 'Can I connect multiple storefronts?', a: `Yes. ${BRAND.plan} supports unlimited channels — web, app, and boutique POS — unified in one dashboard.` },
  { q: 'What happens when I accept an AI pick?', a: 'The recommendation is pushed to your storefront configuration. You can revert within 24 hours from the AI page.' },
  { q: 'Is my data secure?', a: `All data is encrypted at rest and in transit. ${BRAND.name} Commerce is SOC 2 Type II certified.` },
];

export function HelpCenter({ onNavigate }: { onNavigate: (view: View, opts?: NavigateOptions) => void }) {
  const ref = useReveal<HTMLDivElement>();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filtered = query.trim()
    ? GUIDES.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()) || g.desc.toLowerCase().includes(query.toLowerCase()))
    : GUIDES;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      <div className="card reveal in" style={{ padding: 'var(--s-12)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 50% 0%, rgba(16,185,129,0.14), transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            How can we <span className="serif" style={{ color: 'var(--emerald-300)' }}>help?</span>
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 24 }}>Search guides, watch tutorials, or contact support</p>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', height: 52, borderRadius: 'var(--r-full)', border: '1px solid var(--line-strong)', maxWidth: 480, margin: '0 auto' }}>
            <Search size={18} color="var(--text-3)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles…"
              className="input-ghost"
              style={{ flex: 1, fontSize: 'var(--t-body)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--s-4)' }}>
        {[
          { label: 'Live chat', desc: 'Avg. response 4 min', icon: MessageCircle, action: () => onNavigate('settings', { settingsTab: 'team' }) },
          { label: 'Video tutorials', desc: '12 guided walkthroughs', icon: Video, action: () => onNavigate('overview') },
          { label: 'Design system', desc: 'Components & tokens', icon: Palette, action: () => onNavigate('design') },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={item.action}
              className="card"
              style={{ padding: 'var(--s-6)', textAlign: 'left', transition: 'transform var(--dur-2), border-color var(--dur-2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                <Icon size={18} color="var(--emerald-400)" />
              </div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{item.desc}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="card card-pad reveal in">
        <h3 style={{ fontSize: '1.05rem', marginBottom: 20 }}>Popular guides</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-3)', padding: '24px 0', textAlign: 'center' }}>No guides match "{query}"</p>
          ) : filtered.map((g, i) => {
            const Icon = g.icon;
            const target = GUIDE_ROUTES[g.id];
            return (
              <motion.button
                key={g.id}
                type="button"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => target && onNavigate(target)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                  padding: '14px 12px', borderRadius: 'var(--r-md)', textAlign: 'left',
                  transition: 'background var(--dur-2)', cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="var(--text-2)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--t-small)' }}>{g.title}</span>
                    <span className="badge badge-neutral">{g.category}</span>
                  </div>
                  <p style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{g.desc}</p>
                </div>
                <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', flexShrink: 0 }}>{g.time}</span>
                <ChevronRight size={16} color="var(--text-4)" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="card card-pad reveal in">
        <h3 style={{ fontSize: '1.05rem', marginBottom: 20 }}>Frequently asked questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 8 }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '12px 0', textAlign: 'left', fontWeight: 600,
                  fontSize: 'var(--t-small)',
                }}
              >
                {item.q}
                <ChevronRight size={16} color="var(--text-3)" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-2)' }} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)', lineHeight: 1.6, paddingBottom: 12 }}>{item.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="card reveal in" style={{ padding: 'var(--s-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Still need help?</h3>
          <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)' }}>Our support team is available 24/7 for {BRAND.plan} customers.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('settings', { settingsTab: 'team' })}>
          Contact support <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
