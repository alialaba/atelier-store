import Link from "next/link";
import { Fragment } from "react";

type Crumb = {
  label: string;
  /** Omit for plain text (a category without its own page, or the current page). */
  href?: string;
};

/** Small uppercase trail above a page title. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page py-4">
      <ol className="flex flex-wrap items-center gap-2 type-caption text-ink-subtle uppercase">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && <li aria-hidden="true">/</li>}
              <li aria-current={current ? "page" : undefined} className={current ? "text-ink" : undefined}>
                {item.href && !current ? (
                  <Link href={item.href} className="link-reveal">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
