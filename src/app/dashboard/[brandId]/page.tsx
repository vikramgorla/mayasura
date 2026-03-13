'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, MessageSquare, Package, FileText, BarChart3, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/lib/types';

interface DashboardData {
  brand: Brand;
  productCount: number;
  contentCount: number;
}

export default function BrandDashboardPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/brands/${brandId}`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/products`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/content`).then(r => r.json()),
    ]).then(([brandData, productData, contentData]) => {
      setData({
        brand: brandData.brand,
        productCount: productData.products?.length || 0,
        contentCount: contentData.content?.length || 0,
      });
    });
  }, [brandId]);

  if (!data) return null;

  const channels = JSON.parse(data.brand.channels || '[]');

  const quickLinks = [
    { href: `/dashboard/${brandId}/website`, icon: Globe, label: 'Website', desc: 'View generated website', color: 'bg-blue-50 text-blue-600' },
    { href: `/dashboard/${brandId}/chatbot`, icon: MessageSquare, label: 'Chatbot', desc: 'Test your AI chatbot', color: 'bg-emerald-50 text-emerald-600' },
    { href: `/dashboard/${brandId}/products`, icon: Package, label: 'Products', desc: `${data.productCount} products`, color: 'bg-amber-50 text-amber-600' },
    { href: `/dashboard/${brandId}/content`, icon: FileText, label: 'Content', desc: `${data.contentCount} pieces`, color: 'bg-purple-50 text-purple-600' },
    { href: `/dashboard/${brandId}/analytics`, icon: BarChart3, label: 'Analytics', desc: 'View metrics', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{data.brand.name}</h1>
          <Badge variant={data.brand.status === 'launched' ? 'success' : 'secondary'}>
            {data.brand.status}
          </Badge>
        </div>
        <p className="text-slate-500">{data.brand.tagline || 'No tagline'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">Channels</p>
            <p className="text-2xl font-bold">{channels.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">Products</p>
            <p className="text-2xl font-bold">{data.productCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">Content</p>
            <p className="text-2xl font-bold">{data.contentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <p className="text-2xl font-bold capitalize">{data.brand.status}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${link.color}`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{link.label}</p>
                  <p className="text-xs text-slate-400">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Channels */}
      <h2 className="text-lg font-semibold mb-4">Active Channels</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-500">Enabled channels for this brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {channels.length === 0 ? (
              <p className="text-sm text-slate-400">No channels enabled</p>
            ) : (
              channels.map((channel: string) => (
                <Badge key={channel} variant="default" className="capitalize">
                  {channel === 'ecommerce' ? (
                    <><ShoppingBag className="h-3 w-3 mr-1" /> E-Commerce</>
                  ) : (
                    channel.replace(/-/g, ' ')
                  )}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
