"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "./product-form";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: string | null;
  sortOrder: number;
  status: string;
  stockCount: number | null;
}

export default function ProductsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/products`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch {
      // silent
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= products.length) return;

    const current = products[idx];
    const swap = products[swapIdx];
    if (!current || !swap) return;

    await Promise.all([
      fetch(`/api/v1/brands/${brandId}/products/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swap.sortOrder }),
      }),
      fetch(`/api/v1/brands/${brandId}/products/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    fetchProducts();
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Products</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          variant="brand"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <ProductForm
          brandId={brandId}
          product={editingProduct}
          onSaved={handleFormSaved}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <Package className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">Add your first product</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Products will appear in your shop.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleReorder(product.id, "up")}
                  disabled={idx === 0}
                  className="p-0.5 disabled:opacity-20"
                >
                  <ArrowUp className="h-3 w-3 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => handleReorder(product.id, "down")}
                  disabled={idx === products.length - 1}
                  className="p-0.5 disabled:opacity-20"
                >
                  <ArrowDown className="h-3 w-3 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-5 w-5 text-[var(--text-tertiary)]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[var(--text-primary)] truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-[var(--accent)]">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(product.price)}
                  </span>
                  {product.category && <Badge variant="secondary">{product.category}</Badge>}
                  <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setShowForm(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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
