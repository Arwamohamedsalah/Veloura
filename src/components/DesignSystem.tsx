import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useReveal } from '../lib/hooks';
import { Sparkline } from '../lib/charts';
import type { View, NavigateOptions } from '../lib/types';
import { BRAND } from '../lib/brand';

const SWATCHES = [
  { name: 'Ink', token: '--ink', hex: '#0a0a0b' },
  { name: 'Ink 2', token: '--ink-2', hex: '#141416' },
  { name: 'Emerald', token: '--emerald-500', hex: '#10b981' },
  { name: 'Emerald Light', token: '--emerald-400', hex: '#34d399' },
  { name: 'Orange', token: '--orange-500', hex: '#f97316' },
  { name: 'Orange Light', token: '--orange-400', hex: '#fb923c' },
  { name: 'Paper', token: '--paper', hex: '#faf9f7' },
  { name: 'Error', token: '--error', hex: '#ef4444' },
];

export function DesignSystem({ onNavigate }: { onNavigate: (view: View, opts?: NavigateOptions) => void }) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }}>
      <header className="reveal in">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => onNavigate('help')}>
          <ArrowLeft size={14} /> Back to Help Center
        </button>
        <span className="badge badge-emerald" style={{ marginBottom: 12 }}>{BRAND.name} DS · v1.0</span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Design <span className="serif" style={{ color: 'var(--emerald-300)' }}>system</span>
        </h2>
        <p style={{ color: 'var(--text-2)', maxWidth: 640, lineHeight: 1.6 }}>
          Tokens, components, and patterns powering {BRAND.name} {BRAND.tagline}. Built on an 8px spacing grid, 12-column layout, and WCAG AA contrast ratios.
        </p>
      </header>

      {/* Colors */}
      <Section title="Color palette" subtitle="Semantic ramps with emerald primary and orange accent">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {SWATCHES.map((s, i) => (
            <motion.div
              key={s.token}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="card"
              style={{ overflow: 'hidden' }}
            >
              <div style={{ height: 72, background: `var(${s.token})` }} />
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--t-small)' }}>{s.name}</div>
                <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', fontFamily: 'monospace' }}>{s.hex}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" subtitle="Manrope for UI · Instrument Serif for editorial accents">
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div><span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.1em' }}>DISPLAY</span><p style={{ fontSize: 'var(--t-display)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{BRAND.name} {BRAND.tagline}</p></div>
          <div><span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.1em' }}>H1</span><p style={{ fontSize: 'var(--t-h1)', fontWeight: 700, letterSpacing: '-0.02em' }}>Store performance</p></div>
          <div><span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.1em' }}>H2</span><p style={{ fontSize: 'var(--t-h2)', fontWeight: 600 }}>Revenue analytics</p></div>
          <div><span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.1em' }}>SERIF ACCENT</span><p className="serif" style={{ fontSize: 'var(--t-h2)', color: 'var(--emerald-300)' }}>outpacing forecast by 18%</p></div>
          <div><span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-4)', letterSpacing: '0.1em' }}>BODY</span><p style={{ fontSize: 'var(--t-body)', color: 'var(--text-2)', maxWidth: 480 }}>Every pick is scored on conversion lift and confidence. Accept to push it to your storefront.</p></div>
        </div>
      </Section>

      {/* Spacing & radius */}
      <Section title="Spacing & radius" subtitle="8px base unit · consistent corner radii">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--s-6)' }}>
          <div className="card card-pad">
            <h4 style={{ fontSize: 'var(--t-small)', marginBottom: 16, color: 'var(--text-3)' }}>Spacing scale</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[4, 8, 12, 16, 24, 32, 48, 64, 80].map((px) => (
                <div key={px} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: px, height: 16, background: 'var(--emerald-500)', borderRadius: 2, opacity: 0.7 }} />
                  <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', fontFamily: 'monospace' }}>{px}px</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h4 style={{ fontSize: 'var(--t-small)', marginBottom: 16, color: 'var(--text-3)' }}>Border radius</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { label: 'xs 6', r: 'var(--r-xs)' },
                { label: 'sm 10', r: 'var(--r-sm)' },
                { label: 'md 14', r: 'var(--r-md)' },
                { label: 'lg 20', r: 'var(--r-lg)' },
                { label: 'xl 28', r: 'var(--r-xl)' },
                { label: 'full', r: 'var(--r-full)' },
              ].map((x) => (
                <div key={x.label} style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: x.r, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', marginBottom: 6 }} />
                  <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{x.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons" subtitle="Primary, accent, ghost, and size variants">
        <div className="card card-pad" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-ghost">Ghost</button>
          <button className="btn btn-light">Light</button>
          <button className="btn btn-primary btn-sm">Small</button>
          <button className="btn btn-primary btn-lg">Large</button>
          <button className="btn btn-icon btn-primary" aria-label="Icon">+</button>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs" subtitle="Form controls with focus states">
        <div className="card card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Text input</span>
            <input className="input" placeholder="Enter value…" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select</span>
            <select className="input"><option>Fashion</option><option>Electronics</option></select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Search</span>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 44, borderRadius: 'var(--r-full)', border: '1px solid var(--line)' }}>
              <input className="input-ghost" placeholder="Search…" style={{ flex: 1 }} />
            </div>
          </label>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges" subtitle="Status indicators and labels">
        <div className="card card-pad" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <span className="badge badge-emerald"><span className="badge-dot" /> Emerald</span>
          <span className="badge badge-orange"><span className="badge-dot" /> Orange</span>
          <span className="badge badge-neutral">Neutral</span>
          <span className="badge badge-error"><span className="badge-dot" /> Error</span>
        </div>
      </Section>

      {/* Cards & shadows */}
      <Section title="Cards & elevation" subtitle="Layered surfaces with subtle borders">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div className="card card-pad"><div style={{ fontWeight: 600, marginBottom: 4 }}>Default card</div><p style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)' }}>Ink-2 background, line border</p></div>
          <div className="glass card-pad" style={{ borderRadius: 'var(--r-xl)' }}><div style={{ fontWeight: 600, marginBottom: 4 }}>Glass card</div><p style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)' }}>Blur + gradient fill</p></div>
          <div style={{ padding: 24, borderRadius: 'var(--r-xl)', background: 'var(--ink-2)', boxShadow: 'var(--shadow-lg)' }}><div style={{ fontWeight: 600, marginBottom: 4 }}>Elevated</div><p style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)' }}>Shadow-lg depth</p></div>
        </div>
      </Section>

      {/* Charts preview */}
      <Section title="Data visualization" subtitle="Sparklines and animated charts">
        <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Sparkline data={[30, 35, 32, 40, 38, 45, 52, 48, 60, 58, 72, 80]} color="#10b981" width={160} height={40} />
          <Sparkline data={[20, 25, 30, 28, 35, 32, 40, 45, 42, 50, 55, 60]} color="#f97316" width={160} height={40} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))' }} />
            </div>
            <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', marginTop: 6, display: 'block' }}>Progress bar · 72%</span>
          </div>
        </div>
      </Section>

      {/* Skeleton */}
      <Section title="Loading states" subtitle="Skeleton shimmer for async content">
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton" style={{ height: 20, width: '40%' }} />
          <div className="skeleton" style={{ height: 14, width: '70%' }} />
          <div className="skeleton" style={{ height: 120, borderRadius: 'var(--r-lg)' }} />
        </div>
      </Section>

      {/* 12-col grid demo */}
      <Section title="12-column grid" subtitle="Invisible layout system · responsive breakpoints">
        <div className="grid-12 card-pad card" style={{ gap: 8 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ height: 48, background: 'rgba(16,185,129,0.12)', borderRadius: 'var(--r-sm)', border: '1px dashed rgba(16,185,129,0.25)', display: 'grid', placeItems: 'center', fontSize: 10, color: 'var(--emerald-400)' }}>
              {i + 1}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="reveal in">
      <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>{title}</h3>
      <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 20 }}>{subtitle}</p>
      {children}
    </section>
  );
}
