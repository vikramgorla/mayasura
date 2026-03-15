'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, RotateCcw, Plus, Trash2, Copy, Check,
  ExternalLink, Code, Settings, Smile, Briefcase, Sparkles,
  BarChart3, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingDots } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Brand, ChatbotFaq } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const toneOptions = [
  { id: 'friendly', label: 'Friendly', icon: Smile, desc: 'Warm, approachable, uses casual language', emoji: '😊' },
  { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Formal, concise, business-oriented', emoji: '💼' },
  { id: 'playful', label: 'Playful', icon: Sparkles, desc: 'Fun, energetic, uses emojis', emoji: '🎉' },
];

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
  const [activeTab, setActiveTab] = useState<'test' | 'faqs' | 'tone' | 'embed'>('test');
  const [chatStats, setChatStats] = useState({ totalSessions: 0, totalMessages: 0, avgMessages: 0 });
  const [selectedTone, setSelectedTone] = useState('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/chatbot-faqs`).then(r => r.json()).then(d => setFaqs(d.faqs || []));
    // Load chat stats
    fetch(`/api/brands/${brandId}/chatbot-stats`).then(r => r.json()).then(d => {
      if (d.stats) setChatStats(d.stats);
    }).catch(() => {});
    // Load saved tone
    fetch(`/api/brands/${brandId}/settings/chatbot-tone`).then(r => r.json()).then(d => {
      if (d.value) setSelectedTone(d.value);
    }).catch(() => {});
  };

  useEffect(() => { loadData(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch {
      toast.error('Failed to add FAQ');
    }
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
    } catch {
      toast.error('Failed to update FAQ');
    }
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
    } catch {
      toast.error('Failed to delete');
    }
  };

  const saveTone = async (tone: string) => {
    setSelectedTone(tone);
    try {
      await fetch(`/api/brands/${brandId}/settings/chatbot-tone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: tone }),
      });
      toast.success('Chatbot tone updated');
    } catch {
      toast.error('Failed to save tone');
    }
  };

  if (!brand) return null;
  const slug = brand.slug || brand.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const widgetCode = `<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`;

  const tabs = [
    { id: 'test' as const, label: 'Test Chat', icon: MessageSquare },
    { id: 'faqs' as const, label: `FAQs (${faqs.length})`, icon: MessageCircle },
    { id: 'tone' as const, label: 'Tone', icon: Settings },
    { id: 'embed' as const, label: 'Embed', icon: Code },
  ];

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Chatbot' },
        ]}
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
              Test, manage FAQs, and embed your chatbot
            </p>
          </div>
          <a
            href={`/chat/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Test Your Chatbot <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: chatStats.totalSessions, icon: MessageSquare },
            { label: 'Total Messages', value: chatStats.totalMessages, icon: MessageCircle },
            { label: 'Avg Messages/Session', value: chatStats.avgMessages.toFixed(1), icon: BarChart3 },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Test Chat Tab */}
        {activeTab === 'test' && (
          <Card className="overflow-hidden">
            <div className="h-[500px] flex flex-col">
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                  >
                    {brand.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{brand.name} Support</p>
                    <p className="text-xs text-emerald-500">● Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setMessages([]); setSessionId(null); }}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">Send a message to test your chatbot</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {['What do you offer?', 'Tell me about your brand', 'What are your prices?'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setInput(q)}
                          className="px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md'
                    }`} style={msg.role === 'user' ? { backgroundColor: brand.accent_color } : {}}>
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
                  <Button type="submit" size="icon" disabled={!input.trim() || sending} variant="brand">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{faqs.length} FAQ entries — the chatbot will use these to answer questions</p>
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
                    <Button size="sm" onClick={addFaq} disabled={!newFaq.question.trim() || !newFaq.answer.trim()}>
                      Save FAQ
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingFaq(false); setNewFaq({ question: '', answer: '' }); }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {faqs.length === 0 && !addingFaq ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500 dark:text-zinc-400 mb-2">No FAQs yet</p>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">Add question-answer pairs to help your chatbot respond better</p>
                  <Button onClick={() => setAddingFaq(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add First FAQ
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <Card key={faq.id}>
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
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 cursor-pointer" onClick={() => { setEditingFaq(faq.id); setEditFaq({ question: faq.question, answer: faq.answer }); }}>
                            <p className="font-semibold text-sm text-zinc-900 dark:text-white mb-1">
                              Q: {faq.question}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              A: {faq.answer}
                            </p>
                            <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-2">Click to edit</p>
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tone Tab */}
        {activeTab === 'tone' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Chatbot Personality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Choose how your chatbot communicates with customers. This affects the tone and style of all AI-generated responses.
                </p>
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => saveTone(tone.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedTone === tone.id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tone.emoji}</span>
                      <div>
                        <p className={`font-semibold text-sm ${selectedTone === tone.id ? 'text-violet-700 dark:text-violet-300' : 'text-zinc-900 dark:text-white'}`}>
                          {tone.label}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{tone.desc}</p>
                      </div>
                      {selectedTone === tone.id && (
                        <Check className="h-5 w-5 text-violet-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Tone preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                    {selectedTone === 'friendly' && `"Hey there! 👋 Welcome to ${brand.name}! I'm here to help you with anything you need. What can I do for you today?"`}
                    {selectedTone === 'professional' && `"Welcome to ${brand.name}. I'm your AI assistant, ready to help with product information, orders, and general inquiries. How may I assist you?"`}
                    {selectedTone === 'playful' && `"Yay, you're here! 🎉✨ Welcome to ${brand.name}! I'm SO excited to chat with you! What awesome thing can we explore together? 🚀"`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Embed Tab */}
        {activeTab === 'embed' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Embed Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Add this script tag to any website to embed a floating chatbot widget that lets visitors chat with your AI assistant.
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
              <CardHeader>
                <CardTitle className="text-sm">Standalone Chat Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  You can also link directly to the full-page chatbot:
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
  );
}
