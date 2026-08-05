import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpRight, DollarSign, ShoppingCart,
  Users, Sparkles, Zap,
} from 'lucide-react';
import { type Product, type Order, type Recommendation, type View, type NavigateOptions } from '../lib/types';
import { formatCurrency, formatNumber } from '../lib/data';
import { useReveal, useCountUp, useInView } from '../lib/hooks';
import { AreaChart, Sparkline, ProgressRing, Heatmap } from '../lib/charts';
import { Avatar } from './ui/Avatar';
import { BRAND } from '../lib/brand';

export function Overview({
  products, orders, recommendations, loading, onNavigate,
}: {
  products: Product[]; orders: Order[]; recommendations: Recommendation[];
  loading: boolean;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const revenueData = [42, 55, 48, 61, 58, 72, 68, 85, 79, 92, 88, 104];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const convRate = 3.8;

  const kpis = [
    { label: 'Revenue (30d)', value: totalRevenue + 184200, prefix: '$', delta: 18.2, up: true, icon: DollarSign, color: 'var(--emerald-400)', spark: [30, 35, 32, 40, 38, 45, 52, 48, 60, 58, 72, 80], glow: 'var(--shadow-glow-emerald)' },
    { label: 'Orders', value: orders.length + 1284, delta: 12.4, up: true, icon: ShoppingCart, color: 'var(--orange-400)', spark: [20, 25, 30, 28, 35, 32, 40, 45, 42, 50, 55, 60], glow: 'var(--shadow-glow-orange)' },
    { label: 'Active customers', value: 4820, delta: 8.1, up: true, icon: Users, color: 'var(--emerald-400)', spark: [40, 42, 41, 45, 48, 46, 52, 55, 53, 58, 60, 64], glow: 'var(--shadow-glow-emerald)' },
    { label: 'Conversion', value: convRate, suffix: '%', delta: -0.4, up: false, icon: Zap, color: 'var(--orange-400)', spark: [3.2, 3.4, 3.1, 3.6, 3.5, 3.8, 3.7, 4.0, 3.9, 4.1, 3.8, 3.8], glow: 'var(--shadow-glow-orange)' },
  ];

  return (
    <div ref={ref} className="page-stack" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      {/* Hero band */}
      <HeroBand orders={orders} totalRevenue={totalRevenue} recommendations={recommendations} loading={loading} onNavigate={onNavigate} />

      {/* KPI grid */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s-5)' }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} kpi={k} index={i} loading={loading} />
        ))}
      </div>

      {/* Revenue + side stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--s-6)' }} className="two-col">
        <div className="card card-pad reveal in" style={{ minHeight: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>Revenue performance</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginTop: 2 }}>Last 12 months · all channels</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['1M', '6M', '1Y'].map((t, i) => (
                <button key={t} className="btn-icon-sm btn-ghost" style={{
                  width: 'auto', padding: '0 12px', borderRadius: 'var(--r-full)',
                  fontSize: 'var(--t-tiny)', fontWeight: 600,
                  background: i === 2 ? 'rgba(255,255,255,0.08)' : undefined,
                  color: i === 2 ? 'var(--text)' : 'var(--text-3)',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }} className="mono-num">
              {loading ? '—' : formatCurrency(totalRevenue + 184200)}
            </span>
            <span className="badge badge-emerald"><TrendingUp size={12} /> +18.2%</span>
          </div>
          <AreaChart data={revenueData} color="#10b981" height={220} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 4px' }}>
            {months.map((m, i) => <span key={i} style={{ fontSize: 11, color: 'var(--text-4)' }}>{m}</span>)}
          </div>
        </div>

        {/* Side: channel split + inventory health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
          <div className="card card-pad reveal in" style={{ cursor: 'pointer' }} onClick={() => onNavigate('analytics')}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Channel mix</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 18 }}>Orders by source</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Web', value: 58, color: 'var(--emerald-500)' },
                { label: 'App', value: 27, color: 'var(--orange-500)' },
                { label: 'Boutique', value: 15, color: '#6366f1' },
              ].map((c, i) => (
                <ChannelBar key={c.label} {...c} delay={i * 0.1} />
              ))}
            </div>
          </div>
          <div className="card card-pad reveal in" style={{ cursor: 'pointer' }} onClick={() => onNavigate('inventory')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: '1.05rem' }}>Inventory health</h3>
              <span className="badge badge-emerald"><span className="badge-dot" /> live</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ProgressRing value={Math.min(100, (products.filter(p => p.status === 'active').length / Math.max(1, products.length)) * 100)} color="var(--emerald-400)" size={72} label="healthy" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <Row label="In stock" value={formatNumber(totalStock)} color="var(--emerald-400)" />
                <Row label="Low stock" value={String(products.filter(p => p.status === 'low').length)} color="var(--orange-400)" />
                <Row label="Out of stock" value={String(products.filter(p => p.status === 'out').length)} color="#fca5a5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity + recent orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--s-6)' }} className="two-col">
        <div className="card card-pad reveal in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>Recent orders</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginTop: 2 }}>{orders.length} in pipeline</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('orders')}>View all <ArrowUpRight size={14} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading ? (
              <>{[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)}</>
            ) : orders.slice(0, 5).map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => onNavigate('orders', { orderId: o.id })}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 'var(--r-md)', transition: 'background var(--dur-2)', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar name={o.customer} size={36} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--t-small)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.customer}</div>
                  <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{o.order_no} · {o.items} item{o.items > 1 ? 's' : ''}</div>
                </div>
                <StatusBadge status={o.status} />
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--t-small)' }} className="hide-sm">{formatCurrency(Number(o.total))}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card card-pad reveal in" style={{ cursor: 'pointer' }} onClick={() => onNavigate('analytics')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.05rem' }}>Engagement</h3>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>12 weeks</span>
          </div>
          <Heatmap weeks={12} rows={7} color="#10b981" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0.2, 0.4, 0.6, 0.8, 1].map(v => <span key={v} style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981', opacity: v }} />)}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBand({ orders, totalRevenue, recommendations, loading, onNavigate }: { orders: Order[]; totalRevenue: number; recommendations: Recommendation[]; loading: boolean; onNavigate: (view: View, opts?: NavigateOptions) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="card" style={{ position: 'relative', overflow: 'hidden', minHeight: 280, border: '1px solid var(--line)' }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: -80, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)', filter: 'blur(40px)', animation: 'float-slow 14s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: -120, left: 20, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)', filter: 'blur(40px)', animation: 'float-rev 16s ease-in-out infinite' }} />

      <div style={{ position: 'relative', padding: 'var(--s-12)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 'var(--s-8)', alignItems: 'center' }} className="hero-grid hero-grid-inner">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', fontSize: 'var(--t-tiny)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--emerald-300)', marginBottom: 16 }}
          >
            <Sparkles size={13} /> AI Insight · {recommendations.length} new picks
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 12 }}
          >
            Good evening, {BRAND.fullName}.<br />
            <span className="serif" style={{ color: 'var(--emerald-300)' }}>Your store is outpacing forecast by 18%.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            style={{ color: 'var(--text-2)', maxWidth: 520, marginBottom: 20, fontSize: 'var(--t-body)' }}
          >
            Revenue this period is {loading ? '—' : formatCurrency(totalRevenue + 184200)}, with {orders.length + 1284} orders across web, app and boutique channels. Three AI recommendations are ready to act on.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.24 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            className="hero-actions"
          >
            <button className="btn btn-primary" onClick={() => onNavigate('ai')}><Sparkles size={16} /> Review AI picks</button>
            <button className="btn btn-ghost" onClick={() => onNavigate('analytics')}>View report <ArrowUpRight size={16} /></button>
          </motion.div>
        </div>

        {/* Floating stat tiles */}
        <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, position: 'relative' }}>
          {[
            { label: 'Today', value: formatCurrency(18420), sub: '+12% vs avg', color: 'var(--emerald-400)' },
            { label: 'Avg order', value: formatCurrency(loading ? 0 : totalRevenue / Math.max(1, orders.length)), sub: 'steady', color: 'var(--orange-400)' },
            { label: 'Refund rate', value: '0.8%', sub: 'below target', color: 'var(--emerald-400)' },
            { label: 'New customers', value: '142', sub: '+8 today', color: 'var(--orange-400)' },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="glass"
              style={{ padding: 18, borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}
            >
              <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: t.color }} className="mono-num">{t.value}</div>
              <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', marginTop: 2 }}>{t.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi, index, loading }: { kpi: { label: string; value: number; prefix?: string; suffix?: string; delta: number; up: boolean; icon: typeof DollarSign; color: string; spark: number[]; glow: string }; index: number; loading: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const val = useCountUp(kpi.value, inView);
  const Icon = kpi.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="card"
      style={{ padding: 'var(--s-6)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${kpi.color.replace(')', ', 0.12)').replace('var(', 'rgba(')}, transparent 70%)`, filter: 'blur(20px)', opacity: 0.6 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
          <Icon size={18} color={kpi.color} />
        </div>
        <span className={`badge ${kpi.up ? 'badge-emerald' : 'badge-error'}`}>
          {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
        </span>
      </div>
      <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{kpi.label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }} className="mono-num">
        {loading ? '—' : `${kpi.prefix || ''}${kpi.suffix ? val.toFixed(1) : Math.round(val).toLocaleString()}${kpi.suffix || ''}`}
      </div>
      <div style={{ marginTop: 10 }}>
        <Sparkline data={kpi.spark} color={kpi.color.includes('emerald') ? '#10b981' : '#f97316'} width={200} height={32} />
      </div>
    </motion.div>
  );
}

function ChannelBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'var(--t-small)' }}>
        <span style={{ color: 'var(--text-2)' }}>{label}</span>
        <span style={{ fontWeight: 600 }} className="mono-num">{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', borderRadius: 999, background: color }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--t-small)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>
        <span style={{ width: 8, height: 8, borderRadius: 3, background: color }} /> {label}
      </span>
      <span style={{ fontWeight: 700 }} className="mono-num">{value}</span>
    </div>
  );
}

export function StatusBadge({ status }: { status: Order['status'] }) {
  const map: Record<Order['status'], { cls: string; label: string }> = {
    pending: { cls: 'badge-orange', label: 'Pending' },
    processing: { cls: 'badge-orange', label: 'Processing' },
    shipped: { cls: 'badge-neutral', label: 'Shipped' },
    delivered: { cls: 'badge-emerald', label: 'Delivered' },
    cancelled: { cls: 'badge-error', label: 'Cancelled' },
  };
  const s = map[status];
  return <span className={`badge ${s.cls}`} style={{ flexShrink: 0 }}><span className="badge-dot" /> {s.label}</span>;
}
