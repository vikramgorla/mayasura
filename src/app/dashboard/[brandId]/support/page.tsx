"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Headphones, ChevronDown, ChevronUp, Send, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketMessage { id: string; role: string; content: string; createdAt: string }
interface Ticket { id: string; customerName: string; customerEmail: string; subject: string; category: string | null; priority: string; status: string; messageCount: number; createdAt: string; updatedAt: string }
interface TicketDetail extends Ticket { messages: TicketMessage[] }

const STATUS_OPTIONS = ["open", "in-progress", "resolved", "closed"];
const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  closed: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function SupportPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      const url = statusFilter
        ? `/api/v1/brands/${brandId}/tickets?status=${statusFilter}`
        : `/api/v1/brands/${brandId}/tickets`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setTickets(json.data || []);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [brandId, statusFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  async function fetchDetail(ticketId: string) {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/tickets/${ticketId}`);
      if (res.ok) {
        const json = await res.json();
        setTicketDetail(json.data);
      }
    } catch { /* silent */ }
  }

  async function toggleExpand(ticketId: string) {
    if (expandedId === ticketId) {
      setExpandedId(null);
      setTicketDetail(null);
      setReplyText("");
      return;
    }
    setExpandedId(ticketId);
    await fetchDetail(ticketId);
  }

  async function updateTicket(ticketId: string, field: string, value: string) {
    try {
      await fetch(`/api/v1/brands/${brandId}/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      fetchTickets();
    } catch { /* silent */ }
  }

  async function sendReply(ticketId: string) {
    if (!replyText.trim() || replying) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText("");
        await fetchDetail(ticketId);
        fetchTickets();
      }
    } catch { /* silent */ } finally { setReplying(false); }
  }

  const openCount = tickets.filter((t) => t.status === "open").length;

  if (loading) return <SupportSkeleton />;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Support</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          {openCount > 0 && <span className="text-[var(--accent)]"> · {openCount} open</span>}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
            !statusFilter ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] font-medium" : "border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${
              statusFilter === s ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] font-medium" : "border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <Headphones className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">No support tickets yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Tickets are created when visitors submit contact forms.
          </p>
        </div>
      )}

      {/* Ticket List */}
      <div className="space-y-2">
        {tickets.map((ticket) => {
          const expanded = expandedId === ticket.id;

          return (
            <div
              key={ticket.id}
              className="border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)] overflow-hidden"
            >
              {/* Row */}
              <button
                onClick={() => toggleExpand(ticket.id)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {ticket.subject}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_COLORS[ticket.status] || ""}`}>
                      {ticket.status}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${PRIORITY_COLORS[ticket.priority] || ""}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                    <span>{ticket.customerName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span>{ticket.messageCount} msg{ticket.messageCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                )}
              </button>

              {/* Expanded Detail */}
              {expanded && (
                <div className="border-t border-[var(--border-primary)] p-4 space-y-4">
                  {/* Customer info + controls */}
                  <div className="flex flex-wrap gap-4 items-start">
                    <div className="text-sm">
                      <p className="text-xs text-[var(--text-tertiary)]">Customer</p>
                      <p className="text-[var(--text-primary)] font-medium">{ticket.customerName}</p>
                      <p className="text-[var(--text-secondary)]">{ticket.customerEmail}</p>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicket(ticket.id, "status", e.target.value)}
                        className="text-xs px-2 py-1 border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select
                        value={ticket.priority}
                        onChange={(e) => updateTicket(ticket.id, "priority", e.target.value)}
                        className="text-xs px-2 py-1 border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      >
                        {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Messages Thread */}
                  {ticketDetail?.messages && (
                    <div className="space-y-3">
                      {ticketDetail.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "agent" ? "justify-end" : ""}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              msg.role === "agent"
                                ? "bg-[var(--accent-light)] text-[var(--accent)]"
                                : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-medium uppercase opacity-70">
                                {msg.role === "agent" ? "You" : "Customer"}
                              </span>
                              <span className="text-[10px] opacity-50">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply */}
                  <div className="flex gap-2">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a reply..."
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply(ticket.id)}
                      className="flex-1 px-3 py-2 text-sm border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                    <button
                      onClick={() => sendReply(ticket.id)}
                      disabled={!replyText.trim() || replying}
                      className="px-3 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-40 flex items-center gap-1.5"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      <Send className="h-3.5 w-3.5" />
                      {replying ? "Sending..." : "Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupportSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-8 w-28" />
      <div className="flex gap-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}</div>
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
    </div>
  );
}
