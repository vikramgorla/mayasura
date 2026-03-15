"use client";

import { useState } from "react";
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
}

interface BlogEditorProps {
  brandId: string;
  post: BlogPost | null;
  onClose: () => void;
}

export function BlogEditor({ brandId, post, onClose }: BlogEditorProps) {
  const isNew = !post?.id;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    post?.seoDescription || ""
  );
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSave(status?: string) {
    if (!title.trim()) return;
    setSaving(true);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      content: content || undefined,
      excerpt: excerpt || undefined,
      category: category || undefined,
      tags: tagList.length > 0 ? tagList : undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      ...(status ? { status } : {}),
    };

    try {
      const url = isNew
        ? `/api/v1/brands/${brandId}/blog`
        : `/api/v1/brands/${brandId}/blog/${post.id}`;

      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {showPreview ? "Editor" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save Draft
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Save className="h-3 w-3 mr-1" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Post title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-xl font-bold border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)]"
          />

          {showPreview ? (
            <div
              className="p-6 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)] min-h-[400px] prose-sm"
              style={{ color: "var(--text-primary)" }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: renderBasicMarkdown(content),
                }}
              />
            </div>
          ) : (
            <textarea
              placeholder="Write your post in markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-mono resize-none"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Excerpt */}
          <div className="p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Excerpt
            </label>
            <textarea
              placeholder="Brief summary of the post"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none"
            />
          </div>

          {/* Category & Tags */}
          <div className="p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering, Marketing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] mb-3"
            />

            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="tag1, tag2, tag3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
          </div>

          {/* SEO */}
          <div className="p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              SEO
            </label>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">
                    SEO Title
                  </span>
                  <span
                    className={
                      seoTitle.length > 60
                        ? "text-red-500"
                        : "text-[var(--text-tertiary)]"
                    }
                  >
                    {seoTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="SEO-optimized title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">
                    Meta Description
                  </span>
                  <span
                    className={
                      seoDescription.length > 160
                        ? "text-red-500"
                        : "text-[var(--text-tertiary)]"
                    }
                  >
                    {seoDescription.length}/160
                  </span>
                </div>
                <textarea
                  placeholder="Meta description for search results"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none"
                />
              </div>

              {/* SERP Preview */}
              {(seoTitle || title) && (
                <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-secondary)]">
                  <p className="text-xs text-[var(--text-tertiary)] mb-1">
                    Google Preview
                  </p>
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {seoTitle || title}
                  </p>
                  <p className="text-xs text-green-700 truncate">
                    yoursite.com/blog/...
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                    {seoDescription || excerpt || "No description set."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBasicMarkdown(text: string): string {
  if (!text) return '<p class="text-[var(--text-tertiary)]">Nothing to preview yet...</p>';

  return text
    .replace(/^### (.+)$/gm, '<h3 style="font-weight:600;margin:1em 0 0.5em">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25rem;font-weight:700;margin:1.5em 0 0.5em">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:700;margin:1.5em 0 0.5em">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}
