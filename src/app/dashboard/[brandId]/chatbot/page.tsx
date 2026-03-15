'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, RotateCcw, Plus, Trash2, Copy, Check,
  ExternalLink, Code, Settings, Sparkles, BarChart3, MessageCircle,
  Clock, Palette, GripVertical, ChevronDown, ChevronUp, Moon, Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingDots } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Brand, ChatbotFaq } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/* ─── Personality options ─────────────────────────────────────── */
const PERSONALITIES = [
  {
    id: 'friendly',
    label: 'Friendly',
    emoji: '😊',
    desc: 'Warm, approachable, casual language',
    preview: (name: string) => `Hey there! 👋 Welcome to ${name}! I'm here to help you with anything you need. What can I do for you today?`,
  },
  {
    id: 'professional',
    label: 'Professional',
    emoji: '💼',
    desc: 'Formal, concise, business-oriented',
    preview: (name: string) => `Welcome to ${name}. I'm your AI assistant, ready to help with product information, orders, and general inquiries. How may I assist you?`,
  },
  {
    id: 'quirky',
    label: 'Quirky',
    emoji: '🎉',
    desc: 'Fun, energetic, playful with emojis',
    preview: (name: string) => `Yay, you're here! 🎉✨ Welcome to ${name}! I'm SO excited to chat with you! What awesome thing can we explore together? 🚀`,
  },
  {
    id: 'formal',
    label: 'Formal',
    emoji: '🎩',
    desc: 'Distinguished, eloquent, premium tone',
    preview: (name: string) => `Good day. You have reached the ${name} customer assistance service. We are delighted to attend to your enquiry. How may we be of service?`,
  },
];

const THEME_COLORS = [
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#E11D48' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Sky', value: '#0284C7' },
  { label: 'Pink', value: '#DB2777' },
  { label: 'Zinc', value: '#18181B' },
];

const BUSINESS_HOURS_DEFAULT = {
  enabled: false,
  timezone: 'UTC',
  hours: {
    mon: { open: '09:00', close: '17:00', closed: false },
    tue: { open: '09:00', close: '17:00', closed: false },
    wed: { open: '09:00', close: '17:00', closed: false },
    thu: { open: '09:00', close: '17:00', closed: false },
    fri: { open: '09:00', close: '17:00', closed: false },
    sat: { open: '10:00', close: '14:00', closed: true },
    sun: { open: '10:00', close: '14:00', closed: true },
  },
  offlineMessage: "We're currently closed. Leave a message and we'll get back to you during business hours.",
};

const DAY_LABELS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export default function ChatbotPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<ChatbotFaq[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [addingFaq, setAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [editFaq, setEditFaq] = useState({ question: '', answer: '' });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'test' | 'faqs' | 'personality' | 'theme' | 'hours' | 'embed'>('test');
  const [chatStats, setChatStats] = useState({ totalSessions: 0, totalMessages: 0, avgMessages: 0 });
  const [personality, setPersonality] = useState('friendly');
  const [greeting, setGreeting] = useState('');
  const [chatColor, setChatColor] = useState('#4F46E5');
  const [savingGreeting, setSavingGreeting] = useState(false);
  const [businessHours, setBusinessHours] = useState(BUSINESS_HOURS_DEFAULT);
  const [savingHours, setSavingHours] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const loadData = useCallback(async () => {
    try {
      const [brandRes, faqRes, statsRes, toneRes, greetingRes, colorRes, hoursRes] = await Promise.allSettled([
        fetch(`/api/brands/${brandId}`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/chatbot-faqs`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/chatbot-stats`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/settings/chatbot-tone`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/settings/chatbot-greeting`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/settings/chatbot-color`).then(r => r.json()),
        fetch(`/api/brands/${brandId}/settings/chatbot-hours`).then(r => r.json()),
      ]);

      if (brandRes.status === 'fulfilled') setBrand(brandRes.value.brand);
      if (faqRes.status === 'fulfilled') setFaqs(faqRes.value.faqs || []);
      if (statsRes.status === 'fulfilled' && statsRes.value.stats) setChatStats(statsRes.value.stats);
      if (toneRes.status === 'fulfilled' && toneRes.value.value) setPersonality(toneRes.value.value);
      if (greetingRes.status === 'fulfilled' && greetingRes.value.value) setGreeting(greetingRes.value.value);
      if (colorRes.status === 'fulfilled' && colorRes.value.value) setChatColor(colorRes.value.value);
      if (hoursRes.status === 'fulfilled' && hoursRes.value.value) {
        try { setBusinessHours(JSON.parse(hoursRes.value.value)); } catch { /* use default */ }
      }

      // Build suggested questions from brand products
      if (brandRes.status === 'fulfilled') {
        const prods = await fetch(`/api/brands/${brandId}/products`).then(r => r.json()).catch(() => ({ products: [] }));
        const suggestions: string[] = ['What do you offer?', 'Tell me about your brand', 'What are your prices?'];
        if (prods.products?.length > 0) {
          const p = prods.products[0];
          suggestions.push(`Tell me about ${p.name}`);
          if (prods.products[1]) suggestions.push(`How does ${prods.products[1].name} compare?`);
        }
        setSuggestedQuestions(suggestions);
      }
    } catch { /* ignore */ }
  }, [brandId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }
    setSending(false);
  };

  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    try {
      await fetch(`/api/brands/${brandId}/chatbot-faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      });
      setNewFaq({ question: '', answer: '' });
      setAddingFaq(false);
      toast.success('FAQ added');
      loadData();
    } catch { toast.error('Failed to add FAQ'); }
  };

  const updateFaq = async (faqId: string) => {
    if (!editFaq.question.trim() || !editFaq.answer.trim()) return;
    try {
      await fetch(`/api/brands/${brandId}/chatbot-faqs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId, ...editFaq }),
      });
      setEditingFaq(null);
      toast.success('FAQ updated');
      loadData();
    } catch { toast.error('Failed to update FAQ'); }
  };

  const deleteFaq = async (faqId: string) => {
    try {
      await fetch(`/api/brands/${brandId}/chatbot-faqs`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId }),
      });
      toast.success('FAQ deleted');
      loadData();
    } catch { toast.error('Failed to delete'); }
  };

  const savePersonality = async (p: string) => {
    setPersonality(p);
    try {
      await fetch(`/api/brands/${brandId}/settings/chatbot-tone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: p }),
      });
      toast.success('Personality updated');
    } catch { toast.error('Failed to save'); }
  };

  const saveGreeting = async () => {
    setSavingGreeting(true);
    try {
      await fetch(`/api/brands/${brandId}/settings/chatbot-greeting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: greeting }),
      });
      toast.success('Greeting updated');
    } catch { toast.error('Failed to save greeting'); }
    setSavingGreeting(false);
  };

  const saveChatColor = async (color: string) => {
    setChatColor(color);
    try {
      await fetch(`/api/brands/${brandId}/settings/chatbot-color`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: color }),
      });
      toast.success('Chat color updated');
    } catch { toast.error('Failed to save color'); }
  };

  const saveBusinessHours = async () => {
    setSavingHours(true);
    try {
      await fetch(`/api/brands/${brandId}/settings/chatbot-hours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(businessHours) }),
      });
      toast.success('Business hours saved');
    } catch { toast.error('Failed to save hours'); }
    setSavingHours(false);
  };

  // Drag-to-reorder FAQs
  const handleDragStart = (idx: number) => { dragIdx.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = async (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    if (dragIdx.current === null || dragIdx.current === targetIdx) return;
    const reordered = [...faqs];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(targetIdx, 0, moved);
    const updated = reordered.map((f, i) => ({ ...f, sort_order: i }));
    setFaqs(updated);
    dragIdx.current = null;
    // Save reorder
    try {
      await fetch(`/api/brands/${brandId}/chatbot-faqs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: updated.map(f => ({ id: f.id, sort_order: f.sort_order })) }),
      });
    } catch { /* best-effort */ }
  };

  if (!brand) return null;
  const slug = brand.slug || brand.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const widgetCode = `<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`;

  const tabs = [
    { id: 'test' as const, label: 'Test Chat', icon: MessageSquare },
    { id: 'faqs' as const, label: `FAQs (${faqs.length})`, icon: MessageCircle },
    { id: 'personality' as const, label: 'Personality', icon: Settings },
    { id: 'theme' as const, label: 'Theme', icon: Palette },
    { id: 'hours' as const, label: 'Hours', icon: Clock },
    { id: 'embed' as const, label: 'Embed', icon: Code },
  ];

  const currentPersonality = PERSONALITIES.find(p => p.id === personality) || PERSONALITIES[0];

  return (
    <PageTransition>
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Chatbot' }]}
        className="mb-4"
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <MessageSquare className="h-6 w-6" />
              AI Chatbot
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Customize, test, and deploy your brand chatbot
            </p>
          </div>
          <a
            href={`/chat/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Open Chat <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: chatStats.totalSessions, icon: MessageSquare },
            { label: 'Total Messages', value: chatStats.totalMessages, icon: MessageCircle },
            { label: 'Avg / Session', value: chatStats.avgMessages.toFixed(1), icon: BarChart3 },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] text-zinc-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-x-auto w-fit max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Test Chat ───────────────────────────────────────────── */}
        {activeTab === 'test' && (
          <Card className="overflow-hidden">
            <div className="h-[520px] flex flex-col">
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: chatColor }}
                  >
                    {brand.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{brand.name} Support</p>
                    <p className="text-xs text-emerald-500">● Online · {currentPersonality.emoji} {currentPersonality.label}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setMessages([]); setSessionId(null); }}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <div
                      className="h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: chatColor }}
                    >
                      {brand.name[0]}
                    </div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {greeting || currentPersonality.preview(brand.name)}
                    </p>
                    <p className="text-xs text-zinc-400 mb-4">Try asking a question:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => setInput(q)}
                          className="px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div
                        className="h-6 w-6 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: chatColor }}
                      >
                        {brand.name[0]}
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md'
                    }`} style={msg.role === 'user' ? { backgroundColor: chatColor } : {}}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3">
                      <LoadingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." disabled={sending} className="flex-1" />
                  <Button type="submit" size="icon" disabled={!input.trim() || sending} style={{ backgroundColor: chatColor }}>
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        )}

        {/* ── FAQs ───────────────────────────────────────────────── */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {faqs.length} entries — drag to reorder
              </p>
              <Button onClick={() => setAddingFaq(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add FAQ
              </Button>
            </div>

            {addingFaq && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(f => ({ ...f, question: e.target.value }))}
                    placeholder="Question..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none text-zinc-900 dark:text-white"
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(f => ({ ...f, answer: e.target.value }))}
                    placeholder="Answer..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none text-zinc-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addFaq} disabled={!newFaq.question.trim() || !newFaq.answer.trim()}>Save FAQ</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingFaq(false); setNewFaq({ question: '', answer: '' }); }}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {faqs.length === 0 && !addingFaq ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500 dark:text-zinc-400 mb-2">No FAQs yet</p>
                  <Button onClick={() => setAddingFaq(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add First FAQ
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragLeave={() => setDragOverIdx(null)}
                    className={`transition-all ${dragOverIdx === idx ? 'scale-[1.02] opacity-80' : ''}`}
                  >
                    <Card>
                      <CardContent className="p-4">
                        {editingFaq === faq.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editFaq.question}
                              onChange={(e) => setEditFaq(f => ({ ...f, question: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none text-zinc-900 dark:text-white"
                            />
                            <textarea
                              value={editFaq.answer}
                              onChange={(e) => setEditFaq(f => ({ ...f, answer: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none text-zinc-900 dark:text-white"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateFaq(faq.id)}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingFaq(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="cursor-grab text-zinc-300 dark:text-zinc-600 mt-1 flex-shrink-0">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => { setEditingFaq(faq.id); setEditFaq({ question: faq.question, answer: faq.answer }); }}>
                              <p className="font-semibold text-sm text-zinc-900 dark:text-white mb-1">Q: {faq.question}</p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">A: {faq.answer}</p>
                              <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-1.5">Click to edit · drag to reorder</p>
                            </div>
                            <button
                              onClick={() => deleteFaq(faq.id)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Personality ─────────────────────────────────────────── */}
        {activeTab === 'personality' && (
          <div className="space-y-6">
            {/* Personality Selector */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Chatbot Personality</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-2 mb-4">
                  Choose how your chatbot communicates. This affects the tone of all AI responses.
                </p>
                {PERSONALITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => savePersonality(p.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      personality === p.id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${personality === p.id ? 'text-violet-700 dark:text-violet-300' : 'text-zinc-900 dark:text-white'}`}>
                          {p.label}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{p.desc}</p>
                      </div>
                      {personality === p.id && <Check className="h-5 w-5 text-violet-500" />}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 flex gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: chatColor }}
                  >
                    {brand.name[0]}
                  </div>
                  <div className="bg-white dark:bg-zinc-700 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 max-w-xs">
                    {currentPersonality.preview(brand.name)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Greeting */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Custom Greeting Message</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Override the personality greeting with a custom message. Leave blank to use the personality default.
                </p>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder={currentPersonality.preview(brand.name)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none text-zinc-900 dark:text-white focus:border-violet-400"
                />
                <Button variant="brand" size="sm" onClick={saveGreeting} disabled={savingGreeting}>
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  {savingGreeting ? 'Saving...' : 'Save Greeting'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Theme ──────────────────────────────────────────────── */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Chatbot Color Theme</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-2">
                  Choose a color for the chat bubble and header. This is separate from your site template colors.
                </p>

                {/* Preset swatches */}
                <div className="flex flex-wrap gap-3">
                  {THEME_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => saveChatColor(c.value)}
                      title={c.label}
                      className={`h-10 w-10 rounded-full transition-all border-4 ${
                        chatColor === c.value ? 'border-violet-400 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>

                {/* Custom color picker */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={chatColor}
                    onChange={(e) => saveChatColor(e.target.value)}
                    className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer bg-transparent"
                  />
                  <div>
                    <p className="text-sm font-mono font-medium text-zinc-700 dark:text-zinc-300">{chatColor}</p>
                    <p className="text-xs text-zinc-400">Custom color</p>
                  </div>
                </div>

                {/* Live preview */}
                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-400 mb-3">Preview</p>
                  <div className="relative max-w-xs">
                    {/* Chat widget preview */}
                    <div className="rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: chatColor }}>
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                          {brand.name[0]}
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">{brand.name} Support</p>
                          <p className="text-white/60 text-[10px]">● Online</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-zinc-800 p-3 space-y-2">
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full flex-shrink-0" style={{ backgroundColor: chatColor }} />
                          <div className="bg-zinc-100 dark:bg-zinc-700 rounded-xl px-3 py-2 text-[10px] text-zinc-700 dark:text-zinc-200">
                            Hi! How can I help you?
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="rounded-xl px-3 py-2 text-[10px] text-white" style={{ backgroundColor: chatColor }}>
                            Tell me about your products
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Floating button */}
                    <div
                      className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: chatColor }}
                    >
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Business Hours ──────────────────────────────────────── */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Business Hours
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-normal text-zinc-400">
                      {businessHours.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setBusinessHours(h => ({ ...h, enabled: !h.enabled }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        businessHours.enabled ? 'bg-violet-500' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        businessHours.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {businessHours.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      {Object.entries(businessHours.hours).map(([day, times]) => (
                        <div key={day} className="flex items-center gap-3">
                          <span className="text-sm w-24 text-zinc-700 dark:text-zinc-300">{DAY_LABELS[day]}</span>
                          <button
                            onClick={() => setBusinessHours(h => ({
                              ...h,
                              hours: { ...h.hours, [day]: { ...times, closed: !times.closed } },
                            }))}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              times.closed
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {times.closed ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                            {times.closed ? 'Closed' : 'Open'}
                          </button>
                          {!times.closed && (
                            <div className="flex items-center gap-2 text-sm">
                              <input
                                type="time"
                                value={times.open}
                                onChange={(e) => setBusinessHours(h => ({
                                  ...h,
                                  hours: { ...h.hours, [day]: { ...times, open: e.target.value } },
                                }))}
                                className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none"
                              />
                              <span className="text-zinc-400">to</span>
                              <input
                                type="time"
                                value={times.close}
                                onChange={(e) => setBusinessHours(h => ({
                                  ...h,
                                  hours: { ...h.hours, [day]: { ...times, close: e.target.value } },
                                }))}
                                className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none"
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="pt-4">
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                          Offline Message
                        </label>
                        <textarea
                          value={businessHours.offlineMessage}
                          onChange={(e) => setBusinessHours(h => ({ ...h, offlineMessage: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none text-zinc-900 dark:text-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!businessHours.enabled && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 py-2">
                    Enable business hours to auto-reply with an offline message when your team is unavailable.
                  </p>
                )}

                <Button variant="brand" size="sm" onClick={saveBusinessHours} disabled={savingHours}>
                  {savingHours ? 'Saving...' : 'Save Hours'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Embed ───────────────────────────────────────────────── */}
        {activeTab === 'embed' && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Embed Code</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Add this script tag to any website to embed a floating chatbot widget.
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-zinc-900 text-green-400 text-sm overflow-x-auto font-mono">
                    {widgetCode}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(widgetCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      toast.success('Copied to clipboard');
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Standalone Chat Page</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  Share this link for a full-page chatbot experience:
                </p>
                <a
                  href={`/chat/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  /chat/{slug} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
    </PageTransition>
  );
}
