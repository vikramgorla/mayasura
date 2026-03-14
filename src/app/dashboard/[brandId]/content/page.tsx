'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Sparkles, Trash2, BookOpen, Share2, Mail, Copy, Eye, X, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string;
  created_at: string;
}

const contentTypes = [
  { type: 'blog', label: 'Blog Post', icon: BookOpen, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { type: 'social', label: 'Social Media', icon: Share2, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { type: 'email', label: 'Email Template', icon: Mail, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { type: 'landing', label: 'Landing Page', icon: Globe, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { type: 'about', label: 'About Page', icon: FileText, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
];

export default function ContentPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [content, setContent] = useState<ContentItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const toast = useToast();

  const loadContent = () => {
    const url = filter
      ? `/api/brands/${brandId}/content?type=${filter}`
      : `/api/brands/${brandId}/content`;
    fetch(url).then(r => r.json()).then(d => setContent(d.content || []));
  };

  useEffect(() => { loadContent(); }, [brandId, filter]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (e) {
      toast.error('Generation failed');
    }
    setGenerating(null);
  };

  const deleteContentItem = async (contentId: string) => {
    if (!confirm('Delete this content?')) return;
    await fetch(`/api/brands/${brandId}/content?contentId=${contentId}`, { method: 'DELETE' });
    toast.success('Content deleted');
    loadContent();
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
    blog: { icon: BookOpen, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    social: { icon: Share2, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    email: { icon: Mail, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    landing: { icon: Globe, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    about: { icon: FileText, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
    faq: { icon: MessageCircle, color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  };

  // Group by type for stats
  const typeCounts: Record<string, number> = {};
  content.forEach(c => {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });

  return (
    <div className="p-4 sm:p-8">
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

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === null ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All ({content.length})
        </Button>
        {['blog', 'social', 'email', 'landing', 'about'].map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(type)}
            className="capitalize"
          >
            {type} {typeCounts[type] ? `(${typeCounts[type]})` : ''}
          </Button>
        ))}
      </div>

      {/* Content List */}
      {content.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-1 text-zinc-900 dark:text-white">No content yet</h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Generate some content using the buttons above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => {
            const typeInfo = typeIcons[item.type] || { icon: FileText, color: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' };
            const Icon = typeInfo.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate text-zinc-900 dark:text-white">{item.title}</h3>
                          <Badge variant="secondary" className="capitalize flex-shrink-0">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 whitespace-pre-wrap">{item.body}</p>
                        <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-2">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
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

      {/* Preview Modal */}
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
                  </div>
                  <button onClick={() => setPreviewItem(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap leading-relaxed">
                    {previewItem.body}
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(previewItem.body)}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { duplicateContent(previewItem); setPreviewItem(null); }}>
                    <FileText className="h-3.5 w-3.5 mr-1" /> Duplicate
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
