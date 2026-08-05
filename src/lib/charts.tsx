import { useEffect, useState } from 'react';
import { useInView } from './hooks';

/* ===== Area / Line chart ===== */
export function AreaChart({
  data,
  color = '#10b981',
  height = 220,
  showGrid = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const w = 760;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 16 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.12;
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * iw;
    const y = pad.top + ih - ((d - min) / range) * ih;
    return [x, y] as const;
  });
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${pad.top + ih} L${pts[0][0]},${pad.top + ih} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`area-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showGrid &&
          gridLines.map((g) => (
            <line
              key={g}
              x1={pad.left}
              x2={w - pad.right}
              y1={pad.top + ih * g}
              y2={pad.top + ih * g}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}
        <path
          d={areaPath}
          fill={`url(#area-${color.slice(1)})`}
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}
        />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2400,
            strokeDashoffset: inView ? 0 : 2400,
            transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={inView ? 3 : 0}
            fill={color}
            style={{ transition: `r 0.3s ease ${0.8 + i * 0.05}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ===== Bar chart ===== */
export function BarChart({
  data,
  labels,
  color = '#f97316',
  height = 220,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const w = 760;
  const h = height;
  const pad = { top: 16, right: 8, bottom: 28, left: 8 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.15;
  const bw = (iw / data.length) * 0.55;
  const gap = iw / data.length;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`bar-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={pad.left} x2={w - pad.right} y1={pad.top + ih * g} y2={pad.top + ih * g} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const bh = (d / max) * ih;
          const x = pad.left + gap * i + (gap - bw) / 2;
          const y = pad.top + ih - bh;
          return (
            <g key={i}>
              <rect
                x={x}
                y={inView ? y : pad.top + ih}
                width={bw}
                height={inView ? bh : 0}
                rx={bw / 2}
                fill={`url(#bar-${color.slice(1)})`}
                style={{ transition: `y 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, height 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s` }}
              />
              <text x={x + bw / 2} y={h - 8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="Manrope">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ===== Donut chart ===== */
export function Donut({
  segments,
  size = 200,
  thickness = 22,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${inView ? len : 0} ${c}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: `stroke-dasharray 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s` }}
            />
          );
          offset += len;
          return el;
        })}
        <text x="50%" y="48%" textAnchor="middle" fill="var(--text)" fontSize="26" fontWeight="700" fontFamily="Manrope">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fill="var(--text-3)" fontSize="11" fontFamily="Manrope" letterSpacing="1">
          UNITS
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
            <span style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)' }}>{s.label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Sparkline ===== */
export function Sparkline({ data, color = '#10b981', width = 120, height = 36 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={`url(#spark-${color.slice(1)})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ===== Animated progress ring ===== */
export function ProgressRing({ value, color = '#10b981', size = 56, label }: { value: number; color?: string; size?: number; label?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const thickness = 5;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={inView ? c - (value / 100) * c : c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: 'var(--t-small)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{Math.round(value)}%</span>
        {label && <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{label}</span>}
      </div>
    </div>
  );
}

/* ===== Heatmap (activity) ===== */
export function Heatmap({ weeks = 12, rows = 7, color = '#10b981' }: { weeks?: number; rows?: number; color?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [cells, setCells] = useState<number[]>([]);
  useEffect(() => {
    const arr = Array.from({ length: weeks * rows }, () => Math.random());
    setCells(arr);
  }, [weeks, rows]);
  const cell = 14;
  const gap = 4;
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateRows: `repeat(${rows}, ${cell}px)`, gridAutoFlow: 'column', gridAutoColumns: `${cell}px`, gap }}>
      {cells.map((v, i) => {
        const intensity = v;
        return (
          <div
            key={i}
            style={{
              width: cell,
              height: cell,
              borderRadius: 4,
              background: intensity < 0.15 ? 'rgba(255,255,255,0.04)' : color,
              opacity: inView ? 0.15 + intensity * 0.85 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.4)',
              transition: `opacity 0.5s ease ${(i % rows) * 0.01 + Math.floor(i / rows) * 0.008}s, transform 0.5s ease ${(i % rows) * 0.01 + Math.floor(i / rows) * 0.008}s`,
            }}
          />
        );
      })}
    </div>
  );
}
