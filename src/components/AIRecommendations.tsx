import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight, Check, X, Brain, Target } from 'lucide-react';
import { useState } from 'react';
import { type Recommendation, type View, type NavigateOptions } from '../lib/types';
import { useReveal, useInView } from '../lib/hooks';
import { BRAND } from '../lib/brand';

export function AIRecommendations({
  recommendations, loading, onNavigate,
}: {
  recommendations: Recommendation[];
  loading: boolean;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'fashion' | 'electronics' | 'lifestyle'>('all');

  const visible = recommendations.filter((r) => !dismissed.includes(r.id) && (filter === 'all' || r.category === filter));
  const stats = {
    total: recommendations.length,
    avgLift: recommendations.length ? recommendations.reduce((s, r) => s + Number(r.lift), 0) / recommendations.length : 0,
    accepted: accepted.length,
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      {/* AI Hero */}
      <AIHero stats={stats} loading={loading} />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginRight: 4 }}>Category</span>
        {(['all', 'fashion', 'electronics', 'lifestyle'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn btn-sm"
            style={{
              background: filter === f ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
              border: '1px solid ' + (filter === f ? 'rgba(16,185,129,0.3)' : 'var(--line)'),
              color: filter === f ? 'var(--emerald-300)' : 'var(--text-2)',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recommendations grid */}
      <div className="rec-grid">
        <AnimatePresence mode="popLayout">
          {loading
            ? [0, 1, 2].map((i) => <div key={i} className="card" style={{ height: 360, borderRadius: 'var(--r-xl)' }}><div className="skeleton" style={{ height: '100%', borderRadius: 'var(--r-xl)' }} /></div>)
            : visible.map((rec, i) => (
              <RecCard
                key={rec.id}
                rec={rec}
                index={i}
                accepted={accepted.includes(rec.id)}
                onAccept={() => setAccepted((a) => [...a, rec.id])}
                onDismiss={() => setDismissed((d) => [...d, rec.id])}
              />
            ))}
        </AnimatePresence>
      </div>

      {!loading && visible.length === 0 && (
        <div className="card card-pad" style={{ textAlign: 'center', padding: 'var(--s-16)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Check size={26} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 6 }}>All caught up</h3>
          <p style={{ color: 'var(--text-3)', maxWidth: 380, margin: '0 auto' }}>You've reviewed every recommendation in this category. New picks arrive as your store data refreshes.</p>
        </div>
      )}

      {/* Insight strip */}
      <InsightStrip onNavigate={onNavigate} />
    </div>
  );
}

function AIHero({ stats, loading }: { stats: { total: number; avgLift: number; accepted: number }; loading: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="card" style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--line)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 120% at 0% 0%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(80% 120% at 100% 100%, rgba(249,115,22,0.14), transparent 55%)' }} />
      <div style={{ position: 'relative', padding: 'var(--s-12)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--s-8)', alignItems: 'center' }} className="hero-grid">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 'var(--t-tiny)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--emerald-300)', marginBottom: 16 }}
          >
            <Brain size={13} /> {BRAND.ai} · merchandising engine
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: 12 }}
          >
            Recommendations engineered<br />
            <span className="serif" style={{ color: 'var(--emerald-300)' }}>from your store's live signal.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.16 }}
            style={{ color: 'var(--text-2)', maxWidth: 520, marginBottom: 20 }}
          >
            Every pick is scored on conversion lift and confidence. Accept to push it to your storefront, or dismiss to train the model.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Active picks', value: loading ? '—' : String(stats.total), icon: Sparkles, color: 'var(--emerald-400)' },
            { label: 'Avg lift', value: loading ? '—' : `${stats.avgLift.toFixed(1)}%`, icon: TrendingUp, color: 'var(--orange-400)' },
            { label: 'Accepted', value: String(stats.accepted), icon: Check, color: 'var(--emerald-400)' },
            { label: 'Model version', value: 'v4.2', icon: Target, color: 'var(--orange-400)' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.94 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
                className="glass"
                style={{ padding: 16, borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}
              >
                <Icon size={16} color={s.color} />
                <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 8, letterSpacing: '-0.02em' }} className="mono-num">{s.value}</div>
                <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RecCard({
  rec, index, accepted, onAccept, onDismiss,
}: {
  rec: Recommendation; index: number; accepted: boolean; onAccept: () => void; onDismiss: () => void;
}) {
  const accentColor = rec.accent === 'emerald' ? 'var(--emerald-400)' : 'var(--orange-400)';
  const accentBg = rec.accent === 'emerald' ? 'rgba(16,185,129,0.12)' : 'rgba(249,115,22,0.12)';
  const img = rec.image_url || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'var(--ink-3)' }}>
        {img && <img src={img} alt={rec.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s var(--ease)' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,11,0.85))' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
          <span className="badge" style={{ background: accentBg, color: accentColor, border: `1px solid ${accentColor.replace(')', ', 0.3)').replace('var(', 'rgba(')}`, textTransform: 'capitalize' }}>
            {rec.category}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--t-tiny)', color: 'var(--text-2)' }}>
            <Sparkles size={12} color={accentColor} /> AI pick
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>est. lift</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: accentColor, lineHeight: 1 }} className="mono-num">+{Number(rec.lift).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--s-6)', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <h3 style={{ fontSize: '1.05rem', lineHeight: 1.25 }}>{rec.title}</h3>
        <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)', lineHeight: 1.5, flex: 1 }}>{rec.reason}</p>

        {/* Confidence bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-tiny)', marginBottom: 5 }}>
            <span style={{ color: 'var(--text-3)' }}>Confidence</span>
            <span style={{ fontWeight: 600, color: accentColor }} className="mono-num">{Math.round(Number(rec.confidence) * 100)}%</span>
          </div>
          <ConfidenceBar value={Number(rec.confidence) * 100} color={accentColor} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {accepted ? (
            <button className="btn btn-sm" style={{ flex: 1, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--emerald-300)' }}>
              <Check size={15} /> Accepted
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={onAccept}>
              <Zap size={15} /> Accept
            </button>
          )}
          <button className="btn-icon-sm btn-ghost" onClick={onDismiss} aria-label="Dismiss"><X size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  return (
    <div ref={ref} style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%', borderRadius: 999, background: color }}
      />
    </div>
  );
}

function InsightStrip({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="card reveal in insight-strip" style={{ padding: 'var(--s-8)' }}>
      <div className="insight-icon" style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(249,115,22,0.15))', display: 'grid', placeItems: 'center' }}>
        <Brain size={22} color="var(--emerald-300)" />
      </div>
      <div className="insight-body">
        <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>How {BRAND.ai} scores picks</h3>
        <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)', maxWidth: 640 }}>
          Each recommendation blends sales velocity, browse intent, inventory health and lookalike-audience signals. Lift is the projected conversion change; confidence is the model's certainty given sample size.
        </p>
      </div>
      <button className="btn btn-ghost btn-sm insight-learn" onClick={() => onNavigate('help')}>Learn more <ArrowRight size={14} /></button>
    </div>
  );
}
