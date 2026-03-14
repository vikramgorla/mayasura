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
      {/* Hero */}
      <section
        className="py-20 sm:py-28"
        style={{ backgroundColor: brand.primary_color }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-6"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            About {brand.name}
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: `${brand.secondary_color}80` }}
          >
            {brand.tagline || `Get to know who we are and what drives us.`}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: brand.font_heading }}
              >
                Our Story
              </h2>
              <div className="space-y-4 text-base leading-relaxed opacity-70">
                <p>
                  {brand.description ||
                    `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value to our customers.`}
                </p>
                <p>
                  We believe in building lasting relationships with our community through
                  transparency, innovation, and an unwavering commitment to excellence.
                </p>
                {brand.brand_voice && (
                  <p>
                    Our voice is{' '}
                    <strong style={{ color: brand.accent_color }}>{brand.brand_voice}</strong> —
                    every interaction reflects who we are and what we stand for.
                  </p>
                )}
              </div>
            </div>

            <div
              className="rounded-3xl overflow-hidden aspect-square flex items-center justify-center"
              style={{ backgroundColor: `${brand.accent_color}10` }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="max-w-[60%]" />
              ) : (
                <span
                  className="text-8xl font-bold"
                  style={{ color: brand.accent_color, fontFamily: brand.font_heading }}
                >
                  {brand.name[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: `${brand.primary_color}05` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold mb-12 text-center"
            style={{ fontFamily: brand.font_heading }}
          >
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '💡', title: 'Innovation', desc: 'Constantly evolving to stay ahead' },
              { icon: '🎯', title: 'Precision', desc: 'Every detail matters in what we do' },
              { icon: '🌿', title: 'Sustainability', desc: 'Building for the future responsibly' },
              { icon: '❤️', title: 'Community', desc: 'People are at the heart of everything' },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: brand.font_heading }}
                >
                  {value.title}
                </h3>
                <p className="text-sm opacity-60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: brand.font_heading }}
          >
            Let&apos;s Connect
          </h2>
          <p className="text-lg opacity-60 mb-10 max-w-xl mx-auto">
            Whether you have questions, ideas, or just want to say hello — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/site/${slug}/contact`}
              className="px-8 py-3.5 rounded-full text-base font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: brand.accent_color,
                color: '#fff',
              }}
            >
              Get in Touch
            </Link>
            <Link
              href={`/shop/${slug}`}
              className="px-8 py-3.5 rounded-full text-base font-semibold border transition-colors hover:opacity-80"
              style={{
                borderColor: `${brand.primary_color}30`,
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
