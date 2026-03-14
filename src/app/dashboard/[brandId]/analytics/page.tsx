'use client';

import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockStats = [
  { label: 'Total Visitors', value: '—', change: '—', icon: Users, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { label: 'Page Views', value: '—', change: '—', icon: Eye, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { label: 'Click Rate', value: '—', change: '—', icon: MousePointerClick, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { label: 'Avg. Session', value: '—', change: '—', icon: Clock, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <BarChart3 className="h-6 w-6" />
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your brand&apos;s digital performance</p>
        </div>
        <Badge variant="warning">Coming Soon</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Traffic Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 dark:text-slate-500">Analytics data will appear here</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Once your brand goes live</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 dark:text-slate-500">Channel metrics will appear here</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Chatbot usage, content views, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Coming */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">What&apos;s Coming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Website Analytics</h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Page views & unique visitors</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Bounce rate & session duration</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Traffic sources</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Chatbot Metrics</h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Total conversations</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Resolution rate</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Popular topics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Content Performance</h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Content engagement</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Social reach estimates</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Email open rates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
