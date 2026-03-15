'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Plus, Trash2, ToggleLeft, ToggleRight, Copy, Check,
  Percent, DollarSign, Shuffle, Edit2, X, Calendar, ShoppingCart,
  Users, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';

interface DiscountCode {
  id: string;
  brand_id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  active: number;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

function generateCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DiscountsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const toast = useToast();

  // Form state
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_order: '',
    max_uses: '',
    starts_at: '',
    expires_at: '',
  });
  const [saving, setSaving] = useState(false);

  const loadDiscounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}/discounts`);
      const data = await res.json();
      setDiscounts(data.discounts || []);
    } catch {
      toast.error('Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadDiscounts(); }, [loadDiscounts]);

  const resetForm = () => {
    setForm({ code: '', type: 'percentage', value: '', min_order: '', max_uses: '', starts_at: '', expires_at: '' });
    setEditingId(null);
    setShowCreate(false);
  };

  const startEdit = (d: DiscountCode) => {
    setForm({
      code: d.code,
      type: d.type,
      value: String(d.value),
      min_order: d.min_order ? String(d.min_order) : '',
      max_uses: d.max_uses ? String(d.max_uses) : '',
      starts_at: d.starts_at ? d.starts_at.slice(0, 10) : '',
      expires_at: d.expires_at ? d.expires_at.slice(0, 10) : '',
    });
    setEditingId(d.id);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.value) {
      toast.error('Code and value are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/brands/${brandId}/discounts`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discountId: editingId,
            code: form.code.trim().toUpperCase(),
            type: form.type,
            value: Number(form.value),
            min_order: form.min_order ? Number(form.min_order) : null,
            max_uses: form.max_uses ? Number(form.max_uses) : null,
            starts_at: form.starts_at || null,
            expires_at: form.expires_at || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDiscounts(data.discounts);
        toast.success('Discount code updated');
      } else {
        const res = await fetch(`/api/brands/${brandId}/discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: form.code.trim().toUpperCase(),
            type: form.type,
            value: Number(form.value),
            min_order: form.min_order ? Number(form.min_order) : null,
            max_uses: form.max_uses ? Number(form.max_uses) : null,
            starts_at: form.starts_at || null,
            expires_at: form.expires_at || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDiscounts(data.discounts);
        toast.success('Discount code created');
      }
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete discount code "${code}"?`)) return;
    try {
      const res = await fetch(`/api/brands/${brandId}/discounts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscounts(data.discounts);
      toast.success('Discount deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (d: DiscountCode) => {
    try {
      const res = await fetch(`/api/brands/${brandId}/discounts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountId: d.id, active: d.active ? 0 : 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscounts(data.discounts);
      toast.success(d.active ? 'Code deactivated' : 'Code activated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Copied!');
  };

  const totalSavings = discounts.reduce((sum, d) => {
    if (d.type === 'percentage') return sum; // can't calculate without order totals
    return sum + d.value * d.used_count;
  }, 0);

  const activeCount = discounts.filter(d => d.active).length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-500" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-8">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Discounts' },
          ]}
          className="mb-4"
        />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                <Tag className="h-6 w-6" />
                Discount Codes
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Create and manage promotional discount codes
              </p>
            </div>
            <Button
              variant="brand"
              onClick={() => { setEditingId(null); resetForm(); setShowCreate(true); }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Code
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Codes', value: discounts.length, icon: Tag, color: 'violet' },
              { label: 'Active', value: activeCount, icon: TrendingUp, color: 'emerald' },
              { label: 'Total Uses', value: discounts.reduce((s, d) => s + d.used_count, 0), icon: Users, color: 'blue' },
              { label: 'Fixed Savings', value: `$${totalSavings.toFixed(0)}`, icon: ShoppingCart, color: 'amber' },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`h-4 w-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] text-zinc-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create/Edit Form */}
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <Card className="border-violet-200 dark:border-violet-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{editingId ? 'Edit Discount Code' : 'Create New Discount Code'}</span>
                      <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600">
                        <X className="h-4 w-4" />
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Code */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Code <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={form.code}
                            onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                            placeholder="e.g. SUMMER20"
                            className="font-mono uppercase"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
                            title="Auto-generate code"
                          >
                            <Shuffle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Type + Value */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Discount Type & Value <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <button
                              onClick={() => setForm(f => ({ ...f, type: 'percentage' }))}
                              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                                form.type === 'percentage'
                                  ? 'bg-violet-500 text-white'
                                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <Percent className="h-3.5 w-3.5" />
                              %
                            </button>
                            <button
                              onClick={() => setForm(f => ({ ...f, type: 'fixed' }))}
                              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                                form.type === 'fixed'
                                  ? 'bg-violet-500 text-white'
                                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <DollarSign className="h-3.5 w-3.5" />
                              $
                            </button>
                          </div>
                          <Input
                            type="number"
                            value={form.value}
                            onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
                            placeholder={form.type === 'percentage' ? '20' : '10.00'}
                            min="0"
                            max={form.type === 'percentage' ? '100' : undefined}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Min order */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Min. Order ($)
                        </label>
                        <Input
                          type="number"
                          value={form.min_order}
                          onChange={(e) => setForm(f => ({ ...f, min_order: e.target.value }))}
                          placeholder="No minimum"
                          min="0"
                        />
                      </div>

                      {/* Max uses */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Max Uses
                        </label>
                        <Input
                          type="number"
                          value={form.max_uses}
                          onChange={(e) => setForm(f => ({ ...f, max_uses: e.target.value }))}
                          placeholder="Unlimited"
                          min="1"
                        />
                      </div>

                      {/* Dates */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          <Calendar className="h-3 w-3 inline mr-1" />Start Date
                        </label>
                        <Input
                          type="date"
                          value={form.starts_at}
                          onChange={(e) => setForm(f => ({ ...f, starts_at: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          <Calendar className="h-3 w-3 inline mr-1" />Expiry Date
                        </label>
                        <Input
                          type="date"
                          value={form.expires_at}
                          onChange={(e) => setForm(f => ({ ...f, expires_at: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="brand" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : editingId ? 'Update Code' : 'Create Code'}
                      </Button>
                      <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discount Codes List */}
          {discounts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">No discount codes yet</h3>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
                  Create promotional codes to drive sales and reward customers.
                </p>
                <Button variant="brand" onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Code
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {discounts.map((d, i) => {
                const isExpired = d.expires_at && new Date(d.expires_at) < new Date();
                const isNotStarted = d.starts_at && new Date(d.starts_at) > new Date();
                const usagePercent = d.max_uses ? Math.min(100, (d.used_count / d.max_uses) * 100) : null;

                return (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className={`transition-opacity ${!d.active || isExpired ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          {/* Code info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <button
                                onClick={() => copyCode(d.code)}
                                className="font-mono font-bold text-base text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 flex items-center gap-1.5 group"
                                title="Copy code"
                              >
                                {d.code}
                                {copiedCode === d.code
                                  ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                }
                              </button>
                              {/* Badge */}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                d.type === 'percentage'
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {d.type === 'percentage' ? `${d.value}% off` : `$${d.value} off`}
                              </span>
                              {isExpired && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                  Expired
                                </span>
                              )}
                              {isNotStarted && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                  Scheduled
                                </span>
                              )}
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                              {d.min_order && <span>Min. ${d.min_order}</span>}
                              <span>{d.used_count} uses{d.max_uses ? ` / ${d.max_uses}` : ''}</span>
                              {d.starts_at && <span>From {formatDate(d.starts_at)}</span>}
                              {d.expires_at && <span>Until {formatDate(d.expires_at)}</span>}
                            </div>

                            {/* Usage bar */}
                            {usagePercent !== null && (
                              <div className="mt-2">
                                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden w-full max-w-xs">
                                  <motion.div
                                    className={`h-full rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercent}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleToggle(d)}
                              className={`p-2 rounded-lg transition-colors ${
                                d.active
                                  ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                  : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                              }`}
                              title={d.active ? 'Deactivate' : 'Activate'}
                            >
                              {d.active
                                ? <ToggleRight className="h-5 w-5" />
                                : <ToggleLeft className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => startEdit(d)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id, d.code)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
