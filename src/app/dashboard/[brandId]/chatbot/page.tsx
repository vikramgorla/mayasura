'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Send, RotateCcw, Plus, Trash2, Copy, Check, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingDots } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Brand, ChatbotFaq } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'test' | 'faqs' | 'embed'>('test');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/chatbot-faqs`).then(r => r.json()).then(d => setFaqs(d.faqs || []));
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

  if (!brand) return null;
  const slug = brand.slug || brand.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const widgetCode = `<script src="${baseUrl}/api/public/brand/${slug}/widget"></script>`;

  const tabs = [
    { id: 'test' as const, label: 'Test Chat', icon: MessageSquare },
    { id: 'faqs' as const, label: 'FAQs', icon: MessageSquare },
    { id: 'embed' as const, label: 'Embed', icon: Code },
  ];

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <MessageSquare className="h-6 w-6" />
              AI Chatbot
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Test, manage FAQs, and embed your chatbot
            </p>
          </div>
          <a
            href={`/chat/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            Live Chat <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                  >
                    {brand.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{brand.name} Support</p>
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
                    <p className="text-sm text-slate-400">Send a message to test your chatbot</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {['What do you offer?', 'Tell me about your brand'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setInput(q)}
                          className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
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
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md'
                    }`} style={msg.role === 'user' ? { backgroundColor: brand.accent_color } : {}}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                      <LoadingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
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
              <p className="text-sm text-slate-500">{faqs.length} FAQ entries — the chatbot will use these to answer questions</p>
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none"
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(f => ({ ...f, answer: e.target.value }))}
                    placeholder="Answer..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none"
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
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">No FAQs yet</p>
                  <p className="text-sm text-slate-400 mb-4">Add question-answer pairs to help your chatbot respond better</p>
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
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                            Q: {faq.question}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            A: {faq.answer}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Add this script tag to any website to embed a floating chatbot widget that lets visitors chat with your AI assistant.
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-900 text-green-400 text-sm overflow-x-auto font-mono">
                    {widgetCode}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(widgetCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      toast.success('Copied to clipboard');
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
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
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  You can also link directly to the full-page chatbot:
                </p>
                <a
                  href={`/chat/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
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
