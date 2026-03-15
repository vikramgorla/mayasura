'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  MessageSquareQuote, Plus, Star, Trash2, Edit3, GripVertical,
  Sparkles, Loader2, X, Check, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import type { Testimonial } from '@/lib/types';

// ─── Star Rating Component ────────────────────────────────────────
function StarRating({ rating, onChange, readonly = false }: { rating: number; onChange?: (r: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-4 w-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Sortable Testimonial Card ─────────────────────────────────────
function SortableTestimonialCard({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  testimonial: Testimonial;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDragging ? 0.7 : 1, y: 0 }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      className={`group ${isDragging ? 'z-50 relative' : ''}`}
    >
      <Card className={`transition-all ${isDragging ? 'shadow-xl ring-2 ring-violet-300 dark:ring-violet-700' : 'hover:shadow-md'} ${testimonial.featured ? 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-3">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 pt-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 text-violet-600 dark:text-violet-400"
              >
                {testimonial.author_name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {testimonial.author_name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {[testimonial.author_role, testimonial.author_company].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {testimonial.featured === 1 && (
                    <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <StarRating rating={testimonial.rating} readonly />
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onToggleFeatured(testimonial.id, testimonial.featured === 1 ? 0 : 1)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    testimonial.featured
                      ? 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                      : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Award className="h-3 w-3 inline mr-1" />
                  {testimonial.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => onEdit(testimonial)}
                  className="text-xs px-2 py-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit3 className="h-3 w-3 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(testimonial.id)}
                  className="text-xs px-2 py-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-3 w-3 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Testimonial Form Modal ─────────────────────────────────────
function TestimonialForm({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial?: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    author_name: initial?.author_name || '',
    author_role: initial?.author_role || '',
    author_company: initial?.author_company || '',
    quote: initial?.quote || '',
    rating: initial?.rating || 5,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {initial ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <X className="h-4 w-4 text-zinc-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Author Name *</label>
              <input
                value={form.author_name}
                onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/30"
                placeholder="Jane Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Role / Title</label>
                <input
                  value={form.author_role}
                  onChange={e => setForm(f => ({ ...f, author_role: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/30"
                  placeholder="CEO"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Company</label>
                <input
                  value={form.author_company}
                  onChange={e => setForm(f => ({ ...f, author_company: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/30"
                  placeholder="Acme Inc"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Testimonial *</label>
              <textarea
                value={form.quote}
                onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                placeholder="This product changed my life..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Rating</label>
              <StarRating rating={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onSave(form)}
              disabled={saving || !form.author_name || !form.quote}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              {initial ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function TestimonialsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}/testimonials`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleSave = async (data: Partial<Testimonial>) => {
    setSaving(true);
    try {
      if (editingTestimonial) {
        const res = await fetch(`/api/brands/${brandId}/testimonials`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testimonialId: editingTestimonial.id, ...data }),
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        setTestimonials(result.testimonials);
        toast.success('Testimonial updated');
      } else {
        const res = await fetch(`/api/brands/${brandId}/testimonials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        setTestimonials(result.testimonials);
        toast.success('Testimonial added', 'Your social proof is growing! ⭐');
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch {
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/brands/${brandId}/testimonials?testimonialId=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setTestimonials(result.testimonials);
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleFeatured = async (id: string, featured: number) => {
    try {
      const res = await fetch(`/api/brands/${brandId}/testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId: id, featured }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setTestimonials(result.testimonials);
      toast.success(featured ? 'Marked as featured ⭐' : 'Removed from featured');
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex(t => t.id === active.id);
    const newIndex = testimonials.findIndex(t => t.id === over.id);
    const reordered = arrayMove(testimonials, oldIndex, newIndex);
    setTestimonials(reordered);

    const updates = reordered.map((t, i) => ({ id: t.id, sort_order: i }));
    try {
      await fetch(`/api/brands/${brandId}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', updates }),
      });
    } catch {
      toast.error('Failed to save order');
      fetchTestimonials();
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();

      // Save each generated testimonial
      for (const t of result.testimonials || []) {
        await fetch(`/api/brands/${brandId}/testimonials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        });
      }

      await fetchTestimonials();
      toast.success('AI testimonials generated! ✨', `${result.testimonials?.length || 0} testimonials created`);
    } catch {
      toast.error('Failed to generate testimonials');
    } finally {
      setGenerating(false);
    }
  };

  const featuredCount = testimonials.filter(t => t.featured).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
        <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-4" />
        ))}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brand', href: `/dashboard/${brandId}` },
            { label: 'Testimonials' },
          ]}
          className="mb-4"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <MessageSquareQuote className="h-6 w-6 text-violet-600" />
              Testimonials
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Manage social proof for your brand — {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
              {featuredCount > 0 && <span className="text-amber-500"> · {featuredCount} featured</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
              AI Generate
            </Button>
            <Button
              size="sm"
              onClick={() => { setEditingTestimonial(null); setShowForm(true); }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Testimonial
            </Button>
          </div>
        </motion.div>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <>
            <EmptyState
              icon={MessageSquareQuote}
              title="No testimonials yet"
              description="Add customer testimonials to build trust and social proof on your site."
              action={{
                label: 'Add Testimonial',
                onClick: () => setShowForm(true),
              }}
            />
            <div className="flex justify-center -mt-8 mb-8">
              <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
                Or AI Generate Samples
              </Button>
            </div>
          </>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={testimonials.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {testimonials.map(t => (
                    <SortableTestimonialCard
                      key={t.id}
                      testimonial={t}
                      onEdit={(t) => { setEditingTestimonial(t); setShowForm(true); }}
                      onDelete={handleDelete}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <TestimonialForm
              initial={editingTestimonial}
              onSave={handleSave}
              onClose={() => { setShowForm(false); setEditingTestimonial(null); }}
              saving={saving}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
