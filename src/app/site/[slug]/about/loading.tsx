export default function AboutLoading() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="space-y-3 mt-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
