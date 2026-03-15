"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  BarChart3,
  Eye,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  TrendingDown,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "@/components/ui/chart";

interface AnalyticsData {
  total: number;
  prevTotal: number;
  uniqueVisitors: number;
  prevUniqueVisitors: number;
  byDay: { date: string; count: number }[];
  byPage: { page: string; count: number }[];
  devices: { desktop: number; mobile: number; tablet: number };
  byReferrer: { referrer: string | null; count: number }[];
}

const PERIOD_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

function trendPct(current: number, previous: number): { pct: number; up: boolean } {
  if (previous === 0) return { pct: current > 0 ? 100 : 0, up: true };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export default function AnalyticsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/analytics?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [brandId, days]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) return <AnalyticsSkeleton />;

  if (!data || data.total === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-6">Analytics</h1>
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <BarChart3 className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">No analytics data yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Share your site to start tracking. Page views are recorded automatically when visitors browse your consumer site.
          </p>
        </div>
      </div>
    );
  }

  const viewsTrend = trendPct(data.total, data.prevTotal);
  const visitorsTrend = trendPct(data.uniqueVisitors, data.prevUniqueVisitors);
  const totalDevices = data.devices.desktop + data.devices.mobile + data.devices.tablet;

  const chartData = data.byDay.map((d) => ({
    label: d.date,
    value: d.count,
  }));

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)]">Site traffic and visitor insights</p>
        </div>
        <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-lg p-0.5">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                days === opt.value
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Total Views"
          value={data.total}
          icon={Eye}
          trend={viewsTrend}
        />
        <MetricCard
          label="Unique Visitors"
          value={data.uniqueVisitors}
          icon={Users}
          trend={visitorsTrend}
        />
        <MetricCard
          label="Pages / Visit"
          value={data.uniqueVisitors > 0 ? Math.round((data.total / data.uniqueVisitors) * 10) / 10 : 0}
          icon={Globe}
        />
        <MetricCard
          label="Top Pages"
          value={data.byPage.length}
          icon={BarChart3}
        />
      </div>

      {/* Line Chart */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Page Views Over Time</h3>
        <LineChart data={chartData} height={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Top Pages</h3>
          {data.byPage.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No page data</p>
          ) : (
            <div className="space-y-2">
              {data.byPage.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-primary)] truncate flex-1 mr-2 font-mono">
                    {p.page}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(p.count / (data.byPage[0]?.count || 1)) * 100}%`,
                          backgroundColor: "var(--accent)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] w-8 text-right">
                      {p.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Devices</h3>
          {totalDevices === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No device data</p>
          ) : (
            <div className="space-y-3">
              <DeviceBar label="Desktop" icon={Monitor} value={data.devices.desktop} total={totalDevices} />
              <DeviceBar label="Mobile" icon={Smartphone} value={data.devices.mobile} total={totalDevices} />
              <DeviceBar label="Tablet" icon={Tablet} value={data.devices.tablet} total={totalDevices} />
            </div>
          )}
        </div>
      </div>

      {/* Referrers */}
      {data.byReferrer.length > 0 && (
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Top Referrers</h3>
          <div className="space-y-2">
            {data.byReferrer.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)] truncate flex-1 mr-2">
                  {r.referrer || "Direct"}
                </span>
                <span className="text-xs text-[var(--text-secondary)] shrink-0">
                  {r.count} visit{r.count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label, value, icon: Icon, trend,
}: {
  label: string;
  value: number;
  icon: typeof Eye;
  trend?: { pct: number; up: boolean };
}) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[var(--text-tertiary)]" />
        <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-semibold text-[var(--text-primary)]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {trend && trend.pct > 0 && (
          <span className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${trend.up ? "text-green-600" : "text-red-500"}`}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.pct}%
          </span>
        )}
      </div>
    </div>
  );
}

function DeviceBar({
  label, icon: Icon, value, total,
}: {
  label: string;
  icon: typeof Monitor;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
      <span className="text-sm text-[var(--text-primary)] w-16">{label}</span>
      <div className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
        />
      </div>
      <span className="text-xs text-[var(--text-secondary)] w-12 text-right">{pct}%</span>
      <span className="text-xs text-[var(--text-tertiary)] w-8 text-right">{value}</span>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
