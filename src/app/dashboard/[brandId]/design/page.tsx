'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Type, Layers, Sparkles, Save, Loader2, Check,
  ArrowLeft, Paintbrush, LayoutGrid, CircleDot, SquareStack,
  Monitor, Tablet, Smartphone, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Brand } from '@/lib/types';
import { WEBSITE_TEMPLATES, type WebsiteTemplate } from '@/lib/website-templates';
import { FontPicker, FontPreview } from '@/components/design/font-picker';
import {
  ColorSystemEditor,
  ColorPalettePresets,
  COLOR_PALETTES,
  type ColorSystem,
  type ColorPalette,
} from '@/components/design/color-system';
import {
  ButtonStyleEditor,
  SpacingEditor,
  BorderRadiusEditor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  type SpacingDensity,
  type BorderRadiusPreset,
  DEFAULT_DESIGN_SETTINGS,
} from '@/components/design/style-controls';
import { TemplatePreviewCard, TemplateDetailPreview } from '@/components/design/template-preview';

// ─── Panel Sections ──────────────────────────────────────────────
type PanelSection = 'template' | 'colors' | 'fonts' | 'buttons' | 'spacing';

const PANEL_SECTIONS: { id: PanelSection; label: string; icon: React.ElementType }[] = [
  { id: 'template', label: 'Template', icon: Layers },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'fonts', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: CircleDot },
  { id: 'spacing', label: 'Layout', icon: LayoutGrid },
];

// ─── Main Design Studio ─────────────────────────────────────────
export default function DesignStudioPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;
  const toast = useToast();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelSection>('template');

  // Design state
  const [templateId, setTemplateId] = useState('minimal');
  const [colors, setColors] = useState<ColorSystem>({
    primary: '#0f172a',
    secondary: '#f8fafc',
    accent: '#3b82f6',
    text: '#0f172a',
    muted: '#64748b',
    surface: '#ffffff',
    border: '#e2e8f0',
  });
  const [activePaletteId, setActivePaletteId] = useState<string | undefined>();
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [buttonShape, setButtonShape] = useState<ButtonShape>('rounded');
  const [buttonSize, setButtonSize] = useState<ButtonSize>('medium');
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>('solid');
  const [spacing, setSpacing] = useState<SpacingDensity>('normal');
  const [borderRadius, setBorderRadius] = useState<BorderRadiusPreset>('rounded');
  const [customCSS, setCustomCSS] = useState('');

  // Load brand data
  useEffect(() => {
    Promise.all([
      fetch(`/api/brands/${brandId}`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/settings`).then(r => r.json()),
    ]).then(([brandData, settingsData]) => {
      const b = brandData.brand as Brand;
      const s = (settingsData.settings || {}) as Record<string, string>;
      setBrand(b);
      setSettings(s);

      // Initialize design state from brand + settings
      setTemplateId(b.website_template || 'minimal');
      setColors({
        primary: b.primary_color || '#0f172a',
        secondary: b.secondary_color || '#f8fafc',
        accent: b.accent_color || '#3b82f6',
        text: s.text_color || b.primary_color || '#0f172a',
        muted: s.muted_color || '#64748b',
        surface: s.surface_color || '#ffffff',
        border: s.border_color || '#e2e8f0',
      });
      setHeadingFont(b.font_heading || 'Inter');
      setBodyFont(b.font_body || 'Inter');
      setButtonShape((s.button_shape as ButtonShape) || 'rounded');
      setButtonSize((s.button_size as ButtonSize) || 'medium');
      setButtonVariant((s.button_variant as ButtonVariant) || 'solid');
      setSpacing((s.spacing_density as SpacingDensity) || 'normal');
      setBorderRadius((s.border_radius as BorderRadiusPreset) || 'rounded');
      setCustomCSS(b.custom_css || '');
      setActivePaletteId(s.color_palette_id || undefined);

      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load brand');
      setLoading(false);
    });
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track changes
  const markChanged = useCallback(() => setHasChanges(true), []);

  // Save all design settings
  const handleSave = async () => {
    if (!brand) return;
    setSaving(true);

    try {
      // Save brand-level fields
      const brandUpdates = {
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font_heading: headingFont,
        font_body: bodyFont,
        website_template: templateId,
        custom_css: customCSS,
      };

      const brandRes = await fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandUpdates),
      });

      if (!brandRes.ok) throw new Error('Failed to save brand');
      const brandData = await brandRes.json();
      setBrand(brandData.brand);

      // Save extended settings via brand_settings
      const extendedSettings: Record<string, string> = {
        text_color: colors.text,
        muted_color: colors.muted,
        surface_color: colors.surface,
        border_color: colors.border,
        button_shape: buttonShape,
        button_size: buttonSize,
        button_variant: buttonVariant,
        spacing_density: spacing,
        border_radius: borderRadius,
        color_palette_id: activePaletteId || '',
      };

      const settingsRes = await fetch(`/api/brands/${brandId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: extendedSettings }),
      });

      if (!settingsRes.ok) throw new Error('Failed to save settings');

      setHasChanges(false);
      toast.success('Design saved', 'Your design changes are live.');
    } catch {
      toast.error('Failed to save design');
    }

    setSaving(false);
  };

  // Template selection
  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    const template = WEBSITE_TEMPLATES.find(t => t.id === id);
    if (template) {
      // Apply template defaults for fonts
      setHeadingFont(template.fonts.heading);
      setBodyFont(template.fonts.body);
      // Apply template colors
      const tc = template.colors.light;
      setColors({
        primary: tc.text,
        secondary: tc.background,
        accent: tc.accent,
        text: tc.text,
        muted: tc.muted,
        surface: tc.surface,
        border: tc.border,
      });
      setActivePaletteId(undefined);
    }
    markChanged();
  };

  // Color palette selection
  const handlePaletteSelect = (palette: ColorPalette) => {
    setColors(palette.colors);
    setActivePaletteId(palette.id);
    markChanged();
  };

  const selectedTemplate = WEBSITE_TEMPLATES.find(t => t.id === templateId);

  if (loading || !brand) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/${brandId}/settings`)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Design Studio' },
            ]}
          />
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-violet-600" />
              Design Studio
            </h1>
            <p className="text-[11px] text-zinc-400">{brand.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[11px] text-amber-600 dark:text-amber-400 font-medium"
            >
              Unsaved changes
            </motion.span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            size="sm"
            className="text-xs"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            {saving ? 'Saving...' : 'Save Design'}
          </Button>
        </div>
      </div>

      {/* Main Content: Controls + Preview */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Panel: Controls */}
        <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 overflow-hidden max-h-[50vh] lg:max-h-none">
          {/* Section tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-2 py-1.5 gap-0.5 overflow-x-auto shrink-0">
            {PANEL_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActivePanel(section.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activePanel === section.id
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <section.icon className="h-3.5 w-3.5" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                {activePanel === 'template' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Website Template</p>
                      <p className="text-xs text-zinc-400 mb-4">Choose a design language for your brand</p>
                      <div className="grid grid-cols-1 gap-3">
                        {WEBSITE_TEMPLATES.map(template => (
                          <TemplatePreviewCard
                            key={template.id}
                            template={template}
                            isSelected={templateId === template.id}
                            brandName={brand.name}
                            onClick={() => handleTemplateSelect(template.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePanel === 'colors' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Color System</p>
                      <p className="text-xs text-zinc-400 mb-4">Define your brand&apos;s visual palette</p>
                    </div>
                    <ColorSystemEditor
                      colors={colors}
                      onChange={(c) => { setColors(c); setActivePaletteId(undefined); markChanged(); }}
                      onPaletteSelect={handlePaletteSelect}
                      activePaletteId={activePaletteId}
                    />
                  </div>
                )}

                {activePanel === 'fonts' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Typography</p>
                      <p className="text-xs text-zinc-400 mb-4">Pick fonts that express your brand</p>
                    </div>
                    <FontPicker
                      label="Heading Font"
                      value={headingFont}
                      onChange={(f) => { setHeadingFont(f); markChanged(); }}
                    />
                    <FontPicker
                      label="Body Font"
                      value={bodyFont}
                      onChange={(f) => { setBodyFont(f); markChanged(); }}
                    />
                    <FontPreview
                      headingFont={headingFont}
                      bodyFont={bodyFont}
                      brandName={brand.name}
                    />
                  </div>
                )}

                {activePanel === 'buttons' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Button Style</p>
                      <p className="text-xs text-zinc-400 mb-4">Customize your call-to-action buttons</p>
                    </div>
                    <ButtonStyleEditor
                      shape={buttonShape}
                      size={buttonSize}
                      variant={buttonVariant}
                      onShapeChange={(v) => { setButtonShape(v); markChanged(); }}
                      onSizeChange={(v) => { setButtonSize(v); markChanged(); }}
                      onVariantChange={(v) => { setButtonVariant(v); markChanged(); }}
                      accentColor={colors.accent}
                    />
                  </div>
                )}

                {activePanel === 'spacing' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Layout & Spacing</p>
                      <p className="text-xs text-zinc-400 mb-4">Control density and border radius</p>
                    </div>
                    <SpacingEditor
                      value={spacing}
                      onChange={(v) => { setSpacing(v); markChanged(); }}
                    />
                    <div className="pt-2">
                      <BorderRadiusEditor
                        value={borderRadius}
                        onChange={(v) => { setBorderRadius(v); markChanged(); }}
                      />
                    </div>
                    {/* Custom CSS */}
                    <div className="pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                        Custom CSS
                      </p>
                      <textarea
                        value={customCSS}
                        onChange={e => { setCustomCSS(e.target.value); markChanged(); }}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-green-400 text-xs font-mono outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        placeholder={`/* Your custom CSS */\n.hero-section {\n  padding: 4rem 0;\n}`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-auto p-4 lg:p-6">
          {selectedTemplate && (
            <TemplateDetailPreview
              template={selectedTemplate}
              brandName={brand.name}
              colors={colors}
              headingFont={headingFont}
              bodyFont={bodyFont}
              buttonShape={buttonShape}
              buttonSize={buttonSize}
              buttonVariant={buttonVariant}
              spacing={spacing}
              borderRadius={borderRadius}
            />
          )}
        </div>
      </div>
    </div>
  );
}
