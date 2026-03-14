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

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <>
      {/* Header */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-medium uppercase tracking-widest mb-6 block"
            style={{ color: `${brand.primary_color}40` }}
          >
            Products
          </span>
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3"
            style={{ fontFamily: brand.font_heading }}
          >
            Our Collection
          </h1>
          <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize"
                  style={{
                    backgroundColor: filter === cat ? brand.primary_color : 'transparent',
                    color: filter === cat ? brand.secondary_color : `${brand.primary_color}50`,
                    border: filter === cat ? 'none' : `1px solid ${brand.primary_color}12`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: `${brand.primary_color}40` }}>
                No products yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${slug}/product/${product.id}`}
                  className="group block"
                >
                  <div
                    className="aspect-[4/3] mb-4 overflow-hidden"
                    style={{ backgroundColor: `${brand.primary_color}04` }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10" style={{ color: `${brand.primary_color}12` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {product.category && (
                    <span
                      className="text-[10px] font-medium uppercase tracking-widest mb-1 block"
                      style={{ color: `${brand.primary_color}35` }}
                    >
                      {product.category}
                    </span>
                  )}
                  <h3
                    className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: brand.font_heading }}
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: `${brand.primary_color}45` }}>
                      {product.description}
                    </p>
                  )}
                  {product.price != null && product.price > 0 ? (
                    <span className="text-sm font-medium">
                      {product.currency || 'USD'} {product.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: `${brand.primary_color}40` }}>
                      Contact for price
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
