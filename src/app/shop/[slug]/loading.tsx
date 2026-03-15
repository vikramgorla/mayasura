export default function ShopLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="h-8 w-8 rounded bg-zinc-100" />
        <div className="h-3 w-20 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
