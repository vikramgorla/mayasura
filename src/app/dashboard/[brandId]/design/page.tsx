'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Type, Layers, Save, Loader2,
  ArrowLeft, Paintbrush, LayoutGrid, CircleDot,
  Undo2, Redo2, Download, Upload, Wand2,
  AlertTriangle, Sparkles, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Brand } from '@/lib/types';
import { WEBSITE_TEMPLATES, type WebsiteTemplate } from '@/lib/website-templates';
import { FontPicker, FontPreview } from '@/components/design/font-picker';
import {
  ColorSystemEditor,
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
} from '@/components/design/style-controls';
import { TemplatePreviewCard, TemplateDetailPreview } from '@/components/design/template-preview';

// ─── Font Pairing Suggestions ────────────────────────────────────
const FONT_PAIRINGS: Record<string, string[]> = {
  // Sans-serif headings → body suggestions
  'Inter': ['Inter', 'Source Serif 4', 'Lora', 'DM Sans'],
  'Plus Jakarta Sans': ['Inter', 'Lora', 'Source Serif 4', 'Plus Jakarta Sans'],
  'DM Sans': ['DM Sans', 'Source Serif 4', 'Crimson Pro', 'Inter'],
  'Outfit': ['Inter', 'Outfit', 'Source Serif 4', 'Lora'],
  'Space Grotesk': ['Inter', 'Space Grotesk', 'Spectral', 'DM Sans'],
  'Manrope': ['Manrope', 'Inter', 'Source Serif 4', 'Lora'],
  'Sora': ['Inter', 'Sora', 'Source Serif 4', 'DM Sans'],
  'Poppins': ['Poppins', 'Inter', 'Lora', 'DM Sans'],
  'Nunito': ['Nunito', 'Inter', 'Merriweather', 'Source Serif 4'],
  'Lato': ['Lato', 'Merriweather', 'Inter', 'Source Serif 4'],
  'Raleway': ['Raleway', 'Inter', 'Lora', 'Merriweather'],
  'Work Sans': ['Work Sans', 'Source Serif 4', 'Inter', 'Lora'],
  'Rubik': ['Rubik', 'Inter', 'Source Serif 4', 'DM Sans'],
  'Figtree': ['Figtree', 'Inter', 'Source Serif 4', 'Lora'],
  'Albert Sans': ['Albert Sans', 'Inter', 'Source Serif 4', 'DM Sans'],
  // Serif headings → body suggestions
  'Playfair Display': ['Inter', 'DM Sans', 'Lato', 'Source Serif 4'],
  'Source Serif 4': ['Inter', 'DM Sans', 'Source Serif 4', 'Lato'],
  'Lora': ['Inter', 'DM Sans', 'Lato', 'Lora'],
  'Merriweather': ['Inter', 'DM Sans', 'Merriweather', 'Work Sans'],
  'Crimson Pro': ['Inter', 'DM Sans', 'Crimson Pro', 'Lato'],
  'EB Garamond': ['Inter', 'DM Sans', 'EB Garamond', 'Lato'],
  'Libre Baskerville': ['Inter', 'DM Sans', 'Libre Baskerville', 'Work Sans'],
  'Cormorant Garamond': ['Inter', 'DM Sans', 'Cormorant Garamond', 'Raleway'],
  'Spectral': ['Inter', 'Space Grotesk', 'Spectral', 'DM Sans'],
  'Noto Serif': ['Inter', 'Noto Serif', 'DM Sans', 'Lato'],
  // Display headings → body suggestions
  'Archivo Black': ['Inter', 'DM Sans', 'Work Sans', 'Lato'],
  'Bebas Neue': ['Inter', 'DM Sans', 'Raleway', 'Lato'],
  'Oswald': ['Inter', 'DM Sans', 'Lato', 'Work Sans'],
  'Anton': ['Inter', 'DM Sans', 'Raleway', 'Work Sans'],
  'Montserrat': ['Montserrat', 'Inter', 'DM Sans', 'Source Serif 4'],
  'Righteous': ['Inter', 'DM Sans', 'Poppins', 'Lato'],
  // Monospace headings → body suggestions
  'JetBrains Mono': ['Inter', 'DM Sans', 'JetBrains Mono', 'Space Grotesk'],
  'Fira Code': ['Inter', 'DM Sans', 'Space Grotesk', 'Fira Code'],
  'Source Code Pro': ['Inter', 'DM Sans', 'Source Code Pro', 'Space Grotesk'],
};

// ─── Design Presets ──────────────────────────────────────────────
interface DesignPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  template: string;
  headingFont: string;
  bodyFont: string;
  colors: ColorSystem;
  buttonShape: ButtonShape;
  buttonVariant: ButtonVariant;
  spacing: SpacingDensity;
  borderRadius: BorderRadiusPreset;
}

const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'startup-fresh',
    name: 'Startup Fresh',
    emoji: '🚀',
    description: 'Clean, modern, tech-forward with blue accents',
    template: 'startup',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    colors: { primary: '#0F172A', secondary: '#FFFFFF', accent: '#3B82F6', text: '#0F172A', muted: '#64748B', surface: '#F8FAFC', border: '#E2E8F0' },
    buttonShape: 'rounded',
    buttonVariant: 'solid',
    spacing: 'normal',
    borderRadius: 'rounded',
  },
  {
    id: 'luxury-brand',
    name: 'Luxury Brand',
    emoji: '✨',
    description: 'Elegant serif fonts, gold accent, spacious layout',
    template: 'boutique',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    colors: { primary: '#1A1A2E', secondary: '#FAF9F7', accent: '#C5954A', text: '#1A1A2E', muted: '#71717A', surface: '#FFFFFF', border: '#E4E4E7' },
    buttonShape: 'sharp',
    buttonVariant: 'solid',
    spacing: 'generous',
    borderRadius: 'subtle',
  },
  {
    id: 'artisan-craft',
    name: 'Artisan Craft',
    emoji: '🎨',
    description: 'Warm earth tones, handmade feel, serif typography',
    template: 'editorial',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'DM Sans',
    colors: { primary: '#44403C', secondary: '#FAFAF9', accent: '#B45309', text: '#292524', muted: '#78716C', surface: '#FFFFFF', border: '#D6D3D1' },
    buttonShape: 'rounded',
    buttonVariant: 'outline',
    spacing: 'normal',
    borderRadius: 'rounded',
  },
  {
    id: 'tech-forward',
    name: 'Tech Forward',
    emoji: '💻',
    description: 'Dark theme, monospace accent, sleek and minimal',
    template: 'tech',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    colors: { primary: '#0A0F1A', secondary: '#0F0F17', accent: '#22D3EE', text: '#E2E8F0', muted: '#64748B', surface: '#1A1A2E', border: '#1E293B' },
    buttonShape: 'sharp',
    buttonVariant: 'solid',
    spacing: 'compact',
    borderRadius: 'subtle',
  },
  {
    id: 'eco-natural',
    name: 'Eco Natural',
    emoji: '🌿',
    description: 'Organic greens, clean sans-serif, warm backgrounds',
    template: 'wellness',
    headingFont: 'Nunito',
    bodyFont: 'Inter',
    colors: { primary: '#14532D', secondary: '#FDF8F0', accent: '#16A34A', text: '#14532D', muted: '#6B7280', surface: '#FFFFFF', border: '#D1D5DB' },
    buttonShape: 'pill',
    buttonVariant: 'solid',
    spacing: 'generous',
    borderRadius: 'pill',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    emoji: '⚪',
    description: 'Near-black text, white space, quiet elegance',
    template: 'minimal',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    colors: { primary: '#111111', secondary: '#FFFFFF', accent: '#111111', text: '#111111', muted: '#6B7280', surface: '#FAFAFA', border: '#E5E7EB' },
    buttonShape: 'sharp',
    buttonVariant: 'outline',
    spacing: 'generous',
    borderRadius: 'subtle',
  },
];

// ─── Undo/Redo Types ─────────────────────────────────────────────
interface DesignState {
  templateId: string;
  colors: ColorSystem;
  headingFont: string;
  bodyFont: string;
  buttonShape: ButtonShape;
  buttonSize: ButtonSize;
  buttonVariant: ButtonVariant;
  spacing: SpacingDensity;
  borderRadius: BorderRadiusPreset;
  customCSS: string;
}

function statesEqual(a: DesignState, b: DesignState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─── Panel Sections ──────────────────────────────────────────────
type PanelSection = 'presets' | 'template' | 'colors' | 'fonts' | 'buttons' | 'spacing';

const PANEL_SECTIONS: { id: PanelSection; label: string; icon: React.ElementType }[] = [
  { id: 'presets', label: 'Presets', icon: Wand2 },
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelSection>('presets');

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

  // Template switch confirmation
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);

  // Undo/redo stack
  const [undoStack, setUndoStack] = useState<DesignState[]>([]);
  const [redoStack, setRedoStack] = useState<DesignState[]>([]);
  const skipHistoryRef = useRef(false);

  // Recent colors
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const getCurrentState = useCallback((): DesignState => ({
    templateId, colors, headingFont, bodyFont,
    buttonShape, buttonSize, buttonVariant,
    spacing, borderRadius, customCSS,
  }), [templateId, colors, headingFont, bodyFont, buttonShape, buttonSize, buttonVariant, spacing, borderRadius, customCSS]);

  const pushHistory = useCallback(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    const state = getCurrentState();
    setUndoStack(prev => {
      if (prev.length > 0 && statesEqual(prev[prev.length - 1], state)) return prev;
      return [...prev.slice(-30), state]; // Keep max 30 states
    });
    setRedoStack([]);
  }, [getCurrentState]);

  const applyState = useCallback((state: DesignState) => {
    skipHistoryRef.current = true;
    setTemplateId(state.templateId);
    setColors(state.colors);
    setHeadingFont(state.headingFont);
    setBodyFont(state.bodyFont);
    setButtonShape(state.buttonShape);
    setButtonSize(state.buttonSize);
    setButtonVariant(state.buttonVariant);
    setSpacing(state.spacing);
    setBorderRadius(state.borderRadius);
    setCustomCSS(state.customCSS);
    setHasChanges(true);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length < 2) return;
    const current = undoStack[undoStack.length - 1];
    const previous = undoStack[undoStack.length - 2];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, current]);
    applyState(previous);
  }, [undoStack, applyState]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, next]);
    applyState(next);
  }, [redoStack, applyState]);

  // Load brand data
  useEffect(() => {
    Promise.all([
      fetch(`/api/brands/${brandId}`).then(r => r.json()),
      fetch(`/api/brands/${brandId}/settings`).then(r => r.json()),
    ]).then(([brandData, settingsData]) => {
      const b = brandData.brand as Brand;
      const s = (settingsData.settings || {}) as Record<string, string>;
      setBrand(b);

      // Initialize design state from brand + settings
      const initState: DesignState = {
        templateId: b.website_template || 'minimal',
        colors: {
          primary: b.primary_color || '#0f172a',
          secondary: b.secondary_color || '#f8fafc',
          accent: b.accent_color || '#3b82f6',
          text: s.text_color || b.primary_color || '#0f172a',
          muted: s.muted_color || '#64748b',
          surface: s.surface_color || '#ffffff',
          border: s.border_color || '#e2e8f0',
        },
        headingFont: b.font_heading || 'Inter',
        bodyFont: b.font_body || 'Inter',
        buttonShape: (s.button_shape as ButtonShape) || 'rounded',
        buttonSize: (s.button_size as ButtonSize) || 'medium',
        buttonVariant: (s.button_variant as ButtonVariant) || 'solid',
        spacing: (s.spacing_density as SpacingDensity) || 'normal',
        borderRadius: (s.border_radius as BorderRadiusPreset) || 'rounded',
        customCSS: b.custom_css || '',
      };

      applyState(initState);
      setActivePaletteId(s.color_palette_id || undefined);

      // Load recent colors
      if (s.recent_colors) {
        try { setRecentColors(JSON.parse(s.recent_colors)); } catch { /* ignore */ }
      }

      // Initialize undo stack with current state
      setUndoStack([initState]);
      setHasChanges(false);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load brand');
      setLoading(false);
    });
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track changes + push history
  const markChanged = useCallback(() => {
    setHasChanges(true);
    pushHistory();
  }, [pushHistory]);

  // Track color usage for recent colors
  const trackRecentColor = useCallback((color: string) => {
    setRecentColors(prev => {
      const updated = [color, ...prev.filter(c => c !== color)].slice(0, 8);
      return updated;
    });
  }, []);

  // Save all design settings
  const handleSave = async () => {
    if (!brand) return;
    setSaving(true);

    try {
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
        recent_colors: JSON.stringify(recentColors),
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

  // Template selection with confirmation
  const handleTemplateSelect = (id: string) => {
    if (templateId !== id && hasChanges) {
      setPendingTemplate(id);
      return;
    }
    applyTemplate(id);
  };

  const applyTemplate = (id: string) => {
    pushHistory();
    setTemplateId(id);
    const template = WEBSITE_TEMPLATES.find(t => t.id === id);
    if (template) {
      setHeadingFont(template.fonts.heading);
      setBodyFont(template.fonts.body);
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
    setHasChanges(true);
    setPendingTemplate(null);
  };

  // Color palette selection
  const handlePaletteSelect = (palette: ColorPalette) => {
    pushHistory();
    setColors(palette.colors);
    setActivePaletteId(palette.id);
    setHasChanges(true);
  };

  // Apply design preset
  const applyPreset = (preset: DesignPreset) => {
    pushHistory();
    setTemplateId(preset.template);
    setHeadingFont(preset.headingFont);
    setBodyFont(preset.bodyFont);
    setColors(preset.colors);
    setButtonShape(preset.buttonShape);
    setButtonVariant(preset.buttonVariant);
    setSpacing(preset.spacing);
    setBorderRadius(preset.borderRadius);
    setActivePaletteId(undefined);
    setHasChanges(true);
    toast.success(`Applied "${preset.name}" preset`);
  };

  // Export design as JSON
  const exportDesignJSON = () => {
    const designExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      brandName: brand?.name,
      design: getCurrentState(),
      activePaletteId,
    };
    const blob = new Blob([JSON.stringify(designExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(brand?.name || 'design').toLowerCase().replace(/\s+/g, '-')}-design.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Design exported');
  };

  // Import design from JSON
  const importDesignJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.design) {
          pushHistory();
          applyState(data.design);
          if (data.activePaletteId) setActivePaletteId(data.activePaletteId);
          toast.success('Design imported', `Loaded design from "${data.brandName || 'file'}"`);
        } else {
          toast.error('Invalid design file');
        }
      } catch {
        toast.error('Failed to import design');
      }
    };
    input.click();
  };

  const selectedTemplate = WEBSITE_TEMPLATES.find(t => t.id === templateId);
  const fontSuggestions = FONT_PAIRINGS[headingFont] || ['Inter', 'DM Sans', 'Lato'];

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
      {/* Template Switch Confirmation Modal */}
      <AnimatePresence>
        {pendingTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setPendingTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Switch Template?</h3>
                  <p className="text-xs text-zinc-500">This will reset fonts and colors</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                Switching templates will apply new default fonts and colors. Your current customizations
                will be replaced. You can undo this change.
              </p>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setPendingTemplate(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => applyTemplate(pendingTemplate)}>
                  Switch Template
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 mr-1">
            <button
              onClick={undo}
              disabled={undoStack.length < 2}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          {/* Export/Import */}
          <button
            onClick={exportDesignJSON}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Export design"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={importDesignJSON}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Import design"
          >
            <Upload className="h-4 w-4" />
          </button>

          {hasChanges && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[11px] text-amber-600 dark:text-amber-400 font-medium"
            >
              Unsaved
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
                {/* ═══ PRESETS PANEL ═══ */}
                {activePanel === 'presets' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Design Presets</p>
                      <p className="text-xs text-zinc-400 mb-4">One-click curated designs for your brand</p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {DESIGN_PRESETS.map(preset => (
                          <motion.button
                            key={preset.id}
                            onClick={() => applyPreset(preset)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all text-left group"
                          >
                            <span className="text-xl shrink-0 mt-0.5">{preset.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                  {preset.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 line-clamp-1">{preset.description}</p>
                              {/* Color preview swatches */}
                              <div className="flex gap-1 mt-2">
                                {[preset.colors.primary, preset.colors.secondary, preset.colors.accent, preset.colors.text, preset.colors.muted].map((c, i) => (
                                  <div
                                    key={i}
                                    className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-600"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ TEMPLATE PANEL ═══ */}
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

                {/* ═══ COLORS PANEL ═══ */}
                {activePanel === 'colors' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Color System</p>
                      <p className="text-xs text-zinc-400 mb-4">Define your brand&apos;s visual palette</p>
                    </div>

                    {/* Recent Colors */}
                    {recentColors.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                          Recent Colors
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {recentColors.map((color, i) => (
                            <button
                              key={`${color}-${i}`}
                              onClick={() => {
                                // Copy to clipboard
                                navigator.clipboard.writeText(color).then(() => {
                                  toast.success('Color copied', color);
                                });
                              }}
                              className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: color }}
                              title={`${color} — click to copy`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <ColorSystemEditor
                      colors={colors}
                      onChange={(c) => {
                        // Track changed colors before update
                        const keys = Object.keys(c) as Array<keyof ColorSystem>;
                        for (const k of keys) {
                          if (c[k] !== colors[k]) {
                            trackRecentColor(c[k]);
                          }
                        }
                        setColors(c);
                        setActivePaletteId(undefined);
                        markChanged();
                      }}
                      onPaletteSelect={handlePaletteSelect}
                      activePaletteId={activePaletteId}
                    />
                  </div>
                )}

                {/* ═══ FONTS PANEL ═══ */}
                {activePanel === 'fonts' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Typography</p>
                      <p className="text-xs text-zinc-400 mb-4">Pick fonts that express your brand</p>
                    </div>
                    <FontPicker
                      label="Heading Font"
                      value={headingFont}
                      onChange={(f) => { pushHistory(); setHeadingFont(f); markChanged(); }}
                    />
                    <FontPicker
                      label="Body Font"
                      value={bodyFont}
                      onChange={(f) => { pushHistory(); setBodyFont(f); markChanged(); }}
                    />

                    {/* Font Pairing Suggestions */}
                    <div className="bg-violet-50 dark:bg-violet-900/10 rounded-xl p-4 border border-violet-100 dark:border-violet-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                        <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                          Suggested Body Fonts for {headingFont}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {fontSuggestions.filter(f => f !== bodyFont).map(font => (
                          <button
                            key={font}
                            onClick={() => { pushHistory(); setBodyFont(font); markChanged(); }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                      {bodyFont && fontSuggestions.includes(bodyFont) && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-violet-600 dark:text-violet-400">
                          <Check className="h-3 w-3" />
                          Great pairing!
                        </div>
                      )}
                    </div>

                    <FontPreview
                      headingFont={headingFont}
                      bodyFont={bodyFont}
                      brandName={brand.name}
                    />
                  </div>
                )}

                {/* ═══ BUTTONS PANEL ═══ */}
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
                      onShapeChange={(v) => { pushHistory(); setButtonShape(v); markChanged(); }}
                      onSizeChange={(v) => { pushHistory(); setButtonSize(v); markChanged(); }}
                      onVariantChange={(v) => { pushHistory(); setButtonVariant(v); markChanged(); }}
                      accentColor={colors.accent}
                    />
                  </div>
                )}

                {/* ═══ SPACING PANEL ═══ */}
                {activePanel === 'spacing' && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Layout & Spacing</p>
                      <p className="text-xs text-zinc-400 mb-4">Control density and border radius</p>
                    </div>
                    <SpacingEditor
                      value={spacing}
                      onChange={(v) => { pushHistory(); setSpacing(v); markChanged(); }}
                    />
                    <div className="pt-2">
                      <BorderRadiusEditor
                        value={borderRadius}
                        onChange={(v) => { pushHistory(); setBorderRadius(v); markChanged(); }}
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
