'use client';

import Link from 'next/link';
import { useBrandSite } from './layout';

export default function BrandHomePage() {
  const data = useBrandSite();
  if (!data) return null;

  const { brand, products, blogPosts, websiteTemplate: template } = data;
  const slug = brand.slug || brand.id;
  const channels = JSON.parse(brand.channels || '[]') as string[];
  const templateId = template?.id || 'minimal';
  const radius = template?.preview.borderRadius || '0px';
  const tp = template?.preview;

  // Template-specific heading style
  const headingStyle = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
  };

  // Button style based on template
  const primaryBtnStyle: React.CSSProperties = {
    backgroundColor: brand.primary_color,
    color: brand.secondary_color,
    borderRadius: radius,
  };

  const secondaryBtnStyle: React.CSSProperties = {
    borderColor: `${brand.primary_color}20`,
    color: brand.primary_color,
    borderRadius: radius,
  };

  // Hero rendering based on template
  const renderHero = () => {
    const industry = brand.industry && (
      <span
        className="inline-block text-xs font-medium uppercase tracking-widest mb-6"
        style={{ color: `${brand.primary_color}50` }}
      >
        {brand.industry}
      </span>
    );

    const heading = (
      <h1 style={headingStyle}>
        {brand.tagline || brand.name}
      </h1>
    );

    const description = (
      <p
        className="text-lg sm:text-xl leading-relaxed"
        style={{ color: `${brand.primary_color}60` }}
      >
        {brand.description || `Welcome to ${brand.name}. We're here to serve you.`}
      </p>
    );

    const buttons = (
      <div className="flex flex-wrap gap-4">
        {channels.includes('ecommerce') && (
          <Link href={`/shop/${slug}`} className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85" style={primaryBtnStyle}>
            Shop Now
          </Link>
        )}
        <Link href={`/site/${slug}/about`} className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70" style={secondaryBtnStyle}>
          Learn More
        </Link>
      </div>
    );

    switch (tp?.heroStyle) {
      case 'centered':
        return (
          <section className="py-24 sm:py-32 lg:py-40">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
              <div className="max-w-3xl mx-auto">
                {industry}
                <div className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] mb-8">{heading}</div>
                <div className="mb-12 max-w-xl mx-auto">{description}</div>
                <div className="flex flex-wrap justify-center gap-4">
                  {channels.includes('ecommerce') && (
                    <Link href={`/shop/${slug}`} className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85" style={primaryBtnStyle}>
                      Shop Now
                    </Link>
                  )}
                  <Link href={`/site/${slug}/about`} className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70" style={secondaryBtnStyle}>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'split':
        return (
          <section className="py-20 sm:py-28 lg:py-36">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  {industry}
                  <div className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] mb-8">{heading}</div>
                  <div className="mb-10">{description}</div>
                  {buttons}
                </div>
                <div className="aspect-[4/5]" style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }} />
              </div>
            </div>
          </section>
        );

      case 'full-width':
        return (
          <section className="py-28 sm:py-36 lg:py-44" style={{ backgroundColor: `${brand.primary_color}04` }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              {industry}
              <div className="text-[clamp(3rem,8vw,6rem)] leading-[1.02] mb-8">{heading}</div>
              <div className="mb-12 max-w-2xl">{description}</div>
              {buttons}
            </div>
          </section>
        );

      case 'stacked':
        return (
          <section className="py-20 sm:py-28">
            <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
              {industry}
              <div className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.12] mb-6">{heading}</div>
              <div className="mb-10 max-w-xl mx-auto">{description}</div>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {channels.includes('ecommerce') && (
                  <Link href={`/shop/${slug}`} className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85" style={primaryBtnStyle}>
                    Shop Now
                  </Link>
                )}
                <Link href={`/site/${slug}/about`} className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70" style={secondaryBtnStyle}>
                  Learn More
                </Link>
              </div>
              <div className="aspect-[16/9] mx-auto" style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }} />
            </div>
          </section>
        );

      default: // left-aligned (minimal)
        return (
          <section className="py-24 sm:py-32 lg:py-40">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <div className="max-w-3xl">
                {industry}
                <div className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] mb-8">{heading}</div>
                <div className="mb-12 max-w-xl">{description}</div>
                {buttons}
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <>
      {/* Hero */}
      {renderHero()}

      {/* Divider */}
      {templateId !== 'bold' && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="h-px" style={{ backgroundColor: `${brand.primary_color}08` }} />
        </div>
      )}

      {/* Values */}
      <section className={templateId === 'playful' ? 'py-16 sm:py-24' : 'py-20 sm:py-28'}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <h2
              className="text-2xl sm:text-3xl mb-3"
              style={headingStyle}
            >
              Why {brand.name}
            </h2>
            <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
              {brand.brand_voice
                ? `We believe in ${brand.brand_voice.toLowerCase()}.`
                : 'What sets us apart.'}
            </p>
          </div>

          {(() => {
            const features = [
              { title: 'Quality First', desc: 'Every product and service is crafted with meticulous attention to detail and unwavering quality standards.' },
              { title: 'Customer Focus', desc: 'Your satisfaction drives us. We listen, adapt, and deliver experiences that exceed expectations.' },
              { title: 'Innovation', desc: 'We constantly push boundaries to bring you the latest and most thoughtful solutions in our space.' },
            ];

            // Different card layouts per template
            switch (tp?.cardStyle) {
              case 'elevated':
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map(f => (
                      <div key={f.title} className="p-8 shadow-sm border" style={{ borderColor: `${brand.primary_color}08`, borderRadius: radius, backgroundColor: brand.secondary_color }}>
                        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'bordered':
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map(f => (
                      <div key={f.title} className="p-8 border-2" style={{ borderColor: `${brand.primary_color}15`, borderRadius: radius }}>
                        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'rounded':
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map(f => (
                      <div key={f.title} className="p-8" style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }}>
                        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'flat':
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map(f => (
                      <div key={f.title}>
                        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                );
              default: // minimal — gap-px grid
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: `${brand.primary_color}08` }}>
                    {features.map(f => (
                      <div key={f.title} className="p-8 sm:p-10" style={{ backgroundColor: brand.secondary_color }}>
                        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: `${brand.primary_color}55` }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                );
            }
          })()}
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
                    style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }}
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
                    style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }}
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
            style={{ backgroundColor: `${brand.primary_color}04`, borderRadius: radius }}
          >
            <h2
              className="text-2xl sm:text-3xl mb-4"
              style={headingStyle}
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
                  style={primaryBtnStyle}
                >
                  Visit Shop
                </Link>
              )}
              <Link
                href={`/site/${slug}/contact`}
                className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
                style={secondaryBtnStyle}
              >
                Contact Us
              </Link>
              {channels.includes('chatbot') && (
                <Link
                  href={`/chat/${slug}`}
                  className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
                  style={secondaryBtnStyle}
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
