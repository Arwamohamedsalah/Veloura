import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Download, ChevronDown, MoreHorizontal, ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, Package } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { type Order, type View, type NavigateOptions } from '../lib/types';
import { formatCurrency } from '../lib/data';
import { useReveal } from '../lib/hooks';
import { StatusBadge } from './Overview';
import { OrderDetailPanel } from './ui/OrderDetailPanel';
import { Avatar } from './ui/Avatar';

type Filter = 'all' | Order['status'];

const FILTERS: { id: Filter; label: string; icon?: typeof CheckCircle2 }[] = [
  { id: 'all', label: 'All orders' },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  { id: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export function Orders({
  orders, loading, initialFilter = 'all', initialOrderId = null, onNavigate,
}: {
  orders: Order[];
  loading: boolean;
  initialFilter?: Filter;
  initialOrderId?: string | null;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'date' | 'total' | 'items'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string | null>(initialOrderId);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedOrder = orders.find((o) => o.id === selected) ?? null;

  useEffect(() => { setFilter(initialFilter); }, [initialFilter]);
  useEffect(() => { if (initialOrderId) setSelected(initialOrderId); }, [initialOrderId]);

  const filtered = useMemo(() => {
    let list = orders.filter((o) => (filter === 'all' || o.status === filter));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => o.customer.toLowerCase().includes(q) || o.order_no.toLowerCase().includes(q) || (o.location || '').toLowerCase().includes(q));
    }
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sort === 'total') cmp = Number(a.total) - Number(b.total);
      else if (sort === 'items') cmp = a.items - b.items;
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [orders, filter, query, sort, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] || 0) + 1;
    return c;
  }, [orders]);

  const totalRevenue = filtered.reduce((s, o) => s + Number(o.total), 0);

  const toggleSort = (col: 'date' | 'total' | 'items') => {
    if (sort === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(col); setSortDir('desc'); }
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--s-4)' }}>
        {[
          { label: 'Total orders', value: String(orders.length), color: 'var(--emerald-400)' },
          { label: 'Filtered revenue', value: formatCurrency(totalRevenue), color: 'var(--orange-400)' },
          { label: 'Avg order value', value: formatCurrency(orders.length ? orders.reduce((s, o) => s + Number(o.total), 0) / orders.length : 0), color: 'var(--emerald-400)' },
          { label: 'Pending action', value: String(orders.filter((o) => o.status === 'pending' || o.status === 'processing').length), color: 'var(--orange-400)' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            className="card"
            style={{ padding: 'var(--s-5)' }}
          >
            <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, marginTop: 4, letterSpacing: '-0.02em' }} className="mono-num">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="btn btn-sm"
              style={{
                background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                border: '1px solid ' + (active ? 'rgba(16,185,129,0.3)' : 'var(--line)'),
                color: active ? 'var(--emerald-300)' : 'var(--text-2)',
              }}
            >
              {Icon && <Icon size={14} />} {f.label}
              <span style={{ marginLeft: 4, opacity: 0.6, fontSize: 'var(--t-tiny)' }}>{counts[f.id] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 40, borderRadius: 'var(--r-full)', border: '1px solid var(--line)', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={16} color="var(--text-3)" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by customer, order #, or city…" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 'var(--t-small)', flex: 1, minWidth: 0 }} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setFiltersOpen((v) => !v)}><SlidersHorizontal size={15} /> Filters</button>
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('analytics')}><Download size={15} /> Export</button>
      </div>

      {filtersOpen && (
        <div className="card" style={{ padding: 'var(--s-5)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', width: '100%', marginBottom: 4 }}>Quick filters</span>
          {FILTERS.slice(1).map((f) => (
            <button key={f.id} className="btn btn-sm btn-ghost" onClick={() => { setFilter(f.id); setFiltersOpen(false); }}>{f.label}</button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-small)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <Th label="Order" />
                <Th label="Customer" />
                <Th label="Channel" className="hide-sm" />
                <Th label="Date" className="hide-sm" />
                <SortTh label="Items" active={sort === 'items'} dir={sortDir} onClick={() => toggleSort('items')} className="hide-sm" />
                <SortTh label="Total" active={sort === 'total'} dir={sortDir} onClick={() => toggleSort('total')} align="right" />
                <Th label="Status" />
                <th style={{ width: 48 }} />
              </tr>
            </thead>
            <tbody>
              {loading
                ? [0, 1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                    <td colSpan={8} style={{ padding: '14px 20px' }}><div className="skeleton" style={{ height: 22 }} /></td>
                  </tr>
                ))
                : filtered.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    onClick={() => setSelected(selected === o.id ? null : o.id)}
                    style={{ borderBottom: '1px solid var(--line-soft)', cursor: 'pointer', transition: 'background var(--dur-2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)' }}>{o.order_no}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={o.customer} size={32} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{o.customer}</div>
                          <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{o.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }} className="hide-sm"><ChannelPill channel={o.channel} /></td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-3)' }} className="hide-sm">{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-2)' }} className="hide-sm mono-num">{o.items}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700 }} className="mono-num">{formatCurrency(Number(o.total))}</td>
                    <td style={{ padding: '14px 12px' }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: '14px 12px' }}>
                      <button className="btn-icon-sm" style={{ width: 28, height: 28 }} aria-label="More"><MoreHorizontal size={15} /></button>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 'var(--s-16)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Search size={24} color="var(--text-3)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No orders match</h3>
            <p style={{ color: 'var(--text-3)' }}>Try a different filter or search term.</p>
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--line)', fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>
            <span>Showing {filtered.length} of {orders.length}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-icon-sm btn-ghost" aria-label="Previous"><ChevronDown size={15} style={{ transform: 'rotate(90deg)' }} /></button>
              <button className="btn-icon-sm btn-ghost" aria-label="Next"><ChevronDown size={15} style={{ transform: 'rotate(-90deg)' }} /></button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailPanel order={selectedOrder} onClose={() => setSelected(null)} />
    </div>
  );
}

function Th({ label, className }: { label: string; className?: string }) {
  return <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }} className={className}>{label}</th>;
}

function SortTh({ label, active, dir, onClick, align, className }: { label: string; active: boolean; dir: 'asc' | 'desc'; onClick: () => void; align?: 'right'; className?: string }) {
  return (
    <th style={{ padding: '14px 12px', textAlign: align === 'right' ? 'right' : 'left', fontSize: 'var(--t-tiny)', color: active ? 'var(--text)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }} className={className}>
      <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', fontWeight: 'inherit' }}>
        {label} <ArrowUpDown size={12} style={{ opacity: active ? 1 : 0.4, transform: dir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-2)' }} />
      </button>
    </th>
  );
}

function ChannelPill({ channel }: { channel: Order['channel'] }) {
  const map = {
    web: { label: 'Web', color: 'var(--emerald-300)', bg: 'rgba(16,185,129,0.12)' },
    app: { label: 'App', color: 'var(--orange-300)', bg: 'rgba(249,115,22,0.12)' },
    boutique: { label: 'Boutique', color: '#a5b4fc', bg: 'rgba(99,102,241,0.12)' },
  } as const;
  const c = map[channel];
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 'var(--t-tiny)', fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.bg}` }}>{c.label}</span>;
}
