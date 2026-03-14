'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Package, Palette, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { STARTER_TEMPLATES, StarterTemplate } from '@/lib/templates';

export default function TemplatesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedTemplate = STARTER_TEMPLATES.find(t => t.id === selected);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-slate-900 text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Mayasura</span>
          </Link>
          <Link href="/create">
            <Button variant="brand" size="sm">
              Start from Scratch
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Category Starter Kits
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Start with a template
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Pre-built brand ecosystems for every industry. Pick a template, customize with AI, and launch.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STARTER_TEMPLATES.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TemplateCard
                template={template}
                isSelected={selected === template.id}
                onSelect={() => setSelected(selected === template.id ? null : template.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Template Detail Panel */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg"
          >
            <div className="p-6 sm:p-8" style={{ backgroundColor: selectedTemplate.primaryColor }}>
              <div className="flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: selectedTemplate.accentColor, color: '#fff' }}
                >
                  {selectedTemplate.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: selectedTemplate.secondaryColor }}>
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-sm opacity-70" style={{ color: selectedTemplate.secondaryColor }}>
                    {selectedTemplate.tagline}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{selectedTemplate.brandDescription}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Package className="h-4 w-4 text-slate-400" />
                    Products Included
                  </div>
                  <div className="space-y-2">
                    {selectedTemplate.products.map((p, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-slate-400 ml-2">${p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Palette className="h-4 w-4 text-slate-400" />
                    Brand Identity
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: selectedTemplate.primaryColor }} />
                    <div className="h-8 w-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: selectedTemplate.secondaryColor }} />
                    <div className="h-8 w-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: selectedTemplate.accentColor }} />
                  </div>
                  <p className="text-xs text-slate-400">{selectedTemplate.fontHeading} / {selectedTemplate.fontBody}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    Chatbot Persona
                  </div>
                  <p className="text-sm text-slate-500 italic">&ldquo;{selectedTemplate.chatbotPersona}&rdquo;</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTemplate.toneKeywords.map(kw => (
                  <Badge key={kw} variant="secondary">{kw}</Badge>
                ))}
                {selectedTemplate.channels.map(ch => (
                  <Badge key={ch} variant="outline" className="capitalize">{ch}</Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href={`/create?template=${selectedTemplate.id}`} className="flex-1 sm:flex-none">
                  <Button variant="brand" size="lg" className="w-full sm:w-auto">
                    Use This Template
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => setSelected(null)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: StarterTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-white dark:bg-slate-800 rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
      }`}
    >
      <div className="h-20 p-4 flex items-end" style={{ backgroundColor: template.primaryColor }}>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: template.accentColor + '30' }}
          >
            {template.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: template.secondaryColor }}>
              {template.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-400 mb-1">{template.category}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
          {template.description}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.primaryColor }} />
            <div className="h-4 w-4 rounded-full border border-slate-200" style={{ backgroundColor: template.secondaryColor }} />
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.accentColor }} />
          </div>
          <span className="text-xs text-slate-400">{template.products.length} products</span>
        </div>
      </div>
    </button>
  );
}
