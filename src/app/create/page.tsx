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
  primaryColor: '#0f172a',
  secondaryColor: '#f8fafc',
  accentColor: '#3b82f6',
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
    setIsLaunching(true);
    try {
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
      const result = await res.json();
      const brandId = result.brand.id;

      // Create products (batched)
      for (const product of data.products) {
        await fetch(`/api/brands/${brandId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
      }

      // Generate initial content (non-blocking)
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

      // Launch confetti
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [data.primaryColor, data.accentColor, '#22c55e'],
        });
      } catch {} // Silent fail if confetti doesn't load

      toast.success('🎉 Brand launched!', `${data.name} is live`);
      router.push(`/dashboard/${brandId}`);
    } catch (error) {
      console.error('Launch error:', error);
      toast.error('Launch failed', 'Please try again');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          <span className="text-sm text-slate-500">
            Step {step} of 6
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    step > s.id
                      ? 'bg-emerald-500 text-white'
                      : step === s.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <div className="hidden lg:block min-w-0">
                    <p className={`text-xs font-medium truncate ${step >= s.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {s.name}
                    </p>
                  </div>
                </div>
                {s.id < 6 && (
                  <div className={`h-px flex-1 mx-1 sm:mx-2 transition-all duration-300 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
