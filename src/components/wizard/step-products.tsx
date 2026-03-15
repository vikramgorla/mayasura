"use client";

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Loader2,
  Package,
} from "lucide-react";
import type { WizardData, WizardProduct } from "@/lib/types/wizard";

interface StepProductsProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

export function StepProducts({ data, onChange }: StepProductsProps) {
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const addProduct = useCallback(() => {
    onChange({
      products: [
        ...data.products,
        { id: nanoid(), name: "", currency: "USD" },
      ],
    });
  }, [data.products, onChange]);

  const updateProduct = useCallback(
    (id: string, updates: Partial<WizardProduct>) => {
      onChange({
        products: data.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      });
    },
    [data.products, onChange]
  );

  const removeProduct = useCallback(
    (id: string) => {
      onChange({
        products: data.products.filter((p) => p.id !== id),
      });
    },
    [data.products, onChange]
  );

  const moveProduct = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = data.products.findIndex((p) => p.id === id);
      if (index < 0) return;
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= data.products.length) return;

      const updated = [...data.products];
      const item = updated[index];
      const swapItem = updated[newIndex];
      if (item && swapItem) {
        updated[index] = swapItem;
        updated[newIndex] = item;
      }
      onChange({ products: updated });
    },
    [data.products, onChange]
  );

  const enhanceDescription = useCallback(
    async (product: WizardProduct) => {
      if (!product.name) return;
      setEnhancingId(product.id);
      try {
        const res = await fetch("/api/v1/ai/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "enhance-product",
            productName: product.name,
            currentDescription: product.description || product.name,
            brandVoice: data.brandVoice || undefined,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.description) {
            updateProduct(product.id, {
              description: json.data.description,
            });
          }
        }
      } catch {
        // silent
      } finally {
        setEnhancingId(null);
      }
    },
    [data.brandVoice, updateProduct]
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Products & Services
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Add what you sell. This step is optional — you can add more later.
        </p>
      </div>

      {data.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
          <h3 className="font-medium text-[var(--text-primary)]">
            No products yet
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">
            Add your products or services, or skip this step.
          </p>
          <Button variant="brand" onClick={addProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.products.map((product, index) => (
            <div
              key={product.id}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveProduct(product.id, "up")}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProduct(product.id, "down")}
                    disabled={index === data.products.length - 1}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)]">
                      Name <span className="text-[var(--error)]">*</span>
                    </label>
                    <Input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(product.id, { name: e.target.value })
                      }
                      placeholder="Product name"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[var(--text-secondary)]">
                        Price
                      </label>
                      <Input
                        type="number"
                        value={product.price ?? ""}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            price: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="0.00"
                        className="mt-1"
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-secondary)]">
                        Category
                      </label>
                      <Input
                        value={product.category ?? ""}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            category: e.target.value,
                          })
                        }
                        placeholder="Category"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="pl-8">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-[var(--text-secondary)]">
                      Description
                    </label>
                    <Textarea
                      value={product.description ?? ""}
                      onChange={(e) =>
                        updateProduct(product.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe this product..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enhanceDescription(product)}
                    disabled={!product.name || enhancingId === product.id}
                    title="AI enhance description"
                  >
                    {enhancingId === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addProduct} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
}
