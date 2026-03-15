'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/loading';
import { BrandData, TONE_OPTIONS } from '@/lib/types';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepContent({ data, updateData, onNext, onBack }: Props) {
  const [analyzingVoice, setAnalyzingVoice] = useState(false);
  const [voiceRateLimit, setVoiceRateLimit] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState<{
    tone: string;
    personality: string[];
    sampleGreeting: string;
  } | null>(null);

  const toggleTone = (tone: string) => {
    const keywords = data.toneKeywords.includes(tone)
      ? data.toneKeywords.filter(t => t !== tone)
      : [...data.toneKeywords, tone];
    updateData({ toneKeywords: keywords, brandVoice: keywords.join(', ') });
  };

  const analyzeVoice = async () => {
    if (!data.description || analyzingVoice || voiceRateLimit) return;
    setAnalyzingVoice(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brand-voice',
          description: `${data.name}: ${data.description}. Industry: ${data.industry}`,
        }),
      });
      if (res.status === 429) {
        setVoiceRateLimit(true);
        setTimeout(() => setVoiceRateLimit(false), 30000);
        setAnalyzingVoice(false);
        return;
      }
      const result = await res.json();
      if (result.voice) {
        setVoiceAnalysis(result.voice);
        updateData({
          brandVoice: `${result.voice.tone}. Personality: ${result.voice.personality.join(', ')}`,
        });
      }
    } catch (e) {
      console.error('Voice analysis error:', e);
    }
    setAnalyzingVoice(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Content & Tone</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Define how your brand speaks. This shapes all generated content.</p>
      </div>

      <div className="space-y-8">
        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Brand Tone</label>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Select one or more tones that match your brand voice</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  data.toneKeywords.includes(tone)
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Voice Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Brand Voice Description</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={analyzeVoice}
              disabled={!data.description || analyzingVoice || voiceRateLimit}
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
              title={voiceRateLimit ? 'Rate limit reached. Please wait 30s.' : undefined}
            >
              {analyzingVoice
                ? <><Spinner className="h-4 w-4" /> Generating...</>
                : voiceRateLimit
                ? '⏳ Rate limited'
                : <><Sparkles className="h-3.5 w-3.5" /> AI Analyze</>
              }
            </Button>
          </div>
          <Textarea
            value={data.brandVoice}
            onChange={(e) => updateData({ brandVoice: e.target.value })}
            placeholder="Describe how your brand communicates (e.g., 'Warm, expert, approachable. Uses short sentences. Avoids jargon.')"
            rows={3}
          />
        </div>

        {/* AI Voice Analysis Result */}
        {voiceAnalysis && (
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-indigo-100 dark:border-violet-800/50 rounded-xl p-6 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">AI Voice Analysis</span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Tone</span>
                <p className="text-sm text-indigo-900 dark:text-indigo-200">{voiceAnalysis.tone}</p>
              </div>
              <div>
                <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Personality Traits</span>
                <div className="flex gap-2 mt-1">
                  {voiceAnalysis.personality.map((trait) => (
                    <span key={trait} className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-indigo-700 dark:text-indigo-300 text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Sample Greeting</span>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">&ldquo;{voiceAnalysis.sampleGreeting}&rdquo;</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">How your content will sound</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1 block">Website Hero</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300" style={{ color: undefined }}>
                Welcome to <strong>{data.name || 'Your Brand'}</strong>.{' '}
                {data.tagline || 'Your tagline will appear here.'}{' '}
                {data.toneKeywords.length > 0
                  ? `(${data.toneKeywords.join(', ')} tone)`
                  : ''}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1 block">Chatbot Greeting</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Hi there! 👋 I&apos;m the {data.name || 'brand'} assistant. How can I help you today?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button onClick={onBack} variant="ghost" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
