'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/lib/types';
import { getWebsiteTemplate, type WebsiteTemplate } from '@/lib/website-templates';
import { buildGoogleFontsUrl } from '@/lib/font-loader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

let messageIdCounter = 0;
function genId() {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

function TypingIndicator({ accentColor, templateId }: { accentColor: string; templateId: string }) {
  return (
    <div className="flex gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2"
          style={{
            backgroundColor: accentColor,
            borderRadius: templateId === 'bold' ? '0' : '9999px',
          }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const SUGGESTION_CHIPS = [
  { text: 'What products do you offer?', emoji: '🛍️' },
  { text: 'Tell me about your brand', emoji: '✨' },
  { text: 'How can I contact you?', emoji: '📬' },
  { text: 'What makes you different?', emoji: '💡' },
];

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
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, [messages, sending]);

  const handleSend = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || sending) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: text, id: genId() };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch(`/api/public/brand/${slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.sessionId);
      const assistantMsg: Message = { role: 'assistant', content: data.response, id: genId() };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        id: genId(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setSending(false);
    inputRef.current?.focus();
  }, [input, sending, sessionId, slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

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

  // Message bubble radius per template
  const getBubbleRadius = (role: 'user' | 'assistant') => {
    if (templateId === 'bold') return '0';
    if (templateId === 'playful') return role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px';
    return role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  } as const;

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
        className="px-4 py-3 flex-shrink-0"
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
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5"
                  style={{
                    backgroundColor: '#22c55e',
                    borderRadius: templateId === 'bold' ? '0' : '9999px',
                  }}
                />
                <p className="text-[11px]" style={{ color: `${textColor}50` }}>
                  {templateId === 'playful' ? '🤖 Online now' : 'AI Assistant · Online'}
                </p>
              </div>
            </div>
          </div>
          <Link
            href={`/site/${slug}`}
            className="text-xs px-3 py-1.5 transition-all hover:opacity-70"
            style={{
              color: `${textColor}60`,
              border: `1px solid ${textColor}10`,
              borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '9999px' : '8px',
            }}
          >
            {templateId === 'bold' ? 'WEBSITE' : 'Visit Website'}
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div
                key="welcome"
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    color: accentColor,
                    borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '24px' : '16px',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  {templateId === 'playful' ? '👋' : brand.name[0]}
                </motion.div>
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

                {/* Suggestion chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTION_CHIPS.map((suggestion) => (
                    <motion.button
                      key={suggestion.text}
                      onClick={() => handleSend(suggestion.text)}
                      className="px-4 py-2.5 text-sm transition-all hover:opacity-80"
                      style={{
                        border: `${templateId === 'bold' ? '2' : '1'}px solid ${textColor}12`,
                        borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
                        backgroundColor: templateId === 'playful' ? `${textColor}04` : 'transparent',
                      }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="mr-1.5">{suggestion.emoji}</span>
                      {suggestion.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                >
                  {/* Assistant avatar */}
                  {msg.role === 'assistant' && (
                    <div
                      className="h-7 w-7 flex-shrink-0 flex items-center justify-center text-[10px] font-bold mr-2 mt-1"
                      style={{
                        backgroundColor: `${accentColor}12`,
                        color: accentColor,
                        borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '10px' : '8px',
                      }}
                    >
                      {brand.name[0]}
                    </div>
                  )}
                  <div
                    className="max-w-[75%] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      borderRadius: getBubbleRadius(msg.role),
                      ...(msg.role === 'user'
                        ? {
                            backgroundColor: accentColor,
                            color: '#fff',
                            boxShadow: `0 2px 8px ${accentColor}25`,
                          }
                        : {
                            backgroundColor: isDark ? '#111111' : `${textColor}05`,
                            border: `1px solid ${textColor}06`,
                          }),
                    }}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {sending && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="h-7 w-7 flex-shrink-0 flex items-center justify-center text-[10px] font-bold mr-2 mt-1"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      color: accentColor,
                      borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '10px' : '8px',
                    }}
                  >
                    {brand.name[0]}
                  </div>
                  <div
                    className="px-4 py-3"
                    style={{
                      borderRadius: getBubbleRadius('assistant'),
                      backgroundColor: isDark ? '#111111' : `${textColor}05`,
                      border: `1px solid ${textColor}06`,
                    }}
                  >
                    <TypingIndicator accentColor={accentColor} templateId={templateId} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: `1px solid ${textColor}08` }}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={templateId === 'playful' ? 'Ask me anything... 💬' : 'Type a message...'}
            className="flex-1 px-4 py-3 text-sm outline-none transition-all"
            style={{
              border: `${templateId === 'bold' ? '2' : '1'}px solid ${textColor}12`,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
              backgroundColor: isDark ? '#111111' : `${textColor}03`,
              color: textColor,
            }}
            disabled={sending}
          />
          <motion.button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-3 text-sm font-semibold transition-all disabled:opacity-40"
            style={{
              backgroundColor: accentColor,
              color: '#fff',
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '12px',
              fontWeight: templateId === 'bold' ? 700 : 600,
              textTransform: templateId === 'bold' ? 'uppercase' : undefined,
              letterSpacing: templateId === 'bold' ? '0.05em' : undefined,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {templateId === 'playful' ? '🚀' : 'Send'}
          </motion.button>
        </form>
        {/* Powered by Mayasura */}
        <div className="text-center mt-3 max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-[10px] transition-opacity hover:opacity-60 inline-flex items-center gap-1"
            style={{ color: `${textColor}20` }}
          >
            <span>⚡</span>
            <span>Powered by <span style={{ fontWeight: 600 }}>Mayasura</span></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
