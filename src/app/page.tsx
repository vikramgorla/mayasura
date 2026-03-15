import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center space-y-8 px-4">
        {/* Logo / Title */}
        <div className="space-y-4">
          <h1
            className="text-5xl font-bold tracking-tight sm:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Mayasura
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-md mx-auto">
            Build your brand&apos;s digital palace.
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          Coming Soon
        </div>

        {/* Description */}
        <p className="text-[var(--text-tertiary)] max-w-lg mx-auto text-base leading-relaxed">
          Open-source framework for brands to instantiate their complete digital
          communication ecosystem — website, chatbot, e-commerce, blog — all
          agent-orchestrated.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-base font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]"
            style={{ background: "var(--gradient-brand)" }}
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-6 text-base font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)] active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
