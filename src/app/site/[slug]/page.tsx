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
      {/* Hero — Typography-driven, clean background */}
      <section className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            {brand.industry && (
              <span
                className="inline-block text-xs font-medium uppercase tracking-widest mb-6"
                style={{ color: `${brand.primary_color}50` }}
              >
                {brand.industry}
              </span>
            )}
            <h1
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight mb-8"
              style={{ fontFamily: brand.font_heading }}
            >
              {brand.tagline || brand.name}
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed mb-12 max-w-xl"
              style={{ color: `${brand.primary_color}60` }}
            >
              {brand.description || `Welcome to ${brand.name}. We're here to serve you.`}
            </p>
            <div className="flex flex-wrap gap-4">
              {channels.includes('ecommerce') && (
                <Link
                  href={`/shop/${slug}`}
                  className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: brand.primary_color,
                    color: brand.secondary_color,
                  }}
                >
                  Shop Now
                </Link>
              )}
              <Link
                href={`/site/${slug}/about`}
                className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
                style={{
                  borderColor: `${brand.primary_color}20`,
                  color: brand.primary_color,
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-px" style={{ backgroundColor: `${brand.primary_color}08` }} />
      </div>

      {/* Values — Clean cards with subtle borders */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
              style={{ fontFamily: brand.font_heading }}
            >
              Why {brand.name}
            </h2>
            <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
              {brand.brand_voice
                ? `We believe in ${brand.brand_voice.toLowerCase()}.`
                : 'What sets us apart.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: `${brand.primary_color}08` }}>
            {[
              {
                title: 'Quality First',
                desc: 'Every product and service is crafted with meticulous attention to detail and unwavering quality standards.',
              },
              {
                title: 'Customer Focus',
                desc: 'Your satisfaction drives us. We listen, adapt, and deliver experiences that exceed expectations.',
              },
              {
                title: 'Innovation',
                desc: 'We constantly push boundaries to bring you the latest and most thoughtful solutions in our space.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 sm:p-10"
                style={{ backgroundColor: brand.secondary_color }}
              >
                <h3
                  className="text-base font-semibold mb-3"
                  style={{ fontFamily: brand.font_heading }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview — Clean grid */}
      {products.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
                  style={{ fontFamily: brand.font_heading }}
                >
                  Products
                </h2>
                <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
                  Our curated collection
                </p>
              </div>
              <Link
                href={`/site/${slug}/products`}
                className="hidden sm:inline-flex text-sm font-medium transition-opacity hover:opacity-60"
                style={{ color: brand.primary_color }}
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
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
                        <svg className="w-10 h-10" style={{ color: `${brand.primary_color}15` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3
                    className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: brand.font_heading }}
                  >
                    {product.name}
                  </h3>
                  {product.price != null && product.price > 0 && (
                    <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
                      {product.currency || 'USD'} {product.price.toFixed(2)}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href={`/site/${slug}/products`}
                className="text-sm font-medium"
                style={{ color: brand.primary_color }}
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview — Editorial layout */}
      {blogPosts.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
                  style={{ fontFamily: brand.font_heading }}
                >
                  Journal
                </h2>
                <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
                  Latest thoughts and updates
                </p>
              </div>
              <Link
                href={`/blog/${slug}`}
                className="hidden sm:inline-flex text-sm font-medium transition-opacity hover:opacity-60"
                style={{ color: brand.primary_color }}
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
                  {/* Image placeholder */}
                  <div
                    className="aspect-[16/10] mb-5"
                    style={{ backgroundColor: `${brand.primary_color}04` }}
                  />
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: `${brand.primary_color}40` }}
                      >
                        {post.category}
                      </span>
                    )}
                    {post.published_at && (
                      <span className="text-xs" style={{ color: `${brand.primary_color}30` }}>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2 group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: brand.font_heading }}
                  >
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm line-clamp-2" style={{ color: `${brand.primary_color}45` }}>
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — Clean, minimal */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            className="py-16 sm:py-20 px-8 sm:px-16 text-center"
            style={{ backgroundColor: `${brand.primary_color}04` }}
          >
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4"
              style={{ fontFamily: brand.font_heading }}
            >
              Ready to get started?
            </h2>
            <p
              className="text-sm mb-10 max-w-md mx-auto"
              style={{ color: `${brand.primary_color}50` }}
            >
              {channels.includes('ecommerce')
                ? 'Browse our collection and find exactly what you need.'
                : 'Get in touch with us today.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {channels.includes('ecommerce') && (
                <Link
                  href={`/shop/${slug}`}
                  className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: brand.primary_color,
                    color: brand.secondary_color,
                  }}
                >
                  Visit Shop
                </Link>
              )}
              <Link
                href={`/site/${slug}/contact`}
                className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
                style={{
                  borderColor: `${brand.primary_color}20`,
                  color: brand.primary_color,
                }}
              >
                Contact Us
              </Link>
              {channels.includes('chatbot') && (
                <Link
                  href={`/chat/${slug}`}
                  className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
                  style={{
                    borderColor: `${brand.primary_color}20`,
                    color: brand.primary_color,
                  }}
                >
                  Chat Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
