'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Rocket, ExternalLink, LayoutDashboard, PartyPopper } from 'lucide-react';
import { BrandData } from '@/lib/types';
import { getTemplate, templateToBrandData } from '@/lib/templates';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import StepBasics from '@/components/wizard/StepBasics';
import StepIdentity from '@/components/wizard/StepIdentity';
import StepProducts from '@/components/wizard/StepProducts';
import StepContent from '@/components/wizard/StepContent';
import StepChannels from '@/components/wizard/StepChannels';
import StepReview from '@/components/wizard/StepReview';

const STEPS = [
  { id: 1, name: 'Brand Basics', description: 'Name & identity' },
  { id: 2, name: 'Visual Identity', description: 'Colors & typography' },
  { id: 3, name: 'Products', description: 'What you offer' },
  { id: 4, name: 'Content & Tone', description: 'Your voice' },
  { id: 5, name: 'Channels', description: 'Where to reach' },
  { id: 6, name: 'Review', description: 'Launch it' },
];

const DRAFT_KEY = 'mayasura-wizard-draft';
const DRAFT_STEP_KEY = 'mayasura-wizard-step';

const initialData: BrandData = {
  name: '',
  tagline: '',
  industry: '',
  description: '',
  primaryColor: '#1E1B4B',
  secondaryColor: '#F5F3FF',
  accentColor: '#4F46E5',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  products: [],
  brandVoice: '',
  toneKeywords: [],
  channels: ['website', 'chatbot'],
  status: 'draft',
};

/* ─── Step transition variants ──────────────────────────────── */
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
};

function CreatePageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [data, setData] = useState<BrandData>(initialData);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedBrand, setLaunchedBrand] = useState<{ id: string; name: string; slug: string | null } | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // ─── Load draft from localStorage on mount ───────────────────
  useEffect(() => {
    if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        setData(templateToBrandData(template));
        toast.info('Template loaded', `Starting with ${template.name} template`);
      }
      setDraftLoaded(true);
      return;
    }

    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      const savedStep = localStorage.getItem(DRAFT_STEP_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as BrandData;
        // Only restore if there's meaningful data
        if (parsed.name || parsed.industry) {
          setData(parsed);
          if (savedStep) {
            const parsedStep = parseInt(savedStep, 10);
            if (parsedStep >= 1 && parsedStep <= 6) {
              setStep(parsedStep);
            }
          }
          toast.info('Draft restored', 'Your previous progress has been loaded');
        }
      }
    } catch {
      // Ignore parse errors
    }
    setDraftLoaded(true);
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auto-save draft to localStorage ─────────────────────────
  useEffect(() => {
    if (!draftLoaded) return; // Don't save until initial load is complete
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      localStorage.setItem(DRAFT_STEP_KEY, String(step));
    } catch {
      // Ignore storage errors (quota, etc.)
    }
  }, [data, step, draftLoaded]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_STEP_KEY);
    } catch {}
  }, []);

  const updateData = (updates: Partial<BrandData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, 6));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const fireConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      // First burst — center
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#7C3AED', '#A855F7', '#22C55E', '#F59E0B', '#EC4899'],
        gravity: 0.8,
      });
      // Side bursts
      setTimeout(() => {
        confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7C3AED', '#A855F7', '#6366F1'] });
        confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#22C55E', '#10B981', '#34D399'] });
      }, 250);
      // Final scatter
      setTimeout(() => {
        confetti({ particleCount: 50, spread: 140, origin: { y: 0.3 }, scalar: 0.8, gravity: 1.2, colors: ['#F59E0B', '#FCD34D', '#FDE68A'] });
      }, 600);
      // Extra celebration burst
      setTimeout(() => {
        confetti({ particleCount: 30, spread: 160, origin: { y: 0.5, x: 0.5 }, scalar: 1.2, colors: ['#EC4899', '#F472B6', '#4F46E5'] });
      }, 1000);
    } catch {} // Silent fail
  };

  const handleLaunch = async () => {
    if (isLaunching) return;
    setIsLaunching(true);
    try {
      // Step 1: Create the brand
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          industry: data.industry,
          primary_color: data.primaryColor,
          secondary_color: data.secondaryColor,
          accent_color: data.accentColor,
          font_heading: data.fontHeading,
          font_body: data.fontBody,
          brand_voice: data.brandVoice,
          channels: data.channels,
          status: 'launched',
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (!result.brand?.id) {
        throw new Error('Brand creation failed — no ID returned');
      }
      
      const brandId = result.brand.id;

      // Step 1.5: Save website template setting
      if (data.websiteTemplate) {
        await fetch(`/api/brands/${brandId}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'website_template', value: data.websiteTemplate }),
        }).catch(err => console.error('Template setting error:', err));
      }

      // Step 2: Create products (batched, with error handling)
      if (data.products.length > 0) {
        const productPromises = data.products.map(product =>
          fetch(`/api/brands/${brandId}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          }).catch(err => {
            console.error('Product creation error:', err);
            return null;
          })
        );
        await Promise.all(productPromises);
      }

      // Step 3: Generate initial content (non-blocking)
      fetch(`/api/brands/${brandId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'about' }),
      }).catch(() => {});

      fetch(`/api/brands/${brandId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'landing' }),
      }).catch(() => {});

      // Clear saved draft
      clearDraft();

      // Fire confetti celebration
      fireConfetti();

      // Show success celebration instead of redirecting
      setLaunchedBrand({
        id: brandId,
        name: data.name,
        slug: result.brand.slug,
      });

      toast.success('🎉 Brand launched!', `${data.name} is live`);
    } catch (error) {
      console.error('Launch error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Launch failed', message);
      setIsLaunching(false);
    }
  };

  // ─── Success celebration screen ──────────────────────────────
  if (launchedBrand) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090B] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl shadow-violet-500/10 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Success header */}
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-center relative overflow-hidden">
              {/* Animated glow rings */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-white/10"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5 + i * 0.3, opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, delay: 0.3 + i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
              >
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your Palace is Ready! 🏛️
              </motion.h1>
              <motion.p
                className="text-white/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <strong className="text-white">{launchedBrand.name}</strong> has been launched successfully
              </motion.p>
            </div>

            {/* Success body */}
            <div className="p-6 sm:p-8">
              {/* Brand preview card */}
              <motion.div
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 mb-6 border border-zinc-100 dark:border-zinc-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: data.accentColor }}
                  >
                    {data.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{data.name}</h3>
                    <p className="text-xs text-zinc-400">{data.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.primaryColor }} />
                    <div className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: data.secondaryColor }} />
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.accentColor }} />
                  </div>
                  <span className="text-xs text-zinc-400">{data.fontHeading} / {data.fontBody}</span>
                  <span className="text-xs text-zinc-400 ml-auto">{data.products.length} products</span>
                </div>
              </motion.div>

              {/* What's next checklist */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">What happens next</h3>
                {[
                  { text: 'AI is generating your website content', done: true },
                  { text: 'Landing page is being built', done: true },
                  { text: 'Chatbot is learning your brand voice', done: false },
                  { text: 'Your dashboard is ready to explore', done: false },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.done
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                      {item.done ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <motion.div
                          className="h-2 w-2 rounded-full bg-violet-500"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <span className={item.done ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/${launchedBrand.id}`)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
                {launchedBrand.slug && (
                  <Link
                    href={`/shop/${launchedBrand.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Consumer Site
                  </Link>
                )}
                <button
                  onClick={() => { clearDraft(); router.push('/templates'); }}
                  className="block w-full text-center text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors py-2"
                >
                  Create another brand
                </button>
              </motion.div>
            </div>
          </div>

          {/* Powered by */}
          <motion.p
            className="text-center text-xs text-zinc-400 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Sparkles className="h-3 w-3 inline mr-1" />
            Built with Mayasura — the divine architect of digital ecosystems
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBasics data={data} updateData={updateData} onNext={nextStep} />;
      case 2: return <StepIdentity data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 3: return <StepProducts data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 4: return <StepContent data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 5: return <StepChannels data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 6: return <StepReview data={data} onBack={prevStep} onLaunch={handleLaunch} isLaunching={isLaunching} />;
      default: return null;
    }
  };

  const progress = ((step - 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090B]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          <div className="flex items-center gap-3">
            {(data.name || data.industry) && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline-flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Draft auto-saved
              </motion.span>
            )}
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Step {step} of 6
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar — animated gradient line with glow */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Gradient progress line with glow */}
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4 relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-700 via-violet-500 to-purple-500 relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Glow effect on leading edge */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-violet-400/40 blur-md"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <motion.div
                    className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                      step > s.id
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-sm shadow-emerald-500/25'
                        : step === s.id
                        ? 'bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-md shadow-violet-500/25'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                    }`}
                    animate={step === s.id ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </motion.div>
                  <div className="hidden lg:block min-w-0">
                    <p className={`text-xs font-medium truncate ${step >= s.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {s.name}
                    </p>
                  </div>
                </div>
                {s.id < 6 && (
                  <div className={`h-px flex-1 mx-1 sm:mx-2 transition-all duration-500 ${step > s.id ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content with AnimatePresence transitions */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Clear draft button (subtle, bottom-left) */}
      {(data.name || data.industry) && step < 6 && (
        <motion.div
          className="fixed bottom-4 left-4 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => {
              if (confirm('Clear your draft? This cannot be undone.')) {
                clearDraft();
                setData(initialData);
                setStep(1);
                setDirection(-1);
                toast.info('Draft cleared', 'Starting fresh');
              }
            }}
            className="text-[10px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Clear draft
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090B]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 dark:border-zinc-700 border-t-indigo-600 dark:border-t-indigo-400" />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
