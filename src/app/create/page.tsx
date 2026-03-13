'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { BrandData } from '@/lib/types';
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

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BrandData>(initialData);
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();

  const updateData = (updates: Partial<BrandData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      // Create the brand
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
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

      // Create products
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

      router.push(`/dashboard/${brandId}`);
    } catch (error) {
      console.error('Launch error:', error);
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <span className="text-sm text-slate-500">
            Step {step} of 6
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    step > s.id
                      ? 'bg-emerald-500 text-white'
                      : step === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className={`text-xs font-medium truncate ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.name}
                    </p>
                  </div>
                </div>
                {s.id < 6 && (
                  <div className={`h-px flex-1 mx-2 transition-all duration-300 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {renderStep()}
      </div>
    </div>
  );
}
