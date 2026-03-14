'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, LayoutTemplate, Clock, Users } from 'lucide-react';

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: Rocket, end: 10000, suffix: '+', label: 'Brands Launched', desc: 'and counting', color: 'from-violet-500 to-purple-600' },
  { icon: LayoutTemplate, end: 50, suffix: '+', label: 'Templates', desc: 'every industry covered', color: 'from-blue-500 to-cyan-600' },
  { icon: Clock, end: 5, suffix: ' min', label: 'Average Setup', desc: 'idea to live site', color: 'from-emerald-500 to-teal-600' },
  { icon: Users, end: 99, suffix: '%', label: 'Satisfaction', desc: 'from brand builders', color: 'from-amber-500 to-orange-600' },
];

export function SocialProof() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent dark:to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
            Trusted by thousands
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            The numbers speak for themselves. Join the fastest-growing brand builder platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold font-display text-[var(--text-primary)] mb-1">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2000 + i * 300} />
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{stat.label}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
