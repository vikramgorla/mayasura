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

  return (
    <>
      {/* Header */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: brand.primary_color }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            Contact Us
          </h1>
          <p style={{ color: `${brand.secondary_color}80` }}>
            We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {sent ? (
            <div
              className="text-center py-16 px-8 rounded-3xl"
              style={{ backgroundColor: `${brand.accent_color}08` }}
            >
              <div className="text-5xl mb-6">✉️</div>
              <h2
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: brand.font_heading }}
              >
                Message Sent!
              </h2>
              <p className="opacity-60 mb-8">
                Thank you for reaching out. We&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: brand.accent_color, color: '#fff' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm"
                  style={{
                    borderColor: `${brand.primary_color}15`,
                    backgroundColor: `${brand.primary_color}03`,
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm"
                  style={{
                    borderColor: `${brand.primary_color}15`,
                    backgroundColor: `${brand.primary_color}03`,
                  }}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm resize-none"
                  style={{
                    borderColor: `${brand.primary_color}15`,
                    backgroundColor: `${brand.primary_color}03`,
                  }}
                  placeholder="How can we help you?"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl text-base font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: brand.accent_color,
                  color: '#fff',
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
