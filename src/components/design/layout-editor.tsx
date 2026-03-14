'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  GripVertical, Eye, EyeOff, Settings2, Trash2, Plus, X,
  ChevronDown, ChevronRight, Save, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  type PageLayout,
  type PageSection,
  type SectionType,
  type HeroConfig,
  type FeaturesConfig,
  type ProductsConfig,
  type BlogConfig,
  type TestimonialsConfig,
  type NewsletterConfig,
  type ContactCtaConfig,
  type StatsConfig,
  type FaqConfig,
  SECTION_METADATA,
  createSection,
} from '@/lib/page-layout';

// ─── Section List Item ───────────────────────────────────────────
function SectionListItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onRemove,
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
}) {
  const meta = SECTION_METADATA.find(m => m.type === section.type);

  return (
    <Reorder.Item
      value={section}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing',
        isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/15 shadow-sm'
          : section.visible
            ? 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300'
            : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 opacity-50'
      )}
    >
      <GripVertical className="h-4 w-4 text-zinc-300 dark:text-zinc-600 flex-shrink-0" />

      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-2 min-w-0 text-left"
      >
        <span className="text-sm">{meta?.icon || '📄'}</span>
        <div className="min-w-0">
          <p className={cn(
            'text-xs font-medium truncate',
            section.visible
              ? 'text-zinc-900 dark:text-white'
              : 'text-zinc-400 dark:text-zinc-500'
          )}>
            {meta?.label || section.type}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? (
            <Eye className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-zinc-300" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Remove section"
        >
          <Trash2 className="h-3.5 w-3.5 text-zinc-300 hover:text-red-500" />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ─── Add Section Menu ────────────────────────────────────────────
function AddSectionMenu({
  existingTypes,
  onAdd,
  onClose,
}: {
  existingTypes: SectionType[];
  onAdd: (type: SectionType) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 shadow-lg p-2 space-y-0.5"
    >
      <div className="flex items-center justify-between px-2 py-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Add Section</p>
        <button onClick={onClose} className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
          <X className="h-3 w-3 text-zinc-400" />
        </button>
      </div>
      {SECTION_METADATA.map(meta => {
        const exists = existingTypes.includes(meta.type);
        return (
          <button
            key={meta.type}
            onClick={() => { onAdd(meta.type); onClose(); }}
            disabled={meta.type === 'hero' && exists}
            className={cn(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors',
              meta.type === 'hero' && exists
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'
            )}
          >
            <span className="text-base">{meta.icon}</span>
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{meta.label}</p>
              <p className="text-[10px] text-zinc-400">{meta.description}</p>
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── Section Config Panels ───────────────────────────────────────
function HeroConfigPanel({ config, onChange }: { config: HeroConfig; onChange: (c: HeroConfig) => void }) {
  return (
    <div className="space-y-3">
      <ConfigInput label="Heading" value={config.heading || ''} onChange={v => onChange({ ...config, heading: v })} placeholder="Leave empty for brand tagline" />
      <ConfigInput label="Subheading" value={config.subheading || ''} onChange={v => onChange({ ...config, subheading: v })} placeholder="Leave empty for brand description" />
      <ConfigInput label="CTA Text" value={config.ctaText || ''} onChange={v => onChange({ ...config, ctaText: v })} />
      <ConfigInput label="CTA Link" value={config.ctaLink || ''} onChange={v => onChange({ ...config, ctaLink: v })} placeholder="/shop/your-brand" />
      <ConfigInput label="Secondary CTA Text" value={config.secondaryCtaText || ''} onChange={v => onChange({ ...config, secondaryCtaText: v })} />
      <ConfigSelect
        label="Layout"
        value={config.layout}
        options={[
          { value: 'centered', label: 'Centered' },
          { value: 'left-aligned', label: 'Left Aligned' },
          { value: 'split', label: 'Split' },
        ]}
        onChange={v => onChange({ ...config, layout: v as HeroConfig['layout'] })}
      />
    </div>
  );
}

function FeaturesConfigPanel({ config, onChange }: { config: FeaturesConfig; onChange: (c: FeaturesConfig) => void }) {
  const addItem = () => onChange({ ...config, items: [...config.items, { title: 'New Feature', description: 'Description', icon: '✦' }] });
  const removeItem = (i: number) => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, updates: Partial<FeaturesConfig['items'][0]>) => {
    const items = [...config.items];
    items[i] = { ...items[i], ...updates };
    onChange({ ...config, items });
  };

  return (
    <div className="space-y-3">
      <ConfigSelect
        label="Columns"
        value={String(config.columns)}
        options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]}
        onChange={v => onChange({ ...config, columns: Number(v) as 2 | 3 | 4 })}
      />
      <div>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">Feature Items</p>
        <div className="space-y-2">
          {config.items.map((item, i) => (
            <div key={i} className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.icon || ''}
                  onChange={e => updateItem(i, { icon: e.target.value })}
                  className="w-10 px-1.5 py-1 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                  placeholder="💎"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={e => updateItem(i, { title: e.target.value })}
                  className="flex-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  placeholder="Feature title"
                />
                <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X className="h-3 w-3 text-zinc-400 hover:text-red-500" />
                </button>
              </div>
              <textarea
                value={item.description}
                onChange={e => updateItem(i, { description: e.target.value })}
                className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs resize-none"
                rows={2}
                placeholder="Feature description"
              />
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add Feature
        </button>
      </div>
    </div>
  );
}

function ProductsConfigPanel({ config, onChange }: { config: ProductsConfig; onChange: (c: ProductsConfig) => void }) {
  return (
    <div className="space-y-3">
      <ConfigSelect
        label="Products to Show"
        value={String(config.count)}
        options={[{ value: '3', label: '3 Products' }, { value: '4', label: '4 Products' }, { value: '6', label: '6 Products' }]}
        onChange={v => onChange({ ...config, count: Number(v) as 3 | 4 | 6 })}
      />
      <ConfigSelect
        label="Layout"
        value={config.layout}
        options={[{ value: 'grid', label: 'Grid' }, { value: 'carousel', label: 'Carousel' }]}
        onChange={v => onChange({ ...config, layout: v as 'grid' | 'carousel' })}
      />
      <ConfigToggle label="Show 'View All' link" value={config.showViewAll} onChange={v => onChange({ ...config, showViewAll: v })} />
    </div>
  );
}

function BlogConfigPanel({ config, onChange }: { config: BlogConfig; onChange: (c: BlogConfig) => void }) {
  return (
    <div className="space-y-3">
      <ConfigSelect
        label="Posts to Show"
        value={String(config.count)}
        options={[{ value: '3', label: '3 Posts' }, { value: '4', label: '4 Posts' }, { value: '6', label: '6 Posts' }]}
        onChange={v => onChange({ ...config, count: Number(v) as 3 | 4 | 6 })}
      />
      <ConfigSelect
        label="Layout"
        value={config.layout}
        options={[{ value: 'cards', label: 'Cards' }, { value: 'list', label: 'List' }, { value: 'magazine', label: 'Magazine' }]}
        onChange={v => onChange({ ...config, layout: v as 'cards' | 'list' | 'magazine' })}
      />
    </div>
  );
}

function TestimonialsConfigPanel({ config, onChange }: { config: TestimonialsConfig; onChange: (c: TestimonialsConfig) => void }) {
  const addItem = () => onChange({ ...config, items: [...config.items, { quote: 'Great product!', author: 'Customer', role: '' }] });
  const removeItem = (i: number) => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, updates: Partial<TestimonialsConfig['items'][0]>) => {
    const items = [...config.items];
    items[i] = { ...items[i], ...updates };
    onChange({ ...config, items });
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Testimonials</p>
      {config.items.map((item, i) => (
        <div key={i} className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
          <textarea
            value={item.quote}
            onChange={e => updateItem(i, { quote: e.target.value })}
            className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs resize-none"
            rows={2}
            placeholder="Customer quote"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.author}
              onChange={e => updateItem(i, { author: e.target.value })}
              className="flex-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
              placeholder="Author name"
            />
            <input
              type="text"
              value={item.role || ''}
              onChange={e => updateItem(i, { role: e.target.value })}
              className="flex-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
              placeholder="Role"
            />
            <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
              <X className="h-3 w-3 text-zinc-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
        <Plus className="h-3 w-3" /> Add Testimonial
      </button>
    </div>
  );
}

function NewsletterConfigPanel({ config, onChange }: { config: NewsletterConfig; onChange: (c: NewsletterConfig) => void }) {
  return (
    <div className="space-y-3">
      <ConfigInput label="Heading" value={config.heading || ''} onChange={v => onChange({ ...config, heading: v })} />
      <ConfigInput label="Subheading" value={config.subheading || ''} onChange={v => onChange({ ...config, subheading: v })} />
      <ConfigInput label="Button Text" value={config.buttonText || ''} onChange={v => onChange({ ...config, buttonText: v })} />
    </div>
  );
}

function ContactCtaConfigPanel({ config, onChange }: { config: ContactCtaConfig; onChange: (c: ContactCtaConfig) => void }) {
  return (
    <div className="space-y-3">
      <ConfigInput label="Heading" value={config.heading || ''} onChange={v => onChange({ ...config, heading: v })} />
      <ConfigInput label="Subheading" value={config.subheading || ''} onChange={v => onChange({ ...config, subheading: v })} />
      <ConfigInput label="Button Text" value={config.buttonText || ''} onChange={v => onChange({ ...config, buttonText: v })} />
      <ConfigInput label="Button Link" value={config.buttonLink || ''} onChange={v => onChange({ ...config, buttonLink: v })} />
    </div>
  );
}

function StatsConfigPanel({ config, onChange }: { config: StatsConfig; onChange: (c: StatsConfig) => void }) {
  const addItem = () => onChange({ ...config, items: [...config.items, { number: '0', label: 'Label' }] });
  const removeItem = (i: number) => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, updates: Partial<StatsConfig['items'][0]>) => {
    const items = [...config.items];
    items[i] = { ...items[i], ...updates };
    onChange({ ...config, items });
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Stats Items</p>
      {config.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item.number}
            onChange={e => updateItem(i, { number: e.target.value })}
            className="w-20 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold"
            placeholder="100+"
          />
          <input
            type="text"
            value={item.label}
            onChange={e => updateItem(i, { label: e.target.value })}
            className="flex-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
            placeholder="Label"
          />
          <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
            <X className="h-3 w-3 text-zinc-400 hover:text-red-500" />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
        <Plus className="h-3 w-3" /> Add Stat
      </button>
    </div>
  );
}

function FaqConfigPanel({ config, onChange }: { config: FaqConfig; onChange: (c: FaqConfig) => void }) {
  const addItem = () => onChange({ ...config, items: [...config.items, { question: 'New question?', answer: 'Answer here.' }] });
  const removeItem = (i: number) => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, updates: Partial<FaqConfig['items'][0]>) => {
    const items = [...config.items];
    items[i] = { ...items[i], ...updates };
    onChange({ ...config, items });
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">FAQ Items</p>
      {config.items.map((item, i) => (
        <div key={i} className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={item.question}
              onChange={e => updateItem(i, { question: e.target.value })}
              className="flex-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium"
              placeholder="Question?"
            />
            <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
              <X className="h-3 w-3 text-zinc-400 hover:text-red-500" />
            </button>
          </div>
          <textarea
            value={item.answer}
            onChange={e => updateItem(i, { answer: e.target.value })}
            className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs resize-none"
            rows={2}
            placeholder="Answer"
          />
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
        <Plus className="h-3 w-3" /> Add FAQ
      </button>
    </div>
  );
}

// ─── Config UI Primitives ────────────────────────────────────────
function ConfigInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500"
      />
    </div>
  );
}

function ConfigSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ConfigToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors',
          value ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'
        )}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
          animate={{ x: value ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// ─── Section Configurator ────────────────────────────────────────
function SectionConfigurator({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (config: PageSection['config']) => void;
}) {
  const meta = SECTION_METADATA.find(m => m.type === section.type);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{meta?.icon || '📄'}</span>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{meta?.label}</p>
          <p className="text-[10px] text-zinc-400">{meta?.description}</p>
        </div>
      </div>
      {section.type === 'hero' && <HeroConfigPanel config={section.config as HeroConfig} onChange={onChange} />}
      {section.type === 'features' && <FeaturesConfigPanel config={section.config as FeaturesConfig} onChange={onChange} />}
      {section.type === 'products' && <ProductsConfigPanel config={section.config as ProductsConfig} onChange={onChange} />}
      {section.type === 'blog' && <BlogConfigPanel config={section.config as BlogConfig} onChange={onChange} />}
      {section.type === 'testimonials' && <TestimonialsConfigPanel config={section.config as TestimonialsConfig} onChange={onChange} />}
      {section.type === 'newsletter' && <NewsletterConfigPanel config={section.config as NewsletterConfig} onChange={onChange} />}
      {section.type === 'contact-cta' && <ContactCtaConfigPanel config={section.config as ContactCtaConfig} onChange={onChange} />}
      {section.type === 'stats' && <StatsConfigPanel config={section.config as StatsConfig} onChange={onChange} />}
      {section.type === 'faq' && <FaqConfigPanel config={section.config as FaqConfig} onChange={onChange} />}
      {section.type === 'gallery' && (
        <p className="text-xs text-zinc-400">Gallery configuration coming soon — add image URLs manually.</p>
      )}
    </div>
  );
}

// ─── Main Layout Editor ──────────────────────────────────────────
export function LayoutEditor({
  layout,
  onChange,
  onSave,
  saving,
}: {
  layout: PageLayout;
  onChange: (layout: PageLayout) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(layout.sections[0]?.id || null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const selectedSection = layout.sections.find(s => s.id === selectedId);
  const existingTypes = layout.sections.map(s => s.type);

  const handleReorder = useCallback((reordered: PageSection[]) => {
    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    onChange({ sections: updated });
  }, [onChange]);

  const toggleVisibility = useCallback((id: string) => {
    onChange({
      sections: layout.sections.map(s =>
        s.id === id ? { ...s, visible: !s.visible } : s
      ),
    });
  }, [layout, onChange]);

  const removeSection = useCallback((id: string) => {
    const filtered = layout.sections.filter(s => s.id !== id);
    if (selectedId === id) {
      setSelectedId(filtered[0]?.id || null);
    }
    onChange({ sections: filtered.map((s, i) => ({ ...s, order: i })) });
  }, [layout, onChange, selectedId]);

  const addSection = useCallback((type: SectionType) => {
    const newSection = createSection(type);
    newSection.order = layout.sections.length;
    const updated = [...layout.sections, newSection];
    onChange({ sections: updated });
    setSelectedId(newSection.id);
  }, [layout, onChange]);

  const updateSectionConfig = useCallback((config: PageSection['config']) => {
    if (!selectedId) return;
    onChange({
      sections: layout.sections.map(s =>
        s.id === selectedId ? { ...s, config } : s
      ),
    });
  }, [layout, onChange, selectedId]);

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* Left: Section List */}
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 overflow-hidden">
        <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs font-semibold text-zinc-900 dark:text-white">Sections</p>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          <AnimatePresence>
            {showAddMenu && (
              <AddSectionMenu
                existingTypes={existingTypes}
                onAdd={addSection}
                onClose={() => setShowAddMenu(false)}
              />
            )}
          </AnimatePresence>

          <Reorder.Group
            axis="y"
            values={layout.sections}
            onReorder={handleReorder}
            className="space-y-1.5"
          >
            {layout.sections.map(section => (
              <SectionListItem
                key={section.id}
                section={section}
                isSelected={selectedId === section.id}
                onSelect={() => setSelectedId(section.id)}
                onToggleVisibility={() => toggleVisibility(section.id)}
                onRemove={() => removeSection(section.id)}
              />
            ))}
          </Reorder.Group>
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <Button onClick={onSave} disabled={saving} size="sm" className="w-full text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
            {saving ? 'Saving...' : 'Save Layout'}
          </Button>
        </div>
      </div>

      {/* Right: Section Config */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {selectedSection ? (
            <motion.div
              key={selectedSection.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <SectionConfigurator
                section={selectedSection}
                onChange={updateSectionConfig}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Settings2 className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-400">Select a section to configure</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
