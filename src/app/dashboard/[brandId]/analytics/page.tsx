'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Eye, ShoppingBag, FileText, Mail, MessageSquare, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  pageViews: {
    total: number;
    byPage: Array<{ page: string; count: number }>;
    byDay: Array<{ day: string; count: number }>;
  };
  orderCount: number;
  revenue: number;
  blogPostCount: number;
  publishedPostCount: number;
  contactCount: number;
  newContactCount: number;
  subscriberCount: number;
}

export default function AnalyticsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch(`/api/brands/${brandId}/analytics`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, [brandId]);

  const stats = [
    { label: 'Page Views', value: data?.pageViews.total || 0, icon: Eye, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' },
    { label: 'Orders', value: data?.orderCount || 0, icon: ShoppingBag, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' },
    { label: 'Revenue', value: `$${(data?.revenue || 0).toFixed(0)}`, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/30 text-green-600' },
    { label: 'Blog Posts', value: data?.publishedPostCount || 0, icon: FileText, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
    { label: 'Contacts', value: data?.contactCount || 0, icon: MessageSquare, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' },
    { label: 'Subscribers', value: data?.subscriberCount || 0, icon: Mail, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <BarChart3 className="h-6 w-6" />
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your brand&apos;s performance over the last 30 days</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views over time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Page Views Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.pageViews.byDay && data.pageViews.byDay.length > 0 ? (
                <div className="space-y-2">
                  {data.pageViews.byDay.slice(-14).map((day) => {
                    const maxCount = Math.max(...data.pageViews.byDay.map(d => d.count));
                    const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    return (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-20 flex-shrink-0">
                          {new Date(day.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-8 text-right">
                          {day.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-slate-400">
                  No page views yet. Views will appear once your live site gets traffic.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.pageViews.byPage && data.pageViews.byPage.length > 0 ? (
                <div className="space-y-3">
                  {data.pageViews.byPage.map((page, i) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-mono truncate max-w-[200px]">
                          {page.page}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {page.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-slate-400">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
