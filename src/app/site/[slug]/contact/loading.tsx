export default function ContactLoading() {
  return (
    <div className="animate-pulse max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8 space-y-3">
        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
        <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-11 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-200 rounded" />
        </div>
        <div className="h-11 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-200 rounded w-40" />
      </div>
    </div>
  );
}
