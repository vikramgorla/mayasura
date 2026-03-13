'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/loading';
import { Brand } from '@/lib/types';

export default function DashboardListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then(r => r.json())
      .then(data => { setBrands(data.brands || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Mayasura</span>
          </Link>
          <Link href="/create">
            <Button size="sm" variant="brand">
              <Plus className="h-3.5 w-3.5" />
              New Brand
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Your Brands</h1>
        <p className="text-slate-500 mb-8">Manage your brand ecosystems</p>

        {brands.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">No brands yet</h2>
            <p className="text-slate-500 mb-6">Create your first brand ecosystem to get started.</p>
            <Link href="/create">
              <Button variant="brand">
                <Plus className="h-4 w-4" />
                Create Your First Brand
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => {
              const channels = JSON.parse(brand.channels || '[]');
              return (
                <Link
                  key={brand.id}
                  href={`/dashboard/${brand.id}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="h-24 p-4 flex items-end" style={{ backgroundColor: brand.primary_color }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                      >
                        {brand.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: brand.secondary_color }}>{brand.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {brand.tagline || 'No tagline'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant={brand.status === 'launched' ? 'success' : 'secondary'}>
                          {brand.status}
                        </Badge>
                        <Badge variant="outline">{channels.length} channels</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
