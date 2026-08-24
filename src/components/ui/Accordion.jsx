import { useState } from "react";
import { PlusIcon, MinusIcon } from "../Icons";

/**
 * Disclosure list.
 *
 * Real <button>s with aria-expanded/aria-controls rather than <details>,
 * because the panels need to be styled and animated consistently across
 * browsers — but the semantics are the same ones <details> would give.
 * The first item starts open so the section never reads as empty.
 */
export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `accordion-panel-${i}`;
        const buttonId = `accordion-button-${i}`;

        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-sm font-medium text-ink transition-colors hover:text-muted"
              >
                {item.title}
                <span className="shrink-0 text-muted">
                  {isOpen ? (
                    <MinusIcon width={16} height={16} />
                  ) : (
                    <PlusIcon width={16} height={16} />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 text-sm leading-relaxed text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
