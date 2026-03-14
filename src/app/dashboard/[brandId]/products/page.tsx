'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
}

export default function ProductsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', currency: 'USD', category: '' });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadProducts = () => {
    fetch(`/api/brands/${brandId}/products`).then(r => r.json()).then(d => setProducts(d.products || []));
  };

  useEffect(() => { loadProducts(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addProduct = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      await fetch(`/api/brands/${brandId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price) || 0,
          currency: form.currency,
          category: form.category,
        }),
      });
      setForm({ name: '', description: '', price: '', currency: 'USD', category: '' });
      setShowForm(false);
      loadProducts();
    } catch (e) {
      console.error('Error adding product:', e);
    }
    setSaving(false);
  };

  const deleteProduct = async (productId: string) => {
    await fetch(`/api/brands/${brandId}/products?productId=${productId}`, { method: 'DELETE' });
    loadProducts();
  };

  const generateDescription = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const brandRes = await fetch(`/api/brands/${brandId}`).then(r => r.json());
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product-description',
          productName: form.name,
          brandName: brandRes.brand.name,
        }),
      });
      const data = await res.json();
      if (data.description) setForm(prev => ({ ...prev, description: data.description }));
    } catch (e) {
      console.error('Generation error:', e);
    }
    setGenerating(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Package className="h-6 w-6" />
            Products
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your brand&apos;s products and services</p>
        </div>
        <Button variant="brand" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <Card className="mb-6 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">New Product</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Name</label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Price</label>
                    <Input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" type="number" />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Currency</label>
                    <Input value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Category</label>
                <Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g., Clothing, Services..." />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-slate-500 dark:text-slate-400">Description</label>
                  <Button variant="ghost" size="sm" onClick={generateDescription} disabled={!form.name || generating} className="text-indigo-600 dark:text-indigo-400 text-xs">
                    {generating ? <Spinner className="h-3" /> : <><Sparkles className="h-3 w-3" /> Generate</>}
                  </Button>
                </div>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="brand" onClick={addProduct} disabled={!form.name || saving}>
                  {saving ? <Spinner className="h-4" /> : 'Add Product'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">No products yet</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Add your first product or service</p>
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{product.name}</h3>
                    {product.category && (
                      <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {product.currency} {product.price}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
