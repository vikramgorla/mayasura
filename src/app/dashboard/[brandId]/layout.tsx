'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Globe, MessageSquare, Package, FileText,
  BarChart3, ArrowLeft, HeadphonesIcon, Sparkles, Menu, X,
  Download, Moon, Sun, Settings, ShoppingBag, Newspaper
} from 'lucide-react';
import { PageLoader } from '@/components/ui/loading';
import { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { CommandPalette } from '@/components/command-palette';
import { useToast } from '@/components/ui/toast';
import { UserNav } from '@/components/user-nav';

const navItems = [
  { href: '', icon: LayoutDashboard, label: 'Overview' },
  { href: '/website', icon: Globe, label: 'Website' },
  { href: '/blog', icon: Newspaper, label: 'Blog' },
  { href: '/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/chatbot', icon: MessageSquare, label: 'Chatbot' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/content', icon: FileText, label: 'Content' },
  { href: '/support', icon: HeadphonesIcon, label: 'Support' },
  { href: '/strategy', icon: Sparkles, label: 'AI Strategy' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function BrandDashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolved } = useTheme();
  const toast = useToast();

  useEffect(() => {
    fetch(`/api/brands/${brandId}`)
      .then(r => r.json())
      .then(data => { setBrand(data.brand); setLoading(false); })
      .catch(() => setLoading(false));
  }, [brandId]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const exportBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mayasura-brand-${brandId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Brand exported', 'JSON file downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading) return <PageLoader />;
  if (!brand) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Brand not found</h2>
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">Back to dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090B] flex">
      <CommandPalette brandId={brandId} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-zinc-900/95 border-r border-zinc-200 dark:border-zinc-800 flex-col fixed h-full z-20 sidebar-gradient">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 mb-3">
            <ArrowLeft className="h-3 w-3" />
            All Brands
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm truncate">{brand.name}</h2>
              <p className="text-xs text-zinc-400 truncate">{brand.tagline}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const href = `/dashboard/${brandId}${item.href}`;
              const isActive = pathname === href;
              return (
                <li key={item.href || 'overview'}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
          <button
            onClick={exportBrand}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 w-full"
          >
            <Download className="h-3.5 w-3.5" />
            Export Brand Data
          </button>
          <button
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 w-full"
          >
            {resolved === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {resolved === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="flex gap-1.5 pt-2">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: brand.primary_color }} />
            <div className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: brand.secondary_color }} />
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: brand.accent_color }} />
          </div>
          <p className="text-xs text-zinc-400">{brand.font_heading} / {brand.font_body}</p>
          <div className="text-xs text-zinc-400">
            <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-600 text-[10px]">⌘K</kbd>
            <span className="ml-1.5">Command Palette</span>
          </div>
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <UserNav />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-1.5">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: brand.accent_color, color: '#fff' }}
              >
                {brand.name[0]}
              </div>
              <span className="font-semibold text-sm truncate max-w-[150px]">{brand.name}</span>
            </div>
          </div>
          <button onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')} className="p-1.5">
            {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-zinc-800 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600">
                  <ArrowLeft className="h-3 w-3" />
                  All Brands
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>
              <nav className="flex-1 p-3 overflow-y-auto">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const href = `/dashboard/${brandId}${item.href}`;
                    const isActive = pathname === href;
                    return (
                      <li key={item.href || 'overview-mobile'}>
                        <Link
                          href={href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
