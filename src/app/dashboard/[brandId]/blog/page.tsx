'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileText, Edit, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { BlogPost, Brand } from '@/lib/types';

export default function BlogManagementPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/blog`).then(r => r.json()).then(d => setPosts(d.posts || []));
  };

  useEffect(() => { loadData(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/brands/${brandId}/blog/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        toast.success('Post updated');
      } else {
        await fetch(`/api/brands/${brandId}/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        toast.success('Post created');
      }
      setEditing(null);
      setCreating(false);
      setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft' });
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
      body: JSON.stringify({ status: newStatus }),
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
    setEditing(post);
    setCreating(true);
    setForm({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      status: post.status,
    });
  };

  if (!brand) return null;

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Blog Management</h1>
            <p className="text-sm text-zinc-400 mt-1">
              {posts.length} posts · {posts.filter(p => p.status === 'published').length} published
            </p>
          </div>
          <Button
            onClick={() => { setCreating(true); setEditing(null); setForm({ title: '', content: '', excerpt: '', category: '', status: 'draft' }); }}
          >
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        </div>

        {/* Editor */}
        {creating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-sm">{editing ? 'Edit Post' : 'New Post'}</CardTitle>
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none font-mono"
                  placeholder="Write your post content here... (supports basic markdown)"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving || !form.title}>
                  {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setCreating(false); setEditing(null); }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts list */}
        {posts.length === 0 && !creating ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">No blog posts yet</p>
              <Button onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4 mr-1" /> Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
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
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePublish(post)}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                      title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(post)}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Live blog link */}
        {brand.slug && (
          <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📝 Your live blog is at:{' '}
              <a
                href={`/blog/${brand.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                /blog/{brand.slug}
              </a>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
