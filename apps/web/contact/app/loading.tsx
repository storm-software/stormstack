export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3 rounded-2xl bg-gray-900/80 p-4">
        <div className="h-14 rounded-lg bg-gray-700" />
        <div className="bg-vercel-cyan h-3 w-3/12 rounded-lg" />
        <div className="h-3 w-11/12 rounded-lg bg-gray-700" />
        <div className="h-3 w-8/12 rounded-lg bg-gray-700" />
      </div>
      <div className="space-y-3 rounded-2xl bg-gray-900/80 p-4">
        <div className="h-14 rounded-lg bg-gray-700" />
        <div className="bg-vercel-cyan h-3 w-3/12 rounded-lg" />
        <div className="h-3 w-11/12 rounded-lg bg-gray-700" />
        <div className="h-3 w-8/12 rounded-lg bg-gray-700" />
      </div>
      <div className="space-y-3 rounded-2xl bg-gray-900/80 p-4">
        <div className="h-14 rounded-lg bg-gray-700" />
        <div className="bg-vercel-cyan h-3 w-3/12 rounded-lg" />
        <div className="h-3 w-11/12 rounded-lg bg-gray-700" />
        <div className="h-3 w-8/12 rounded-lg bg-gray-700" />
      </div>
    </div>
  );
}
