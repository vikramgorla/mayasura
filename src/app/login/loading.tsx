import { Loader2 } from 'lucide-react';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
    </div>
  );
}
