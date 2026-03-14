'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '../../layout';

export default function ProductDetailPage() {
  const shop = useShop();
  const params = useParams();
  const productId = params.productId as string;

  if (!shop) return null;
  const { brand, products, addToCart, cartCount } = shop;
  const slug = brand.slug || brand.id;

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href={`/shop/${slug}`} className="hover:opacity-80" style={{ color: brand.accent_color }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href={`/shop/${slug}`}
          className="text-sm hover:opacity-80"
          style={{ color: brand.accent_color }}
        >
          ← Back to shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div
          className="rounded-3xl overflow-hidden aspect-square flex items-center justify-center"
          style={{ backgroundColor: `${brand.accent_color}08` }}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">📦</span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit"
              style={{
                backgroundColor: `${brand.accent_color}15`,
                color: brand.accent_color,
              }}
            >
              {product.category}
            </span>
          )}

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: brand.font_heading }}
          >
            {product.name}
          </h1>

          {product.price != null && product.price > 0 ? (
            <p
              className="text-3xl font-bold mb-6"
              style={{ color: brand.accent_color }}
            >
              {product.currency || 'USD'} {product.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-xl opacity-40 mb-6">Free</p>
          )}

          {product.description && (
            <p className="text-base leading-relaxed opacity-70 mb-8">
              {product.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
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
              className="px-8 py-3.5 rounded-xl text-base font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: brand.accent_color,
                color: '#fff',
                boxShadow: `0 8px 32px ${brand.accent_color}30`,
              }}
            >
              Add to Cart
            </button>

            {cartCount > 0 && (
              <Link
                href={`/shop/${slug}/cart`}
                className="px-8 py-3.5 rounded-xl text-base font-semibold border transition-colors hover:opacity-80"
                style={{ borderColor: `${brand.primary_color}20` }}
              >
                View Cart ({cartCount})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
