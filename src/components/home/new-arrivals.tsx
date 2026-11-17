import { ProductCard } from "@/components/product/product-card";
import { Container, Grid, Section } from "@/components/ui";
import type { Product } from "@/lib/product";

import { SectionHeading } from "./section-heading";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <Section spacing="bottom">
      <SectionHeading
        eyebrow="Just in"
        title="New arrivals"
        link={{ label: "View all", href: "/new-arrivals" }}
      />
      <Container size="bleed">
        <Grid cols={4}>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
