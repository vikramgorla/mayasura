'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, FileText, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface SearchProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  category: string | null;
}

interface SearchBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string;
}

interface SearchPage {
  id: string;
  title: string;
  slug: string;
}

interface SearchResults {
  products: SearchProduct[];
  blogPosts: SearchBlogPost[];
  pages: SearchPage[];
}

type ResultItem =
  | { type: 'product'; data: SearchProduct }
  | { type: 'blog'; data: SearchBlogPost }
  | { type: 'page'; data: SearchPage };

const RECENT_SEARCHES_KEY = 'mayasura_recent_searches';
const MAX_RECENT = 5;

function getRecentSearches(slug: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${RECENT_SEARCHES_KEY}_${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(slug: string, query: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentSearches(slug);
    const updated = [query, ...current.filter((q) => q !== query)].slice(0, MAX_RECENT);
    localStorage.setItem(`${RECENT_SEARCHES_KEY}_${slug}`, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  slug: string;
  textColor: string;
  bgColor: string;
  accentColor: string;
  templateId: string;
}

export function SearchOverlay({
  open,
  onClose,
  slug,
  textColor,
  bgColor,
  accentColor,
  templateId,
}: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flatten results for keyboard navigation
  const flatItems: ResultItem[] = [
    ...(results?.products ?? []).map((d): ResultItem => ({ type: 'product', data: d })),
    ...(results?.blogPosts ?? []).map((d): ResultItem => ({ type: 'blog', data: d })),
    ...(results?.pages ?? []).map((d): ResultItem => ({ type: 'page', data: d })),
  ];

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches(slug));
      setQuery('');
      setResults(null);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, slug]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/public/brand/${slug}/search?q=${encodeURIComponent(query.trim())}`
        );
        const data: SearchResults = await res.json();
        setResults(data);
        setSelectedIndex(-1);
      } catch {
        setResults({ products: [], blogPosts: [], pages: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, slug, open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (flatItems.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleSelect(flatItems[selectedIndex]);
      }
    },
    [flatItems, selectedIndex, onClose]
  );

  const handleSelect = useCallback(
    (item: ResultItem) => {
      if (query.trim()) saveRecentSearch(slug, query.trim());
      onClose();
      if (item.type === 'product') {
        router.push(`/shop/${slug}/product/${item.data.id}`);
      } else if (item.type === 'blog') {
        router.push(`/blog/${slug}/${item.data.slug}`);
      } else if (item.type === 'page') {
        router.push(`/site/${slug}/${item.data.slug}`);
      }
    },
    [router, slug, query, onClose]
  );

  const handleRecentClick = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  const hasResults =
    results &&
    (results.products.length > 0 || results.blogPosts.length > 0 || results.pages.length > 0);
  const noResults = results && !hasResults && query.trim().length >= 2;

  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const overlayBg = isDark ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.65)';
  const panelBg = isDark
    ? templateId === 'neon'
      ? '#050510'
      : templateId === 'tech'
      ? '#0A0F1A'
      : '#111111'
    : bgColor;
  const borderColor = `${textColor}14`;
  const inputBg = `${textColor}06`;
  const mutedColor = `${textColor}50`;
  const itemHoverBg = `${textColor}08`;

  // Shared item index tracker across groups
  let globalIdx = 0;

  const renderProduct = (product: SearchProduct) => {
    const idx = globalIdx++;
    const isSelected = selectedIndex === idx;
    return (
      <motion.button
        key={product.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        onClick={() => handleSelect({ type: 'product', data: product })}
        onMouseEnter={() => setSelectedIndex(idx)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
        style={{
          backgroundColor: isSelected ? `${accentColor}14` : 'transparent',
          color: textColor,
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Package className="h-5 w-5" style={{ color: accentColor }} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{product.name}</p>
          {product.description && (
            <p className="text-xs truncate mt-0.5" style={{ color: mutedColor }}>
              {product.description.slice(0, 80)}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-semibold" style={{ color: accentColor }}>
            {product.currency} {product.price.toFixed(2)}
          </span>
        </div>
        {isSelected && <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />}
      </motion.button>
    );
  };

  const renderBlogPost = (post: SearchBlogPost) => {
    const idx = globalIdx++;
    const isSelected = selectedIndex === idx;
    return (
      <motion.button
        key={post.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        onClick={() => handleSelect({ type: 'blog', data: post })}
        onMouseEnter={() => setSelectedIndex(idx)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
        style={{
          backgroundColor: isSelected ? `${accentColor}14` : 'transparent',
          color: textColor,
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          <BookOpen className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{post.title}</p>
          {post.excerpt && (
            <p className="text-xs truncate mt-0.5" style={{ color: mutedColor }}>
              {post.excerpt.slice(0, 80)}
            </p>
          )}
        </div>
        {isSelected && <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />}
      </motion.button>
    );
  };

  const renderPage = (page: SearchPage) => {
    const idx = globalIdx++;
    const isSelected = selectedIndex === idx;
    return (
      <motion.button
        key={page.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        onClick={() => handleSelect({ type: 'page', data: page })}
        onMouseEnter={() => setSelectedIndex(idx)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
        style={{
          backgroundColor: isSelected ? `${accentColor}14` : 'transparent',
          color: textColor,
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          <FileText className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{page.title}</p>
          <p className="text-xs mt-0.5" style={{ color: mutedColor }}>
            Page
          </p>
        </div>
        {isSelected && <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />}
      </motion.button>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ backgroundColor: overlayBg, backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <div className="relative flex items-start justify-center pt-[12vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -16 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border"
              style={{ backgroundColor: panelBg, borderColor }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-5 py-4 border-b"
                style={{ borderColor }}
              >
                <Search
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: loading ? accentColor : mutedColor }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, blog posts, pages..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-opacity-40"
                  style={{
                    color: textColor,
                  }}
                  aria-label="Search"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded-lg transition-opacity hover:opacity-70"
                    style={{ color: mutedColor }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: mutedColor, backgroundColor: `${textColor}08` }}
                >
                  ESC
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Recent searches (when no query) */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: mutedColor }}>
                      Recent Searches
                    </p>
                    <div className="space-y-1">
                      {recentSearches.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleRecentClick(q)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:opacity-80"
                          style={{ color: textColor, backgroundColor: itemHoverBg }}
                        >
                          <Clock className="h-4 w-4 flex-shrink-0" style={{ color: mutedColor }} />
                          <span className="text-sm">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state when no query and no recent */}
                {!query && recentSearches.length === 0 && (
                  <div className="py-12 text-center px-6">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-20" style={{ color: textColor }} />
                    <p className="text-sm font-medium mb-1" style={{ color: textColor }}>
                      Search everything
                    </p>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      Type to search products, blog posts, and pages
                    </p>
                  </div>
                )}

                {/* Results */}
                {hasResults && (
                  <div className="p-4 space-y-5">
                    {results!.products.length > 0 && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                          style={{ color: mutedColor }}
                        >
                          <Package className="h-3.5 w-3.5" />
                          Products
                        </p>
                        <div className="space-y-0.5">
                          {results!.products.map(renderProduct)}
                        </div>
                      </div>
                    )}
                    {results!.blogPosts.length > 0 && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                          style={{ color: mutedColor }}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Blog Posts
                        </p>
                        <div className="space-y-0.5">
                          {results!.blogPosts.map(renderBlogPost)}
                        </div>
                      </div>
                    )}
                    {results!.pages.length > 0 && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                          style={{ color: mutedColor }}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Pages
                        </p>
                        <div className="space-y-0.5">
                          {results!.pages.map(renderPage)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No results */}
                {noResults && (
                  <div className="py-12 text-center px-6">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-sm font-medium mb-1" style={{ color: textColor }}>
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs mb-5" style={{ color: mutedColor }}>
                      Try different keywords or browse our sections below
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[
                        { label: 'Browse Products', href: `/site/${slug}/products` },
                        { label: 'Read Blog', href: `/blog/${slug}` },
                        { label: 'Contact Us', href: `/site/${slug}/contact` },
                      ].map((s) => (
                        <button
                          key={s.href}
                          onClick={() => {
                            onClose();
                            router.push(s.href);
                          }}
                          className="px-4 py-2 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: `${accentColor}14`,
                            color: accentColor,
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {(hasResults || flatItems.length > 0) && (
                <div
                  className="px-5 py-2.5 border-t flex items-center justify-between text-xs"
                  style={{ borderColor, color: mutedColor }}
                >
                  <span>↑↓ Navigate · ↵ Select · ESC Close</span>
                  <span>
                    {(results?.products.length ?? 0) +
                      (results?.blogPosts.length ?? 0) +
                      (results?.pages.length ?? 0)}{' '}
                    results
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
