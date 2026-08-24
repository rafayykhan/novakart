import { useId, useState } from "react";
import { ArrowRightIcon, CheckIcon } from "../Icons";

/**
 * Signup form with nowhere to send anything.
 *
 * There's no mailing service wired to this build, so the form validates the
 * address client-side and then says exactly that. The alternative — a green
 * "You're subscribed!" that quietly drops the address — is the kind of lie
 * that's easy to ship and hard to justify.
 */
export default function Newsletter() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | invalid | done

  function submit(event) {
    event.preventDefault();

    // Same shape check the browser does, run explicitly so the message is ours.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("invalid");
      return;
    }

    setState("done");
  }

  return (
    <section className="band border-t border-line">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Stay in the loop</p>
            <h2 className="t-section mt-4 text-ink text-balance">
              New things worth seeing.
            </h2>
          </div>

          <div className="lg:pt-2">
            <p className="t-lead max-w-md">
              An occasional note when something lands. No daily mail, no
              countdowns.
            </p>

            {state === "done" ? (
              <div className="mt-7 flex items-start gap-3 rounded-md border border-line bg-surface-2 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-bg">
                  <CheckIcon width={12} height={12} />
                </span>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="text-ink">That address looks right.</span> To
                  be straight with you though — this build has no mailing
                  service connected, so nothing was stored or sent.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7 max-w-md" noValidate>
                <label htmlFor={inputId} className="sr-only">
                  Email address
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id={inputId}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "invalid") setState("idle");
                    }}
                    placeholder="you@example.com"
                    aria-invalid={state === "invalid"}
                    aria-describedby={state === "invalid" ? `${inputId}-error` : undefined}
                    className="field flex-1"
                  />

                  <button type="submit" className="btn btn-primary shrink-0">
                    Sign up
                    <ArrowRightIcon width={15} height={15} />
                  </button>
                </div>

                {state === "invalid" && (
                  <p id={`${inputId}-error`} className="mt-2.5 text-sm text-danger">
                    Enter a valid email address.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
