'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { BrandData } from '@/lib/types';
import { getTemplate, templateToBrandData } from '@/lib/templates';
import { useToast } from '@/components/ui/toast';
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

function CreatePageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BrandData>(initialData);
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Load template if specified
  useEffect(() => {
    if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        setData(templateToBrandData(template));
        toast.info('Template loaded', `Starting with ${template.name} template`);
      }
    }
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateData = (updates: Partial<BrandData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

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

      // Launch confetti celebration
      try {
        const confetti = (await import('canvas-confetti')).default;
        // First burst — center
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#7C3AED', '#A855F7', '#22C55E', '#F59E0B', '#EC4899'],
          gravity: 0.8,
        });
        // Side bursts
        setTimeout(() => {
          confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7C3AED', '#A855F7', '#6366F1'] });
          confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#22C55E', '#10B981', '#34D399'] });
        }, 200);
        // Final scatter
        setTimeout(() => {
          confetti({ particleCount: 40, spread: 120, origin: { y: 0.3 }, scalar: 0.8, gravity: 1.2, colors: ['#F59E0B', '#FCD34D', '#FDE68A'] });
        }, 500);
      } catch {} // Silent fail if confetti doesn't load

      toast.success('🎉 Brand launched!', `${data.name} is live`);
      router.push(`/dashboard/${brandId}`);
    } catch (error) {
      console.error('Launch error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Launch failed', message);
      setIsLaunching(false);
    }
  };

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
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Step {step} of 6
          </span>
        </div>
      </div>

      {/* Progress Bar — sleek gradient line */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Gradient progress line */}
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-700 via-violet-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    step > s.id
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-sm shadow-emerald-500/25'
                      : step === s.id
                      ? 'bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-md shadow-violet-500/25'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <div className="hidden lg:block min-w-0">
                    <p className={`text-xs font-medium truncate ${step >= s.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {s.name}
                    </p>
                  </div>
                </div>
                {s.id < 6 && (
                  <div className={`h-px flex-1 mx-1 sm:mx-2 transition-all duration-300 ${step > s.id ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </div>
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
