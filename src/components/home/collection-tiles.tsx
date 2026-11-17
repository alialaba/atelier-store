import Image from "next/image";
import Link from "next/link";

import { Container, Grid, Media, Section } from "@/components/ui";
import type { Collection } from "@/lib/product";

import { SectionHeading } from "./section-heading";

export function CollectionTiles({ items }: { items: Collection[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Explore" title="Shop by category" />
      <Container size="bleed">
        <Grid cols={4}>
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={item.href} className="group block">
                <Media ratio="product">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </Media>
                <p className="mt-4 text-center type-label">
                  <span className="link-reveal">{item.title}</span>
                </p>
              </Link>
            </li>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
