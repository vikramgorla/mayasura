"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  MessageCircle,
  Plus,
  Trash2,
  GripVertical,
  Save,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  messagesToday: number;
  avgPerSession: number;
}

interface Settings {
  chatbotGreeting: string | null;
  chatbotColor: string | null;
}

const TONES = ["Professional", "Friendly", "Technical"];
const COLOR_PRESETS = ["#5B21B6", "#2563EB", "#059669", "#DC2626", "#D97706", "#0891B2"];

export default function ChatbotPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [settings, setSettings] = useState<Settings>({ chatbotGreeting: null, chatbotColor: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [selectedColor, setSelectedColor] = useState("#5B21B6");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [faqRes, statsRes, settingsRes] = await Promise.all([
        fetch(`/api/v1/brands/${brandId}/chatbot-faqs`),
        fetch(`/api/v1/brands/${brandId}/chatbot-stats`),
        fetch(`/api/v1/brands/${brandId}/chatbot-settings`),
      ]);

      if (faqRes.ok) { const j = await faqRes.json(); setFaqs(j.data || []); }
      if (statsRes.ok) { const j = await statsRes.json(); setStats(j.data); }
      if (settingsRes.ok) {
        const j = await settingsRes.json();
        setSettings(j.data);
        setGreeting(j.data.chatbotGreeting || "");
        setSelectedColor(j.data.chatbotColor || "#5B21B6");
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [brandId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function saveSettings() {
    setSaving(true);
    try {
      await fetch(`/api/v1/brands/${brandId}/chatbot-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotGreeting: greeting, chatbotColor: selectedColor }),
      });
    } catch { /* silent */ } finally { setSaving(false); }
  }

  async function addFaq() {
    if (!newQ.trim() || !newA.trim()) return;
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/chatbot-faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQ.trim(), answer: newA.trim() }),
      });
      if (res.ok) { setNewQ(""); setNewA(""); fetchAll(); }
    } catch { /* silent */ }
  }

  async function updateFaq(faqId: string) {
    if (!editQ.trim() || !editA.trim()) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/chatbot-faqs/${faqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editQ.trim(), answer: editA.trim() }),
      });
      setEditingFaq(null);
      fetchAll();
    } catch { /* silent */ }
  }

  async function deleteFaq(faqId: string) {
    try {
      await fetch(`/api/v1/brands/${brandId}/chatbot-faqs/${faqId}`, { method: "DELETE" });
      fetchAll();
    } catch { /* silent */ }
  }

  if (loading) return <ChatbotSkeleton />;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Chatbot</h1>
          <p className="text-sm text-[var(--text-secondary)]">Configure your AI assistant</p>
        </div>
        <a
          href={`/chat/${brandId}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
        >
          Preview Chat <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Conversations", value: stats.totalSessions },
            { label: "Total Messages", value: stats.totalMessages },
            { label: "Messages Today", value: stats.messagesToday },
            { label: "Avg per Session", value: stats.avgPerSession },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Configuration */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5 space-y-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Configuration</h3>

        {/* Greeting */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Greeting Message</label>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Hi! How can I help you today?"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Accent Color</label>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-[var(--text-primary)] scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="h-8 w-8 rounded-full border-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Tone</label>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTone(t)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  selectedTone === t
                    ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                    : "border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* FAQ Management */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          FAQs <Badge variant="secondary" className="ml-2">{faqs.length}</Badge>
        </h3>

        {faqs.length === 0 && (
          <div className="text-center py-6 text-sm text-[var(--text-tertiary)]">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
            No FAQs yet. Add questions and answers to train your chatbot.
          </div>
        )}

        {faqs.map((faq) => (
          <div key={faq.id} className="border border-[var(--border-primary)] rounded-lg p-3 space-y-2">
            {editingFaq === faq.id ? (
              <div className="space-y-2">
                <input
                  value={editQ}
                  onChange={(e) => setEditQ(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
                <textarea
                  value={editA}
                  onChange={(e) => setEditA(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
                <div className="flex gap-2">
                  <button onClick={() => updateFaq(faq.id)} className="px-3 py-1 text-xs bg-[var(--accent)] text-white rounded">Save</button>
                  <button onClick={() => setEditingFaq(null)} className="px-3 py-1 text-xs border border-[var(--border-primary)] rounded text-[var(--text-secondary)]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <GripVertical className="h-4 w-4 text-[var(--text-tertiary)] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{faq.question}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">{faq.answer}</p>
                </div>
                <button onClick={() => { setEditingFaq(faq.id); setEditQ(faq.question); setEditA(faq.answer); }} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => deleteFaq(faq.id)} className="p-1 text-[var(--text-tertiary)] hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add FAQ */}
        <div className="border border-dashed border-[var(--border-primary)] rounded-lg p-3 space-y-2">
          <input
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Question..."
            className="w-full px-2 py-1.5 text-sm border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <textarea
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            placeholder="Answer..."
            rows={2}
            className="w-full px-2 py-1.5 text-sm border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <button
            onClick={addFaq}
            disabled={!newQ.trim() || !newA.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg disabled:opacity-40"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus className="h-3 w-3" /> Add FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatbotSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
