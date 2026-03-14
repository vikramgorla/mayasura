'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Sparkles, RefreshCw, Monitor, Tablet, Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Brand } from '@/lib/types';

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
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Website Preview
          </h1>
          <p className="text-slate-500 text-sm mt-1">Preview your generated website pages</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Viewport Toggle */}
          <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
            {([
              { id: 'desktop', icon: Monitor },
              { id: 'tablet', icon: Tablet },
              { id: 'mobile', icon: Smartphone },
            ] as const).map(v => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                className={`p-2 rounded-md transition-colors ${
                  viewport === v.id
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <v.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={downloadHTML}>
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download HTML</span>
          </Button>
        </div>
      </div>

      {/* Website Preview Frame */}
      <div className="flex justify-center">
        <motion.div
          animate={{ width: viewportWidths[viewport] }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg"
          style={{ maxWidth: '100%' }}
        >
          {/* Browser Chrome */}
          <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 ml-2">
              <div className="bg-white dark:bg-slate-600 rounded-md px-3 py-1 text-xs text-slate-400 max-w-xs">
                {brand.name.toLowerCase().replace(/\s+/g, '')}.com
              </div>
            </div>
          </div>

          {/* Website Content */}
          <div style={{ backgroundColor: brand.secondary_color }}>
            {/* Nav */}
            <div className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-100" style={{ backgroundColor: brand.primary_color }}>
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
                  <p className="text-slate-400 text-sm mb-4">No landing content generated yet</p>
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
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-slate-100">
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

            {/* Testimonials Placeholder */}
            <div className="px-4 sm:px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: brand.primary_color }}>What People Say</h2>
              <div className={`grid gap-4 max-w-2xl mx-auto ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {['Amazing product!', 'Best experience ever'].map((text, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-slate-100 text-center">
                    <p className="text-sm italic mb-2" style={{ color: brand.primary_color, opacity: 0.7 }}>&ldquo;{text}&rdquo;</p>
                    <p className="text-xs font-medium" style={{ color: brand.accent_color }}>— Happy Customer</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="px-4 sm:px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
              <h2 className="text-xl font-bold mb-4 text-center" style={{ color: brand.primary_color }}>Get In Touch</h2>
              <div className="max-w-md mx-auto text-center">
                <p className="text-sm mb-4" style={{ color: brand.primary_color, opacity: 0.6 }}>
                  Have questions? We&apos;d love to hear from you.
                </p>
                <button
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: brand.accent_color }}
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-6 text-center text-xs" style={{ backgroundColor: brand.primary_color, color: brand.secondary_color, opacity: 0.7 }}>
              © 2026 {brand.name}. Built with Mayasura.
            </div>
          </div>
        </motion.div>
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
