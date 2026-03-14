'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { getWebsiteTemplate, type WebsiteTemplate } from '@/lib/website-templates';
import { buildGoogleFontsUrl } from '@/lib/font-loader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [template, setTemplate] = useState<WebsiteTemplate | undefined>();
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
      .then((d) => {
        setBrand(d.brand);
        const templateId = d.settings?.website_template || 'minimal';
        setTemplate(getWebsiteTemplate(templateId));
      })
      .catch(() => setError(true));
  }, [slug]);

  // Load fonts
  useEffect(() => {
    if (!brand) return;
    const templateId = template?.id || 'minimal';
    const fonts = [brand.font_heading, brand.font_body].filter(Boolean) as string[];
    if (fonts.length === 0) return;
    const url = buildGoogleFontsUrl(fonts);
    const existing = document.querySelector(`link[href="${url}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [brand, template]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Chatbot not found</h1>
          <Link href="/" className="text-sm font-medium underline underline-offset-4 hover:opacity-70">← Back to Mayasura</Link>
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

  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color || '#f8fafc';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color || '#0f172a';
  const accentColor = brand.accent_color;

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

  // Message bubble radius per template
  const getBubbleRadius = (role: 'user' | 'assistant') => {
    if (templateId === 'bold') return '0';
    if (templateId === 'playful') return role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px';
    return role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px';
  };

  return (
    <div
      data-template={templateId}
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: brand.font_body || 'Inter',
      }}
    >
      {/* Header */}
      <header
        className="px-4 py-3"
        style={
          isDark
            ? { backgroundColor: '#000000', borderBottom: `2px solid #FFFFFF10` }
            : { backgroundColor: `${bgColor}f0`, borderBottom: `1px solid ${textColor}08`, backdropFilter: 'blur(16px)' }
        }
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '16px' : '12px',
              }}
            >
              {brand.name[0]}
            </div>
            <div>
              <h1
                className="font-semibold text-sm"
                style={{
                  fontFamily: brand.font_heading,
                  fontWeight: templateId === 'minimal' ? 400 : templateId === 'bold' ? 700 : 600,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                  letterSpacing: templateId === 'bold' ? '0.05em' : undefined,
                }}
              >
                {brand.name}
              </h1>
              <p className="text-xs" style={{ color: `${textColor}50` }}>
                {templateId === 'playful' ? '🤖 AI Assistant' : 'AI Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/site/${slug}`}
              className="text-xs"
              style={{ color: `${textColor}60` }}
            >
              {templateId === 'bold' ? 'WEBSITE' : 'Visit Website'}
            </Link>
            <div
              className="h-2 w-2"
              style={{
                backgroundColor: '#22c55e',
                borderRadius: templateId === 'bold' ? '0' : '9999px',
              }}
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
                className="h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                style={{
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                  borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '24px' : '16px',
                }}
              >
                {templateId === 'playful' ? '👋' : brand.name[0]}
              </div>
              <h2
                className="text-xl mb-2"
                style={{
                  fontFamily: brand.font_heading,
                  fontWeight: templateId === 'minimal' ? 400 : templateId === 'bold' ? 700 : 600,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                }}
              >
                {templateId === 'playful'
                  ? `Hey! Welcome to ${brand.name} 🎉`
                  : templateId === 'bold'
                  ? `WELCOME TO ${brand.name.toUpperCase()}`
                  : `Welcome to ${brand.name}`}
              </h2>
              <p className="text-sm mb-8" style={{ color: `${textColor}45` }}>
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
                    className="px-4 py-2 text-sm transition-all hover:opacity-80"
                    style={{
                      border: `${templateId === 'bold' ? '2' : '1'}px solid ${textColor}12`,
                      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
                      backgroundColor: templateId === 'playful' ? `${textColor}04` : 'transparent',
                    }}
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
                className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                style={{
                  borderRadius: getBubbleRadius(msg.role),
                  ...(msg.role === 'user'
                    ? { backgroundColor: accentColor, color: '#fff' }
                    : {
                        backgroundColor: isDark ? '#111111' : `${textColor}06`,
                        border: `1px solid ${textColor}08`,
                      }),
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3"
                style={{
                  borderRadius: getBubbleRadius('assistant'),
                  backgroundColor: isDark ? '#111111' : `${textColor}06`,
                  border: `1px solid ${textColor}08`,
                }}
              >
                <div className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="h-2 w-2 animate-bounce"
                      style={{
                        backgroundColor: accentColor,
                        animationDelay: `${delay}ms`,
                        borderRadius: templateId === 'bold' ? '0' : '9999px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4" style={{ borderTop: `1px solid ${textColor}08` }}>
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 text-sm outline-none"
            style={{
              border: `${templateId === 'bold' ? '2' : '1'}px solid ${textColor}12`,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
              backgroundColor: isDark ? '#111111' : `${textColor}03`,
              color: textColor,
            }}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: accentColor,
              color: '#fff',
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
              fontWeight: templateId === 'bold' ? 700 : 600,
              textTransform: templateId === 'bold' ? 'uppercase' : undefined,
              letterSpacing: templateId === 'bold' ? '0.05em' : undefined,
            }}
          >
            {templateId === 'playful' ? '🚀' : 'Send'}
          </button>
        </form>
        <p className="text-center text-xs mt-3 max-w-3xl mx-auto" style={{ color: `${textColor}20` }}>
          Powered by {brand.name} AI · Built with Mayasura
        </p>
      </div>
    </div>
  );
}
