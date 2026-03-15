"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogEditor } from "./blog-editor";
import { AiBlogWriter } from "./ai-blog-writer";

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
  publishedAt: string | null;
  createdAt: string;
}

const STATUS_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  scheduled: "outline",
};

function estimateReadingTime(content: string | null): number {
  if (!content) return 0;
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

export default function BlogPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showAiWriter, setShowAiWriter] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/blog`);
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    setShowEditor(true);
    setShowAiWriter(false);
  }

  function handleNewPost() {
    setEditingPost(null);
    setShowEditor(true);
    setShowAiWriter(false);
  }

  function handleAiWriter() {
    setShowAiWriter(true);
    setShowEditor(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post?")) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/blog/${id}`, {
        method: "DELETE",
      });
      fetchPosts();
    } catch {
      // silent
    }
  }

  async function handleTogglePublish(post: BlogPost) {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await fetch(`/api/v1/brands/${brandId}/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPosts();
    } catch {
      // silent
    }
  }

  function handleEditorClose() {
    setShowEditor(false);
    setEditingPost(null);
    fetchPosts();
  }

  function handleAiComplete(content: string, seoData?: Record<string, string>) {
    setShowAiWriter(false);
    setEditingPost({
      id: "",
      title: seoData?.seoTitle || "Untitled",
      slug: "",
      content,
      excerpt: seoData?.excerpt || null,
      category: null,
      tags: seoData?.tags ? JSON.parse(JSON.stringify(seoData.tags)) : [],
      seoTitle: seoData?.seoTitle || null,
      seoDescription: seoData?.seoDescription || null,
      status: "draft",
      publishedAt: null,
      createdAt: new Date().toISOString(),
    });
    setShowEditor(true);
  }

  const filtered = posts
    .filter((p) =>
      statusFilter === "all" ? true : p.status === statusFilter
    )
    .filter((p) =>
      search
        ? p.title.toLowerCase().includes(search.toLowerCase())
        : true
    );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // AI Writer view
  if (showAiWriter) {
    return (
      <AiBlogWriter
        brandId={brandId}
        onComplete={handleAiComplete}
        onCancel={() => setShowAiWriter(false)}
      />
    );
  }

  // Editor view
  if (showEditor) {
    return (
      <BlogEditor
        brandId={brandId}
        post={editingPost}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Blog
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAiWriter} variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Writer
          </Button>
          <Button onClick={handleNewPost} variant="brand" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "draft", "published", "scheduled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                statusFilter === s
                  ? "bg-violet-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
      </div>

      {/* Post List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">
            {posts.length === 0
              ? "Write your first blog post"
              : "No posts match your filter"}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {posts.length === 0
              ? "Use AI Writer for instant content or start from scratch."
              : "Try a different filter or search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                    {post.title}
                  </p>
                  <Badge variant={STATUS_BADGE[post.status] || "secondary"}>
                    {post.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                  {post.category && <span>{post.category}</span>}
                  <span>
                    {estimateReadingTime(post.content)} min read
                  </span>
                  <span>
                    {new Date(
                      post.publishedAt || post.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    post.status === "published"
                      ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }`}
                >
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
