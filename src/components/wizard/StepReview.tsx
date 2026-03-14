'use client';

import { ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';
import { BrandData, AVAILABLE_CHANNELS } from '@/lib/types';

interface Props {
  data: BrandData;
  onBack: () => void;
  onLaunch: () => void;
  isLaunching: boolean;
}

export default function StepReview({ data, onBack, onLaunch, isLaunching }: Props) {
  const selectedChannels = AVAILABLE_CHANNELS.filter(c => data.channels.includes(c.id));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Review & Launch</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Everything looks good? Let&apos;s build your digital palace.</p>
      </div>

      <div className="space-y-6">
        {/* Brand Overview */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6" style={{ backgroundColor: data.primaryColor }}>
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: data.accentColor, color: '#fff' }}
              >
                {data.name ? data.name[0].toUpperCase() : 'M'}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: data.secondaryColor }}>{data.name}</h3>
                <p className="text-sm" style={{ color: data.secondaryColor, opacity: 0.7 }}>{data.tagline}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{data.description}</p>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Industry</span>
            <p className="text-sm font-medium mt-1 text-zinc-900 dark:text-white">{data.industry}</p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Colors</span>
            <div className="flex gap-1.5 mt-2">
              <div className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: data.primaryColor }} />
              <div className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: data.secondaryColor }} />
              <div className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: data.accentColor }} />
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Typography</span>
            <p className="text-sm mt-1 text-zinc-900 dark:text-white">{data.fontHeading} / {data.fontBody}</p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Brand Voice</span>
            <p className="text-sm mt-1 truncate text-zinc-900 dark:text-white">{data.brandVoice || 'Not set'}</p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Products ({data.products.length})</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.products.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">No products added</p>
            ) : (
              data.products.map((product, i) => (
                <Badge key={i} variant="secondary">{product.name}</Badge>
              ))
            )}
          </div>
        </div>

        {/* Channels */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Active Channels ({selectedChannels.length})</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedChannels.map((channel) => (
              <Badge key={channel.id} variant="default">{channel.name}</Badge>
            ))}
          </div>
        </div>

        {/* Launch Info */}
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-indigo-100 dark:border-violet-800/50 rounded-xl p-6 text-center">
          <Rocket className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Ready to launch!</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            We&apos;ll create your brand ecosystem with AI-generated content for all selected channels.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button onClick={onBack} variant="ghost" size="lg" disabled={isLaunching}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onLaunch} variant="brand" size="xl" disabled={isLaunching}>
          {isLaunching ? (
            <>
              <Spinner className="h-5" />
              Building your palace...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Launch Brand
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
