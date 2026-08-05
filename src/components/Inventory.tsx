import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, AlertTriangle, CheckCircle2, XCircle, Star, Plus, Grid3x3, List, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { type Product, type View, type NavigateOptions } from '../lib/types';
import { formatCurrency, formatNumber } from '../lib/data';
import { useReveal } from '../lib/hooks';
import { Modal } from './ui/Modal';

type CatFilter = 'all' | Product['category'];

export function Inventory({
  products, loading, onNavigate,
}: {
  products: Product[];
  loading: boolean;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [cat, setCat] = useState<CatFilter>('all');
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<'name' | 'price' | 'stock'>('stock');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (cat === 'all' || p.category === cat));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sort === 'price') cmp = Number(a.price) - Number(b.price);
      else if (sort === 'stock') cmp = a.stock - b.stock;
      else cmp = a.name.localeCompare(b.name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [products, cat, query, sort, sortDir]);

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    low: products.filter((p) => p.status === 'low').length,
    out: products.filter((p) => p.status === 'out').length,
    value: products.reduce((s, p) => s + Number(p.price) * p.stock, 0),
    units: products.reduce((s, p) => s + p.stock, 0),
  };

  const toggleSort = (c: 'name' | 'price' | 'stock') => {
    if (sort === c) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(c); setSortDir('desc'); }
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--s-4)' }}>
        {[
          { label: 'Total SKUs', value: String(stats.total), icon: Package, color: 'var(--emerald-400)' },
          { label: 'Inventory value', value: formatCurrency(stats.value), icon: CheckCircle2, color: 'var(--orange-400)' },
          { label: 'Units in stock', value: formatNumber(stats.units), icon: Package, color: 'var(--emerald-400)' },
          { label: 'Low stock', value: String(stats.low), icon: AlertTriangle, color: 'var(--orange-400)' },
          { label: 'Out of stock', value: String(stats.out), icon: XCircle, color: '#fca5a5' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="card"
              style={{ padding: 'var(--s-5)', cursor: s.label === 'Low stock' || s.label === 'Out of stock' ? 'pointer' : undefined }}
              onClick={() => {
                if (s.label === 'Low stock' || s.label === 'Out of stock') onNavigate('inventory');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center' }}>
                  <Icon size={16} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, marginTop: 2, letterSpacing: '-0.02em' }} className="mono-num">{s.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 40, borderRadius: 'var(--r-full)', border: '1px solid var(--line)', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={16} color="var(--text-3)" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 'var(--t-small)', flex: 1, minWidth: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'fashion', 'electronics', 'lifestyle'] as CatFilter[]).map((f) => (
            <button key={f} onClick={() => setCat(f)} className="btn btn-sm" style={{
              background: cat === f ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
              border: '1px solid ' + (cat === f ? 'rgba(16,185,129,0.3)' : 'var(--line)'),
              color: cat === f ? 'var(--emerald-300)' : 'var(--text-2)',
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 'var(--r-full)', padding: 3 }}>
          <button onClick={() => setLayout('grid')} className="btn-icon-sm" style={{ width: 32, height: 32, background: layout === 'grid' ? 'rgba(255,255,255,0.08)' : 'transparent' }} aria-label="Grid"><Grid3x3 size={15} /></button>
          <button onClick={() => setLayout('list')} className="btn-icon-sm" style={{ width: 32, height: 32, background: layout === 'list' ? 'rgba(255,255,255,0.08)' : 'transparent' }} aria-label="List"><List size={15} /></button>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}><Plus size={15} /> Add product</button>
      </div>

      {/* Sort row (list only) */}
      {layout === 'list' && (
        <div className="card" style={{ padding: '12px 20px', display: 'flex', gap: 20, alignItems: 'center', fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          <button onClick={() => toggleSort('name')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: sort === 'name' ? 'var(--text)' : 'inherit' }}>Product <ArrowUpDown size={11} /></button>
          <span style={{ marginLeft: 'auto' }} />
          <button onClick={() => toggleSort('price')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: sort === 'price' ? 'var(--text)' : 'inherit' }}>Price <ArrowUpDown size={11} /></button>
          <button onClick={() => toggleSort('stock')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: sort === 'stock' ? 'var(--text)' : 'inherit' }}>Stock <ArrowUpDown size={11} /></button>
        </div>
      )}

      {/* Products */}
      {layout === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--s-5)' }}>
          <AnimatePresence mode="popLayout">
            {loading
              ? [0,1,2,3,4,5].map(i => <div key={i} className="card" style={{ height: 360, borderRadius: 'var(--r-lg)' }}><div className="skeleton" style={{ height: '100%', borderRadius: 'var(--r-lg)' }} /></div>)
              : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-small)' }}>
              <tbody>
                {loading
                  ? [0,1,2,3,4].map(i => <tr key={i} style={{ borderBottom: '1px solid var(--line-soft)' }}><td colSpan={5} style={{ padding: '14px 20px' }}><div className="skeleton" style={{ height: 22 }} /></td></tr>)
                  : filtered.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.04, 0.4) }} style={{ borderBottom: '1px solid var(--line-soft)', transition: 'background var(--dur-2)' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />}
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'capitalize' }}>{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700 }} className="mono-num">{formatCurrency(Number(p.price))}</td>
                      <td style={{ padding: '12px 12px' }}><StockPill product={p} /></td>
                      <td style={{ padding: '12px 12px' }} className="hide-sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-2)' }}><Star size={13} color="var(--orange-400)" fill="var(--orange-400)" /> {p.rating}</span></td>
                      <td style={{ padding: '12px 20px', textAlign: 'right' }} className="mono-num">{p.stock}</td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card card-pad" style={{ textAlign: 'center', padding: 'var(--s-16)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Package size={24} color="var(--text-3)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No products found</h3>
          <p style={{ color: 'var(--text-3)' }}>Try a different category or search term.</p>
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add product" subtitle="Create a new SKU in your catalog">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Product name</span>
            <input className="input" placeholder="Cashmere Wrap Coat" required />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="two-col">
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Category</span>
              <select className="input"><option value="fashion">Fashion</option><option value="electronics">Electronics</option><option value="lifestyle">Lifestyle</option></select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Price ($)</span>
              <input className="input" type="number" placeholder="0" min="0" required />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Initial stock</span>
            <input className="input" type="number" placeholder="0" min="0" required />
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add product</button>
            <button type="button" className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const accentColor = product.accent === 'emerald' ? 'var(--emerald-400)' : 'var(--orange-400)';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.5), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--ink-3)' }}>
        {product.image_url && (
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s var(--ease)' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.07)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,11,0.7))' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span className="badge" style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--text)', border: '1px solid var(--line)', textTransform: 'capitalize', backdropFilter: 'blur(8px)' }}>{product.category}</span>
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <StockDot product={product} />
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--t-tiny)', color: 'var(--text-2)' }}>
          <Star size={12} color="var(--orange-400)" fill="var(--orange-400)" /> {product.rating}
        </div>
      </div>

      <div style={{ padding: 'var(--s-5)', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{ fontSize: 'var(--t-body)', lineHeight: 1.25, fontWeight: 600 }}>{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div>
            <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Price</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: accentColor, letterSpacing: '-0.02em' }} className="mono-num">{formatCurrency(Number(product.price))}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stock</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }} className="mono-num">{product.stock}</div>
          </div>
        </div>
        <StockBar product={product} />
      </div>
    </motion.div>
  );
}

function StockDot({ product }: { product: Product }) {
  const map = {
    active: { color: 'var(--emerald-400)', label: 'Active' },
    low: { color: 'var(--orange-400)', label: 'Low' },
    out: { color: '#fca5a5', label: 'Out' },
  } as const;
  const s = map[product.status];
  return (
    <span className="badge" style={{ background: 'rgba(0,0,0,0.5)', color: s.color, border: `1px solid ${s.color.replace(')', ', 0.3)').replace('var(', 'rgba(')}`, backdropFilter: 'blur(8px)' }}>
      <span className="badge-dot" /> {s.label}
    </span>
  );
}

function StockPill({ product }: { product: Product }) {
  const map = {
    active: { cls: 'badge-emerald', label: 'In stock' },
    low: { cls: 'badge-orange', label: 'Low stock' },
    out: { cls: 'badge-error', label: 'Out of stock' },
  } as const;
  const s = map[product.status];
  return <span className={`badge ${s.cls}`}><span className="badge-dot" /> {s.label}</span>;
}

function StockBar({ product }: { product: Product }) {
  const pct = Math.min(100, (product.stock / 60) * 100);
  const color = product.status === 'out' ? '#fca5a5' : product.status === 'low' ? 'var(--orange-400)' : 'var(--emerald-400)';
  return (
    <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', borderRadius: 999, background: color }} />
    </div>
  );
}
