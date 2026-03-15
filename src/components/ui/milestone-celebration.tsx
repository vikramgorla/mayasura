'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

function generateParticles(count = 40): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,
    y: 50,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 6,
    angle: Math.random() * 360,
    speed: 60 + Math.random() * 120,
  }));
}

interface MilestoneCelebrationProps {
  show: boolean;
  onDone?: () => void;
  message?: string;
  emoji?: string;
}

export function MilestoneCelebration({ show, onDone, message = 'Milestone unlocked!', emoji = '🎉' }: MilestoneCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles(50));
      const t = setTimeout(() => {
        onDone?.();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {/* Particles */}
          {particles.map((p) => {
            const radians = (p.angle * Math.PI) / 180;
            const tx = Math.cos(radians) * p.speed;
            const ty = Math.sin(radians) * p.speed - 80;
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}vw`,
                  y: `${p.y}vh`,
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                animate={{
                  x: `calc(${p.x}vw + ${tx}px)`,
                  y: `calc(${p.y}vh + ${ty}px)`,
                  opacity: 0,
                  scale: 0.3,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{ duration: 1.8 + Math.random() * 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  backgroundColor: p.color,
                }}
              />
            );
          })}

          {/* Toast notification */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 px-6 py-4 flex items-center gap-3">
              <div className="text-2xl" role="img" aria-label="celebration">
                {emoji}
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white">{message}</p>
                <p className="text-xs text-zinc-400 mt-0.5">Keep building your palace 🏛️</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for tracking milestone completion
export function useMilestoneCelebration() {
  const [celebrating, setCelebrating] = useState<{ show: boolean; message: string; emoji: string }>({
    show: false,
    message: '',
    emoji: '🎉',
  });

  const celebrate = (message: string, emoji = '🎉') => {
    setCelebrating({ show: true, message, emoji });
  };

  const done = () => {
    setCelebrating((prev) => ({ ...prev, show: false }));
  };

  return { celebrating, celebrate, done };
}
