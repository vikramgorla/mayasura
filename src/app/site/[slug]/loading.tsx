export default function SiteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="h-10 w-10 rounded-xl bg-zinc-100" />
        <div className="h-2.5 w-24 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
