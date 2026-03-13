'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
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

export default function StepProducts({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState<number | null>(null);

  const addProduct = () => {
    updateData({
      products: [...data.products, { name: '', description: '', price: 0, category: '' }],
    });
  };

  const updateProduct = (index: number, updates: Partial<Product>) => {
    const products = [...data.products];
    products[index] = { ...products[index], ...updates };
    updateData({ products });
  };

  const removeProduct = (index: number) => {
    updateData({
      products: data.products.filter((_, i) => i !== index),
    });
  };

  const generateDescription = async (index: number) => {
    const product = data.products[index];
    if (!product.name) return;
    
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
      const result = await res.json();
      if (result.description) {
        updateProduct(index, { description: result.description });
      }
    } catch (e) {
      console.error('Description generation error:', e);
    }
    setLoading(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Products & Services</h2>
        <p className="text-slate-500">Add what your brand offers. AI can help write compelling descriptions.</p>
      </div>

      <div className="space-y-6">
        {data.products.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500 mb-4">No products yet. Add your first product or service.</p>
            <Button onClick={addProduct} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        )}

        {data.products.map((product, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Product {i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeProduct(i)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Name</label>
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct(i, { name: e.target.value })}
                  placeholder="Product name"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Price</label>
                  <Input
                    type="number"
                    value={product.price || ''}
                    onChange={(e) => updateProduct(i, { price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-xs text-slate-500 mb-1">Currency</label>
                  <Input
                    value={product.currency || 'USD'}
                    onChange={(e) => updateProduct(i, { currency: e.target.value })}
                    placeholder="USD"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1">Category</label>
              <Input
                value={product.category || ''}
                onChange={(e) => updateProduct(i, { category: e.target.value })}
                placeholder="e.g., Clothing, Accessories, Services..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-slate-500">Description</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateDescription(i)}
                  disabled={!product.name || loading === i}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  {loading === i ? <Spinner className="h-3" /> : <><Sparkles className="h-3 w-3" /> Generate</>}
                </Button>
              </div>
              <Textarea
                value={product.description || ''}
                onChange={(e) => updateProduct(i, { description: e.target.value })}
                placeholder="Describe this product..."
                rows={3}
              />
            </div>
          </div>
        ))}

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
        <Button onClick={onNext} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
