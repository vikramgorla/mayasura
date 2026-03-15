'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Brand } from '@/lib/types';
import { UserNav } from '@/components/user-nav';

export default function DashboardListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then(r => r.json())
      .then(data => {
        setBrands(data.brands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="bg-[var(--bg-surface)] border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-display font-semibold text-base tracking-tight hidden sm:inline">Mayasura</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/create">
              <Button size="sm" variant="brand">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Brand</span>
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Your Brands</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Manage your brand ecosystems</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : brands.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 sm:p-12 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">No brands yet</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Create your first brand ecosystem to get started.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/create">
                <Button variant="brand">
                  <Plus className="h-4 w-4" />
                  Create Your First Brand
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {brands.map((brand, i) => {
              const channels = JSON.parse(brand.channels || '[]');
              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/dashboard/${brand.id}`}
                    className="group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all block"
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
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
                        {brand.tagline || 'No tagline'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant={brand.status === 'launched' ? 'success' : 'secondary'}>
                            {brand.status}
                          </Badge>
                          <Badge variant="outline">{channels.length} channels</Badge>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 transition-colors flex-shrink-0" />
                      </div>
                      {brand.status === 'launched' && brand.slug && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700 flex gap-3" onClick={(e) => e.stopPropagation()}>
                          <a href={`/site/${brand.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-700">🌐 Site</a>
                          <a href={`/shop/${brand.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:text-amber-700">🛒 Shop</a>
                          <a href={`/blog/${brand.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">📝 Blog</a>
                          <a href={`/chat/${brand.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:text-emerald-700">💬 Chat</a>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
