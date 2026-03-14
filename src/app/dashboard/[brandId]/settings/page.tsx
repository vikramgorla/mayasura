'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, ShoppingBag, FileText, MessageSquare, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Brand } from '@/lib/types';

export default function SettingsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/settings`).then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, [brandId]);

  const saveSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      setSettings(s => ({ ...s, [key]: value }));
      toast.success('Setting saved');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(null);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!brand) return null;

  const slug = brand.slug || brand.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const liveUrls = [
    { label: 'Website', url: `/site/${slug}`, icon: Globe, color: 'text-blue-600' },
    { label: 'Shop', url: `/shop/${slug}`, icon: ShoppingBag, color: 'text-amber-600' },
    { label: 'Blog', url: `/blog/${slug}`, icon: FileText, color: 'text-purple-600' },
    { label: 'Chatbot', url: `/chat/${slug}`, icon: MessageSquare, color: 'text-emerald-600' },
  ];

  const widgetCode = `<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`;

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure integrations and manage your brand</p>
        </div>

        {/* Live URLs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Live URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveUrls.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-slate-400 font-mono">{item.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(`${baseUrl}${item.url}`, item.label)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                    >
                      {copied === item.label ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Embed Widget */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Chatbot Widget Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Add this script tag to any website to embed your chatbot widget:
            </p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-slate-900 text-green-400 text-xs overflow-x-auto font-mono">
                {widgetCode}
              </pre>
              <button
                onClick={() => copyToClipboard(widgetCode, 'widget')}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                {copied === 'widget' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'stripe_publishable_key', label: 'Stripe Publishable Key', placeholder: 'pk_test_...' },
              { key: 'stripe_secret_key', label: 'Stripe Secret Key', placeholder: 'sk_test_...', sensitive: true },
              { key: 'google_analytics_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
              { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
              { key: 'smtp_port', label: 'SMTP Port', placeholder: '587' },
              { key: 'smtp_user', label: 'SMTP User', placeholder: 'your@email.com' },
              { key: 'smtp_pass', label: 'SMTP Password', placeholder: '••••••', sensitive: true },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5 text-slate-600 dark:text-slate-300">
                  {field.label}
                </label>
                <div className="flex gap-2">
                  <input
                    type={field.sensitive ? 'password' : 'text'}
                    value={settings[field.key] || ''}
                    onChange={(e) => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none font-mono"
                    placeholder={field.placeholder}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveSetting(field.key, settings[field.key] || '')}
                    disabled={saving === field.key}
                  >
                    {saving === field.key ? '...' : 'Save'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brand Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Brand Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Brand ID</span>
              <span className="font-mono text-slate-900 dark:text-white">{brandId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Slug</span>
              <span className="font-mono text-slate-900 dark:text-white">{slug}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-slate-900 dark:text-white capitalize">{brand.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Created</span>
              <span className="text-slate-900 dark:text-white">
                {new Date(brand.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
