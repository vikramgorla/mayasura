"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What is Mayasura?",
    answer:
      "Mayasura is an open-source framework that generates a complete digital ecosystem for your brand — website, shop, blog, chatbot, analytics, and more — from a single AI-powered wizard. Named after the divine architect from the Mahabharata who built the legendary Maya Sabha.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. Mayasura is MIT licensed and completely free to use, modify, and deploy. The only cost is your hosting and any AI API usage (you bring your own API key). There are no premium tiers or paid features.",
  },
  {
    question: "How do I deploy it?",
    answer:
      "Clone the repo, add your environment variables (.env), install dependencies, and run. You can deploy to Railway, Vercel, Docker, or any Node.js server. The README has step-by-step guides for each option.",
  },
  {
    question: "What AI provider does it use?",
    answer:
      "Mayasura uses Anthropic's Claude for AI features like brand name generation, content writing, chatbot responses, and SEO optimization. You'll need an Anthropic API key. The AI layer is modular, so other providers can be added.",
  },
  {
    question: "Can I customize the templates?",
    answer:
      "Absolutely. There are 16 templates to start from, each with its own typography, colors, spacing, and animation system. The Design Studio lets you customize fonts, colors, border radius, button styles, and more — all with a live preview.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "The wizard is designed for non-technical users — answer questions about your brand and AI does the rest. For customization beyond the Design Studio, basic familiarity with Next.js and React helps. For self-hosting, you'll need basic server administration knowledge.",
  },
  {
    question: "Can I contribute?",
    answer:
      "Yes! Mayasura is open source and welcomes contributions. Whether it's new templates, bug fixes, features, or documentation — check the GitHub repo for contribution guidelines and open issues.",
  },
  {
    question: "What's the tech stack?",
    answer:
      "Next.js 15 (App Router), TypeScript, Tailwind CSS v4, SQLite (via better-sqlite3), Framer Motion, Anthropic Claude AI, and shadcn/ui-inspired components. It's designed to be simple to deploy with minimal infrastructure — just a Node.js server and a SQLite file.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-zinc-900 dark:text-zinc-50 pr-4 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-8">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Honest answers — no marketing fluff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6"
        >
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
