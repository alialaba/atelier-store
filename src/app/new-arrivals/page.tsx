import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink, Container, Grid, Section, Text } from "@/components/ui";
import { getNewArrivals } from "@/lib/data/catalog";

/** How many of the newest products the page lists. */
const NEW_ARRIVALS_LIMIT = 24;

export const metadata: Metadata = {
  title: "New arrivals | Atelier",
  description: "The latest pieces to arrive at Atelier, newest first.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(NEW_ARRIVALS_LIMIT);

  return (
    <main id="main" className="flex-1 pt-header">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New arrivals" }]} />

      <Section spacing="bottom" aria-labelledby="new-arrivals-heading">
        <Container className="mb-8 flex flex-col gap-2 pt-4 md:mb-10 md:pt-6">
          <Text variant="label" tone="muted">
            Just in
          </Text>
          <h1 id="new-arrivals-heading" className="type-h1">
            New arrivals
          </h1>
          <Text variant="small" tone="muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}, newest first
          </Text>
        </Container>

        {products.length > 0 ? (
          <Container size="bleed">
            <Grid cols={4}>
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </Grid>
          </Container>
        ) : (
          <Container size="prose" className="flex flex-col items-center gap-4 py-16 text-center">
            <Text tone="muted">No new pieces right now. Check back soon.</Text>
            <ButtonLink href="/" variant="secondary">
              Back to home
            </ButtonLink>
          </Container>
        )}
      </Section>
    </main>
  );
}
