'use client';

import { useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Github, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { SharedFooter } from '@/components/shared-footer';

// Password strength calculator
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: '#22C55E' };
}

function FloatingLabelInput({
  id, label, type = 'text', value, onChange, error, required, autoFocus, rightElement, placeholder
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; required?: boolean;
  autoFocus?: boolean; rightElement?: React.ReactNode; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloated = focused || hasValue;

  return (
    <div className="relative">
      <div
        className="relative rounded-xl border transition-all duration-200"
        style={{
          borderColor: error ? '#EF4444' : focused ? '#7C3AED' : '#E4E4E7',
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.1)' : error ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
          backgroundColor: '#FFFFFF',
        }}
      >
        <label
          htmlFor={id}
          className="absolute left-4 transition-all duration-200 pointer-events-none select-none"
          style={{
            top: isFloated ? '8px' : '50%',
            transform: isFloated ? 'translateY(0)' : 'translateY(-50%)',
            fontSize: isFloated ? '11px' : '14px',
            fontWeight: isFloated ? 500 : 400,
            color: error ? '#EF4444' : focused ? '#7C3AED' : isFloated ? '#71717A' : '#A1A1AA',
            letterSpacing: isFloated ? '0.02em' : 0,
          }}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          autoFocus={autoFocus}
          placeholder={focused ? placeholder : ''}
          className="w-full bg-transparent outline-none text-zinc-900 dark:text-white pr-12"
          style={{
            padding: isFloated || hasValue ? '26px 16px 10px' : '18px 16px',
            fontSize: '14px',
            transition: 'padding 0.2s',
          }}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            className="flex items-center gap-1 text-xs mt-1.5 pl-1"
            style={{ color: '#EF4444' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  const pct = (score / 5) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-2">
        <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all duration-500"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color }}>
          {label}
        </p>
      </div>
    </motion.div>
  );
}

type Mode = 'login' | 'signup';

function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode: Mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const isGuest = searchParams.get('guest') === '1';
  const shopRedirect = searchParams.get('shop');
  const toast = useToast();

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [mode, name, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || 'Something went wrong' });
        setLoading(false);
        return;
      }

      toast.success(
        mode === 'login' ? 'Welcome back!' : 'Account created!',
        mode === 'login' ? `Signed in as ${data.user?.name || email}` : 'Welcome to Mayasura'
      );
      router.push(shopRedirect ? `/shop/${shopRedirect}` : redirect);
    } catch {
      setErrors({ form: 'Network error — please check your connection and try again' });
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setPassword('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand visual */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900 flex-col justify-between p-10">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-60 h-60 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <span className="text-white text-lg font-bold">M</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Mayasura</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                {mode === 'login' ? (
                  <>Welcome<br />back 👋</>
                ) : (
                  <>Build your<br />digital palace 🏛️</>
                )}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
                {mode === 'login'
                  ? 'Sign in to manage your brand\'s complete digital communication stack.'
                  : 'Launch your brand\'s website, shop, chatbot, and more — all in minutes.'}
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                {(mode === 'login' ? [
                  'Access all your brand dashboards',
                  'Manage products and orders',
                  'View analytics and insights',
                ] : [
                  'Website & shop in minutes',
                  'AI-powered chatbot included',
                  'Protocol-native: MCP & A2A ready',
                ]).map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-violet-300 flex-shrink-0" />
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-xs text-white/30">The divine architect. Build palaces, not huts.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-zinc-50">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-lg font-bold">M</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white text-lg">Mayasura</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Mode switcher tabs */}
          <div className="flex rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1 mb-8 shadow-sm">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative"
                style={{
                  color: mode === m ? '#18181B' : '#A1A1AA',
                }}
              >
                {mode === m && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-700 shadow-sm border border-zinc-100 dark:border-zinc-600"
                    layoutId="auth-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 capitalize">
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <FloatingLabelInput
                  id="name"
                  label="Full Name"
                  value={name}
                  onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: '' })); }}
                  error={errors.name}
                  placeholder="Jane Smith"
                  required
                  autoFocus
                />
              )}

              <FloatingLabelInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: '' })); }}
                error={errors.email}
                placeholder="jane@brand.com"
                required
                autoFocus={mode === 'login'}
              />

              <div>
                <FloatingLabelInput
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: '' })); }}
                  error={errors.password}
                  placeholder="min. 6 characters"
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-400 hover:text-zinc-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                {mode === 'signup' && (
                  <AnimatePresence>
                    {password && <PasswordStrengthBar password={password} />}
                  </AnimatePresence>
                )}
              </div>

              {/* Form-level error */}
              <AnimatePresence>
                {errors.form && (
                  <motion.div
                    className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm"
                    style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {errors.form}
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#FFFFFF' }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              onClick={() => toast.error('Not available', 'Social login coming soon')}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              onClick={() => toast.error('Not available', 'Social login coming soon')}
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
          </div>

          {/* Guest option for shop flow */}
          {(isGuest || shopRedirect) && (
            <div className="mt-4">
              <Link
                href={shopRedirect ? `/shop/${shopRedirect}/checkout` : '/shop'}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors"
              >
                Continue as guest
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Switch mode footer */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            {mode === 'login' ? (
              <>
                New to Mayasura?{' '}
                <button onClick={() => switchMode('signup')} className="text-violet-600 hover:text-violet-700 font-medium">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-violet-600 hover:text-violet-700 font-medium">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="flex-1">
        <Suspense fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
          </div>
        }>
          <AuthForm />
        </Suspense>
      </div>
      <SharedFooter minimal />
    </div>
  );
}
