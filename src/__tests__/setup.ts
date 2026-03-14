import '@testing-library/jest-dom';

// ─── Mock next/navigation ────────────────────────────────────────
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const mockPathname = '/';
const mockParams = {};
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useParams: () => mockParams,
  useSearchParams: () => mockSearchParams,
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// ─── Mock next/image ─────────────────────────────────────────────
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

// ─── Mock framer-motion ──────────────────────────────────────────
// Framer Motion animations can interfere with testing. Provide simple passthrough.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          // Return a forwardRef component for any HTML element (motion.div, motion.button, etc.)
          return React.forwardRef(
            (props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
              const {
                initial,
                animate,
                exit,
                transition,
                whileHover,
                whileTap,
                whileFocus,
                whileInView,
                layout,
                layoutId,
                variants,
                ...rest
              } = props;
              const Component = prop as keyof JSX.IntrinsicElements;
              return React.createElement(Component, { ...rest, ref });
            }
          );
        },
      }
    ),
  };
});

// ─── Mock global fetch ───────────────────────────────────────────
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  })
);

vi.stubGlobal('fetch', mockFetch);

// ─── Global test utilities ───────────────────────────────────────
import React from 'react';

// Export mocks for test access
export { mockRouter, mockFetch };
