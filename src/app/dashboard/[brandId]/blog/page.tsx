'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Edit, Trash2, Eye, EyeOff, Sparkles, X,
  Image, Tag, Calendar, Code, Newspaper, Search, Clock,
  BarChart2, Globe, CheckCircle2, AlarmClock, FileEdit,
  ExternalLink, ChevronDown, PenLine, ListOrdered, RefreshCw,
  ChevronUp, ArrowDownToLine, Target, Hash, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { BlogPost, Brand } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';

/* ─── Helpers ───────────────────────────────────────────────── */
function readingTime(content: string): string {
  if (!content) return '1 min read';
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-3" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-500">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br />');
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type PostStatus = 'all' | 'draft' | 'published' | 'scheduled';

/* ─── SEO Preview ───────────────────────────────────────────── */
function SeoPreview({
  title, excerpt, brandSlug, postTitle,
}: {
  title: string; excerpt: string; brandSlug: string; postTitle: string;
}) {
  const url = `yoursite.com/blog/${brandSlug}/${slugify(postTitle || 'post-title')}`;
  const displayTitle = title || postTitle || 'Post Title';
  const displayDesc = excerpt || 'Meta description will appear here. Keep it between 120–160 characters for best results.';

  return (
    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">SEO Preview — Google</p>
      <div className="space-y-1">
        <p className="text-[13px] text-green-700 dark:text-green-500 font-normal truncate">{url}</p>
        <p className="text-[17px] text-blue-700 dark:text-blue-400 font-normal leading-tight hover:underline cursor-pointer line-clamp-1">
          {displayTitle.slice(0, 60)}
          {displayTitle.length > 60 && '...'}
        </p>
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-2">
          {displayDesc.slice(0, 160)}
          {displayDesc.length > 160 && '...'}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
          displayTitle.length <= 60
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
        }`}>
          Title: {displayTitle.length}/60
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
          displayDesc.length >= 120 && displayDesc.length <= 160
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
        }`}>
          Desc: {displayDesc.length}/160
        </span>
      </div>
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────────────────── */
function PostCard({
  post,
  onEdit,
  onDelete,
  onTogglePublish,
  brandSlug,
}: {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (post: BlogPost) => void;
  brandSlug: string;
}) {
  const [expanded, setExpanded] = useState(false);
  let postTags: string[] = [];
  try { postTags = JSON.parse(post.tags || '[]'); } catch { /* ignore */ }

  const isScheduled = post.status === 'published' && post.published_at && new Date(post.published_at) > new Date();
  const statusLabel = isScheduled ? 'scheduled' : post.status;

  const statusConfig = {
    published: { label: 'Published', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
    draft: { label: 'Draft', color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700', icon: FileEdit },
    scheduled: { label: 'Scheduled', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800', icon: AlarmClock },
  };

  const cfg = statusConfig[statusLabel as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="flex">
          {/* Featured image placeholder */}
          <div className="w-24 sm:w-32 flex-shrink-0 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, #8b5cf6 0%, transparent 60%), radial-gradient(circle at 70% 50%, #3b82f6 0%, transparent 60%)',
              }} />
            </div>
            <FileText className="h-8 w-8 text-violet-300 dark:text-violet-600 relative z-10" />
          </div>

          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                    <StatusIcon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                  {post.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                      {post.category}
                    </span>
                  )}
                  {postTags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] text-zinc-400">#{tag}</span>
                  ))}
                </div>

                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1 mb-1">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs text-zinc-400 line-clamp-1 mb-2">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap">
                  {post.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {isScheduled ? 'Scheduled: ' : ''}
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  {post.content && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime(post.content)}
                    </span>
                  )}
                  {post.status === 'published' && (
                    <span className="flex items-center gap-1 text-zinc-300 dark:text-zinc-600" title="Blog analytics coming soon">
                      <BarChart2 className="h-3 w-3" />
                      —
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {post.status === 'published' && brandSlug && (
                  <a
                    href={`/blog/${brandSlug}/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    title="View live"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => onTogglePublish(post)}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expandable content preview */}
            {post.content && (
              <div className="mt-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  {expanded ? 'Hide preview' : 'Preview content'}
                </button>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs prose dark:prose-invert max-w-none line-clamp-4 overflow-hidden border border-zinc-100 dark:border-zinc-800"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content.slice(0, 600)) }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── AI Blog Writer Drawer ────────────────────────────────── */
type BlogTone = 'informative' | 'casual' | 'persuasive' | 'professional';

interface AiBlogWriterProps {
  open: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
  brandId: string;
}

function AiBlogWriterDrawer({ open, onClose, onInsert, brandId }: AiBlogWriterProps) {
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState<BlogTone>('informative');
  const [wordCount, setWordCount] = useState(800);
  const [step, setStep] = useState<'inputs' | 'outline' | 'article' | 'seo'>('inputs');
  const [outline, setOutline] = useState<string[]>([]);
  const [articleTitle, setArticleTitle] = useState('');
  const [article, setArticle] = useState('');
  const [seo, setSeo] = useState<{ metaTitle: string; metaDescription: string; focusKeyword: string; keywordDensitySuggestion: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null);
  const toast = useToast();
  const drawerRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setStep('inputs');
    setOutline([]);
    setArticleTitle('');
    setArticle('');
    setSeo(null);
    setLoading(false);
  };

  const generateOutline = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }
    setLoading(true);
    setLoadingMsg('Generating outline...');
    try {
      const res = await fetch('/api/ai/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'outline', topic, keyword, tone, wordCount }),
      });
      const data = await res.json();
      if (data.outline) {
        setArticleTitle(data.outline.title);
        setOutline(data.outline.sections);
        setStep('outline');
      } else {
        toast.error('Failed to generate outline');
      }
    } catch {
      toast.error('Failed to generate outline');
    }
    setLoading(false);
  };

  const generateArticle = async () => {
    setLoading(true);
    setLoadingMsg('Writing full article...');
    try {
      const res = await fetch('/api/ai/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'article', topic, keyword, tone, wordCount, outline }),
      });
      const data = await res.json();
      if (data.content) {
        setArticle(data.content);
        setStep('article');
      } else {
        toast.error('Failed to generate article');
      }
    } catch {
      toast.error('Failed to generate article');
    }
    setLoading(false);
  };

  const improveSection = async (idx: number) => {
    // Split article into sections by ##
    const sections = article.split(/(?=^## )/m);
    if (!sections[idx]) return;
    setImprovingIdx(idx);
    try {
      const res = await fetch('/api/ai/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'improve',
          sectionContent: sections[idx],
          sectionTitle: outline[idx] || '',
          tone,
          keyword,
        }),
      });
      const data = await res.json();
      if (data.improved) {
        sections[idx] = data.improved;
        setArticle(sections.join('\n\n'));
        toast.success('Section improved!');
      }
    } catch {
      toast.error('Failed to improve section');
    }
    setImprovingIdx(null);
  };

  const generateSeo = async () => {
    setLoading(true);
    setLoadingMsg('Generating SEO suggestions...');
    try {
      const res = await fetch('/api/ai/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'seo', topic, keyword, sectionContent: article.slice(0, 600) }),
      });
      const data = await res.json();
      if (data.seo) {
        setSeo(data.seo);
        setStep('seo');
      }
    } catch {
      toast.error('Failed to generate SEO data');
    }
    setLoading(false);
  };

  const handleInsert = () => {
    if (!article) return;
    onInsert(article);
    onClose();
    toast.success('Content inserted into editor!');
  };

  const articleSections = article ? article.split(/(?=^## )/m) : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col overflow-hidden border-l border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                  <PenLine className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">AI Blog Writer</h2>
                  <p className="text-[10px] text-zinc-400">
                    {step === 'inputs' && 'Set up your article'}
                    {step === 'outline' && 'Edit your outline'}
                    {step === 'article' && 'Review & improve'}
                    {step === 'seo' && 'SEO suggestions'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {step !== 'inputs' && (
                  <button
                    onClick={reset}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Start Over
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 gap-1 flex-shrink-0">
              {(['inputs', 'outline', 'article', 'seo'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step === s ? 'bg-violet-500' :
                    ['inputs', 'outline', 'article', 'seo'].indexOf(step) > i ? 'bg-violet-300' :
                    'bg-zinc-200 dark:bg-zinc-700'
                  }`} />
                </div>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Step 1: Inputs */}
              {step === 'inputs' && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Topic *
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. 10 ways to improve your morning routine"
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                      <Hash className="h-3 w-3 inline mr-1" />
                      Target Keyword
                    </label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      placeholder="e.g. morning routine tips"
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all placeholder:text-zinc-400"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">AI will naturally incorporate this keyword for SEO</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Tone</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['informative', 'casual', 'persuasive', 'professional'] as BlogTone[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTone(t)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                            tone === t
                              ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      {tone === 'informative' && 'Educational, clear, factual — great for how-to guides'}
                      {tone === 'casual' && 'Friendly, conversational — great for lifestyle content'}
                      {tone === 'persuasive' && 'Compelling, action-oriented — great for marketing'}
                      {tone === 'professional' && 'Authoritative, formal — great for B2B and thought leadership'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Target Word Count: <span className="text-violet-600">{wordCount}</span>
                    </label>
                    <input
                      type="range"
                      min={300}
                      max={2000}
                      step={100}
                      value={wordCount}
                      onChange={e => setWordCount(Number(e.target.value))}
                      className="w-full accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                      <span>300</span>
                      <span>Short read</span>
                      <span>Long-form</span>
                      <span>2000</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Outline */}
              {step === 'outline' && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={articleTitle}
                      onChange={e => setArticleTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <ListOrdered className="h-3 w-3" /> Sections (drag to reorder, edit inline)
                      </label>
                      <button
                        onClick={() => setOutline(o => [...o, 'New section heading'])}
                        className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-0.5 font-medium"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {outline.map((section, i) => (
                        <div key={i} className="flex items-center gap-2 group">
                          <span className="text-[10px] text-zinc-400 w-4 flex-shrink-0 text-right">{i + 1}</span>
                          <input
                            type="text"
                            value={section}
                            onChange={e => {
                              const next = [...outline];
                              next[i] = e.target.value;
                              setOutline(next);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                          />
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                if (i === 0) return;
                                const next = [...outline];
                                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                                setOutline(next);
                              }}
                              disabled={i === 0}
                              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-20"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (i === outline.length - 1) return;
                                const next = [...outline];
                                [next[i], next[i + 1]] = [next[i + 1], next[i]];
                                setOutline(next);
                              }}
                              disabled={i === outline.length - 1}
                              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-20"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setOutline(o => o.filter((_, j) => j !== i))}
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Article */}
              {step === 'article' && (
                <div className="p-5 space-y-4">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {article.split(/\s+/).length} words · {articleSections.length} sections
                  </div>

                  {/* Per-section improve buttons */}
                  <div className="space-y-3">
                    {articleSections.map((section, i) => {
                      const firstLine = section.split('\n')[0].replace(/^#+\s*/, '');
                      return (
                        <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50">
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate flex-1 mr-2">
                              {firstLine || `Section ${i + 1}`}
                            </span>
                            <button
                              onClick={() => improveSection(i)}
                              disabled={improvingIdx === i}
                              className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-700 font-medium flex-shrink-0 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors disabled:opacity-50"
                            >
                              {improvingIdx === i ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Sparkles className="h-3 w-3" />
                              )}
                              {improvingIdx === i ? 'Improving...' : 'Improve'}
                            </button>
                          </div>
                          <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {section.replace(/^#+[^\n]*\n/, '').slice(0, 120)}...
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Full article preview */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Full Article (Markdown)</label>
                    <textarea
                      value={article}
                      onChange={e => setArticle(e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono outline-none resize-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: SEO */}
              {step === 'seo' && seo && (
                <div className="p-5 space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" /> SEO Recommendations
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mb-1">Meta Title ({seo.metaTitle.length}/60)</p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{seo.metaTitle}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mb-1">Meta Description ({seo.metaDescription.length}/160)</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{seo.metaDescription}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mb-1">Focus Keyword</p>
                        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">{seo.focusKeyword}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mb-1">Keyword Usage</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{seo.keywordDensitySuggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex-shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-5 py-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-violet-600" />
                  <span className="text-sm text-zinc-500">{loadingMsg}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  {step === 'inputs' && (
                    <Button onClick={generateOutline} className="flex-1" disabled={!topic.trim()}>
                      <ListOrdered className="h-4 w-4" />
                      Generate Outline
                    </Button>
                  )}
                  {step === 'outline' && (
                    <>
                      <Button variant="outline" onClick={() => setStep('inputs')} className="flex-shrink-0">
                        Back
                      </Button>
                      <Button onClick={generateArticle} className="flex-1" disabled={outline.length === 0}>
                        <Sparkles className="h-4 w-4" />
                        Write Full Article
                      </Button>
                    </>
                  )}
                  {step === 'article' && (
                    <>
                      <Button variant="outline" onClick={generateSeo} className="flex-shrink-0">
                        <Target className="h-4 w-4" />
                        SEO
                      </Button>
                      <Button onClick={handleInsert} className="flex-1">
                        <ArrowDownToLine className="h-4 w-4" />
                        Insert into Editor
                      </Button>
                    </>
                  )}
                  {step === 'seo' && (
                    <>
                      <Button variant="outline" onClick={() => setStep('article')} className="flex-shrink-0">
                        Back
                      </Button>
                      <Button onClick={handleInsert} className="flex-1">
                        <ArrowDownToLine className="h-4 w-4" />
                        Insert into Editor
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function BlogManagementPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSeoPreview, setShowSeoPreview] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PostStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: '', status: 'draft',
    tags: '' as string, scheduledDate: '', imageUrl: '',
    seoTitle: '', seoDesc: '',
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [aiWriterOpen, setAiWriterOpen] = useState(false);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setBrand(d.brand))
      .catch(() => toast.error('Failed to load brand'));
    fetch(`/api/brands/${brandId}/blog`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setPosts(d.posts || []))
      .catch(() => toast.error('Failed to load blog posts'));
  };

  useEffect(() => { loadData(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...tags, tagInput.trim()].join(', ') }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: tags.filter(t => t !== tag).join(', ') }));
  };

  const insertImageUrl = () => {
    if (form.imageUrl) {
      setForm(f => ({ ...f, content: f.content + `\n![Image](${form.imageUrl})\n`, imageUrl: '' }));
      toast.success('Image inserted');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        status: form.status,
        tags: JSON.stringify(tags),
      };

      if (form.status === 'published' && form.scheduledDate) {
        payload.published_at = new Date(form.scheduledDate).toISOString();
      } else if (form.status === 'published') {
        payload.published_at = new Date().toISOString();
      }

      if (editing) {
        await fetch(`/api/brands/${brandId}/blog/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Post updated');
      } else {
        await fetch(`/api/brands/${brandId}/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Post created');
      }
      setEditing(null);
      setCreating(false);
      setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft', tags: '', scheduledDate: '', imageUrl: '', seoTitle: '', seoDesc: '' });
      setPreviewMode(false);
      loadData();
    } catch {
      toast.error('Failed to save post');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`/api/brands/${brandId}/blog/${id}`, { method: 'DELETE' });
      toast.success('Post deleted');
      loadData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/brands/${brandId}/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      }),
    });
    toast.success(newStatus === 'published' ? 'Post published!' : 'Post unpublished');
    loadData();
  };

  const generateDraft = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', topic: form.title || 'industry trends' }),
      });
      const data = await res.json();
      if (data.content) {
        setForm(f => ({
          ...f,
          title: data.content.title || f.title,
          content: data.content.body || f.content,
          excerpt: (data.content.body || '').substring(0, 200),
        }));
        toast.success('AI draft generated!');
      }
    } catch {
      toast.error('Failed to generate');
    }
    setGenerating(false);
  };

  const startEdit = (post: BlogPost) => {
    let parsedTags = '';
    try {
      const t = JSON.parse(post.tags || '[]');
      parsedTags = Array.isArray(t) ? t.join(', ') : '';
    } catch { parsedTags = ''; }

    setEditing(post);
    setCreating(true);
    setPreviewMode(false);
    setShowSeoPreview(false);
    setForm({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      status: post.status,
      tags: parsedTags,
      scheduledDate: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
      imageUrl: '',
      seoTitle: '',
      seoDesc: '',
    });
  };

  const resetForm = () => {
    setCreating(false);
    setEditing(null);
    setPreviewMode(false);
    setShowSeoPreview(false);
    setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft', tags: '', scheduledDate: '', imageUrl: '', seoTitle: '', seoDesc: '' });
  };

  if (!brand) return null;

  // Filter and search
  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isScheduled = p.status === 'published' && p.published_at && new Date(p.published_at) > new Date();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'scheduled' && isScheduled) ||
      (statusFilter === 'published' && p.status === 'published' && !isScheduled) ||
      (statusFilter === 'draft' && p.status === 'draft');

    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: posts.length,
    published: posts.filter(p => p.status === 'published' && !(p.published_at && new Date(p.published_at) > new Date())).length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'published' && p.published_at && new Date(p.published_at) > new Date()).length,
  };

  const tabConfig: { value: PostStatus; label: string; icon: React.ElementType }[] = [
    { value: 'all', label: 'All', icon: FileText },
    { value: 'published', label: 'Published', icon: CheckCircle2 },
    { value: 'draft', label: 'Drafts', icon: FileEdit },
    { value: 'scheduled', label: 'Scheduled', icon: AlarmClock },
  ];

  return (
    <PageTransition>
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Blog' },
        ]}
        className="mb-4"
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-violet-600" />
              Blog
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {posts.length} posts · {counts.published} published
              {counts.scheduled > 0 && ` · ${counts.scheduled} scheduled`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setAiWriterOpen(true)}
              className="hidden sm:flex"
            >
              <PenLine className="h-4 w-4 mr-1" /> AI Writer
            </Button>
            <Button
              onClick={() => {
                setCreating(true);
                setEditing(null);
                setPreviewMode(false);
                setShowSeoPreview(false);
                setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft', tags: '', scheduledDate: '', imageUrl: '', seoTitle: '', seoDesc: '' });
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
          </div>
        </div>

        {/* Editor */}
        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mb-8"
            >
              <Card className="border-violet-200 dark:border-violet-800/50 shadow-lg">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {editing ? (
                        <><Edit className="h-4 w-4 text-violet-600" /> Edit Post</>
                      ) : (
                        <><Plus className="h-4 w-4 text-violet-600" /> New Post</>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSeoPreview(!showSeoPreview)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                          showSeoPreview
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <Globe className="h-3 w-3" />
                        SEO
                      </button>
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                          previewMode
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {previewMode ? <><Code className="h-3 w-3" /> Edit</> : <><Eye className="h-3 w-3" /> Preview</>}
                      </button>
                      <button
                        onClick={resetForm}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all font-medium placeholder:text-zinc-400"
                      placeholder="Post title..."
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={form.excerpt}
                      onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                      placeholder="Short excerpt / meta description (120–160 chars)..."
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {form.excerpt.length}/160 — used for SEO and card previews
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-500">Category</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                        placeholder="e.g. News, Tutorial"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-500">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    {form.status === 'published' && (
                      <div>
                        <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Schedule (optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={form.scheduledDate}
                          onChange={(e) => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-zinc-500 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <AnimatePresence>
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                        placeholder="Add tag and press Enter"
                      />
                      <Button variant="outline" size="sm" onClick={addTag}>Add</Button>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                      <Image className="h-3 w-3" /> Insert Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button variant="outline" size="sm" onClick={insertImageUrl} disabled={!form.imageUrl}>Insert</Button>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-zinc-500">Content (Markdown)</label>
                      <div className="flex items-center gap-3">
                        {form.content && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {readingTime(form.content)}
                          </span>
                        )}
                        <button
                          onClick={generateDraft}
                          disabled={generating}
                          className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium"
                        >
                          <Sparkles className="h-3 w-3" />
                          {generating ? 'Generating...' : 'AI Generate'}
                        </button>
                      </div>
                    </div>
                    {previewMode ? (
                      <div
                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm min-h-[300px] prose dark:prose-invert max-w-none overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(form.content) }}
                      />
                    ) : (
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                        rows={14}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none font-mono focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                        placeholder="Write your post content here... (Markdown supported: # ## ### **bold** *italic* [link](url) ![image](url))"
                      />
                    )}
                  </div>

                  {/* SEO Preview */}
                  <AnimatePresence>
                    {showSeoPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <SeoPreview
                          title={form.seoTitle || form.title}
                          excerpt={form.seoDesc || form.excerpt}
                          brandSlug={brand?.slug || ''}
                          postTitle={form.title}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <Button onClick={handleSave} disabled={saving || !form.title}>
                      {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                    </Button>
                    <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                    {form.title && (
                      <span className="ml-auto text-[10px] text-zinc-400">
                        Slug: /blog/{brand?.slug}/{slugify(form.title)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs + Search */}
        {posts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            {/* Status tabs */}
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1 flex-shrink-0">
              {tabConfig.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === tab.value
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    statusFilter === tab.value
                      ? 'bg-zinc-100 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-200'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                  }`}>
                    {counts[tab.value]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 w-full sm:w-auto max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
              />
            </div>
          </div>
        )}

        {/* Posts list */}
        {filteredPosts.length === 0 && !creating ? (
          posts.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No blog posts yet"
              description="Write your first post to engage your audience"
              illustration="blog"
              action={{ label: 'Create First Post', onClick: () => setCreating(true) }}
            />
          ) : (
            <div className="text-center py-16 text-sm text-zinc-400">
              No posts match your search
            </div>
          )
        ) : (
          <motion.div
            className="space-y-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  onTogglePublish={togglePublish}
                  brandSlug={brand?.slug || ''}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Live blog link */}
        {brand.slug && (
          <motion.div
            className="mt-8 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-violet-700 dark:text-violet-300 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Your live blog:{' '}
              <a
                href={`/blog/${brand.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:text-violet-900 dark:hover:text-violet-100 transition-colors"
              >
                /blog/{brand.slug}
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>

    {/* AI Blog Writer Drawer */}
    <AiBlogWriterDrawer
      open={aiWriterOpen}
      onClose={() => setAiWriterOpen(false)}
      onInsert={(content) => {
        // Insert generated content into the editor
        const lines = content.split('\n');
        const titleLine = lines.find(l => l.startsWith('# '));
        const title = titleLine ? titleLine.replace(/^#\s+/, '') : '';
        const body = titleLine ? lines.filter(l => l !== titleLine).join('\n').trim() : content;
        const excerpt = body.replace(/^#+[^\n]*\n/, '').replace(/\*\*/g, '').slice(0, 200).trim();

        setCreating(true);
        setEditing(null);
        setPreviewMode(false);
        setShowSeoPreview(false);
        setForm(f => ({
          ...f,
          title: title || f.title,
          content: body,
          excerpt: excerpt,
          status: 'draft',
        }));
      }}
      brandId={brandId}
    />
    </PageTransition>
  );
}
