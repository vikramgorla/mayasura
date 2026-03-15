'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/loading';
import { BrandData, Product } from '@/lib/types';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
  onBack: () => void;
}

/* ─── Per-product validation ───────────────────────────────── */
interface ProductErrors {
  name?: string;
  price?: string;
  description?: string;
  category?: string;
}

function validateProduct(product: Product): ProductErrors {
  const errors: ProductErrors = {};
  if (!product.name.trim()) {
    errors.name = 'Product name is required';
  } else if (product.name.trim().length > 100) {
    errors.name = 'Must be under 100 characters';
  }
  if (product.price !== undefined && product.price < 0) {
    errors.price = 'Price cannot be negative';
  }
  if (product.description && product.description.length > 500) {
    errors.description = 'Must be under 500 characters';
  }
  if (product.category && product.category.length > 50) {
    errors.category = 'Must be under 50 characters';
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-xs text-red-500 dark:text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const pct = (value?.length ?? 0) / max;
  if (!value || pct < 0.6) return null;
  return (
    <span className={`text-xs ${pct >= 1 ? 'text-red-500' : pct >= 0.8 ? 'text-amber-500' : 'text-zinc-400'}`}>
      {value.length}/{max}
    </span>
  );
}

export default function StepProducts({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState<number | null>(null);
  const [rateLimited, setRateLimited] = useState<Record<number, boolean>>({});
  const [productTouched, setProductTouched] = useState<Record<number, Record<string, boolean>>>({});
  const [productErrors, setProductErrors] = useState<Record<number, ProductErrors>>({});

  const addProduct = () => {
    updateData({
      products: [...data.products, { name: '', description: '', price: 0, category: '' }],
    });
  };

  const updateProduct = (index: number, updates: Partial<Product>) => {
    const products = [...data.products];
    products[index] = { ...products[index], ...updates };
    updateData({ products });
    // Re-validate touched fields
    const touched = productTouched[index] || {};
    if (Object.keys(touched).some((k) => touched[k])) {
      const errs = validateProduct(products[index]);
      setProductErrors((prev) => ({ ...prev, [index]: errs }));
    }
  };

  const handleProductBlur = (index: number, field: string) => {
    setProductTouched((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: true },
    }));
    const errs = validateProduct(data.products[index]);
    setProductErrors((prev) => ({ ...prev, [index]: errs }));
  };

  const removeProduct = (index: number) => {
    updateData({ products: data.products.filter((_, i) => i !== index) });
    setProductErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const generateDescription = async (index: number) => {
    const product = data.products[index];
    if (!product.name || loading === index || rateLimited[index]) return;

    setLoading(index);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product-description',
          productName: product.name,
          brandName: data.name,
          brandVoice: data.brandVoice,
        }),
      });
      if (res.status === 429) {
        setRateLimited((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => setRateLimited((prev) => ({ ...prev, [index]: false })), 30000);
        setLoading(null);
        return;
      }
      const result = await res.json();
      if (result.description) {
        updateProduct(index, { description: result.description });
      }
    } catch (e) {
      // handled by toast
    }
    setLoading(null);
  };

  const handleNext = () => {
    // Validate all products
    const allErrors: Record<number, ProductErrors> = {};
    let hasError = false;
    data.products.forEach((p, i) => {
      const errs = validateProduct(p);
      allErrors[i] = errs;
      if (Object.keys(errs).length > 0) hasError = true;
    });
    setProductErrors(allErrors);
    // Mark all touched
    const allTouched: Record<number, Record<string, boolean>> = {};
    data.products.forEach((_, i) => {
      allTouched[i] = { name: true, price: true, description: true, category: true };
    });
    setProductTouched(allTouched);
    if (!hasError) onNext();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Products & Services</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Add what your brand offers. AI can help write compelling descriptions.</p>
      </div>

      <div className="space-y-6">
        {data.products.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">No products yet. Add your first product or service.</p>
            <Button onClick={addProduct} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        )}

        {data.products.map((product, i) => {
          const errs = productErrors[i] || {};
          const touched = productTouched[i] || {};
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Product {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeProduct(i)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <CharCount value={product.name} max={100} />
                  </div>
                  <Input
                    value={product.name}
                    onChange={(e) => updateProduct(i, { name: e.target.value })}
                    onBlur={() => handleProductBlur(i, 'name')}
                    placeholder="Product name"
                    className={touched.name && errs.name ? 'border-red-400' : ''}
                    maxLength={100}
                  />
                  <FieldError message={touched.name ? errs.name : undefined} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Price</label>
                    <Input
                      type="number"
                      value={product.price || ''}
                      onChange={(e) => updateProduct(i, { price: parseFloat(e.target.value) || 0 })}
                      onBlur={() => handleProductBlur(i, 'price')}
                      placeholder="0.00"
                      min={0}
                      step="0.01"
                      className={touched.price && errs.price ? 'border-red-400' : ''}
                    />
                    <FieldError message={touched.price ? errs.price : undefined} />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Currency</label>
                    <Input
                      value={product.currency || 'USD'}
                      onChange={(e) => updateProduct(i, { currency: e.target.value.toUpperCase().slice(0, 3) })}
                      placeholder="USD"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400">Category</label>
                  <CharCount value={product.category || ''} max={50} />
                </div>
                <Input
                  value={product.category || ''}
                  onChange={(e) => updateProduct(i, { category: e.target.value })}
                  onBlur={() => handleProductBlur(i, 'category')}
                  placeholder="e.g., Clothing, Accessories, Services..."
                  maxLength={50}
                />
                <FieldError message={touched.category ? errs.category : undefined} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400">Description</label>
                    <CharCount value={product.description || ''} max={500} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generateDescription(i)}
                    disabled={!product.name || loading === i || rateLimited[i]}
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-xs"
                    title={rateLimited[i] ? 'Rate limit reached. Please wait 30s.' : undefined}
                  >
                    {loading === i
                      ? <><Spinner className="h-3 w-3" /> Generating...</>
                      : rateLimited[i]
                      ? '⏳ Rate limited'
                      : <><Sparkles className="h-3 w-3" /> Generate</>
                    }
                  </Button>
                </div>
                <Textarea
                  value={product.description || ''}
                  onChange={(e) => updateProduct(i, { description: e.target.value })}
                  onBlur={() => handleProductBlur(i, 'description')}
                  placeholder="Describe this product..."
                  rows={3}
                  className={touched.description && errs.description ? 'border-red-400' : ''}
                  maxLength={500}
                />
                <FieldError message={touched.description ? errs.description : undefined} />
              </div>
            </div>
          );
        })}

        {data.products.length > 0 && (
          <Button onClick={addProduct} variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            Add Another Product
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button onClick={onBack} variant="ghost" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
