'use client';

import Link from 'next/link';
import { useBrandSite } from '../layout';

export default function AboutPage() {
  const data = useBrandSite();
  if (!data) return null;

  const { brand } = data;
  const slug = brand.slug || brand.id;

  return (
    <>
      {/* Hero — Clean typography, no colored box */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-medium uppercase tracking-widest mb-6 block"
            style={{ color: `${brand.primary_color}40` }}
          >
            About
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8"
            style={{ fontFamily: brand.font_heading }}
          >
            {brand.tagline || `The story behind ${brand.name}`}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: `${brand.primary_color}55` }}
          >
            {brand.description ||
              `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value.`}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-px" style={{ backgroundColor: `${brand.primary_color}08` }} />
      </div>

      {/* Story — Two column layout */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="text-xl font-semibold mb-6"
                style={{ fontFamily: brand.font_heading }}
              >
                Our Story
              </h2>
              <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: `${brand.primary_color}65` }}>
                <p>
                  {brand.description ||
                    `${brand.name} was founded with a clear purpose: to deliver exceptional quality and build lasting relationships with our community.`}
                </p>
                <p>
                  We believe in transparency, innovation, and an unwavering commitment to excellence in everything we do.
                </p>
                {brand.brand_voice && (
                  <p>
                    Our voice is{' '}
                    <span className="font-medium" style={{ color: brand.primary_color }}>
                      {brand.brand_voice}
                    </span>{' '}
                    — every interaction reflects who we are and what we stand for.
                  </p>
                )}
              </div>
            </div>

            {/* Image placeholder */}
            <div
              className="aspect-[4/5] flex items-center justify-center"
              style={{ backgroundColor: `${brand.primary_color}04` }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="max-w-[50%] max-h-[50%] object-contain" />
              ) : (
                <span
                  className="text-7xl font-semibold"
                  style={{ color: `${brand.primary_color}08`, fontFamily: brand.font_heading }}
                >
                  {brand.name[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values — Minimal grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2
            className="text-xl font-semibold mb-12"
            style={{ fontFamily: brand.font_heading }}
          >
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: `${brand.primary_color}08` }}>
            {[
              { title: 'Innovation', desc: 'Constantly evolving to stay ahead' },
              { title: 'Precision', desc: 'Every detail matters in what we do' },
              { title: 'Sustainability', desc: 'Building for the future responsibly' },
              { title: 'Community', desc: 'People at the heart of everything' },
            ].map((value) => (
              <div
                key={value.title}
                className="p-8"
                style={{ backgroundColor: brand.secondary_color }}
              >
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ fontFamily: brand.font_heading }}
                >
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: `${brand.primary_color}45` }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-2xl font-semibold tracking-tight mb-4"
            style={{ fontFamily: brand.font_heading }}
          >
            Let&apos;s Connect
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${brand.primary_color}50` }}>
            Whether you have questions, ideas, or just want to say hello — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/site/${slug}/contact`}
              className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
              style={{
                backgroundColor: brand.primary_color,
                color: brand.secondary_color,
              }}
            >
              Get in Touch
            </Link>
            <Link
              href={`/shop/${slug}`}
              className="px-7 py-3 text-sm font-medium tracking-wide border transition-colors hover:opacity-70"
              style={{
                borderColor: `${brand.primary_color}20`,
                color: brand.primary_color,
              }}
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
