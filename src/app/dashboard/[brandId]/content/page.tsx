'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Sparkles, Trash2, BookOpen, Share2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';

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
];

export default function ContentPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [content, setContent] = useState<ContentItem[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

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
      loadContent();
    } catch (e) {
      console.error('Generation error:', e);
    }
    setGenerating(null);
  };

  const deleteContentItem = async (contentId: string) => {
    await fetch(`/api/brands/${brandId}/content?contentId=${contentId}`, { method: 'DELETE' });
    loadContent();
  };

  const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
    blog: { icon: BookOpen, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    social: { icon: Share2, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    email: { icon: Mail, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    landing: { icon: FileText, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    about: { icon: FileText, color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="h-6 w-6" />
            Content Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate and manage brand content with AI</p>
        </div>
      </div>

      {/* Generate Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Generate Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {contentTypes.map((ct) => (
              <Button
                key={ct.type}
                variant="outline"
                size="sm"
                onClick={() => generateContent(ct.type)}
                disabled={generating === ct.type}
              >
                {generating === ct.type ? (
                  <Spinner className="h-4" />
                ) : (
                  <ct.icon className="h-3.5 w-3.5" />
                )}
                Generate {ct.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === null ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {['blog', 'social', 'email', 'landing', 'about'].map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Content List */}
      {content.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">No content yet</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">Generate some content using the buttons above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => {
            const typeInfo = typeIcons[item.type] || { icon: FileText, color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' };
            const Icon = typeInfo.icon;
            return (
              <Card key={item.id} className="group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate text-slate-900 dark:text-white">{item.title}</h3>
                        <Badge variant="secondary" className="capitalize flex-shrink-0">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">{item.body}</p>
                      <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContentItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
