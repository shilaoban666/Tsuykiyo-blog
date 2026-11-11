export default function PostsLoading() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-40 sm:px-6">
      <div className="h-3 w-32 animate-pulse rounded-full bg-line" />
      <div className="mt-6 h-16 max-w-xl animate-pulse rounded-2xl bg-line/70" />
      <div className="mt-4 h-4 max-w-lg animate-pulse rounded-full bg-line/50" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-line">
            <div className="aspect-[3/2] animate-pulse bg-line/40" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 animate-pulse rounded-full bg-line/50" />
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-line/70" />
              <div className="h-3 w-full animate-pulse rounded-full bg-line/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}