"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Percent, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function DiscountsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
  });

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/discounts`);
      if (res.ok) {
        const json = await res.json();
        setDiscounts(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  function resetForm() {
    setForm({
      code: "",
      type: "percentage",
      value: "",
      minOrder: "",
      maxUses: "",
      expiresAt: "",
    });
    setShowForm(false);
  }

  async function handleCreate() {
    if (!form.code.trim() || !form.value) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/brands/${brandId}/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim(),
          type: form.type,
          value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : undefined,
          maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });

      if (res.ok) {
        resetForm();
        fetchDiscounts();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, active: boolean) {
    try {
      await fetch(`/api/v1/brands/${brandId}/discounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      fetchDiscounts();
    } catch {
      // silent
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this discount code?")) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/discounts/${id}`, {
        method: "DELETE",
      });
      fetchDiscounts();
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Discount Codes
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {discounts.length} code{discounts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          variant="brand"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Code
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">
              New Discount Code
            </h2>
            <button onClick={resetForm}>
              <X className="h-4 w-4 text-[var(--text-secondary)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              placeholder="Code (e.g. SAVE20) *"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono"
            />
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "percentage" | "fixed",
                })
              }
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
            <input
              type="number"
              placeholder={form.type === "percentage" ? "Value (%)" : "Value ($)"}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
            <input
              type="number"
              placeholder="Min order amount"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
            <input
              type="number"
              placeholder="Max uses"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
            <input
              type="date"
              placeholder="Expires at"
              value={form.expiresAt}
              onChange={(e) =>
                setForm({ ...form, expiresAt: e.target.value })
              }
              className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleCreate}
              disabled={saving || !form.code.trim() || !form.value}
              variant="brand"
              size="sm"
            >
              {saving && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              Create Code
            </Button>
            <Button onClick={resetForm} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Discount List */}
      {discounts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <Percent className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">
            No discount codes yet
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Create codes to offer promotions to your customers.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {discounts.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-4 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm text-[var(--text-primary)]">
                    {d.code}
                  </span>
                  <Badge variant={d.active ? "default" : "secondary"}>
                    {d.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                  <span>
                    {d.type === "percentage" ? `${d.value}%` : `$${d.value}`} off
                  </span>
                  <span>
                    {d.usedCount}
                    {d.maxUses ? `/${d.maxUses}` : ""} used
                  </span>
                  {d.expiresAt && (
                    <span>
                      Expires{" "}
                      {new Date(d.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(d.id, d.active)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    d.active
                      ? "bg-violet-600"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      d.active ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(d.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
