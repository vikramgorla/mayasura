'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Palette, Globe, Plug, AlertTriangle, Save, Loader2,
  Check, Copy, ExternalLink, Eye, Trash2, MessageSquare,
  ShoppingBag, FileText, Mail, Share2, ChevronRight,
  Newspaper, Download, Upload, Clock, Key, RefreshCw, Bell,
  Webhook,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Brand, INDUSTRY_CATEGORIES, TONE_OPTIONS } from '@/lib/types';
import { WEBSITE_TEMPLATES } from '@/lib/website-templates';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

// ─── General Tab ─────────────────────────────────────────────────
function GeneralTab({ brand, onSave }: { brand: Brand; onSave: (updates: Record<string, unknown>) => Promise<boolean> }) {
  const [form, setForm] = useState({
    name: brand.name || '',
    tagline: brand.tagline || '',
    description: brand.description || '',
    industry: brand.industry || '',
    brand_voice: brand.brand_voice || '',
    slug: brand.slug || '',
    status: brand.status || 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState('');

  const validateSlug = (slug: string) => {
    const cleaned = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (cleaned.length < 2) return 'Slug must be at least 2 characters';
    if (cleaned.length > 64) return 'Slug must be under 64 characters';
    return '';
  };

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm(f => ({ ...f, slug: cleaned }));
    setSlugError(validateSlug(cleaned));
  };

  const handleSave = async () => {
    if (slugError) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brand Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Brand Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="A short tagline for your brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="Describe your brand..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Industry</label>
            <select
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            >
              <option value="">Select industry</option>
              {INDUSTRY_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brand Voice & Tone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Brand Voice</label>
            <textarea
              value={form.brand_voice}
              onChange={e => setForm(f => ({ ...f, brand_voice: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="Describe how your brand communicates..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-600 dark:text-zinc-300">Tone Keywords</label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map(tone => {
                const isSelected = form.brand_voice?.includes(tone);
                return (
                  <button
                    key={tone}
                    onClick={() => {
                      const current = form.brand_voice || '';
                      if (isSelected) {
                        setForm(f => ({ ...f, brand_voice: current.replace(tone + ', ', '').replace(', ' + tone, '').replace(tone, '') }));
                      } else {
                        setForm(f => ({ ...f, brand_voice: current ? `${current}, ${tone}` : tone }));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">URL Slug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Brand Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400 font-mono">/site/</span>
              <input
                type="text"
                value={form.slug}
                onChange={e => handleSlugChange(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-zinc-800 text-sm outline-none font-mono focus:ring-2 focus:ring-violet-500/20 ${
                  slugError ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-700 focus:border-violet-500'
                }`}
                placeholder="my-brand"
              />
            </div>
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
            <p className="text-xs text-zinc-400 mt-1">Used in all your public URLs (website, shop, blog, chatbot)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brand Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(['draft', 'launched', 'paused'] as const).map(status => (
              <button
                key={status}
                onClick={() => setForm(f => ({ ...f, status }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  form.status === status
                    ? status === 'launched'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : status === 'paused'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {status === 'launched' && '🟢 '}{status === 'paused' && '🟡 '}{status === 'draft' && '⚪ '}{status}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !!slugError}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ─── Design Tab ──────────────────────────────────────────────────
function DesignTab({ brand }: { brand: Brand; onSave: (updates: Record<string, unknown>) => Promise<boolean> }) {
  const params = useParams();
  const brandId = params.brandId as string;
  const selectedTemplate = WEBSITE_TEMPLATES.find(t => t.id === (brand.website_template || 'minimal'));

  return (
    <div className="space-y-6">
      {/* Design Studio CTA */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
              <Palette className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Design Studio</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Open the full Design Studio for a premium editing experience with live preview, 
                10 color palettes, 23+ fonts, button styles, and more.
              </p>
              <a
                href={`/dashboard/${brandId}/design`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                <Palette className="h-4 w-4" />
                Open Design Studio
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick summary of current design */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Current Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-20">Template</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {selectedTemplate?.name || 'Minimal'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-20">Colors</span>
            <div className="flex gap-1.5">
              <div className="h-6 w-6 rounded border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: brand.primary_color }} />
              <div className="h-6 w-6 rounded border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: brand.secondary_color }} />
              <div className="h-6 w-6 rounded border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: brand.accent_color }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-20">Heading</span>
            <span className="text-sm text-zinc-900 dark:text-white" style={{ fontFamily: brand.font_heading }}>
              {brand.font_heading}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-20">Body</span>
            <span className="text-sm text-zinc-900 dark:text-white" style={{ fontFamily: brand.font_body }}>
              {brand.font_body}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Channels Tab ────────────────────────────────────────────────
function ChannelsTab({ brand, onSave }: { brand: Brand; onSave: (updates: Record<string, unknown>) => Promise<boolean> }) {
  const [channels, setChannels] = useState<string[]>(() => {
    try { return JSON.parse(brand.channels || '[]'); } catch { return []; }
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const slug = brand.slug || brand.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const allChannels = [
    { id: 'website', name: 'Website', icon: Globe, color: 'text-blue-600', url: `/site/${slug}` },
    { id: 'ecommerce', name: 'Shop', icon: ShoppingBag, color: 'text-amber-600', url: `/shop/${slug}` },
    { id: 'blog', name: 'Blog', icon: Newspaper, color: 'text-purple-600', url: `/blog/${slug}` },
    { id: 'chatbot', name: 'AI Chatbot', icon: MessageSquare, color: 'text-emerald-600', url: `/chat/${slug}` },
    { id: 'email', name: 'Email Marketing', icon: Mail, color: 'text-rose-600', url: null },
    { id: 'social', name: 'Social Media', icon: Share2, color: 'text-cyan-600', url: null },
  ];

  const toggleChannel = (id: string) => {
    setChannels(ch =>
      ch.includes(id) ? ch.filter(c => c !== id) : [...ch, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ channels });
    setSaving(false);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(`${baseUrl}${url}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allChannels.map(ch => {
              const isActive = channels.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    isActive
                      ? 'border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ch.icon className={`h-5 w-5 ${isActive ? ch.color : 'text-zinc-300 dark:text-zinc-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                        {ch.name}
                      </p>
                      {isActive && ch.url && (
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{ch.url}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && ch.url && (
                      <>
                        <button
                          onClick={() => copyUrl(ch.url!, ch.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400"
                          title="Copy URL"
                        >
                          {copied === ch.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                          href={ch.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400"
                          title="Open"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        isActive ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    >
                      <motion.div
                        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                        animate={{ x: isActive ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chatbot Widget Embed */}
      {channels.includes('chatbot') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Chatbot Widget Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400 mb-2">Add this script to any website to embed the chatbot widget:</p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-zinc-900 text-green-400 text-xs overflow-x-auto font-mono">
                {`<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`);
                  setCopied('widget');
                  setTimeout(() => setCopied(null), 2000);
                }}
                className="absolute top-2 right-2 p-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
              >
                {copied === 'widget' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Channels
        </Button>
      </div>
    </div>
  );
}

// ─── Integrations Tab ────────────────────────────────────────────
function IntegrationsTab({ brandId, settings: initialSettings }: { brandId: string; settings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const toast = useToast();

  const saveSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSettings(s => ({ ...s, [key]: value }));
        toast.success('Setting saved');
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    }
    setSaving(null);
  };

  const saveBulk = async (keys: string[]) => {
    const bulk: Record<string, string> = {};
    for (const key of keys) {
      bulk[key] = settings[key] || '';
    }
    setSaving(keys[0]);
    try {
      const res = await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: bulk }),
      });
      if (res.ok) {
        toast.success('Settings saved');
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    }
    setSaving(null);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const IntegrationSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">{icon}{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const SettingField = ({ settingKey, label, placeholder, sensitive, type }: {
    settingKey: string; label: string; placeholder: string; sensitive?: boolean; type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">{label}</label>
      <div className="flex gap-2">
        <input
          type={sensitive ? 'password' : type || 'text'}
          value={settings[settingKey] || ''}
          onChange={e => setSettings(s => ({ ...s, [settingKey]: e.target.value }))}
          className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          placeholder={placeholder}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => saveSetting(settingKey, settings[settingKey] || '')}
          disabled={saving === settingKey}
        >
          {saving === settingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stripe */}
      <IntegrationSection title="Stripe Payments" icon={<div className="h-4 w-4 bg-violet-600 rounded text-white text-[8px] flex items-center justify-center font-bold">S</div>}>
        <SettingField settingKey="stripe_publishable_key" label="Publishable Key" placeholder="pk_test_..." />
        <SettingField settingKey="stripe_secret_key" label="Secret Key" placeholder="sk_test_..." sensitive />
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Mode</label>
          <div className="flex gap-2">
            {['test', 'live'].map(mode => (
              <button
                key={mode}
                onClick={() => {
                  setSettings(s => ({ ...s, stripe_mode: mode }));
                  saveSetting('stripe_mode', mode);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  (settings.stripe_mode || 'test') === mode
                    ? mode === 'live'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Webhook URL</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/public/brand/${brandId}/webhook/stripe` : '...'}
            </code>
            <button
              onClick={() => copyText(`${window.location.origin}/api/public/brand/${brandId}/webhook/stripe`, 'webhook')}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400"
            >
              {copied === 'webhook' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </IntegrationSection>

      {/* SMTP */}
      <IntegrationSection title="Email / SMTP" icon={<Mail className="h-4 w-4 text-rose-500" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingField settingKey="smtp_host" label="SMTP Host" placeholder="smtp.gmail.com" />
          <SettingField settingKey="smtp_port" label="SMTP Port" placeholder="587" type="number" />
          <SettingField settingKey="smtp_user" label="SMTP User" placeholder="your@email.com" />
          <SettingField settingKey="smtp_pass" label="SMTP Password" placeholder="••••••" sensitive />
          <SettingField settingKey="smtp_from_address" label="From Address" placeholder="hello@yourbrand.com" />
          <SettingField settingKey="smtp_from_name" label="From Name" placeholder="Your Brand" />
        </div>
      </IntegrationSection>

      {/* Google Analytics */}
      <IntegrationSection title="Google Analytics" icon={<div className="h-4 w-4 rounded text-[8px] flex items-center justify-center font-bold bg-orange-500 text-white">G</div>}>
        <SettingField settingKey="google_analytics_id" label="Tracking ID" placeholder="G-XXXXXXXXXX" />
      </IntegrationSection>

      {/* Custom Domain */}
      <IntegrationSection title="Custom Domain" icon={<Globe className="h-4 w-4 text-blue-500" />}>
        <SettingField settingKey="custom_domain" label="Domain" placeholder="yourbrand.com" />
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1">CNAME Setup</p>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            Point your domain&apos;s CNAME record to <code className="font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded">cname.mayasura.app</code>
          </p>
        </div>
      </IntegrationSection>

      {/* Social Media */}
      <IntegrationSection title="Social Media Links" icon={<Share2 className="h-4 w-4 text-cyan-500" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingField settingKey="social_facebook" label="Facebook" placeholder="https://facebook.com/yourbrand" />
          <SettingField settingKey="social_instagram" label="Instagram" placeholder="https://instagram.com/yourbrand" />
          <SettingField settingKey="social_twitter" label="Twitter / X" placeholder="https://x.com/yourbrand" />
          <SettingField settingKey="social_linkedin" label="LinkedIn" placeholder="https://linkedin.com/company/yourbrand" />
          <SettingField settingKey="social_tiktok" label="TikTok" placeholder="https://tiktok.com/@yourbrand" />
          <SettingField settingKey="social_youtube" label="YouTube" placeholder="https://youtube.com/@yourbrand" />
        </div>
      </IntegrationSection>

      {/* Webhooks */}
      <IntegrationSection title="Webhooks" icon={<Plug className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}>
        <p className="text-xs text-zinc-400 mb-2">
          Receive POST notifications when events occur. URLs must be HTTPS.
        </p>
        <SettingField settingKey="webhook_order_created" label="Order Created" placeholder="https://your-server.com/webhooks/order" />
        <SettingField settingKey="webhook_contact_new" label="New Contact Submission" placeholder="https://your-server.com/webhooks/contact" />
        <SettingField settingKey="webhook_newsletter_subscribe" label="Newsletter Subscribe" placeholder="https://your-server.com/webhooks/newsletter" />
      </IntegrationSection>
    </div>
  );
}

// ─── Danger Zone Tab ─────────────────────────────────────────────
function DangerZoneTab({ brand, brandId }: { brand: Brand; brandId: string }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const loadCounts = async () => {
    setLoadingCounts(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/counts`);
      const data = await res.json();
      setCounts(data.counts);
    } catch {
      // ignore
    }
    setLoadingCounts(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    loadCounts();
  };

  const handleDelete = async () => {
    if (confirmText !== brand.name) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/brands/${brandId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Brand deleted', 'All data has been permanently removed');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete brand');
      }
    } catch {
      toast.error('Failed to delete brand');
    }
    setDeleting(false);
  };

  const totalItems = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="space-y-6">
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Once you delete a brand, there is no going back. This will permanently delete all data
            associated with <strong className="text-zinc-900 dark:text-white">{brand.name}</strong> — 
            including products, orders, blog posts, content, chatbot FAQs, tickets, contact submissions,
            newsletter subscribers, analytics data, and all settings.
          </p>
          <Button
            variant="destructive"
            onClick={openDeleteModal}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete This Brand
          </Button>
        </CardContent>
      </Card>

      {/* Brand Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brand Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Brand ID</span>
            <span className="font-mono text-zinc-900 dark:text-white text-xs">{brandId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Created</span>
            <span className="text-zinc-900 dark:text-white">
              {new Date(brand.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Last Updated</span>
            <span className="text-zinc-900 dark:text-white">
              {new Date(brand.updated_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Delete &quot;{brand.name}&quot;?</h3>
                  <p className="text-xs text-zinc-400">This action cannot be undone</p>
                </div>
              </div>

              {/* Show what will be deleted */}
              {loadingCounts ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading data counts...
                </div>
              ) : counts && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                  <p className="text-xs font-medium text-red-800 dark:text-red-400 mb-2">
                    This will permanently delete {totalItems} items:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(counts)
                      .filter(([, count]) => count > 0)
                      .map(([table, count]) => (
                        <p key={table} className="text-xs text-red-600 dark:text-red-500">
                          • {count} {table.replace(/_/g, ' ')}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">
                  Type <strong className="text-zinc-900 dark:text-white">{brand.name}</strong> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  placeholder={brand.name}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => { setShowDeleteModal(false); setConfirmText(''); }}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmText !== brand.name || deleting}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete Forever
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data Tab (Import/Export) ─────────────────────────────────────
function DataTab({ brandId, brand }: { brandId: string; brand: Brand }) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mayasura-${brand.slug || brandId}-export.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Brand exported', 'Complete data downloaded as JSON');
    } catch {
      toast.error('Export failed');
    }
    setExporting(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const res = await fetch(`/api/brands/new/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Import successful!', `Created brand with ${result.imported?.products || 0} products, ${result.imported?.blogPosts || 0} blog posts`);
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch {
      toast.error('Invalid JSON file');
    }
    setImporting(false);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-600" />
            Export Brand Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Download a complete backup of all your brand data — products, content, blog posts, 
            orders, contacts, settings, and more.
          </p>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export All Data (JSON)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="h-4 w-4 text-emerald-600" />
            Import Brand Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Upload a previously exported JSON file to create a new brand with all its data.
            This creates a new brand — it won&apos;t overwrite existing data.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span className="text-sm font-medium">{importing ? 'Importing...' : 'Choose JSON File'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Activity Log Tab ────────────────────────────────────────────
function ActivityLogTab({ brandId }: { brandId: string }) {
  const [activities, setActivities] = useState<Array<{ id: string; type: string; description: string; created_at: string; metadata: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch activities from the brand endpoint
    fetch(`/api/brands/${brandId}/analytics`)
      .then(r => r.json())
      .then(() => {
        // Also try to get the activity log via the existing products/content endpoints
        // For now, show brand-level activity
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [brandId]);

  const activityTypeEmoji: Record<string, string> = {
    brand_created: '🚀',
    brand_updated: '✏️',
    product_added: '📦',
    product_deleted: '🗑️',
    content_generated: '✍️',
    blog_published: '📝',
    order_placed: '🛒',
    contact_received: '📧',
    settings_updated: '⚙️',
    design_updated: '🎨',
    import: '📥',
    export: '📤',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-600" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            All changes and actions on your brand. Activities are logged automatically when you make changes.
          </p>
          {activities.length === 0 ? (
            <div className="py-8 text-center">
              <Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Activity logging is enabled. Changes will appear here as you use the dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                  <span className="text-lg">{activityTypeEmoji[activity.type] || '📋'}</span>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{activity.description}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── API Keys Tab ────────────────────────────────────────────────
function APIKeysTab({ brandId }: { brandId: string }) {
  const [keys, setKeys] = useState<Array<{ id: string; name: string; key: string; created_at: string }>>([]);
  const [keyName, setKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const generateKey = () => {
    if (!keyName) return;
    const key = `msk_${brandId.slice(0, 6)}_${Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    setGeneratedKey(key);
    setKeys(prev => [...prev, { id: key, name: keyName, key: key.slice(0, 12) + '...' + key.slice(-4), created_at: new Date().toISOString() }]);
    setKeyName('');
    toast.success('API key generated');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-600" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-4">
            <p className="text-xs text-amber-800 dark:text-amber-400">
              🚧 API Keys are in preview. Keys generated here are stored locally and provide a placeholder for future REST API integration.
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
              placeholder="Key name (e.g., Production API)"
            />
            <Button onClick={generateKey} disabled={!keyName}>
              <Key className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>

          {generatedKey && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                ⚠️ Copy this key now — it won&apos;t be shown again
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded truncate">
                  {generatedKey}
                </code>
                <button
                  onClick={() => copyKey(generatedKey)}
                  className="p-1.5 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-emerald-600" />}
                </button>
              </div>
            </div>
          )}

          {keys.length > 0 ? (
            <div className="space-y-2">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{key.name}</p>
                    <p className="text-xs font-mono text-zinc-400">{key.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">{new Date(key.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => setKeys(prev => prev.filter(k => k.id !== key.id))}
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">No API keys generated yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────
function NotificationsTab({ brandId, settings: initialSettings }: { brandId: string; settings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const toast = useToast();

  const saveSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSettings(s => ({ ...s, [key]: value }));
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 2000);
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    }
    setSaving(null);
  };

  const toggleNotification = async (key: string) => {
    const current = settings[key] === 'true';
    const next = (!current).toString();
    setSettings(s => ({ ...s, [key]: next }));
    await saveSetting(key, next);
  };

  const NotifToggle = ({ settingKey, label, description }: { settingKey: string; label: string; description: string }) => {
    const isOn = settings[settingKey] !== 'false'; // Default to on
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {savedKey === settingKey && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
            >
              Saved ✓
            </motion.span>
          )}
          <button
            onClick={() => toggleNotification(settingKey)}
            disabled={saving === settingKey}
            className={`relative w-11 h-6 rounded-full transition-colors ${isOn ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
              animate={{ x: isOn ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>
    );
  };

  const WebhookField = ({ settingKey, label, placeholder }: { settingKey: string; label: string; placeholder: string }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={settings[settingKey] || ''}
          onChange={e => setSettings(s => ({ ...s, [settingKey]: e.target.value }))}
          className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          placeholder={placeholder}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => saveSetting(settingKey, settings[settingKey] || '')}
          disabled={saving === settingKey}
          className="flex-shrink-0"
        >
          {saving === settingKey ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : savedKey === settingKey ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Email notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4 text-rose-500" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-zinc-400 mb-1">Choose which events trigger email notifications to you.</p>
          <NotifToggle
            settingKey="notif_email_new_order"
            label="New Order"
            description="Get notified when a customer places an order"
          />
          <NotifToggle
            settingKey="notif_email_new_contact"
            label="New Contact Submission"
            description="Get notified when someone fills in your contact form"
          />
          <NotifToggle
            settingKey="notif_email_new_subscriber"
            label="New Newsletter Subscriber"
            description="Get notified when someone subscribes to your list"
          />
          <NotifToggle
            settingKey="notif_email_new_ticket"
            label="New Support Ticket"
            description="Get notified when a support ticket is opened"
          />
          <NotifToggle
            settingKey="notif_email_chatbot_lead"
            label="Chatbot Lead Captured"
            description="Get notified when the chatbot captures a lead"
          />
          <NotifToggle
            settingKey="notif_email_weekly_digest"
            label="Weekly Digest"
            description="A weekly summary of your brand's performance"
          />
        </CardContent>
      </Card>

      {/* Notification email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            Notification Destination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">Notification Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={settings['notif_email_address'] || ''}
                onChange={e => setSettings(s => ({ ...s, notif_email_address: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder="you@example.com"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveSetting('notif_email_address', settings['notif_email_address'] || '')}
                disabled={saving === 'notif_email_address'}
              >
                {saving === 'notif_email_address' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : savedKey === 'notif_email_address' ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
            <p className="text-xs text-zinc-400 mt-1">Notifications will be sent to this address (defaults to your account email)</p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Webhook className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            Webhook Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              POST requests are sent to your URL when events occur. Must be HTTPS. Payload is JSON with event type and data.
            </p>
          </div>
          <WebhookField
            settingKey="webhook_order_created"
            label="Order Created"
            placeholder="https://your-server.com/webhooks/order"
          />
          <WebhookField
            settingKey="webhook_contact_new"
            label="New Contact Submission"
            placeholder="https://your-server.com/webhooks/contact"
          />
          <WebhookField
            settingKey="webhook_newsletter_subscribe"
            label="Newsletter Subscribe"
            placeholder="https://your-server.com/webhooks/newsletter"
          />
          <WebhookField
            settingKey="webhook_ticket_created"
            label="Ticket Created"
            placeholder="https://your-server.com/webhooks/ticket"
          />
          <WebhookField
            settingKey="webhook_chatbot_lead"
            label="Chatbot Lead Captured"
            placeholder="https://your-server.com/webhooks/lead"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Settings Page ──────────────────────────────────────────
export default function SettingsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('general');
  const toast = useToast();

  useEffect(() => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/settings`).then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, [brandId]);

  const saveBrand = useCallback(async (updates: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setBrand(data.brand);
        toast.success('Saved successfully');
        return true;
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
        return false;
      }
    } catch {
      toast.error('Failed to save');
      return false;
    }
  }, [brandId, toast]);

  if (!brand) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'channels', label: 'Channels', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'data', label: 'Data', icon: Download },
    { id: 'activity', label: 'Activity Log', icon: Clock },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
        className="mb-4"
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your brand configuration, design, channels, and integrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          {/* Desktop tabs */}
          <div className="hidden sm:block">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="dark:bg-zinc-800">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className={tab.id === 'danger' ? 'text-red-500' : ''}>
                    <tab.icon className="h-3.5 w-3.5 mr-1.5 inline" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile tab list */}
          <div className="sm:hidden space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? tab.id === 'danger'
                      ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                      : 'bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400'
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && <GeneralTab brand={brand} onSave={saveBrand} />}
            {activeTab === 'design' && <DesignTab brand={brand} onSave={saveBrand} />}
            {activeTab === 'channels' && <ChannelsTab brand={brand} onSave={saveBrand} />}
            {activeTab === 'notifications' && <NotificationsTab brandId={brandId} settings={settings} />}
            {activeTab === 'integrations' && <IntegrationsTab brandId={brandId} settings={settings} />}
            {activeTab === 'data' && <DataTab brandId={brandId} brand={brand} />}
            {activeTab === 'activity' && <ActivityLogTab brandId={brandId} />}
            {activeTab === 'api-keys' && <APIKeysTab brandId={brandId} />}
            {activeTab === 'danger' && <DangerZoneTab brand={brand} brandId={brandId} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
