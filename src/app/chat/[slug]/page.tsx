'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d) => setBrand(d.brand))
      .catch(() => setError(true));
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chatbot not found</h1>
          <Link href="/" className="text-blue-400 hover:underline">← Back to Mayasura</Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-pulse h-8 w-32 rounded bg-zinc-200" />
      </div>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    try {
      const res = await fetch(`/api/public/brand/${slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I'm having trouble right now. Please try again in a moment." },
      ]);
    }
    setSending(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: brand.secondary_color || '#f8fafc',
        color: brand.primary_color || '#0f172a',
        fontFamily: brand.font_body || 'Inter',
      }}
    >
      {/* Header */}
      <header
        className="border-b px-4 py-3"
        style={{
          backgroundColor: `${brand.primary_color}f0`,
          borderColor: `${brand.accent_color}30`,
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.name[0]}
            </div>
            <div>
              <h1
                className="font-semibold text-sm"
                style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
              >
                {brand.name}
              </h1>
              <p className="text-xs" style={{ color: `${brand.secondary_color}60` }}>
                AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/site/${slug}`}
              className="text-xs"
              style={{ color: `${brand.secondary_color}80` }}
            >
              Visit Website
            </Link>
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: '#22c55e' }}
            />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                style={{ backgroundColor: `${brand.accent_color}15`, color: brand.accent_color }}
              >
                {brand.name[0]}
              </div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: brand.font_heading }}
              >
                Hi! Welcome to {brand.name}
              </h2>
              <p className="opacity-50 text-sm mb-8">
                Ask me anything about our products and services.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'What products do you offer?',
                  'Tell me about your brand',
                  'How can I contact you?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => handleSend(), 0);
                    }}
                    className="px-4 py-2 rounded-full text-sm border transition-colors hover:opacity-80"
                    style={{ borderColor: `${brand.primary_color}15` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        backgroundColor: brand.accent_color,
                        color: '#fff',
                      }
                    : {
                        backgroundColor: `${brand.primary_color}08`,
                        border: `1px solid ${brand.primary_color}10`,
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-md"
                style={{
                  backgroundColor: `${brand.primary_color}08`,
                  border: `1px solid ${brand.primary_color}10`,
                }}
              >
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: brand.accent_color, animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: brand.accent_color, animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: brand.accent_color, animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t px-4 py-4"
        style={{ borderColor: `${brand.primary_color}10` }}
      >
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border outline-none text-sm"
            style={{
              borderColor: `${brand.primary_color}15`,
              backgroundColor: `${brand.primary_color}03`,
            }}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-transform hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: brand.accent_color, color: '#fff' }}
          >
            Send
          </button>
        </form>
        <p
          className="text-center text-xs mt-3 opacity-30 max-w-3xl mx-auto"
        >
          Powered by {brand.name} AI · Built with Mayasura
        </p>
      </div>
    </div>
  );
}
