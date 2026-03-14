'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeadphonesIcon, Plus, X, Send, AlertCircle,
  Clock, CheckCircle, XCircle, ChevronRight, BarChart3,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';

interface Ticket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  satisfaction_rating: number | null;
  created_at: string;
}

interface TicketMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface Stats {
  total: number;
  open: number;
  resolved: number;
  satisfaction: number | null;
}

const priorityColors: Record<string, string> = {
  low: 'bg-zinc-100 text-zinc-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, typeof Clock> = {
  open: AlertCircle,
  'in-progress': Clock,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function SupportPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, resolved: 0, satisfaction: null });
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [selectedTicketData, setSelectedTicketData] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: '',
  });

  const loadTickets = async () => {
    const url = filter !== 'all'
      ? `/api/brands/${brandId}/tickets?status=${filter}`
      : `/api/brands/${brandId}/tickets`;
    const res = await fetch(url);
    const data = await res.json();
    setTickets(data.tickets || []);
    setStats(data.stats || { total: 0, open: 0, resolved: 0, satisfaction: null });
  };

  useEffect(() => { loadTickets(); }, [brandId, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const createNewTicket = async () => {
    if (!form.customer_name || !form.customer_email || !form.subject) return;
    try {
      await fetch(`/api/brands/${brandId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('Ticket created', `Ticket for ${form.customer_name}`);
      setShowForm(false);
      setForm({ customer_name: '', customer_email: '', subject: '', message: '', priority: 'medium', category: '' });
      loadTickets();
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const openTicket = async (ticketId: string) => {
    setSelectedTicket(ticketId);
    const res = await fetch(`/api/brands/${brandId}/tickets?ticketId=${ticketId}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setSelectedTicketData(data.ticket || null);
  };

  const sendReply = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await fetch(`/api/brands/${brandId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selectedTicket, message: newMessage, role: 'agent', status: 'in-progress' }),
      });
      setNewMessage('');
      openTicket(selectedTicket);
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to send reply');
    }
    setSending(false);
  };

  const updateStatus = async (ticketId: string, status: string) => {
    await fetch(`/api/brands/${brandId}/tickets`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, status }),
    });
    toast.success('Ticket updated');
    loadTickets();
    if (selectedTicket === ticketId) openTicket(ticketId);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <HeadphonesIcon className="h-6 w-6" />
            Customer Support
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage support tickets and customer inquiries</p>
        </div>
        <Button variant="brand" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="p-4">
          <p className="text-xs text-zinc-400 mb-1">Total Tickets</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-zinc-400 mb-1">Open</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.open}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-zinc-400 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-zinc-400 mb-1">Satisfaction</p>
          <p className="text-2xl font-bold flex items-center gap-1">
            {stats.satisfaction ? <>{stats.satisfaction}<Star className="h-4 w-4 text-amber-400" /></> : '—'}
          </p>
        </CardContent></Card>
      </div>

      {/* New Ticket Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">New Support Ticket</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Customer Name</label>
                    <Input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Email</label>
                    <Input type="email" value={form.customer_email} onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Subject</label>
                    <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Issue summary" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Priority</label>
                    <Select
                      value={form.priority}
                      onValueChange={v => setForm(p => ({ ...p, priority: v }))}
                      options={[
                        { value: 'low', label: '🟢 Low' },
                        { value: 'medium', label: '🔵 Medium' },
                        { value: 'high', label: '🟠 High' },
                        { value: 'urgent', label: '🔴 Urgent' },
                      ]}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Message</label>
                  <Textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Describe the issue..." rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button variant="brand" onClick={createNewTicket} disabled={!form.customer_name || !form.subject}>Create Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticket List */}
        <div className="flex-1">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
              <Button key={s} variant={filter === s ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(s)} className="capitalize whitespace-nowrap">
                {s === 'all' ? 'All' : s}
              </Button>
            ))}
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-12 text-center">
              <HeadphonesIcon className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No tickets yet</h3>
              <p className="text-sm text-zinc-400">Create a support ticket to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map(ticket => {
                const StatusIcon = statusIcons[ticket.status] || AlertCircle;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => openTicket(ticket.id)}
                    className={`w-full text-left bg-white dark:bg-zinc-800 border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer ${
                      selectedTicket === ticket.id ? 'border-blue-500 shadow-md' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <StatusIcon className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{ticket.subject}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{ticket.customer_name} · {new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                        <ChevronRight className="h-4 w-4 text-zinc-300" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket Detail Panel */}
        {selectedTicket && selectedTicketData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[400px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{selectedTicketData.subject}</h3>
                <button onClick={() => { setSelectedTicket(null); setSelectedTicketData(null); }}>
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>{selectedTicketData.customer_name}</span>
                <span>·</span>
                <span>{selectedTicketData.customer_email}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {['open', 'in-progress', 'resolved', 'closed'].map(s => (
                  <Button
                    key={s}
                    variant={selectedTicketData.status === s ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => updateStatus(selectedTicket, s)}
                    className="text-xs capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'customer'
                      ? 'bg-zinc-100 dark:bg-zinc-700 rounded-bl-md'
                      : msg.role === 'ai'
                        ? 'bg-purple-100 text-purple-900 rounded-br-md'
                        : 'bg-blue-600 text-white rounded-br-md'
                  }`}>
                    <p className="text-xs font-medium mb-1 opacity-60">{msg.role}</p>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-100 dark:border-zinc-700">
              <form onSubmit={e => { e.preventDefault(); sendReply(); }} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" size="icon" variant="brand" disabled={!newMessage.trim() || sending}>
                  {sending ? <Spinner className="h-4" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
