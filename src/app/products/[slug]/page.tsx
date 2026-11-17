import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PlusIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Container, Grid, Heading, Section, Text } from "@/components/ui";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/catalog";
import { formatPrice } from "@/lib/product";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Atelier`,
    description: product.description,
    openGraph: { images: [product.images[0].src] },
  };
}

/*
 * The shell (header offset + skeleton) is URL-independent so navigation can be
 * instant; everything that reads `params` streams in behind Suspense.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <main id="main" className="flex-1 pt-header">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </main>
  );
}

/** Gallery left (thumbnail rail + main image), details right; stacked and edge-to-edge on mobile. */
const detailGrid =
  "grid lg:container-page lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 lg:pt-2 xl:gap-20";

function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="container-page py-4">
        <div className="h-3 w-48 bg-surface" />
      </div>
      <div className={detailGrid}>
        <div className="flex flex-col gap-3 lg:flex-row-reverse">
          <div className="aspect-product flex-1 bg-well" />
          <div className="flex gap-2 px-4 lg:w-20 lg:flex-col lg:px-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-product w-16 bg-surface lg:w-full" />
            ))}
          </div>
        </div>
        <div className="gutter-x flex flex-col gap-4 pt-8 lg:px-0 lg:pt-0">
          <div className="h-3 w-24 bg-surface" />
          <div className="h-8 w-3/4 bg-surface" />
          <div className="h-5 w-20 bg-surface" />
          <div className="mt-8 h-14 w-full bg-surface" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug);
  const sections = [
    { title: "Description", body: <Text tone="muted">{product.description}</Text> },
    {
      title: "Details & care",
      body: (
        <ul className="flex list-disc flex-col gap-1.5 pl-4 type-body-sm text-ink-muted">
          {product.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Delivery & returns",
      body: (
        <Text variant="small" tone="muted">
          Complimentary standard delivery in 2–4 business days, with express options at
          checkout. Return or exchange within 30 days of delivery, free of charge.
        </Text>
      ),
    },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page py-4">
        <ol className="flex flex-wrap items-center gap-2 type-caption text-ink-subtle uppercase">
          <li>
            <Link href="/" className="link-reveal">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{product.category}</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className={detailGrid}>
        <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
          <ProductGallery
            images={product.images}
            sizes="(min-width: 1024px) 45vw, 100vw"
            preload
            railFrom="lg"
          />
        </div>

        <div className="gutter-x pt-8 pb-4 lg:px-0 lg:pt-0">
          <div className="flex flex-col gap-2">
            <Text variant="label" tone="muted">
              {product.category}
            </Text>
            <h1 className="type-h1">{product.name}</h1>
            <Text variant="caption" tone="subtle">
              SKU {product.sku}
            </Text>
            <p className="mt-2 text-xl font-medium">{formatPrice(product.price)}</p>
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <PurchasePanel product={product} />
          </div>

          <div className="mt-10 border-b border-line">
            {sections.map((section, index) => (
              <details key={section.title} open={index === 0} className="group border-t border-line">
                <summary className="flex cursor-pointer items-center justify-between py-5 type-label">
                  {section.title}
                  <PlusIcon className="size-4 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <div className="pb-6">{section.body}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Section aria-labelledby="related-heading">
          <Container className="mb-8 md:mb-10">
            <Heading id="related-heading" level={2}>
              You may also like
            </Heading>
          </Container>
          <Container size="bleed">
            <Grid cols={4}>
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </>
  );
}
