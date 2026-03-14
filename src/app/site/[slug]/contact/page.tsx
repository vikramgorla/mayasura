'use client';

import { useState } from 'react';
import { useBrandSite } from '../layout';

export default function ContactPage() {
  const data = useBrandSite();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!data) return null;

  const { brand } = data;
  const slug = brand.slug || brand.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/public/brand/${slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setSending(false);
  };

  const inputStyle = {
    borderColor: `${brand.primary_color}12`,
    color: brand.primary_color,
    backgroundColor: 'transparent',
  };

  return (
    <>
      {/* Header */}
      <section className="py-20 sm:py-28">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-medium uppercase tracking-widest mb-6 block"
            style={{ color: `${brand.primary_color}40` }}
          >
            Contact
          </span>
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
            style={{ fontFamily: brand.font_heading }}
          >
            Get in touch
          </h1>
          <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
            Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          {sent ? (
            <div className="text-center py-16">
              <h2
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: brand.font_heading }}
              >
                Message sent
              </h2>
              <p className="text-sm mb-8" style={{ color: `${brand.primary_color}50` }}>
                Thank you for reaching out. We&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity"
                style={{ color: brand.primary_color }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: `${brand.primary_color}50` }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-0 py-3 border-0 border-b text-sm outline-none transition-colors focus:border-current"
                  style={inputStyle}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: `${brand.primary_color}50` }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full px-0 py-3 border-0 border-b text-sm outline-none transition-colors focus:border-current"
                  style={inputStyle}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: `${brand.primary_color}50` }}
                >
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  rows={5}
                  className="w-full px-0 py-3 border-0 border-b text-sm outline-none transition-colors focus:border-current resize-none"
                  style={inputStyle}
                  placeholder="How can we help?"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{
                  backgroundColor: brand.primary_color,
                  color: brand.secondary_color,
                }}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
