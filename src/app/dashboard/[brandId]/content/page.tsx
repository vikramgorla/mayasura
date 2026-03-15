'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText, Sparkles, Trash2, BookOpen, Share2, Mail, Copy, Eye, X,
  Globe, MessageCircle, Wand2, Edit3, Check, ChevronDown, Clock,
  LayoutTemplate, CheckSquare, Square, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────────

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string;
  status: string;
  metadata: string;
  created_at: string;
}

type ContentStatus = 'draft' | 'review' | 'published';

// ─── Constants ─────────────────────────────────────────────────

const contentTypes = [
  { type: 'blog', label: 'Blog Post', icon: BookOpen, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { type: 'social', label: 'Social Media', icon: Share2, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { type: 'email', label: 'Email Template', icon: Mail, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { type: 'landing', label: 'Landing Page', icon: Globe, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { type: 'about', label: 'About Page', icon: FileText, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
];

const statusConfig: Record<ContentStatus, { label: string; color: string; icon: typeof Check }> = {
  draft: { label: 'Draft', color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400', icon: Edit3 },
  review: { label: 'In Review', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: Eye },
  published: { label: 'Published', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: Check },
};

const CONTENT_TEMPLATES = [
  {
    name: 'Blog Post',
    type: 'blog',
    title: 'Untitled Blog Post',
    body: `# Your Blog Post Title

## Introduction
Start with a hook that grabs your reader's attention. What problem are you solving?

## Main Content
Break your content into clear sections with headers. Use short paragraphs.

### Key Point 1
Explain your first main idea here.

### Key Point 2
Explain your second main idea here.

## Conclusion
Summarize the key takeaways and include a call to action.

---
*What did you think? Let us know in the comments.*`,
  },
  {
    name: 'Product Launch',
    type: 'blog',
    title: 'Introducing [Product Name]',
    body: `# Introducing [Product Name]

We're thrilled to announce our latest creation — **[Product Name]**.

## What is it?
A brief description of what the product does and who it's for.

## Key Features
- **Feature 1**: Description of the first key feature
- **Feature 2**: Description of the second key feature
- **Feature 3**: Description of the third key feature

## Why We Built It
Share the story behind the product. What problem does it solve?

## Availability & Pricing
[Product Name] is available now starting at $XX.

👉 **[Shop Now](/shop)**`,
  },
  {
    name: 'Newsletter',
    type: 'email',
    title: 'Monthly Newsletter — [Month Year]',
    body: `# [Brand Name] Newsletter — [Month Year]

Hey there! 👋

Here's what's been happening this month:

## 🆕 What's New
- New product launch: [Product Name]
- Updated our website with fresh designs

## 📖 From the Blog
- [Blog Post Title 1] — Brief summary
- [Blog Post Title 2] — Brief summary

## 🎁 Special Offer
This month only: Use code **NEWSLETTER10** for 10% off your next order.

## 🗓️ Coming Up
- [Upcoming event or product]
- [Upcoming event or product]

Thanks for being part of our community!

— The [Brand Name] Team`,
  },
  {
    name: 'Social Post',
    type: 'social',
    title: 'Social Media Post',
    body: `✨ [Attention-grabbing opening line]

Here's what we've been working on:

🔹 Point one
🔹 Point two
🔹 Point three

👉 Link in bio to learn more

#YourBrand #RelevantHashtag #AnotherHashtag`,
  },
];

// ─── Helpers ───────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(text: string): string {
  const words = wordCount(text);
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/** Basic markdown to HTML — handles headers, bold, italic, lists, links, hr, code */
function markdownToHtml(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded" />')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-4 border-zinc-200 dark:border-zinc-700" />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-500 dark:text-zinc-400">$1</blockquote>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines
    .replace(/\n/g, '<br/>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<br\/>)*\s*(<li>)/g, '$1$3');
  html = html.replace(/(<li>.*?<\/li>)/g, '<ul class="list-disc ml-5 space-y-1">$1</ul>');
  // Clean up duplicate <ul> wrapping
  html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');

  return `<p>${html}</p>`;
}

// ─── Component ─────────────────────────────────────────────────

export default function ContentPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [content, setContent] = useState<ContentItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toast = useToast();

  const loadContent = useCallback(() => {
    const url = filter
      ? `/api/brands/${brandId}/content?type=${filter}`
      : `/api/brands/${brandId}/content`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setContent(d.content || []))
      .catch(() => toast.error('Failed to load content'));
  }, [brandId, filter, toast]);

  useEffect(() => { loadContent(); }, [loadContent]);

  // ─── Filter ────────────────────────────────────────────

  const filteredContent = useMemo(() => {
    let items = content;
    if (statusFilter) {
      items = items.filter(c => (c.status || 'draft') === statusFilter);
    }
    return items;
  }, [content, statusFilter]);

  // ─── Actions ───────────────────────────────────────────

  const generateContent = async (type: string) => {
    setGenerating(type);
    try {
      const res = await fetch(`/api/brands/${brandId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      await res.json();
      toast.success(`${type} content generated!`);
      loadContent();
    } catch {
      toast.error('Generation failed');
    }
    setGenerating(null);
  };

  const deleteContentItem = async (contentId: string) => {
    if (!confirm('Delete this content?')) return;
    try {
      const res = await fetch(`/api/brands/${brandId}/content?contentId=${contentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Content deleted');
      setSelectedIds(prev => { const next = new Set(prev); next.delete(contentId); return next; });
      loadContent();
    } catch {
      toast.error('Failed to delete content');
    }
  };

  const batchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} content item${selectedIds.size > 1 ? 's' : ''}?`)) return;
    try {
      const ids = Array.from(selectedIds).join(',');
      const res = await fetch(`/api/brands/${brandId}/content?ids=${ids}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(`${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''} deleted`);
      setSelectedIds(new Set());
      loadContent();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const duplicateContent = async (item: ContentItem) => {
    try {
      await fetch(`/api/brands/${brandId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: item.type,
          title: `${item.title} (Copy)`,
          body: item.body,
        }),
      });
      toast.success('Content duplicated!');
      loadContent();
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const updateStatus = async (contentId: string, newStatus: ContentStatus) => {
    try {
      const res = await fetch(`/api/brands/${brandId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Status updated to ${statusConfig[newStatus].label}`);
      loadContent();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/brands/${brandId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: editingItem.id, title: editTitle, body: editBody }),
      });
      if (!res.ok) throw new Error();
      toast.success('Content saved!');
      setEditingItem(null);
      loadContent();
    } catch {
      toast.error('Failed to save');
    }
  };

  const createFromTemplate = async (template: typeof CONTENT_TEMPLATES[number]) => {
    try {
      await fetch(`/api/brands/${brandId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: template.type,
          title: template.title,
          body: template.body,
        }),
      });
      toast.success(`Created from "${template.name}" template!`);
      setShowTemplates(false);
      loadContent();
    } catch {
      toast.error('Failed to create');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const openEditor = (item: ContentItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditBody(item.body);
  };

  // ─── Selection helpers ─────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContent.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContent.map(c => c.id)));
    }
  };

  const allSelected = filteredContent.length > 0 && selectedIds.size === filteredContent.length;

  // ─── Type icons ────────────────────────────────────────

  const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
    blog: { icon: BookOpen, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    social: { icon: Share2, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    email: { icon: Mail, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    landing: { icon: Globe, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    about: { icon: FileText, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
    faq: { icon: MessageCircle, color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  };

  const typeCounts: Record<string, number> = {};
  content.forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });

  const statusCounts: Record<string, number> = {};
  content.forEach(c => { statusCounts[c.status || 'draft'] = (statusCounts[c.status || 'draft'] || 0) + 1; });

  // ─── Render ────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content Hub' },
        ]}
        className="mb-4"
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <FileText className="h-6 w-6" />
            Content Hub
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {content.length} pieces · Generate and manage brand content with AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
            <LayoutTemplate className="h-4 w-4 mr-1" />
            Templates
          </Button>
        </div>
      </div>

      {/* Generate Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            Generate Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {contentTypes.map((ct) => (
              <Button
                key={ct.type}
                variant="outline"
                size="sm"
                onClick={() => generateContent(ct.type)}
                disabled={generating === ct.type}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                {generating === ct.type ? (
                  <Spinner className="h-5" />
                ) : (
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${ct.color}`}>
                    <ct.icon className="h-4 w-4" />
                  </div>
                )}
                <span className="text-xs">{ct.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          <Button variant={filter === null ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(null)}>
            All ({content.length})
          </Button>
          {['blog', 'social', 'email', 'landing', 'about'].map((type) => (
            <Button key={type} variant={filter === type ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(type)} className="capitalize">
              {type} {typeCounts[type] ? `(${typeCounts[type]})` : ''}
            </Button>
          ))}
        </div>

        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 mx-1 hidden sm:block" />

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          <Button variant={statusFilter === null ? 'default' : 'ghost'} size="sm" onClick={() => setStatusFilter(null)}>
            All Statuses
          </Button>
          {(['draft', 'review', 'published'] as ContentStatus[]).map((status) => {
            const sc = statusConfig[status];
            return (
              <Button key={status} variant={statusFilter === status ? 'default' : 'ghost'} size="sm" onClick={() => setStatusFilter(status)}>
                {sc.label} {statusCounts[status] ? `(${statusCounts[status]})` : ''}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Batch actions */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800"
        >
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {selectedIds.size} selected
          </span>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-xs">
            Clear
          </Button>
          <Button variant="destructive" size="sm" onClick={batchDelete} className="ml-auto">
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete Selected
          </Button>
        </motion.div>
      )}

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <EmptyState
          icon={Wand2}
          title="No content yet"
          description="Generate content with AI or start from a template — use the buttons above to create blog posts, social media copy, emails, and more"
        />
      ) : (
        <div className="space-y-3">
          {/* Select all header */}
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={toggleSelectAll}
              className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={allSelected ? 'Deselect all' : 'Select all'}
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4 text-violet-600" />
              ) : (
                <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
              )}
            </button>
            <span className="text-xs text-zinc-400">Select all</span>
          </div>

          {filteredContent.map((item) => {
            const typeInfo = typeIcons[item.type] || { icon: FileText, color: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' };
            const Icon = typeInfo.icon;
            const status = (item.status || 'draft') as ContentStatus;
            const sc = statusConfig[status];
            const StatusIcon = sc.icon;
            const words = wordCount(item.body || '');
            const reading = readingTime(item.body || '');
            const isSelected = selectedIds.has(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`group hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-violet-400 dark:ring-violet-600' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Selection checkbox */}
                      <button
                        onClick={() => toggleSelect(item.id)}
                        className="mt-1 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-violet-600" />
                        ) : (
                          <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>

                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm truncate text-zinc-900 dark:text-white">{item.title}</h3>
                          <Badge variant="secondary" className="capitalize flex-shrink-0">{item.type}</Badge>
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 whitespace-pre-wrap">{item.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-zinc-300 dark:text-zinc-600 flex items-center gap-1">
                            <FileText className="h-3 w-3" /> {words} words
                          </span>
                          <span className="text-xs text-zinc-300 dark:text-zinc-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {reading}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {/* Status workflow buttons */}
                        {status === 'draft' && (
                          <button
                            onClick={() => updateStatus(item.id, 'review')}
                            className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-zinc-400 hover:text-amber-600"
                            title="Move to Review"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {status === 'review' && (
                          <button
                            onClick={() => updateStatus(item.id, 'published')}
                            className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-400 hover:text-emerald-600"
                            title="Publish"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {status === 'published' && (
                          <button
                            onClick={() => updateStatus(item.id, 'draft')}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                            title="Unpublish (back to Draft)"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditor(item)}
                          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.body)}
                          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => duplicateContent(item)}
                          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                          title="Duplicate"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteContentItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════ Templates Modal ═══════ */}
      <AnimatePresence>
        {showTemplates && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowTemplates(false)}
            />
            <div className="flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[70vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-violet-600" />
                    Content Templates
                  </h3>
                  <button onClick={() => setShowTemplates(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {CONTENT_TEMPLATES.map((template, i) => (
                    <button
                      key={i}
                      onClick={() => createFromTemplate(template)}
                      className="w-full text-left p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="capitalize">{template.type}</Badge>
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-white group-hover:text-violet-600 transition-colors">
                          {template.name}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">{template.body.slice(0, 120)}...</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ Editor Modal (Split Pane: Markdown + Preview) ═══════ */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditingItem(null)}
            />
            <div className="flex items-start justify-center pt-[5vh] px-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Editor header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant="secondary" className="capitalize flex-shrink-0">{editingItem.type}</Badge>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 text-sm font-semibold bg-transparent border-none outline-none text-zinc-900 dark:text-white"
                      placeholder="Title..."
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {wordCount(editBody)} words
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {readingTime(editBody)}
                    </span>
                    <Button size="sm" onClick={saveEdit} className="ml-2">
                      <Check className="h-3.5 w-3.5 mr-1" /> Save
                    </Button>
                    <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Split pane: editor + preview */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                  {/* Markdown editor */}
                  <div className="flex flex-col overflow-hidden">
                    <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-medium text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                      Markdown
                    </div>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="flex-1 p-4 text-sm font-mono leading-relaxed bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 resize-none outline-none"
                      placeholder="Write your content in Markdown..."
                      spellCheck={false}
                    />
                  </div>

                  {/* Live preview */}
                  <div className="flex flex-col overflow-hidden hidden md:flex">
                    <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-medium text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                      Preview
                    </div>
                    <div
                      className="flex-1 overflow-y-auto p-4 prose dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(editBody) }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ Preview Modal ═══════ */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setPreviewItem(null)}
            />
            <div className="flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[70vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{previewItem.type}</Badge>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{previewItem.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig[(previewItem.status || 'draft') as ContentStatus].color}`}>
                      {statusConfig[(previewItem.status || 'draft') as ContentStatus].label}
                    </span>
                  </div>
                  <button onClick={() => setPreviewItem(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <div
                    className="prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(previewItem.body || '') }}
                  />
                </div>
                <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {wordCount(previewItem.body || '')} words · {readingTime(previewItem.body || '')}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(previewItem.body)}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { openEditor(previewItem); setPreviewItem(null); }}>
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { duplicateContent(previewItem); setPreviewItem(null); }}>
                      <FileText className="h-3.5 w-3.5 mr-1" /> Duplicate
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
