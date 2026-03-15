"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Trash2, Download, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
}

export default function SettingsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}`);
        if (res.ok) {
          const json = await res.json();
          const b = json.data;
          setBrand(b);
          setName(b.name || "");
          setTagline(b.tagline || "");
          setDescription(b.description || "");
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [brandId]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/brands/${brandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim() || null,
          description: description.trim() || null,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setBrand(json.data);
      }
    } catch { /* silent */ } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/export`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brand-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch { /* silent */ }
  }

  async function handleDelete() {
    if (deleteText !== brand?.name) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/brands/${brandId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch { /* silent */ } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!brand) {
    return <p className="text-[var(--text-secondary)]">Brand not found</p>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>

      {/* Brand Info */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Brand Information
        </h2>
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Tagline</label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A short tagline for your brand" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your brand..."
            rows={4}
            className="w-full text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg p-3 text-[var(--text-primary)] resize-y focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <Button variant="brand" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Data Management */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Data Management
        </h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" disabled title="Coming soon">
            <Upload className="h-4 w-4 mr-1" /> Import JSON
          </Button>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          Export downloads all brand data including products, blog posts, testimonials, and settings.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
        </div>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          Deleting your brand is permanent and cannot be undone. All products,
          blog posts, orders, and data will be lost.
        </p>

        {!showDeleteConfirm ? (
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete Brand
          </Button>
        ) : (
          <div className="space-y-3 p-4 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-zinc-900">
            <p className="text-sm text-[var(--text-primary)]">
              Type <strong>{brand.name}</strong> to confirm deletion:
            </p>
            <Input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder={brand.name}
              className="border-red-300 dark:border-red-800"
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteText !== brand.name || deleting}
              >
                {deleting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                {deleting ? "Deleting..." : "Permanently Delete"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
