// Placeholder cards while the products thunk is pending.
export default function Skeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="panel animate-pulse rounded-2xl p-3">
          <div className="h-40 rounded-xl bg-ink/5" />
          <div className="mt-4 h-3 w-1/3 rounded bg-ink/5" />
          <div className="mt-3 h-3 w-4/5 rounded bg-ink/5" />
          <div className="mt-2 h-3 w-2/3 rounded bg-ink/5" />
        </div>
      ))}
    </>
  );
}
