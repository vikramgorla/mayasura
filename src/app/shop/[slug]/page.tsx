'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useShop } from './layout';

export default function ShopPage() {
  const shop = useShop();
  const [filter, setFilter] = useState<string>('all');

  if (!shop) return null;
  const { brand, products, addToCart } = shop;
  const slug = brand.slug || brand.id;

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <>
      {/* Header */}
      <section
        className="py-12 sm:py-16"
        style={{ backgroundColor: brand.primary_color }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            Shop
          </h1>
          <p style={{ color: `${brand.secondary_color}80` }}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
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
              <p className="text-xl opacity-40">No products available</p>
              <p className="text-sm opacity-30 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden border transition-all hover:shadow-xl"
                  style={{ borderColor: `${brand.primary_color}10` }}
                >
                  <Link href={`/shop/${slug}/product/${product.id}`}>
                    {product.image_url ? (
                      <div
                        className="h-52 bg-cover bg-center transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `url(${product.image_url})` }}
                      />
                    ) : (
                      <div
                        className="h-52 flex items-center justify-center text-5xl"
                        style={{ backgroundColor: `${brand.accent_color}08` }}
                      >
                        📦
                      </div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link href={`/shop/${slug}/product/${product.id}`}>
                      {product.category && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
                          style={{
                            backgroundColor: `${brand.accent_color}15`,
                            color: brand.accent_color,
                          }}
                        >
                          {product.category}
                        </span>
                      )}
                      <h3
                        className="font-semibold mb-1 group-hover:opacity-80 transition-opacity"
                        style={{ fontFamily: brand.font_heading }}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm opacity-50 mb-3 line-clamp-2">{product.description}</p>
                      )}
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      {product.price != null && product.price > 0 ? (
                        <span className="text-lg font-bold" style={{ color: brand.accent_color }}>
                          {product.currency || 'USD'} {product.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm opacity-40">Free</span>
                      )}
                      <button
                        onClick={() =>
                          addToCart({
                            productId: product.id,
                            name: product.name,
                            price: product.price || 0,
                            currency: product.currency || 'USD',
                            image_url: product.image_url || undefined,
                          })
                        }
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-transform hover:scale-105"
                        style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
