'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sparkles, RefreshCw, Monitor, Tablet, Smartphone,
  Download, LayoutGrid, Eye, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
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

type Viewport = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'preview' | 'editor';

const viewportWidths: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function WebsitePage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [landingContent, setLandingContent] = useState<ContentItem | null>(null);
  const [aboutContent, setAboutContent] = useState<ContentItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [layout, setLayout] = useState<PageLayout | null>(null);
  const [savingLayout, setSavingLayout] = useState(false);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/content?type=landing`).then(r => r.json()).then(d => {
      if (d.content?.length) setLandingContent(d.content[0]);
    });
    fetch(`/api/brands/${brandId}/content?type=about`).then(r => r.json()).then(d => {
      if (d.content?.length) setAboutContent(d.content[0]);
    });
    fetch(`/api/brands/${brandId}/products`).then(r => r.json()).then(d => {
      setProducts(d.products || []);
    });
    // Load layout from settings
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

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Globe className="h-5 w-5" />
            Website
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Preview and edit your website layout</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-700 p-0.5">
            {([
              { id: 'preview' as ViewMode, icon: Eye, label: 'Preview' },
              { id: 'editor' as ViewMode, icon: Layers, label: 'Layout' },
            ]).map(v => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === v.id
                    ? 'bg-white dark:bg-zinc-600 shadow-sm text-zinc-900 dark:text-white'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <v.icon className="h-3.5 w-3.5" />
                {v.label}
              </button>
            ))}
          </div>

          {viewMode === 'preview' && (
            <>
              {/* Viewport Toggle */}
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
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <v.icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={downloadHTML} className="text-xs">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline ml-1">Download</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'editor' && layout ? (
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
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto p-4 sm:p-6"
            >
              {/* Website Preview Frame */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ width: viewportWidths[viewport] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-lg"
                  style={{ maxWidth: '100%' }}
                >
                  {/* Browser Chrome */}
                  <div className="bg-zinc-100 dark:bg-zinc-700 px-4 py-3 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-600">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="bg-white dark:bg-zinc-600 rounded-md px-3 py-1 text-xs text-zinc-400 max-w-xs">
                        {brand.name.toLowerCase().replace(/\s+/g, '')}.com
                      </div>
                    </div>
                  </div>

                  {/* Website Content */}
                  <div style={{ backgroundColor: brand.secondary_color }}>
                    {/* Nav */}
                    <div className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-zinc-100" style={{ backgroundColor: brand.primary_color }}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: brand.accent_color, color: '#fff' }}>
                          {brand.name[0]}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: brand.secondary_color }}>{brand.name}</span>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6 text-xs" style={{ color: brand.secondary_color, opacity: 0.7 }}>
                        <span>Home</span>
                        <span className="hidden sm:inline">Products</span>
                        <span className="hidden sm:inline">About</span>
                        <span>Contact</span>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="px-4 sm:px-8 py-12 sm:py-16 text-center">
                      {landingContent ? (
                        <>
                          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: brand.primary_color }}>
                            {landingContent.title}
                          </h1>
                          <div className="text-sm max-w-xl mx-auto leading-relaxed whitespace-pre-wrap" style={{ color: brand.primary_color, opacity: 0.7 }}>
                            {landingContent.body.split('\n').slice(0, 4).join('\n')}
                          </div>
                          <button
                            className="mt-6 px-6 py-2.5 rounded-lg text-sm font-medium text-white"
                            style={{ backgroundColor: brand.accent_color }}
                          >
                            Get Started
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-zinc-400 text-sm mb-4">No landing content generated yet</p>
                          <Button variant="brand" size="sm" onClick={() => generateContent('landing')} disabled={generating === 'landing'}>
                            {generating === 'landing' ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> Generate Landing Page</>}
                          </Button>
                        </div>
                      )}
                      {landingContent && (
                        <Button variant="ghost" size="sm" onClick={() => generateContent('landing')} disabled={generating === 'landing'} className="mt-4">
                          {generating === 'landing' ? <Spinner className="h-4" /> : <><RefreshCw className="h-3.5 w-3.5" /> Regenerate</>}
                        </Button>
                      )}
                    </div>

                    {/* Products Section */}
                    {products.length > 0 && (
                      <div className="px-4 sm:px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
                        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: brand.primary_color }}>Our Products</h2>
                        <div className={`grid gap-4 max-w-2xl mx-auto ${
                          viewport === 'mobile' ? 'grid-cols-1' : viewport === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'
                        }`}>
                          {products.slice(0, 6).map((product) => (
                            <div key={product.id} className="bg-white rounded-lg p-4 border border-zinc-100">
                              <div className="h-20 rounded-md mb-3 flex items-center justify-center" style={{ backgroundColor: brand.accent_color + '15' }}>
                                <span className="text-2xl">📦</span>
                              </div>
                              <h3 className="text-xs font-semibold" style={{ color: brand.primary_color }}>{product.name}</h3>
                              <p className="text-xs mt-1" style={{ color: brand.primary_color, opacity: 0.5 }}>
                                {product.currency} {product.price}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* About Section */}
                    <div className="px-4 sm:px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
                      <h2 className="text-xl font-bold mb-4 text-center" style={{ color: brand.primary_color }}>About Us</h2>
                      {aboutContent ? (
                        <div className="text-sm max-w-xl mx-auto leading-relaxed text-center whitespace-pre-wrap" style={{ color: brand.primary_color, opacity: 0.7 }}>
                          {aboutContent.body.split('\n').slice(0, 4).join('\n')}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Button variant="outline" size="sm" onClick={() => generateContent('about')} disabled={generating === 'about'}>
                            {generating === 'about' ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> Generate About Page</>}
                          </Button>
                        </div>
                      )}
                      {aboutContent && (
                        <div className="text-center mt-4">
                          <Button variant="ghost" size="sm" onClick={() => generateContent('about')} disabled={generating === 'about'}>
                            {generating === 'about' ? <Spinner className="h-4" /> : <><RefreshCw className="h-3.5 w-3.5" /> Regenerate</>}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-8 py-6 text-center text-xs" style={{ backgroundColor: brand.primary_color, color: brand.secondary_color, opacity: 0.7 }}>
                      © 2026 {brand.name}. Built with Mayasura.
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
