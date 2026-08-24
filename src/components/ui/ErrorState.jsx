import { AlertIcon } from "../Icons";

/**
 * User-facing failure. The raw message from the thunk is kept behind a
 * <details> rather than printed as the headline — a shopper needs "try again",
 * not "TypeError: Failed to fetch".
 */
export default function ErrorState({
  title = "Something went wrong.",
  description = "We couldn't load this right now. It's usually temporary.",
  detail,
  onRetry,
  retryLabel = "Try again",
}) {
  return (
    <div className="panel flex flex-col items-start gap-5 p-7 sm:p-9" role="alert">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red/10 text-red">
        <AlertIcon width={21} height={21} />
      </span>

      <div>
        <p className="t-sub text-ink">{title}</p>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary btn-sm">
          {retryLabel}
        </button>
      )}

      {detail && (
        <details className="w-full text-xs text-faint">
          <summary className="cursor-pointer select-none">Technical detail</summary>
          <p className="mt-2 break-words font-mono">{detail}</p>
        </details>
      )}
    </div>
  );
}
