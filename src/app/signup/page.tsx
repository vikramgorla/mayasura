'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Signup now redirects to the unified login/signup page (login page handles both modes)
function SignupRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    router.replace(`/login?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    }>
      <SignupRedirect />
    </Suspense>
  );
}
