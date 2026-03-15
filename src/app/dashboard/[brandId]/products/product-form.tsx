"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: string | null;
  status: string;
}

interface ProductFormProps {
  brandId: string;
  product: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProductForm({
  brandId,
  product,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    currency: product?.currency || "USD",
    imageUrl: product?.imageUrl || "",
    category: product?.category || "",
    status: product?.status || "active",
  });

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      imageUrl: form.imageUrl.trim() || undefined,
      category: form.category.trim() || undefined,
      status: form.status,
    };

    try {
      const url = isEdit
        ? `/api/v1/brands/${brandId}/products/${product.id}`
        : `/api/v1/brands/${brandId}/products`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) onSaved();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6 p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--text-primary)]">
          {isEdit ? "Edit Product" : "New Product"}
        </h2>
        <button onClick={onCancel}>
          <X className="h-4 w-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="Product name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="sm:col-span-2 px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleSave}
          disabled={saving || !form.name.trim()}
          variant="brand"
          size="sm"
        >
          {saving && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
          {isEdit ? "Save Changes" : "Add Product"}
        </Button>
        <Button onClick={onCancel} variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
}
