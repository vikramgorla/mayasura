'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function SharedFooter({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <footer className="border-t border-[var(--border-primary)] py-6 px-4 sm:px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded bg-violet-700 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">M</span>
              </div>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Mayasura</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
              v3.3
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
              Open Source
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span>© {new Date().getFullYear()} Mayasura</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--border-primary)] py-12 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded bg-violet-700 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">M</span>
              </div>
              <span className="font-display font-semibold text-sm text-[var(--text-primary)]">Mayasura</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                v3.3
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-3">
              Build palaces, not huts.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Templates', href: '/templates' },
                { label: 'Create Brand', href: '/create' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Documentation', href: '#' },
                { label: 'API Reference', href: '#' },
                { label: 'Changelog', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'MIT License', href: 'https://github.com/vikramgorla/mayasura' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-primary)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-tertiary)]">
              © {new Date().getFullYear()} Mayasura — The divine architect of digital ecosystems
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
              Open Source
            </span>
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
