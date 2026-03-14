'use client';

import { ArrowLeft, ArrowRight, Globe, MessageSquare, ShoppingBag, Mail, Share2, Bell, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandData, AVAILABLE_CHANNELS } from '@/lib/types';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  MessageSquare,
  ShoppingBag,
  Mail,
  Share2,
  Bell,
  Users,
};

export default function StepChannels({ data, updateData, onNext, onBack }: Props) {
  const toggleChannel = (channelId: string) => {
    const channels = data.channels.includes(channelId)
      ? data.channels.filter(c => c !== channelId)
      : [...data.channels, channelId];
    updateData({ channels });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Choose Your Channels</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Select which digital channels to activate for your brand.</p>
      </div>

      <div className="space-y-3">
        {AVAILABLE_CHANNELS.map((channel) => {
          const Icon = iconMap[channel.icon] || Globe;
          const isSelected = data.channels.includes(channel.id);
          
          return (
            <button
              key={channel.id}
              onClick={() => toggleChannel(channel.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 dark:border-indigo-400 bg-violet-50 dark:bg-violet-950/30 shadow-sm shadow-violet-500/10'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? 'bg-indigo-600 dark:bg-violet-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <p className={`font-medium ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {channel.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{channel.description}</p>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-indigo-600 dark:bg-violet-500 border-indigo-600 dark:border-indigo-500 text-white'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {data.channels.length} channel{data.channels.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button onClick={onBack} variant="ghost" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} variant="brand" size="lg" disabled={data.channels.length === 0}>
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
