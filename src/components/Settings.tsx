import { motion } from 'framer-motion';
import {
  Store, Globe, Bell, CreditCard, Shield, Users, Zap,
  ChevronRight, Check,
} from 'lucide-react';
import { useState } from 'react';
import { useReveal } from '../lib/hooks';
import { Avatar } from './ui/Avatar';
import type { View, NavigateOptions } from '../lib/types';
import { BRAND } from '../lib/brand';

const SECTIONS = [
  { id: 'store', label: 'Store', icon: Store },
  { id: 'channels', label: 'Channels', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'team', label: 'Team', icon: Users },
];

export function Settings({
  activeTab, onTabChange, onNavigate,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigate: (view: View, opts?: NavigateOptions) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [saved, setSaved] = useState(false);
  const [channels, setChannels] = useState({ web: true, app: true, boutique: true });
  const [form, setForm] = useState({
    storeName: BRAND.storeName as string,
    domain: 'shop.veloura.io',
    currency: 'USD',
    timezone: 'Africa/Lagos',
    emailOrders: true,
    emailAI: true,
    emailLowStock: true,
    twoFactor: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      <div className="card reveal in" style={{ padding: 'var(--s-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 100% at 100% 0%, rgba(16,185,129,0.12), transparent 60%)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', letterSpacing: '-0.02em' }}>Store settings</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginTop: 4 }}>Configure your {BRAND.name} {BRAND.tagline} workspace</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            {saved ? <><Check size={15} /> Saved</> : 'Save changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: 'var(--s-6)' }} className="settings-grid">
        <nav className="card reveal in" style={{ padding: 'var(--s-4)', alignSelf: 'start', position: 'sticky', top: 'calc(var(--topbar-h) + 16px)' }}>
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onTabChange(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 2,
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? 'var(--text)' : 'var(--text-2)', fontWeight: isActive ? 600 : 500,
                  fontSize: 'var(--t-small)', transition: 'background var(--dur-2)',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--emerald-400)' : undefined} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="card card-pad reveal in">
          {activeTab === 'store' && (
            <SettingsGroup title="General" description="Basic store identity and regional preferences">
              <Field label="Store name" value={form.storeName} onChange={(v) => setForm({ ...form, storeName: v })} />
              <Field label="Custom domain" value={form.domain} onChange={(v) => setForm({ ...form, domain: v })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
                <SelectField label="Currency" value={form.currency} options={['USD', 'EUR', 'GBP', 'NGN']} onChange={(v) => setForm({ ...form, currency: v })} />
                <SelectField label="Timezone" value={form.timezone} options={['Africa/Lagos', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo']} onChange={(v) => setForm({ ...form, timezone: v })} />
              </div>
            </SettingsGroup>
          )}

          {activeTab === 'channels' && (
            <SettingsGroup title="Sales channels" description="Where customers discover and buy">
              {[
                { id: 'web' as const, name: 'Web storefront', desc: 'Primary e-commerce site', icon: Globe },
                { id: 'app' as const, name: 'Mobile app', desc: 'iOS & Android native', icon: Zap },
                { id: 'boutique' as const, name: 'Boutique POS', desc: 'In-store point of sale', icon: Store },
              ].map((ch) => {
                const Icon = ch.icon;
                return (
                  <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--line-soft)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center' }}>
                      <Icon size={18} color="var(--emerald-400)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{ch.name}</div>
                      <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{ch.desc}</div>
                    </div>
                    <Toggle
                      checked={channels[ch.id]}
                      onChange={(v) => setChannels((prev) => ({ ...prev, [ch.id]: v }))}
                    />
                  </div>
                );
              })}
            </SettingsGroup>
          )}

          {activeTab === 'notifications' && (
            <SettingsGroup title="Email alerts" description="Choose what reaches your inbox">
              <ToggleRow label="New orders" desc="Instant alert for every purchase" checked={form.emailOrders} onChange={(v) => setForm({ ...form, emailOrders: v })} />
              <ToggleRow label="AI recommendations" desc="When high-confidence picks are ready" checked={form.emailAI} onChange={(v) => setForm({ ...form, emailAI: v })} />
              <ToggleRow label="Low stock warnings" desc="Before SKUs hit zero" checked={form.emailLowStock} onChange={(v) => setForm({ ...form, emailLowStock: v })} />
            </SettingsGroup>
          )}

          {activeTab === 'billing' && (
            <SettingsGroup title="Plan & billing" description={`${BRAND.plan} subscription`}>
              <div className="glass" style={{ padding: 20, borderRadius: 'var(--r-lg)', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(100% 80% at 100% 0%, rgba(249,115,22,0.15), transparent 60%)' }} />
                <div style={{ position: 'relative' }}>
                  <span className="badge badge-orange" style={{ marginBottom: 10 }}>{BRAND.plan}</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>$149<span style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)', fontWeight: 500 }}>/mo</span></div>
                  <p style={{ fontSize: 'var(--t-small)', color: 'var(--text-2)', marginBottom: 16 }}>Predictive demand, unlimited AI picks, priority support.</p>
                  <button className="btn btn-accent btn-sm" onClick={() => onNavigate('help')}>Manage subscription</button>
                </div>
              </div>
              <div style={{ fontSize: 'var(--t-small)', color: 'var(--text-3)' }}>Next billing date: Sep 5, 2026 · Visa •••• 4242</div>
            </SettingsGroup>
          )}

          {activeTab === 'security' && (
            <SettingsGroup title="Security" description="Protect your store and team">
              <ToggleRow label="Two-factor authentication" desc="Require 2FA for all team members" checked={form.twoFactor} onChange={(v) => setForm({ ...form, twoFactor: v })} />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => onTabChange('security')}>Change password <ChevronRight size={14} /></button>
              <button className="btn btn-ghost btn-sm" onClick={() => onTabChange('security')}>View active sessions <ChevronRight size={14} /></button>
            </SettingsGroup>
          )}

          {activeTab === 'team' && (
            <SettingsGroup title="Team members" description="People with access to this workspace">
              {[
                { name: BRAND.fullName, role: 'Owner', email: BRAND.email },
                { name: 'James Chen', role: 'Merchandiser', email: 'j.chen@veloura.io' },
                { name: 'Sophie Laurent', role: 'Analyst', email: 'sophie@veloura.io' },
              ].map((m) => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--line-soft)' }}>
                  <Avatar name={m.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--t-small)' }}>{m.name}</div>
                    <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{m.email}</div>
                  </div>
                  <span className="badge badge-neutral">{m.role}</span>
                </div>
              ))}
              <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => onNavigate('help')}>Invite member</button>
            </SettingsGroup>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{title}</h3>
      <p style={{ color: 'var(--text-3)', fontSize: 'var(--t-small)', marginBottom: 24 }}>{description}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 999, padding: 3, flexShrink: 0,
        background: checked ? 'var(--emerald-500)' : 'rgba(255,255,255,0.12)',
        border: `1px solid ${checked ? 'var(--emerald-500)' : 'var(--line)'}`,
        transition: 'background var(--dur-2), border-color var(--dur-2)',
        display: 'flex', alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          width: 18, height: 18, borderRadius: 999,
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          marginLeft: checked ? 'auto' : 0,
        }}
      />
    </button>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--t-small)' }}>{label}</div>
        <div style={{ fontSize: 'var(--t-tiny)', color: 'var(--text-3)' }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
