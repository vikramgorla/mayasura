"use client";

import { useCallback } from "react";
import {
  Globe,
  MessageCircle,
  ShoppingBag,
  Mail,
  Share2,
  Bell,
  Users,
  Check,
} from "lucide-react";
import type { WizardData } from "@/lib/types/wizard";
import { CHANNELS } from "@/lib/types/wizard";

interface StepChannelsProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  "message-circle": MessageCircle,
  "shopping-bag": ShoppingBag,
  mail: Mail,
  "share-2": Share2,
  bell: Bell,
  users: Users,
};

export function StepChannels({ data, onChange }: StepChannelsProps) {
  const toggleChannel = useCallback(
    (channelId: string) => {
      const current = data.channels;
      if (current.includes(channelId)) {
        onChange({ channels: current.filter((c) => c !== channelId) });
      } else {
        onChange({ channels: [...current, channelId] });
      }
    },
    [data.channels, onChange]
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Channels
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Choose which channels to activate for your brand. You can enable more
          later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHANNELS.map((channel) => {
          const isActive = data.channels.includes(channel.id);
          const Icon = ICON_MAP[channel.icon];

          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => toggleChannel(channel.id)}
              className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent-light)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border-primary)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-sm)]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-[var(--text-primary)]">
                  {channel.name}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                  {channel.description}
                </p>
              </div>

              {isActive && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-[var(--accent)]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[var(--text-tertiary)] text-center">
        {data.channels.length} channel{data.channels.length !== 1 ? "s" : ""}{" "}
        selected
      </p>
    </div>
  );
}
