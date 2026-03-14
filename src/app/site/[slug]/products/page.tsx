'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrandSite } from '../layout';

export default function ProductsPage() {
  const data = useBrandSite();
  const [filter, setFilter] = useState<string>('all');

  if (!data) return null;

  const { brand, products } = data;
  const slug = brand.slug || brand.id;

  // Get unique categories
  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <>
      {/* Header */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: brand.primary_color }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            Our Products
          </h1>
          <p style={{ color: `${brand.secondary_color}80` }}>
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize"
                  style={{
                    backgroundColor: filter === cat ? brand.accent_color : `${brand.primary_color}08`,
                    color: filter === cat ? '#fff' : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl opacity-40">No products yet</p>
              <p className="text-sm opacity-30 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${slug}/product/${product.id}`}
                  className="group rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: `${brand.primary_color}10` }}
                >
                  {product.image_url ? (
                    <div
                      className="h-56 bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                  ) : (
                    <div
                      className="h-56 flex items-center justify-center text-5xl transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${brand.accent_color}10` }}
                    >
                      📦
                    </div>
                  )}
                  <div className="p-6">
                    {product.category && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
                        style={{
                          backgroundColor: `${brand.accent_color}15`,
                          color: brand.accent_color,
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ fontFamily: brand.font_heading }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm opacity-50 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {product.price != null && product.price > 0 ? (
                        <span className="text-lg font-bold" style={{ color: brand.accent_color }}>
                          {product.currency || 'USD'} {product.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm opacity-40">Contact for price</span>
                      )}
                      <span
                        className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: brand.accent_color }}
                      >
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
