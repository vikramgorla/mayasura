"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  accentColor: string | null;
  chatbotGreeting: string | null;
  chatbotColor: string | null;
  websiteTemplate: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "mayasura-chat-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function ChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/v1/public/brand/${slug}`);
        if (!res.ok) { setNotFound(true); return; }
        const json = await res.json();
        setBrand(json.data);
        // Set initial suggestions
        const defaultSugs = [
          `Tell me about ${json.data.name}`,
          "What products do you offer?",
          "How can I contact you?",
          json.data.industry ? `What makes you unique in ${json.data.industry}?` : "What services do you provide?",
        ];
        setSuggestions(defaultSugs);
        // Set greeting as first message
        if (json.data.chatbotGreeting) {
          setMessages([{
            id: "greeting",
            role: "assistant",
            content: json.data.chatbotGreeting,
          }]);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sending) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/v1/public/brand/${slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId: getSessionId() }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const json = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: json.data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (json.data.suggestions) setSuggestions(json.data.suggestions);
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm having trouble right now. Please try again in a moment.",
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [sending, slug]);

  const accentColor = brand?.chatbotColor || brand?.accentColor || "#5B21B6";

  if (loading) return <ChatSkeleton />;

  if (notFound || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <p className="text-6xl mb-4">🤖</p>
          <h1 className="text-xl font-semibold text-zinc-800">Chatbot not found</h1>
          <p className="text-sm text-zinc-500 mt-1">This brand doesn't exist or hasn't launched yet.</p>
          <a href="/" className="text-sm text-violet-600 hover:underline mt-4 inline-block">← Go back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-4 py-3 flex items-center gap-3 shrink-0">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            brand.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-zinc-900 truncate">{brand.name}</h1>
          {brand.tagline && <p className="text-xs text-zinc-500 truncate">{brand.tagline}</p>}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-zinc-500">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <WelcomeScreen brand={brand} accentColor={accentColor} />
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} accentColor={accentColor} brandInitial={brand.name.charAt(0)} />
        ))}

        {sending && <TypingIndicator accentColor={accentColor} brandInitial={brand.name.charAt(0)} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {suggestions.length > 0 && !sending && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white p-3 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="h-10 w-10 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, accentColor, brandInitial }: {
  message: Message; accentColor: string; brandInitial: string;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {brandInitial}
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "text-white rounded-br-md"
            : "bg-zinc-100 text-zinc-800 rounded-bl-md"
        }`}
        style={isUser ? { backgroundColor: accentColor } : undefined}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function WelcomeScreen({ brand, accentColor }: { brand: Brand; accentColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4" style={{ backgroundColor: accentColor }}>{brand.name.charAt(0)}</div>
      <h2 className="text-lg font-semibold text-zinc-800">{brand.name}</h2>
      {brand.tagline && <p className="text-sm text-zinc-500 mt-1">{brand.tagline}</p>}
      <p className="text-xs text-zinc-400 mt-3">Ask me anything about {brand.name}</p>
    </div>
  );
}

function TypingIndicator({ accentColor, brandInitial }: { accentColor: string; brandInitial: string }) {
  return (
    <div className="flex items-end gap-2">
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: accentColor }}
      >
        {brandInitial}
      </div>
      <div className="bg-zinc-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <div className="border-b border-zinc-200 bg-white px-4 py-3 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48 mt-1" /></div>
      </div>
      <div className="flex-1 p-4"><div className="flex justify-center py-12"><Skeleton className="h-16 w-16 rounded-full" /></div></div>
      <div className="border-t border-zinc-200 bg-white p-3"><Skeleton className="h-10 w-full rounded-full" /></div>
    </div>
  );
}
