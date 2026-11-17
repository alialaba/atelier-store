/*
 * Editorial storefront content (campaigns, departments, services).
 * Catalog data (products, categories, stock) lives in the database; see src/lib/data/catalog.ts.
 * Images are from Unsplash (https://unsplash.com/license).
 */

import type { CatalogImage, Collection } from "./product";

export type Campaign = {
  eyebrow: string;
  title: string;
  body?: string;
  image: CatalogImage;
  actions: { label: string; href: string }[];
};

const UNSPLASH = "https://images.unsplash.com/photo-";

function unsplash(id: string, width = 1600): string {
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const heroCampaign: Campaign = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Season",
  body: "Considered pieces in soft tailoring, open knits and hand-finished leather.",
  image: {
    src: unsplash("1509631179647-0177331693ae", 2400),
    alt: "A model in wide striped trousers and a white top poses against a turquoise wall.",
  },
  actions: [
    { label: "Shop women", href: "/women" },
    { label: "Shop men", href: "/men" },
  ],
};

export const departments: Collection[] = [
  {
    slug: "women",
    title: "Women",
    href: "/women",
    image: {
      src: unsplash("1539109136881-3be0616acf4b"),
      alt: "A woman in a pale blue coat carries a leather shoulder bag in a cathedral square.",
    },
  },
  {
    slug: "men",
    title: "Men",
    href: "/men",
    image: {
      src: unsplash("1487222477894-8943e31ef7b2"),
      alt: "A man in a brown leather jacket and round sunglasses.",
    },
  },
];

export const featureCampaign: Campaign = {
  eyebrow: "The colour study",
  title: "Saturated, softly",
  body: "Relaxed silhouettes in a single, sunlit shade.",
  image: {
    src: unsplash("1515886657613-9f3515b0c78f", 2400),
    alt: "A model in a mustard-yellow tracksuit stands on a sunlit beach court.",
  },
  actions: [{ label: "Discover the edit", href: "/edits/colour-study" }],
};

export const atelierStory: Campaign = {
  eyebrow: "In store",
  title: "Visit the atelier",
  body: "Book a private appointment for personal styling, alterations and made-to-order pieces with our client advisors.",
  image: {
    src: unsplash("1441984904996-e0b6ba687e04", 1600),
    alt: "The interior of a boutique with garments on rails under pendant lamps.",
  },
  actions: [
    { label: "Book an appointment", href: "/appointments" },
    { label: "Find a store", href: "/stores" },
  ],
};

export const services = [
  {
    title: "Complimentary shipping",
    body: "Free standard delivery on every order, with express options at checkout.",
  },
  {
    title: "Returns & exchanges",
    body: "Return or exchange within 30 days of delivery, free of charge.",
  },
  {
    title: "Signature packaging",
    body: "Every order arrives gift-ready, with a handwritten note on request.",
  },
  {
    title: "Client services",
    body: "Advisors are available by phone, chat and email, seven days a week.",
  },
];
