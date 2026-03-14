'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { Brand } from '@/lib/types';
import { useTheme } from '@/components/theme-provider';
import { useToast } from '@/components/ui/toast';

export default function DashboardListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { resolved, setTheme } = useTheme();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/brands').then(r => r.json()),
      fetch('/api/auth/me').then(r => r.json()),
    ]).then(([brandData, userData]) => {
      setBrands(brandData.brands || []);
      setUser(userData.user || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.info('Signed out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-slate-900 text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:inline">Mayasura</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user && (
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
            <Link href="/create">
              <Button size="sm" variant="brand">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Brand</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Your Brands</h1>
          {user && <p className="text-sm text-slate-400 hidden sm:block">Welcome, {user.name}</p>}
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your brand ecosystems</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : brands.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 sm:p-12 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No brands yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first brand ecosystem to get started.</p>
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
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all block"
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
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant={brand.status === 'launched' ? 'success' : 'secondary'}>
                            {brand.status}
                          </Badge>
                          <Badge variant="outline">{channels.length} channels</Badge>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                      </div>
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
