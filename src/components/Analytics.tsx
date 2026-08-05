import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Globe, Smartphone, Store, Users, Clock, ShoppingBag } from 'lucide-react';
import { type Product, type View } from '../lib/types';
import { formatCurrency, formatNumber } from '../lib/data';
import { useReveal, useInView, useCountUp } from '../lib/hooks';
import { AreaChart, BarChart, Donut } from '../lib/charts';

export function Analytics({ products, loading, onNavigate }: { products: Product[]; loading: boolean; onNavigate: (view: View) => void }) {
  const ref = useReveal<HTMLDivElement>();

  const revenueData = [38, 42, 48, 45, 52, 58, 55, 62, 68, 72, 78, 86];
  const ordersData = [120, 145, 132, 168, 158, 182, 175, 198, 210, 225, 242, 268];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const categoryRevenue = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + Number(p.price) * Math.max(1, p.stock) * 0.4;
    return acc;
  }, {} as Record<string, number>);

  const donutSegments = [
    { label: 'Fashion', value: Math.round(categoryRevenue.fashion || 0), color: '#10b981' },
    { label: 'Electronics', value: Math.round(categoryRevenue.electronics || 0), color: '#f97316' },
    { label: 'Lifestyle', value: Math.round(categoryRevenue.lifestyle || 0), color: '#6366f1' },
  ];

  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const maxRev = Math.max(...topProducts.map((p) => Number(p.price) * 10));

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--s-5)' }}>
        {[
          { label: 'Gross revenue', value: 1284200, prefix: '$', delta: 22.1, up: true, icon: TrendingUp },
          { label: 'Sessions', value: 184200, delta: 14.6, up: true, icon: Users },
          { label: 'Avg session', value: '4m 12s', delta: 6.3, up: true, icon: Clock, raw: true },
          { label: 'Bounce rate', value: 32, suffix: '%', delta: -2.1, up: true, icon: TrendingDown },
          { label: 'Cart abandon', value: 18, suffix: '%', delta: -3.4, up: true, icon: ShoppingBag },
        ].map((k, i) => <AnalyticsKpi key={k.label} kpi={k} index={i} loading={loading} />)}
      </div>

      {/* Revenue vs Orders */}
      <div className="card card-pad reveal in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Revenue & order volume</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginTop: 2 }}>12-month trend · dual axis</p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 'var(--t-small)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }} /> Revenue</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#f97316' }} /> Orders</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-6)' }} className="two-col">
          <div>
            <AreaChart data={revenueData} color="#10b981" height={240} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              {monthLabels.map((m) => <span key={m} style={{ fontSize: 11, color: 'var(--text-4)' }}>{m[0]}</span>)}
            </div>
          </div>
          <div>
            <BarChart data={ordersData} labels={monthLabels.map((m) => m[0])} color="#f97316" height={240} />
          </div>
        </div>
      </div>

      {/* Category split + Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 'var(--s-6)' }} className="two-col">
        <div className="card card-pad reveal in">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Revenue by category</h3>
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 20 }}>Inventory-weighted distribution</p>
          <Donut segments={donutSegments} size={200} />
        </div>

        <div className="card card-pad reveal in">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Traffic sources</h3>
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 20 }}>Where sessions originate</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Organic search', value: 42, icon: Globe, color: 'var(--emerald-400)' },
              { label: 'Mobile app', value: 28, icon: Smartphone, color: 'var(--orange-400)' },
              { label: 'Boutique referral', value: 18, icon: Store, color: '#818cf8' },
              { label: 'Direct', value: 12, icon: Users, color: 'var(--emerald-400)' },
            ].map((c, i) => <TrafficBar key={c.label} {...c} delay={i * 0.1} />)}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card card-pad reveal in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Top performing products</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginTop: 2 }}>Ranked by rating × velocity</p>
          </div>
          <span className="badge badge-emerald" style={{ cursor: 'pointer' }} onClick={() => onNavigate('inventory')}><TrendingUp size={12} /> trending</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {loading ? [0,1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 48 }} />) : topProducts.map((p, i) => {
            const rev = Number(p.price) * 10;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                className="analytics-product-row"
              >
                <span style={{ width: 24, fontSize: 'var(--t-small)', fontWeight: 700, color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
                <div style={{ minWidth: 0, flex: '0 1 200px' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--t-small)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'capitalize' }}>{p.category} · {p.rating}★</div>
                </div>
                <div className="product-bar" style={{ flex: 1, maxWidth: 280, margin: '0 16px' }}>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(rev / maxRev) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', borderRadius: 999, background: p.accent === 'emerald' ? 'var(--emerald-500)' : 'var(--orange-500)' }}
                    />
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--t-small)', minWidth: 80, textAlign: 'right' }}>{formatCurrency(rev)}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cohort / geography */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--s-6)' }} className="two-col">
        <div className="card card-pad reveal in">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 18 }}>Top regions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { region: 'North America', revenue: 482000, share: 38 },
              { region: 'Europe', revenue: 396000, share: 31 },
              { region: 'Asia Pacific', revenue: 268000, share: 21 },
              { region: 'Middle East', revenue: 92000, share: 7 },
              { region: 'Other', revenue: 42000, share: 3 },
            ].map((r, i) => (
              <RegionRow key={r.region} {...r} delay={i * 0.08} />
            ))}
          </div>
        </div>

        <div className="card card-pad reveal in">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Conversion funnel</h3>
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 18 }}>Session → purchase</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { stage: 'Sessions', value: 184200, pct: 100, color: 'var(--emerald-500)' },
              { stage: 'Product views', value: 112800, pct: 61, color: 'var(--emerald-400)' },
              { stage: 'Add to cart', value: 42600, pct: 23, color: 'var(--orange-500)' },
              { stage: 'Checkout', value: 21800, pct: 12, color: 'var(--orange-400)' },
              { stage: 'Purchase', value: 14200, pct: 7.7, color: 'var(--emerald-600)' },
            ].map((s, i) => (
              <FunnelRow key={s.stage} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsKpi({ kpi, index, loading }: { kpi: { label: string; value: number | string; prefix?: string; suffix?: string; delta: number; up: boolean; icon: typeof TrendingUp; raw?: boolean }; index: number; loading: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const Icon = kpi.icon;
  const isNum = typeof kpi.value === 'number';
  const val = useCountUp(isNum ? (kpi.value as number) : 0, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="card"
      style={{ padding: 'var(--s-5)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center' }}>
          <Icon size={16} color="var(--text-2)" />
        </div>
        <span className={`badge ${kpi.up ? 'badge-emerald' : 'badge-error'}`}>
          {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {kpi.delta > 0 ? '+' : ''}{kpi.delta}{kpi.suffix === '%' ? 'pp' : '%'}
        </span>
      </div>
      <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{kpi.label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }} className="mono-num">
        {loading ? '—' : kpi.raw ? kpi.value : `${kpi.prefix || ''}${isNum ? formatNumber(Math.round(val)) : kpi.value}${kpi.suffix || ''}`}
      </div>
    </motion.div>
  );
}

function TrafficBar({ label, value, icon, color, delay }: { label: string; value: number; icon: typeof Globe; color: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const Icon = icon;
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Icon size={15} color={color} />
        <span style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)' }}>{label}</span>
        <span style={{ marginLeft: 'auto', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }} className="mono-num">{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', borderRadius: 999, background: color }} />
      </div>
    </div>
  );
}

function RegionRow({ region, revenue, share, delay }: { region: string; revenue: number; share: number; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 'var(--t-small)', flex: '0 0 120px', color: 'var(--text-2)' }}>{region}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${share}%` } : {}} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))' }} />
      </div>
      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--t-small)', minWidth: 80, textAlign: 'right' }}>{formatCurrency(revenue)}</span>
    </div>
  );
}

function FunnelRow({ stage, value, pct, color, delay }: { stage: string; value: number; pct: number; color: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-small)', marginBottom: 5 }}>
        <span style={{ color: 'var(--text-2)' }}>{stage}</span>
        <span style={{ fontWeight: 600 }} className="mono-num">{formatNumber(value)} · {pct}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', borderRadius: 6, background: color }} />
      </div>
    </div>
  );
}
