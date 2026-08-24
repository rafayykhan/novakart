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
    <section className="on-ink" aria-labelledby="newsletter-heading">
      <div className="shell band">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-[#ec3013]" aria-hidden="true" />
              Stay in the loop
            </p>
            <h2 id="newsletter-heading" className="t-display mt-6 text-[#f4efe6] text-balance">
              New things
              <br />
              worth seeing.
            </h2>
          </div>

          <div className="lg:pt-4">
            <p className="max-w-md text-[15px] leading-relaxed text-[#f4efe6]/70">
              An occasional note when something lands. No daily mail, no
              countdowns, no "last chance".
            </p>

            {state === "done" ? (
              <div className="mt-8 flex max-w-md items-start gap-3.5 border border-[#f4efe6]/20 p-5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ec3013] text-white">
                  <CheckIcon width={12} height={12} />
                </span>
                <p className="text-sm leading-relaxed text-[#f4efe6]/70">
                  <span className="text-[#f4efe6]">That address looks right.</span>{" "}
                  To be straight with you though — this build has no mailing
                  service connected, so nothing was stored or sent.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 max-w-md" noValidate>
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
                    /* The ink field needs its own input treatment — .field is
                       built for the cream page and would vanish here. */
                    className="flex-1 rounded-sm border border-[#f4efe6]/25 bg-transparent px-4 py-3.5 text-[15px] text-[#f4efe6] outline-none transition-colors placeholder:text-[#f4efe6]/40 hover:border-[#f4efe6]/50 focus:border-[#ec3013] focus:ring-2 focus:ring-[#ec3013]/40 aria-[invalid=true]:border-[#ff6a4d]"
                  />

                  <button type="submit" className="btn btn-red shrink-0">
                    Sign up
                    <ArrowRightIcon width={14} height={14} className="arrow" />
                  </button>
                </div>

                {state === "invalid" && (
                  <p id={`${inputId}-error`} className="mt-3 text-sm text-[#ff8a72]">
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
