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

  // Load Google Fonts
  useEffect(() => {
    if (!brand) return;
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
  }, [brand]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Chatbot not found</h1>
          <Link href="/" className="text-sm font-medium underline underline-offset-4 hover:opacity-70">
            ← Back to Mayasura
          </Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded bg-zinc-100" />
          <div className="h-3 w-24 rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

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
  const userBubbleStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '0',
      border: `2px solid ${accentColor}`,
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '20px 20px 4px 20px',
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '12px 12px 4px 12px',
    };
    if (templateId === 'editorial') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '2px',
    };
    return {
      backgroundColor: textColor, color: bgColor, borderRadius: '2px',
    };
  })();

  const assistantBubbleStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: `${textColor}06`, borderRadius: '0',
      border: `2px solid ${textColor}10`,
    };
    if (templateId === 'playful') return {
      backgroundColor: '#FFFFFF', borderRadius: '20px 20px 20px 4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    };
    if (templateId === 'classic') return {
      backgroundColor: bgColor, borderRadius: '12px 12px 12px 4px',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.04), -3px -3px 6px rgba(255,255,255,0.6)',
    };
    return {
      backgroundColor: `${textColor}05`, borderRadius: '2px',
      border: `1px solid ${textColor}08`,
    };
  })();

  // Input style
  const chatInputStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      borderColor: `${textColor}15`, backgroundColor: `${textColor}04`,
      borderWidth: '2px', borderRadius: '0',
    };
    if (templateId === 'playful') return {
      borderColor: `${textColor}10`, backgroundColor: '#FFFFFF',
      borderWidth: '2px', borderRadius: '16px',
    };
    if (templateId === 'classic') return {
      borderColor: `${textColor}10`, backgroundColor: bgColor,
      borderWidth: '1px', borderRadius: '12px',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)',
    };
    return {
      borderColor: `${textColor}10`, backgroundColor: 'transparent',
      borderWidth: '1px', borderRadius: '4px',
    };
  })();

  const sendBtnStyle: React.CSSProperties = {
    backgroundColor: isDark ? accentColor : textColor,
    color: isDark ? '#FFFFFF' : bgColor,
    borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '10px' : '0',
    fontWeight: templateId === 'bold' ? 700 : 500,
    letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
    textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
    fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      data-template={templateId}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: brand.font_body || 'Inter',
      }}
    >
      {/* Header */}
      <header
        className="border-b px-5 py-3"
        style={{
          borderColor: `${textColor}08`,
          borderBottomWidth: templateId === 'bold' ? '2px' : '1px',
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: `${accentColor}12`,
                color: accentColor,
                borderRadius: templateId === 'playful' ? '14px' : templateId === 'classic' ? '10px' : templateId === 'bold' ? '0' : '8px',
              }}
            >
              {brand.name[0]}
            </div>
            <div>
              <h1
                className="font-medium text-sm"
                style={{
                  fontFamily: brand.font_heading,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
                  fontWeight: templateId === 'bold' ? 700 : 500,
                }}
              >
                {brand.name}
              </h1>
              <p className="text-xs" style={{ color: `${textColor}45` }}>
                {templateId === 'bold' ? 'AI ASSISTANT' : 'AI Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/site/${slug}`}
              className="text-xs transition-opacity hover:opacity-60"
              style={{ color: `${textColor}55` }}
            >
              {templateId === 'bold' ? 'WEBSITE' : 'Visit Website'}
            </Link>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div
                className="h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                style={{
                  backgroundColor: `${accentColor}10`,
                  color: accentColor,
                  borderRadius: templateId === 'playful' ? '20px' : templateId === 'classic' ? '14px' : templateId === 'bold' ? '0' : '12px',
                }}
              >
                {brand.name[0]}
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: brand.font_heading }}>
                {templateId === 'playful' ? `Hi! Welcome to ${brand.name} 👋` : templateId === 'bold' ? `WELCOME TO ${brand.name.toUpperCase()}` : `Hi! Welcome to ${brand.name}`}
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
                    className="px-4 py-2 text-sm border transition-all hover:opacity-70"
                    style={{
                      borderColor: `${textColor}12`,
                      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : templateId === 'bold' ? '0' : '4px',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                      fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
                      fontWeight: templateId === 'bold' ? 700 : undefined,
                      letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                      textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
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
                style={msg.role === 'user' ? userBubbleStyle : assistantBubbleStyle}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="px-4 py-3" style={assistantBubbleStyle}>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t px-5 py-4"
        style={{
          borderColor: `${textColor}08`,
          borderTopWidth: templateId === 'bold' ? '2px' : '1px',
        }}
      >
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={templateId === 'playful' ? 'Type a message... 💬' : 'Type a message...'}
            className="flex-1 px-4 py-3 border outline-none text-sm"
            style={chatInputStyle}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-3 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={sendBtnStyle}
          >
            {templateId === 'bold' ? 'SEND' : 'Send'}
          </button>
        </form>
        <p className="text-center text-xs mt-3" style={{ color: `${textColor}20` }}>
          Powered by {brand.name} AI · Built with Mayasura
        </p>
      </div>
    </div>
  );
}
