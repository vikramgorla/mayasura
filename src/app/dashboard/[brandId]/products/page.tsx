'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package, Plus, Sparkles, Trash2, X, Edit, Image, Tag, Box, Search, Save, ShoppingBag, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  stock_count: number;
  status: string;
}

export default function ProductsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', currency: 'USD', category: '',
    image_url: '', stock_count: '-1', meta_title: '', meta_description: '',
    variants: '',
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toast = useToast();

  const loadProducts = () => {
    fetch(`/api/brands/${brandId}/products`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load products');
        return r.json();
      })
      .then(d => setProducts(d.products || []))
      .catch(() => toast.error('Failed to load products'));
  };

  useEffect(() => { loadProducts(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', currency: 'USD', category: '', image_url: '', stock_count: '-1', meta_title: '', meta_description: '', variants: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      currency: product.currency || 'USD',
      category: product.category || '',
      image_url: product.image_url || '',
      stock_count: product.stock_count?.toString() || '-1',
      meta_title: '',
      meta_description: '',
      variants: '',
    });
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        currency: form.currency,
        category: form.category,
        image_url: form.image_url || null,
        stock_count: parseInt(form.stock_count) || -1,
      };

      if (editingProduct) {
        await fetch(`/api/brands/${brandId}/products?productId=${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Product updated');
      } else {
        await fetch(`/api/brands/${brandId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Product added');
      }
      resetForm();
      loadProducts();
    } catch (e) {
      toast.error('Failed to save product');
    }
    setSaving(false);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/brands/${brandId}/products?productId=${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Product deleted');
      setSelectedIds(prev => { const next = new Set(prev); next.delete(productId); return next; });
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const batchDeleteProducts = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} product${selectedIds.size > 1 ? 's' : ''}?`)) return;
    try {
      const ids = Array.from(selectedIds).join(',');
      const res = await fetch(`/api/brands/${brandId}/products?ids=${ids}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(`${selectedIds.size} product${selectedIds.size > 1 ? 's' : ''} deleted`);
      setSelectedIds(new Set());
      loadProducts();
    } catch {
      toast.error('Failed to delete products');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
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
      toast.success('Description generated!');
    } catch (e) {
      toast.error('Generation failed');
    }
    setGenerating(false);
  };

  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products' },
        ]}
        className="mb-4"
      />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Package className="h-6 w-6" />
            Products
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} · Manage your catalog
          </p>
        </div>
        <Button variant="brand" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      {products.length > 3 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
            placeholder="Search products..."
          />
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showForm && (
        <Card className="mb-6 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h3>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Name *</label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Price</label>
                    <Input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" type="number" />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Currency</label>
                    <Input value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
                  <Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g., Clothing, Electronics" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    <Box className="h-3 w-3 inline mr-1" />
                    Stock Count (-1 = unlimited)
                  </label>
                  <Input value={form.stock_count} onChange={e => setForm(p => ({ ...p, stock_count: e.target.value }))} type="number" placeholder="-1" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  <Image className="h-3 w-3 inline mr-1" />
                  Image URL
                </label>
                <Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://example.com/product.jpg" />
                {form.image_url && (
                  <div className="mt-2">
                    <img
                      src={form.image_url}
                      alt="Product preview"
                      loading="lazy"
                      className="h-20 w-20 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  <Tag className="h-3 w-3 inline mr-1" />
                  Variants (size/color, comma separated)
                </label>
                <Input
                  value={form.variants}
                  onChange={e => setForm(p => ({ ...p, variants: e.target.value }))}
                  placeholder="e.g., Small, Medium, Large / Red, Blue, Green"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400">Description</label>
                  <Button variant="ghost" size="sm" onClick={generateDescription} disabled={!form.name || generating} className="text-violet-600 dark:text-violet-400 text-xs">
                    {generating ? <Spinner className="h-3" /> : <><Sparkles className="h-3 w-3" /> AI Generate</>}
                  </Button>
                </div>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." rows={3} />
              </div>

              {/* SEO fields */}
              <details className="group">
                <summary className="text-xs font-medium text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
                  SEO Fields (optional)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Meta Title</label>
                    <Input value={form.meta_title} onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))} placeholder="SEO title for product page" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Meta Description</label>
                    <Textarea value={form.meta_description} onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))} placeholder="SEO meta description..." rows={2} />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {form.meta_description.length}/160 characters
                    </p>
                  </div>
                </div>
              </details>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button variant="brand" onClick={saveProduct} disabled={!form.name || saving}>
                  {saving ? <Spinner className="h-4" /> : <><Save className="h-3.5 w-3.5 mr-1" />{editingProduct ? 'Update' : 'Add Product'}</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {selectedIds.size} selected
          </span>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-xs">
            Clear
          </Button>
          <Button variant="destructive" size="sm" onClick={batchDeleteProducts} className="ml-auto">
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={Search}
            title="No products found"
            description="Try a different search term"
          />
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="No products yet"
            description="Add your first product to start selling"
            illustration="products"
            action={{
              label: 'Add Product',
              onClick: () => { resetForm(); setShowForm(true); },
            }}
          />
        )
      ) : (
        <div className="space-y-2">
          {/* Select all header */}
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={toggleSelectAll}
              className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={selectedIds.size === filteredProducts.length ? 'Deselect all' : 'Select all'}
            >
              {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                <CheckSquare className="h-4 w-4 text-violet-600" />
              ) : (
                <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
              )}
            </button>
            <span className="text-xs text-zinc-400">Select all</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`group hover:shadow-md transition-all ${selectedIds.has(product.id) ? 'ring-2 ring-violet-400 dark:ring-violet-600' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Selection checkbox */}
                  <button
                    onClick={() => toggleSelect(product.id)}
                    className="mt-1 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
                  >
                    {selectedIds.has(product.id) ? (
                      <CheckSquare className="h-4 w-4 text-violet-600" />
                    ) : (
                      <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </button>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="h-16 w-16 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {product.category && (
                            <Badge variant="secondary">{product.category}</Badge>
                          )}
                          {product.stock_count >= 0 && (
                            <span className={`text-[10px] font-medium ${product.stock_count === 0 ? 'text-red-500' : product.stock_count < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {product.stock_count === 0 ? 'Out of stock' : `${product.stock_count} in stock`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {product.currency} {product.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 mt-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(product)} className="h-9 sm:h-7 text-xs min-w-[44px]">
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                        className="h-9 sm:h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 min-w-[44px]"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}
