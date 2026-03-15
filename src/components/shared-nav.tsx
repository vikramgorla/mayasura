'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/lib/utils';

interface SharedNavProps {
  /** Transparent variant for hero pages like landing */
  transparent?: boolean;
  /** Max width class override */
  maxWidth?: string;
}

/**
 * SharedNav — consistent top nav bar across public pages.
 * Used on landing, templates, pricing, etc.
 * Dashboard has its own sidebar nav.
 */
export function SharedNav({ transparent = false, maxWidth = 'max-w-7xl' }: SharedNavProps) {
  const pathname = usePathname();

  const isTemplates = pathname === '/templates';
  const isCreate = pathname === '/create';

  return (
    <nav
      className={cn(
        'border-b sticky top-0 z-30 transition-colors',
        transparent
          ? 'bg-white/60 dark:bg-[#09090B]/60 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50'
          : 'bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-lg border-zinc-200 dark:border-zinc-800'
      )}
    >
      <div className={cn(maxWidth, 'mx-auto px-4 sm:px-6 h-14 flex items-center justify-between')}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-display font-semibold text-base tracking-tight">Mayasura</span>
        </Link>

        {/* Nav links (desktop) */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink href="/templates" active={isTemplates}>Templates</NavLink>
          <NavLink href="/create" active={isCreate}>Create</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isCreate && (
            <Link href="/create">
              <Button variant="brand" size="sm">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          <UserNav />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        active
          ? 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      )}
    >
      {children}
    </Link>
  );
}
