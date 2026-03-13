'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Globe, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';
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

export default function WebsitePage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [landingContent, setLandingContent] = useState<ContentItem | null>(null);
  const [aboutContent, setAboutContent] = useState<ContentItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

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
    } catch (e) {
      console.error('Generation error:', e);
    }
    setGenerating(null);
  };

  if (!brand) return null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Website Preview
          </h1>
          <p className="text-slate-500 text-sm mt-1">Preview your generated website pages</p>
        </div>
      </div>

      {/* Website Preview Frame */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
        {/* Browser Chrome */}
        <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 ml-2">
            <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 max-w-xs">
              {brand.name.toLowerCase().replace(/\s+/g, '')}.com
            </div>
          </div>
        </div>

        {/* Website Content */}
        <div style={{ backgroundColor: brand.secondary_color }}>
          {/* Nav */}
          <div className="px-8 py-4 flex items-center justify-between border-b border-slate-100" style={{ backgroundColor: brand.primary_color }}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: brand.accent_color, color: '#fff' }}>
                {brand.name[0]}
              </div>
              <span className="font-semibold text-sm" style={{ color: brand.secondary_color }}>{brand.name}</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: brand.secondary_color, opacity: 0.7 }}>
              <span>Home</span>
              <span>Products</span>
              <span>About</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="px-8 py-16 text-center">
            {landingContent ? (
              <>
                <h1 className="text-3xl font-bold mb-4" style={{ color: brand.primary_color }}>
                  {landingContent.title}
                </h1>
                <div className="text-sm max-w-xl mx-auto leading-relaxed whitespace-pre-wrap" style={{ color: brand.primary_color, opacity: 0.7 }}>
                  {landingContent.body.split('\n').slice(0, 4).join('\n')}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm mb-4">No landing content generated yet</p>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => generateContent('landing')}
                  disabled={generating === 'landing'}
                >
                  {generating === 'landing' ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> Generate Landing Page</>}
                </Button>
              </div>
            )}
            {landingContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateContent('landing')}
                disabled={generating === 'landing'}
                className="mt-4"
              >
                {generating === 'landing' ? <Spinner className="h-4" /> : <><RefreshCw className="h-3.5 w-3.5" /> Regenerate</>}
              </Button>
            )}
          </div>

          {/* Products Section */}
          {products.length > 0 && (
            <div className="px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: brand.primary_color }}>Our Products</h2>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
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
          <div className="px-8 py-12 border-t" style={{ borderColor: brand.primary_color + '10' }}>
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: brand.primary_color }}>About Us</h2>
            {aboutContent ? (
              <div className="text-sm max-w-xl mx-auto leading-relaxed text-center whitespace-pre-wrap" style={{ color: brand.primary_color, opacity: 0.7 }}>
                {aboutContent.body.split('\n').slice(0, 4).join('\n')}
              </div>
            ) : (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateContent('about')}
                  disabled={generating === 'about'}
                >
                  {generating === 'about' ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> Generate About Page</>}
                </Button>
              </div>
            )}
            {aboutContent && (
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateContent('about')}
                  disabled={generating === 'about'}
                >
                  {generating === 'about' ? <Spinner className="h-4" /> : <><RefreshCw className="h-3.5 w-3.5" /> Regenerate</>}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 text-center text-xs" style={{ backgroundColor: brand.primary_color, color: brand.secondary_color, opacity: 0.7 }}>
            © 2026 {brand.name}. Built with Mayasura.
          </div>
        </div>
      </div>
    </div>
  );
}
