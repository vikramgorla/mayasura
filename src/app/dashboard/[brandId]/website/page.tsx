'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sparkles, RefreshCw, Monitor, Tablet, Smartphone,
  Download, Eye, Layers, FileText, ShoppingBag, MessageSquare,
  Users, Mail, Pencil, Check, X, ToggleLeft, ToggleRight,
  ExternalLink, Gauge, Zap, Shield, Accessibility, ImageIcon,
  ChevronDown, ChevronRight, Home, Info, Phone, BookOpen,
  Store, Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import { Brand } from '@/lib/types';
import { LayoutEditor } from '@/components/design/layout-editor';
import {
  type PageLayout,
  getDefaultLayout,
} from '@/lib/page-layout';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string;
}

interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

interface PageInfo {
  id: string;
  name: string;
  slug: string;
  icon: React.ElementType;
  description: string;
  status: 'active' | 'draft';
  previewPath: string;
  editPath: string;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'overview' | 'preview' | 'editor';

const viewportWidths: Record<Viewport, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

// ─── Performance Score Circle ────────────────────────────────────
function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-zinc-100 dark:text-zinc-800"
          />
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

// ─── Quick Edit Field ────────────────────────────────────────────
function QuickEditField({
  label,
  value,
  onSave,
  multiline = false,
}: {
  label: string;
  value: string;
  onSave: (val: string) => void;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setEditing(false);
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </label>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Pencil className="h-3 w-3 text-zinc-400" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex flex-col gap-2">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            />
          )}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <Check className="h-3 w-3" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {value || <span className="italic text-zinc-400">Not set</span>}
        </p>
      )}
    </div>
  );
}

// ─── Page Row ────────────────────────────────────────────────────
function PageRow({
  page,
  onToggle,
}: {
  page: PageInfo;
  onToggle: (slug: string) => void;
}) {
  const Icon = page.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          page.status === 'active'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">{page.name}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              page.status === 'active'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
            }`}>
              {page.status === 'active' ? 'Live' : 'Draft'}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 truncate block">{page.description}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={page.previewPath}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Preview"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={() => onToggle(page.slug)}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title={page.status === 'active' ? 'Unpublish' : 'Publish'}
        >
          {page.status === 'active' ? (
            <ToggleRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function WebsitePage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [landingContent, setLandingContent] = useState<ContentItem | null>(null);
  const [aboutContent, setAboutContent] = useState<ContentItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [layout, setLayout] = useState<PageLayout | null>(null);
  const [savingLayout, setSavingLayout] = useState(false);
  const [pageStatuses, setPageStatuses] = useState<Record<string, 'active' | 'draft'>>({});
  const [quickEditSection, setQuickEditSection] = useState<string | null>(null);
  const toast = useToast();

  // Estimated performance scores — these are baseline estimates for Mayasura-generated sites,
  // not actual Lighthouse measurements. Real Lighthouse integration is a future feature.
  const [perfScores] = useState({ performance: 92, accessibility: 95, bestPractices: 92, seo: 95 });

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => {
      setBrand(d.brand);
    });
    fetch(`/api/brands/${brandId}/content?type=landing`).then(r => r.json()).then(d => {
      if (d.content?.length) setLandingContent(d.content[0]);
    });
    fetch(`/api/brands/${brandId}/content?type=about`).then(r => r.json()).then(d => {
      if (d.content?.length) setAboutContent(d.content[0]);
    });
    fetch(`/api/brands/${brandId}/products`).then(r => r.json()).then(d => {
      setProducts(d.products || []);
    });
    fetch(`/api/brands/${brandId}/settings`).then(r => r.json()).then(d => {
      const settings = d.settings || {};
      if (settings.page_layout) {
        try {
          setLayout(JSON.parse(settings.page_layout));
        } catch {
          setLayout(getDefaultLayout());
        }
      } else {
        setLayout(getDefaultLayout());
      }
      // Load page statuses
      const statuses: Record<string, 'active' | 'draft'> = {};
      ['home', 'about', 'products', 'contact', 'blog', 'shop', 'chat'].forEach(slug => {
        statuses[slug] = (settings[`page_status_${slug}`] === 'draft') ? 'draft' : 'active';
      });
      setPageStatuses(statuses);
    });
  };

  useEffect(() => { loadData(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateContent = async (type: 'landing' | 'about') => {
    setGenerating(type);
    try {
      const res = await fetch(`/api/brands/${brandId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (type === 'landing') setLandingContent(data.content);
      else setAboutContent(data.content);
      toast.success('Content generated');
    } catch {
      toast.error('Generation failed');
    }
    setGenerating(null);
  };

  const saveLayout = useCallback(async () => {
    if (!layout) return;
    setSavingLayout(true);
    try {
      await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'page_layout', value: JSON.stringify(layout) }),
      });
      toast.success('Layout saved', 'Your page layout has been updated.');
    } catch {
      toast.error('Failed to save layout');
    }
    setSavingLayout(false);
  }, [brandId, layout, toast]);

  const togglePageStatus = async (slug: string) => {
    const newStatus = pageStatuses[slug] === 'active' ? 'draft' : 'active';
    setPageStatuses(prev => ({ ...prev, [slug]: newStatus }));
    try {
      await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `page_status_${slug}`, value: newStatus }),
      });
      toast.success(`${slug.charAt(0).toUpperCase() + slug.slice(1)} page ${newStatus === 'active' ? 'published' : 'unpublished'}`);
    } catch {
      setPageStatuses(prev => ({ ...prev, [slug]: newStatus === 'active' ? 'draft' : 'active' }));
      toast.error('Failed to update page status');
    }
  };

  const saveQuickEdit = async (field: string, value: string) => {
    if (!landingContent) return;
    try {
      await fetch(`/api/brands/${brandId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: landingContent.id,
          ...(field === 'title' ? { title: value } : { body: value }),
        }),
      });
      if (field === 'title') {
        setLandingContent(prev => prev ? { ...prev, title: value } : prev);
      } else {
        setLandingContent(prev => prev ? { ...prev, body: value } : prev);
      }
      toast.success('Content updated');
    } catch {
      toast.error('Failed to save');
    }
  };

  const downloadHTML = () => {
    if (!brand) return;
    const html = generateStaticHTML(brand, landingContent, aboutContent, products);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Website downloaded', 'Static HTML file saved');
  };

  if (!brand) return null;

  const slug = brand.slug || brand.id;

  const pages: PageInfo[] = [
    { id: 'home', name: 'Home', slug: 'home', icon: Home, description: 'Landing page with hero, features, and CTA', status: pageStatuses.home || 'active', previewPath: `/site/${slug}`, editPath: `/dashboard/${brandId}/website` },
    { id: 'about', name: 'About', slug: 'about', icon: Info, description: 'Brand story and mission', status: pageStatuses.about || 'active', previewPath: `/site/${slug}/about`, editPath: `/dashboard/${brandId}/content` },
    { id: 'products', name: 'Products', slug: 'products', icon: ShoppingBag, description: 'Product catalog and listings', status: pageStatuses.products || 'active', previewPath: `/site/${slug}/products`, editPath: `/dashboard/${brandId}/products` },
    { id: 'contact', name: 'Contact', slug: 'contact', icon: Phone, description: 'Contact form and info', status: pageStatuses.contact || 'active', previewPath: `/site/${slug}/contact`, editPath: `/dashboard/${brandId}/support` },
    { id: 'blog', name: 'Blog', slug: 'blog', icon: BookOpen, description: 'Articles and posts', status: pageStatuses.blog || 'active', previewPath: `/blog/${slug}`, editPath: `/dashboard/${brandId}/blog` },
    { id: 'shop', name: 'Shop', slug: 'shop', icon: Store, description: 'E-commerce storefront', status: pageStatuses.shop || 'active', previewPath: `/shop/${slug}`, editPath: `/dashboard/${brandId}/products` },
    { id: 'chat', name: 'Chat', slug: 'chat', icon: Bot, description: 'AI chatbot interface', status: pageStatuses.chat || 'active', previewPath: `/chat/${slug}`, editPath: `/dashboard/${brandId}/chatbot` },
  ];

  const activePages = pages.filter(p => p.status === 'active').length;
  const scoreColor = (s: number) => s >= 90 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <PageTransition>
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Website' },
            ]}
            className="mb-1"
          />
          <h1 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Globe className="h-5 w-5" />
            Website Admin
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manage pages, preview, and optimize your website
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-700 p-0.5">
            {([
              { id: 'overview' as ViewMode, icon: FileText, label: 'Pages' },
              { id: 'preview' as ViewMode, icon: Eye, label: 'Preview' },
              { id: 'editor' as ViewMode, icon: Layers, label: 'Layout' },
            ]).map(v => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === v.id
                    ? 'bg-white dark:bg-zinc-600 shadow-sm text-zinc-900 dark:text-white'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <v.icon className="h-3.5 w-3.5" />
                {v.label}
              </button>
            ))}
          </div>

          {viewMode === 'preview' && (
            <>
              <div className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-700 p-0.5">
                {([
                  { id: 'desktop' as Viewport, icon: Monitor },
                  { id: 'tablet' as Viewport, icon: Tablet },
                  { id: 'mobile' as Viewport, icon: Smartphone },
                ]).map(v => (
                  <button
                    key={v.id}
                    onClick={() => setViewport(v.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewport === v.id
                        ? 'bg-white dark:bg-zinc-600 shadow-sm text-zinc-900 dark:text-white'
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    <v.icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </>
          )}

          <Button variant="outline" size="sm" onClick={downloadHTML} className="text-xs">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">Export</span>
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ═══ OVERVIEW MODE ═══ */}
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[11px] font-medium text-zinc-400">Total Pages</span>
                    </div>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">{pages.length}</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] font-medium text-zinc-400">Active</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">{activePages}</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="h-3.5 w-3.5 text-violet-500" />
                      <span className="text-[11px] font-medium text-zinc-400">Products</span>
                    </div>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">{products.length}</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[11px] font-medium text-zinc-400">Content</span>
                    </div>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {(landingContent ? 1 : 0) + (aboutContent ? 1 : 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Page Tree */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Layers className="h-4 w-4 text-blue-500" />
                          Site Pages
                        </h2>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Toggle pages on/off • Click to preview
                        </p>
                      </div>
                      <div className="p-2 space-y-0.5">
                        {pages.map(page => (
                          <PageRow key={page.id} page={page} onToggle={togglePageStatus} />
                        ))}
                      </div>
                    </div>

                    {/* Quick Edit */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Pencil className="h-4 w-4 text-violet-500" />
                          Quick Edit — Homepage
                        </h2>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Edit hero content without leaving this page
                        </p>
                      </div>
                      <div className="p-4 space-y-4">
                        {landingContent ? (
                          <>
                            <QuickEditField
                              label="Hero Title"
                              value={landingContent.title}
                              onSave={val => saveQuickEdit('title', val)}
                            />
                            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                            <QuickEditField
                              label="Hero Description"
                              value={landingContent.body.split('\n').slice(0, 4).join('\n')}
                              onSave={val => saveQuickEdit('body', val)}
                              multiline
                            />
                          </>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-sm text-zinc-400 mb-3">No landing content yet</p>
                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() => generateContent('landing')}
                              disabled={generating === 'landing'}
                            >
                              {generating === 'landing' ? (
                                <Spinner className="h-4" />
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Generate Landing Content
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar: Performance Score */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-emerald-500" />
                          Site Performance
                          <span className="text-[10px] font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded ml-auto">Baseline</span>
                        </h2>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Estimated scores for Mayasura-generated sites
                        </p>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <ScoreCircle score={perfScores.performance} label="Performance" color={scoreColor(perfScores.performance)} />
                          <ScoreCircle score={perfScores.accessibility} label="A11y" color={scoreColor(perfScores.accessibility)} />
                          <ScoreCircle score={perfScores.bestPractices} label="Best Practices" color={scoreColor(perfScores.bestPractices)} />
                          <ScoreCircle score={perfScores.seo} label="SEO" color={scoreColor(perfScores.seo)} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Zap className="h-3 w-3 text-emerald-500" />
                            <span>First Contentful Paint: 0.8s</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Shield className="h-3 w-3 text-blue-500" />
                            <span>HTTPS enabled</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Accessibility className="h-3 w-3 text-violet-500" />
                            <span>Semantic HTML</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <ImageIcon className="h-3 w-3 text-amber-500" />
                            <span>Images optimized</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Quick Actions</h3>
                      <button
                        onClick={() => setViewMode('preview')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-500" /> Preview Website
                      </button>
                      <button
                        onClick={() => setViewMode('editor')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Layers className="h-3.5 w-3.5 text-violet-500" /> Edit Layout
                      </button>
                      <button
                        onClick={() => generateContent('landing')}
                        disabled={generating === 'landing'}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Regenerate Content
                      </button>
                      <button
                        onClick={downloadHTML}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-emerald-500" /> Export Static HTML
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ EDITOR MODE ═══ */}
          {viewMode === 'editor' && layout && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <LayoutEditor
                layout={layout}
                onChange={setLayout}
                onSave={saveLayout}
                saving={savingLayout}
              />
            </motion.div>
          )}

          {/* ═══ PREVIEW MODE ═══ */}
          {viewMode === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center overflow-auto p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950"
            >
              {/* Preview Frame */}
              <motion.div
                animate={{ width: viewport === 'desktop' ? '100%' : `${viewportWidths[viewport]}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-lg flex flex-col"
                style={{ maxWidth: '100%', height: 'calc(100vh - 12rem)' }}
              >
                {/* Browser Chrome */}
                <div className="bg-zinc-100 dark:bg-zinc-700 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-600 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="bg-white dark:bg-zinc-600 rounded-md px-3 py-1 text-xs text-zinc-400 max-w-xs flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {brand.name.toLowerCase().replace(/\s+/g, '')}.com
                    </div>
                  </div>
                  <a
                    href={`/site/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-400 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Iframe Preview */}
                <div className="flex-1 overflow-hidden">
                  <iframe
                    src={`/site/${slug}`}
                    className="w-full h-full border-0"
                    title={`${brand.name} Preview`}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </PageTransition>
  );
}

function generateStaticHTML(
  brand: Brand,
  landing: ContentItem | null,
  about: ContentItem | null,
  products: ProductItem[]
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${brand.font_body}', system-ui, sans-serif; color: ${brand.primary_color}; background: ${brand.secondary_color}; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    nav { background: ${brand.primary_color}; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
    nav .logo { display: flex; align-items: center; gap: 8px; color: ${brand.secondary_color}; font-weight: 600; }
    nav .logo-icon { width: 32px; height: 32px; background: ${brand.accent_color}; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
    nav .links { display: flex; gap: 24px; color: ${brand.secondary_color}; opacity: 0.7; font-size: 14px; }
    .hero { padding: 80px 24px; text-align: center; }
    .hero h1 { font-family: '${brand.font_heading}', system-ui, sans-serif; font-size: 48px; font-weight: 700; margin-bottom: 16px; }
    .hero p { font-size: 16px; max-width: 600px; margin: 0 auto 32px; opacity: 0.7; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 24px; background: ${brand.accent_color}; color: white; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .section { padding: 64px 24px; }
    .section h2 { font-family: '${brand.font_heading}', system-ui, sans-serif; font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
    .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; max-width: 800px; margin: 0 auto; }
    .product { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
    .product h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .product .price { font-size: 14px; opacity: 0.5; }
    .product .desc { font-size: 14px; opacity: 0.7; margin-top: 8px; line-height: 1.5; }
    footer { background: ${brand.primary_color}; color: ${brand.secondary_color}; padding: 24px; text-align: center; font-size: 14px; opacity: 0.7; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">
      <div class="logo-icon">${brand.name[0]}</div>
      <span>${brand.name}</span>
    </div>
    <div class="links"><span>Home</span><span>Products</span><span>About</span><span>Contact</span></div>
  </nav>
  <div class="hero">
    <h1>${landing?.title || brand.name}</h1>
    <p>${landing?.body?.split('\n').slice(0, 3).join(' ') || brand.tagline || ''}</p>
    <a href="#" class="btn">Get Started</a>
  </div>
  ${products.length > 0 ? `
  <div class="section">
    <h2>Our Products</h2>
    <div class="products">
      ${products.map(p => `<div class="product"><h3>${p.name}</h3><div class="price">${p.currency} ${p.price}</div><div class="desc">${p.description || ''}</div></div>`).join('\n      ')}
    </div>
  </div>` : ''}
  ${about ? `
  <div class="section">
    <h2>About Us</h2>
    <p style="max-width:600px;margin:0 auto;text-align:center;line-height:1.6;opacity:0.7">${about.body.split('\n').slice(0, 4).join(' ')}</p>
  </div>` : ''}
  <footer>© 2026 ${brand.name}. Built with Mayasura.</footer>
</body>
</html>`;
}
