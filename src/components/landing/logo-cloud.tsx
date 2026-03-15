'use client';

import { motion } from 'framer-motion';

const brands = [
  'Bloom Studios', 'TechVault', 'Spice Route', 'Verdant', 'LunaFit',
  'Artisan & Co', 'NovaPulse', 'Sapphire', 'EcoBloom', 'PixelForge',
  'Catalyst', 'Harmonia', 'Zenith', 'PureForm', 'SkyLark',
  'Mellow', 'Elevate', 'Origin', 'Luminary', 'Atlas',
];

export function LogoCloud() {
  const firstRow = brands.slice(0, 10);
  const secondRow = brands.slice(10, 20);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-8"
        >
          Join 10,000+ brands already building their digital palaces
        </motion.p>

        {/* Scrolling row 1 — left to right */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
          <div className="flex gap-6 overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 shrink-0"
            >
              {[...firstRow, ...firstRow].map((name, i) => (
                <div
                  key={`a-${i}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] whitespace-nowrap"
                >
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    {name[0]}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scrolling row 2 — right to left */}
        <div className="relative mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
          <div className="flex gap-6 overflow-hidden">
            <motion.div
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 shrink-0"
            >
              {[...secondRow, ...secondRow].map((name, i) => (
                <div
                  key={`b-${i}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] whitespace-nowrap"
                >
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {name[0]}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
