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
    if (!data.description) return;
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
      const result = await res.json();
      if (result.voice) {
        setVoiceAnalysis(result.voice);
        // Auto-set the brand voice
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
        <h2 className="text-2xl font-bold mb-2">Content & Tone</h2>
        <p className="text-slate-500">Define how your brand speaks. This shapes all generated content.</p>
      </div>

      <div className="space-y-8">
        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Brand Tone</label>
          <p className="text-xs text-slate-400 mb-3">Select one or more tones that match your brand voice</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  data.toneKeywords.includes(tone)
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
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
            <label className="block text-sm font-medium">Brand Voice Description</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={analyzeVoice}
              disabled={!data.description || analyzingVoice}
              className="text-blue-600 hover:text-blue-700"
            >
              {analyzingVoice ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> AI Analyze</>}
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
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">AI Voice Analysis</span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-blue-600 font-medium">Tone</span>
                <p className="text-sm text-blue-900">{voiceAnalysis.tone}</p>
              </div>
              <div>
                <span className="text-xs text-blue-600 font-medium">Personality Traits</span>
                <div className="flex gap-2 mt-1">
                  {voiceAnalysis.personality.map((trait) => (
                    <span key={trait} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-blue-600 font-medium">Sample Greeting</span>
                <p className="text-sm text-blue-900 italic">&ldquo;{voiceAnalysis.sampleGreeting}&rdquo;</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-sm font-medium mb-3">How your content will sound</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-400 mb-1 block">Website Hero</span>
              <p className="text-sm" style={{ color: data.primaryColor }}>
                Welcome to <strong>{data.name || 'Your Brand'}</strong>.{' '}
                {data.tagline || 'Your tagline will appear here.'}{' '}
                {data.toneKeywords.length > 0
                  ? `(${data.toneKeywords.join(', ')} tone)`
                  : ''}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-400 mb-1 block">Chatbot Greeting</span>
              <p className="text-sm" style={{ color: data.primaryColor }}>
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
