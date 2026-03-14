'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingDots } from '@/components/ui/loading';
import { Brand } from '@/lib/types';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
  }, [brandId]);

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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setSending(false);
  };

  const resetChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  if (!brand) return null;

  return (
    <div className="p-4 sm:p-8 h-[calc(100vh-0px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <MessageSquare className="h-6 w-6" />
            AI Chatbot
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Test your brand&apos;s AI-powered customer support</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetChat}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Chat
        </Button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: brand.accent_color + '15' }}>
                <MessageSquare className="h-8 w-8" style={{ color: brand.accent_color }} />
              </div>
              <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Chat with {brand.name}</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Ask anything about the brand, products, or services. The AI knows your brand context.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['What do you offer?', 'Tell me about your brand', 'What are your prices?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || sending} variant="brand">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
