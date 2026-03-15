'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileText, Edit, Trash2, Eye, EyeOff, Sparkles, X, Image, Tag, Calendar, Code, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { BlogPost, Brand } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

// Simple markdown-to-HTML converter for preview
function markdownToHtml(md: string): string {
  let html = md
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
  return `<p class="mt-3">${html}</p>`;
}

export default function BlogManagementPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: '', status: 'draft',
    tags: '' as string, scheduledDate: '', imageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tagInput, setTagInput] = useState('');
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
      const newTags = [...tags, tagInput.trim()].join(', ');
      setForm(f => ({ ...f, tags: newTags }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag).join(', ');
    setForm(f => ({ ...f, tags: newTags }));
  };

  const insertImageUrl = () => {
    if (form.imageUrl) {
      const imgMd = `\n![Image](${form.imageUrl})\n`;
      setForm(f => ({ ...f, content: f.content + imgMd, imageUrl: '' }));
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
      setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft', tags: '', scheduledDate: '', imageUrl: '' });
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
    setForm({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      status: post.status,
      tags: parsedTags,
      scheduledDate: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
      imageUrl: '',
    });
  };

  if (!brand) return null;

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Blog' },
        ]}
        className="mb-4"
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Blog Management</h1>
            <p className="text-sm text-zinc-400 mt-1">
              {posts.length} posts · {posts.filter(p => p.status === 'published').length} published
            </p>
          </div>
          <Button
            onClick={() => { setCreating(true); setEditing(null); setPreviewMode(false); setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft', tags: '', scheduledDate: '', imageUrl: '' }); }}
          >
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        </div>

        {/* Editor */}
        {creating && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{editing ? 'Edit Post' : 'New Post'}</CardTitle>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      previewMode
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {previewMode ? <><Code className="h-3 w-3 inline mr-1" />Edit</> : <><Eye className="h-3 w-3 inline mr-1" />Preview</>}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">Excerpt</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                  placeholder="Short summary..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none"
                    placeholder="e.g. News, Tutorial"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">Status</label>
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
                    <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Schedule Publish
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
                <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">
                  <Tag className="h-3 w-3 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
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

              {/* Image insertion */}
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-300">
                  <Image className="h-3 w-3 inline mr-1" />
                  Insert Image URL
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

              {/* Content Editor / Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Content</label>
                  <button
                    onClick={generateDraft}
                    disabled={generating}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </button>
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
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none font-mono"
                    placeholder="Write your post content here... (supports markdown: # ## ### **bold** *italic* [link](url) ![image](url))"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving || !form.title}>
                  {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setCreating(false); setEditing(null); setPreviewMode(false); }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts list */}
        {posts.length === 0 && !creating ? (
          <EmptyState
            icon={Newspaper}
            title="No blog posts yet"
            description="Write your first post to engage your audience"
            illustration="blog"
            action={{
              label: 'Create First Post',
              onClick: () => setCreating(true),
            }}
          />
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              let postTags: string[] = [];
              try { postTags = JSON.parse(post.tags || '[]'); } catch { /* ignore */ }

              return (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                          {post.title}
                        </h3>
                        <Badge variant={post.status === 'published' ? 'success' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        {post.excerpt || 'No excerpt'}
                        {post.category && <> · {post.category}</>}
                        {post.published_at && <> · {new Date(post.published_at).toLocaleDateString()}</>}
                      </p>
                      {postTags.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                          {postTags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                              {tag}
                            </span>
                          ))}
                          {postTags.length > 3 && (
                            <span className="text-[10px] text-zinc-400">+{postTags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublish(post)}
                        className="p-2.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(post)}
                        className="p-2.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Live blog link */}
        {brand.slug && (
          <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📝 Your live blog is at:{' '}
              <a href={`/blog/${brand.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                /blog/{brand.slug}
              </a>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
