'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { LayoutDashboard, Globe, MessageSquare, Package, FileText, BarChart3, ArrowLeft } from 'lucide-react';
import { PageLoader } from '@/components/ui/loading';
import { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '', icon: LayoutDashboard, label: 'Overview' },
  { href: '/website', icon: Globe, label: 'Website' },
  { href: '/chatbot', icon: MessageSquare, label: 'Chatbot' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/content', icon: FileText, label: 'Content' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function BrandDashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/brands/${brandId}`)
      .then(r => r.json())
      .then(data => { setBrand(data.brand); setLoading(false); })
      .catch(() => setLoading(false));
  }, [brandId]);

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 mb-3">
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
              <p className="text-xs text-slate-400 truncate">{brand.tagline}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const href = `/dashboard/${brandId}${item.href}`;
              const isActive = pathname === href;
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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

        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-1.5 mb-2">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: brand.primary_color }} />
            <div className="h-4 w-4 rounded-full border border-slate-200" style={{ backgroundColor: brand.secondary_color }} />
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: brand.accent_color }} />
          </div>
          <p className="text-xs text-slate-400">{brand.font_heading} / {brand.font_body}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
