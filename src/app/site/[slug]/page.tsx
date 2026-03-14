'use client';

import Link from 'next/link';
import { useBrandSite } from './layout';

export default function BrandHomePage() {
  const data = useBrandSite();
  if (!data) return null;

  const { brand, products, blogPosts } = data;
  const slug = brand.slug || brand.id;
  const channels = JSON.parse(brand.channels || '[]') as string[];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: brand.primary_color }}
      >
        {/* Background gradient orbs */}
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: brand.accent_color }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: brand.accent_color }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            {brand.industry && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider"
                style={{
                  backgroundColor: `${brand.accent_color}20`,
                  color: brand.accent_color,
                }}
              >
                {brand.industry}
              </span>
            )}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
            >
              {brand.tagline || brand.name}
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: `${brand.secondary_color}99` }}
            >
              {brand.description || `Welcome to ${brand.name}. We're here to serve you.`}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/shop/${slug}`}
                className="px-8 py-3.5 rounded-full text-base font-semibold transition-transform hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: brand.accent_color,
                  color: '#fff',
                  boxShadow: `0 8px 32px ${brand.accent_color}40`,
                }}
              >
                Shop Now
              </Link>
              <Link
                href={`/site/${slug}/about`}
                className="px-8 py-3.5 rounded-full text-base font-semibold border transition-colors hover:opacity-80"
                style={{
                  borderColor: `${brand.secondary_color}30`,
                  color: brand.secondary_color,
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Values Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: brand.font_heading }}
            >
              Why Choose {brand.name}
            </h2>
            <p className="text-lg opacity-60 max-w-2xl mx-auto">
              {brand.brand_voice
                ? `We believe in ${brand.brand_voice.toLowerCase()}.`
                : `Discover what makes us different.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Quality First',
                desc: 'Every product and service is crafted with attention to detail and unwavering quality standards.',
              },
              {
                icon: '🤝',
                title: 'Customer Focus',
                desc: 'Your satisfaction is our priority. We listen, adapt, and deliver beyond expectations.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                desc: 'We constantly push boundaries to bring you the latest and best in our industry.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border transition-shadow hover:shadow-lg"
                style={{
                  borderColor: `${brand.primary_color}10`,
                  backgroundColor: `${brand.primary_color}05`,
                }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>
                  {feature.title}
                </h3>
                <p className="opacity-60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      {products.length > 0 && (
        <section
          className="py-20 sm:py-28"
          style={{ backgroundColor: `${brand.primary_color}05` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-3"
                  style={{ fontFamily: brand.font_heading }}
                >
                  Our Products
                </h2>
                <p className="opacity-60">Browse our curated collection</p>
              </div>
              <Link
                href={`/site/${slug}/products`}
                className="hidden sm:inline-flex text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ color: brand.accent_color }}
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${slug}/product/${product.id}`}
                  className="group rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: `${brand.primary_color}10` }}
                >
                  {product.image_url ? (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                  ) : (
                    <div
                      className="h-48 flex items-center justify-center text-4xl"
                      style={{ backgroundColor: `${brand.accent_color}10` }}
                    >
                      📦
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold mb-1 group-hover:opacity-80 transition-opacity">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm opacity-50 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.price != null && product.price > 0 && (
                      <p className="font-bold" style={{ color: brand.accent_color }}>
                        {product.currency || 'USD'} {product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href={`/site/${slug}/products`}
                className="text-sm font-semibold"
                style={{ color: brand.accent_color }}
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-3"
                  style={{ fontFamily: brand.font_heading }}
                >
                  Latest from the Blog
                </h2>
                <p className="opacity-60">Stay updated with our latest posts</p>
              </div>
              <Link
                href={`/blog/${slug}`}
                className="hidden sm:inline-flex text-sm font-semibold hover:opacity-80"
                style={{ color: brand.accent_color }}
              >
                All Posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${slug}/${post.slug}`}
                  className="group block"
                >
                  <div
                    className="rounded-2xl p-6 border transition-all hover:shadow-lg hover:-translate-y-1"
                    style={{ borderColor: `${brand.primary_color}10` }}
                  >
                    {post.category && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
                        style={{
                          backgroundColor: `${brand.accent_color}15`,
                          color: brand.accent_color,
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    <h3
                      className="text-lg font-semibold mb-2 group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: brand.font_heading }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm opacity-50 line-clamp-3">{post.excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="text-xs opacity-40 mt-4">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-20 sm:py-28"
        style={{ backgroundColor: brand.primary_color }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            Ready to get started?
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: `${brand.secondary_color}80` }}
          >
            {channels.includes('ecommerce')
              ? 'Browse our store and find exactly what you need.'
              : 'Get in touch with us today and let us help you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {channels.includes('ecommerce') && (
              <Link
                href={`/shop/${slug}`}
                className="px-8 py-3.5 rounded-full text-base font-semibold transition-transform hover:scale-105"
                style={{
                  backgroundColor: brand.accent_color,
                  color: '#fff',
                  boxShadow: `0 8px 32px ${brand.accent_color}40`,
                }}
              >
                Visit Shop
              </Link>
            )}
            <Link
              href={`/site/${slug}/contact`}
              className="px-8 py-3.5 rounded-full text-base font-semibold border transition-colors hover:opacity-80"
              style={{
                borderColor: `${brand.secondary_color}30`,
                color: brand.secondary_color,
              }}
            >
              Contact Us
            </Link>
            {channels.includes('chatbot') && (
              <Link
                href={`/chat/${slug}`}
                className="px-8 py-3.5 rounded-full text-base font-semibold border transition-colors hover:opacity-80"
                style={{
                  borderColor: `${brand.secondary_color}30`,
                  color: brand.secondary_color,
                }}
              >
                💬 Chat Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
