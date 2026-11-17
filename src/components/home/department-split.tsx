import Image from "next/image";
import Link from "next/link";

import { Media } from "@/components/ui";
import type { Collection } from "@/lib/product";

/** Two edge-to-edge editorial tiles (e.g. Women / Men) with overlaid labels. */
export function DepartmentSplit({ items }: { items: Collection[] }) {
  return (
    <section aria-label="Shop by department" className="container-bleed">
      <ul className="grid gap-(--grid-gap) md:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={item.href} className="group relative block">
              <Media ratio="portrait">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              </Media>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-8 text-white md:p-12">
                <h2 className="type-h1">{item.title}</h2>
                <span className="btn btn-inverse btn-sm">Shop {item.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
