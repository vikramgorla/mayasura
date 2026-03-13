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
        <h2 className="text-2xl font-bold mb-2">Choose Your Channels</h2>
        <p className="text-slate-500">Select which digital channels to activate for your brand.</p>
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
                  ? 'border-slate-900 bg-slate-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <p className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {channel.name}
                </p>
                <p className="text-sm text-slate-500">{channel.description}</p>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'border-slate-300'
              }`}>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">
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
