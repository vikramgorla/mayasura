'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe, MessageSquare, Package, FileText, BarChart3,
  ArrowRight, ShoppingBag, Sparkles, Plus, CheckCircle,
  Circle, HeadphonesIcon, TrendingUp, Clock, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brand } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

interface DashboardData {
  brand: Brand;
  productCount: number;
  contentCount: number;
  ticketStats: { total: number; open: number; resolved: number; satisfaction: number | null };
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref} className="animate-count-up">{count}</span>;
}

function calculateHealthScore(data: DashboardData): number {
  let score = 0;
  const checks = [
    data.brand.name,
    data.brand.tagline,
    data.brand.description,
    data.brand.brand_voice,
    data.productCount > 0,
    data.contentCount > 0,
    JSON.parse(data.brand.channels || '[]').length > 0,
    data.brand.status === 'launched',
  ];
  score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return score;
}

export default function BrandDashboardPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      fetch(`/api/brands/${brandId}`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/products`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/content`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/tickets`).then(r => r.json()).catch(() => ({ stats: { total: 0, open: 0, resolved: 0, satisfaction: null } })),
    ]).then(([brandData, productData, contentData, ticketData]) => {
      setData({
        brand: brandData.brand,
        productCount: productData.products?.length || 0,
        contentCount: contentData.content?.length || 0,
        ticketStats: ticketData.stats || { total: 0, open: 0, resolved: 0, satisfaction: null },
      });
    });
  }, [brandId]);

  if (!data) return null;

  const channels = JSON.parse(data.brand.channels || '[]');
  const healthScore = calculateHealthScore(data);

  const stats = [
    { label: 'Channels', value: channels.length, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Products', value: data.productCount, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Content', value: data.contentCount, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Tickets', value: data.ticketStats.total, icon: HeadphonesIcon, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  ];

  const quickLinks = [
    { href: `/dashboard/${brandId}/website`, icon: Globe, label: 'Website', desc: 'View generated website', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' },
    { href: `/dashboard/${brandId}/chatbot`, icon: MessageSquare, label: 'Chatbot', desc: 'Test your AI chatbot', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' },
    { href: `/dashboard/${brandId}/products`, icon: Package, label: 'Products', desc: `${data.productCount} products`, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' },
    { href: `/dashboard/${brandId}/content`, icon: FileText, label: 'Content', desc: `${data.contentCount} pieces`, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
    { href: `/dashboard/${brandId}/support`, icon: HeadphonesIcon, label: 'Support', desc: `${data.ticketStats.open} open tickets`, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' },
    { href: `/dashboard/${brandId}/strategy`, icon: Sparkles, label: 'AI Strategy', desc: 'Brand insights', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600' },
  ];

  const onboardingItems = [
    { done: !!data.brand.name, label: 'Set your brand name', link: '' },
    { done: !!data.brand.tagline, label: 'Add a tagline', link: '' },
    { done: data.productCount > 0, label: 'Add your first product', link: `/dashboard/${brandId}/products` },
    { done: data.contentCount > 0, label: 'Generate website content', link: `/dashboard/${brandId}/content` },
    { done: !!data.brand.brand_voice, label: 'Define your brand voice', link: '' },
    { done: data.brand.status === 'launched', label: 'Launch your brand', link: '' },
  ];

  const completedItems = onboardingItems.filter(i => i.done).length;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{data.brand.name}</h1>
          <Badge variant={data.brand.status === 'launched' ? 'success' : 'secondary'}>
            {data.brand.status}
          </Badge>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">{data.brand.tagline || 'No tagline'}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Brand Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Brand Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  <AnimatedCounter value={healthScore} />%
                </div>
                <p className="text-xs text-zinc-400">
                  {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Getting there' : 'Needs attention'}
                </p>
              </div>
              <Progress value={healthScore} color={
                healthScore >= 80 ? 'bg-emerald-500' :
                healthScore >= 60 ? 'bg-blue-500' :
                healthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
              } />
            </CardContent>
          </Card>
        </motion.div>

        {/* Onboarding Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Getting Started
                </CardTitle>
                <span className="text-xs text-zinc-400">{completedItems}/{onboardingItems.length} complete</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onboardingItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg">
                    {item.done ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-zinc-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.03 }}
          >
            <Link href={link.href}>
              <Card className="hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${link.color}`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{link.label}</p>
                    <p className="text-xs text-zinc-400">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Live Ecosystem Links */}
      {data.brand.status === 'launched' && data.brand.slug && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">🏛️ Live Ecosystem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { href: `/site/${data.brand.slug}`, icon: Globe, label: 'Website', desc: 'Live brand website', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
              { href: `/shop/${data.brand.slug}`, icon: ShoppingBag, label: 'Shop', desc: 'E-commerce store', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
              { href: `/blog/${data.brand.slug}`, icon: FileText, label: 'Blog', desc: 'Live blog', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
              { href: `/chat/${data.brand.slug}`, icon: MessageSquare, label: 'Chatbot', desc: 'AI assistant', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${link.color}`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{link.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{link.desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Active Channels */}
      <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Active Channels</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {channels.length === 0 ? (
              <p className="text-sm text-zinc-400">No channels enabled</p>
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
