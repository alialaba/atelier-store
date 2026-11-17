/*
 * Seed data: the original sample catalog. Loaded into Postgres by `npm run db:seed`.
 * Pure data with relative imports only, so it runs under tsx outside Next.
 * Images are from Unsplash (https://unsplash.com/license).
 */

import type { CatalogImage, Product } from "../../lib/product";

export type SeedCategory = {
  slug: string;
  name: string;
  imageUrl?: string;
  imageAlt?: string;
  featured: boolean;
  sortOrder: number;
};

/** A product as authored here; `category` is the category **name**, resolved to an id by the seed. */
export type SeedProduct = Omit<Product, "id">;

const UNSPLASH = "https://images.unsplash.com/photo-";

function unsplash(id: string, width = 1600): string {
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

type Focus = { x: number; y: number; zoom: number };

/**
 * Three portrait (3:4) shots from one photo: the full frame, a close-up on
 * `detail`, and a mirrored, slightly tighter alternate framing.
 */
function shots(id: string, alt: string, detail: Focus): CatalogImage[] {
  const base = `${UNSPLASH}${id}?auto=format&fit=crop&w=1200&h=1600&q=80`;
  return [
    { src: base, alt },
    {
      src: `${base}&crop=focalpoint&fp-x=${detail.x}&fp-y=${detail.y}&fp-z=${detail.zoom}`,
      alt: `Close-up detail: ${alt.charAt(0).toLowerCase()}${alt.slice(1)}`,
    },
    {
      src: `${base}&flip=h&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=1.25`,
      alt: `Alternate view: ${alt.charAt(0).toLowerCase()}${alt.slice(1)}`,
    },
  ];
}

export const seedCategories: SeedCategory[] = [
  {
    slug: "bags",
    name: "Bags",
    imageUrl: unsplash("1584917865442-de89df76afd3", 1000),
    imageAlt: "A structured red top-handle bag.",
    featured: true,
    sortOrder: 0,
  },
  {
    slug: "shoes",
    name: "Shoes",
    imageUrl: unsplash("1543163521-1bf539c55dd2", 1000),
    imageAlt: "A patterned stiletto pump on a pale blue background.",
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "ready-to-wear",
    name: "Ready-to-wear",
    imageUrl: unsplash("1490481651871-ab68de25d43d", 1000),
    imageAlt: "Neutral-toned garments hanging from a minimal clothes rail.",
    featured: true,
    sortOrder: 20,
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    imageUrl: unsplash("1535632066927-ab7c9ab60908", 1000),
    imageAlt: "Gemstone earrings resting on a green leaf.",
    featured: true,
    sortOrder: 30,
  },
  { slug: "accessories", name: "Accessories", featured: false, sortOrder: 40 },
];

const apparelSizes = (stock: [number, number, number, number, number]) =>
  ["XS", "S", "M", "L", "XL"].map((label, i) => ({ label, stock: stock[i] }));

export const seedProducts: SeedProduct[] = [
  {
    slug: "woven-leather-tote",
    sku: "ATL-BG-1001",
    name: "Woven leather top-handle bag",
    category: "Bags",
    price: 189000,
    description:
      "A structured top-handle bag pairing a hand-woven wicker body with smooth calf leather. Sized for the everyday essentials, with a detachable strap for crossbody wear.",
    details: [
      "Hand-woven wicker body, calf leather trims",
      "Detachable, adjustable shoulder strap",
      "Cotton-linen lining with interior slip pocket",
      "W 26 × H 21 × D 12 cm",
      "Made in Italy",
    ],
    images: shots("1590874103328-eac38a683ce7", "An orange woven leather top-handle bag.", {
      x: 0.5,
      y: 0.72,
      zoom: 2.2,
    }),
    colors: [
      { name: "Tangerine", hex: "#d2691e" },
      { name: "Natural", hex: "#d8c3a0" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: [{ label: "One size", stock: 6 }],
  },
  {
    slug: "suede-loafer",
    sku: "ATL-SH-2004",
    name: "Suede loafer",
    category: "Shoes",
    price: 89000,
    description:
      "An unlined loafer in soft brushed suede with brogue detailing and a stacked leather heel. Shaped on a slim last to sit close to the foot.",
    details: [
      "Brushed calf suede upper",
      "Leather sole with rubber heel tip",
      "1.5 cm stacked heel",
      "Fits true to size; half sizes take the next size up",
      "Made in Portugal",
    ],
    images: shots("1560343090-f0409e92791a", "A teal suede loafer on a pastel background.", {
      x: 0.5,
      y: 0.62,
      zoom: 2.2,
    }),
    colors: [
      { name: "Teal", hex: "#2f7a6d" },
      { name: "Chestnut", hex: "#7b4a2a" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: [
      { label: "EU 38", stock: 4 },
      { label: "EU 39", stock: 2 },
      { label: "EU 40", stock: 0 },
      { label: "EU 41", stock: 5 },
      { label: "EU 42", stock: 1 },
      { label: "EU 43", stock: 3 },
    ],
  },
  {
    slug: "open-knit-poncho",
    sku: "ATL-RW-3012",
    name: "Open-knit cotton poncho",
    category: "Ready-to-wear",
    price: 128000,
    description:
      "A relaxed V-neck poncho hand-knitted in an open crochet stitch, finished with a fringed hem. Layer it over a slip dress or a fine-gauge knit.",
    details: [
      "100% organic cotton",
      "Hand-knitted open crochet stitch",
      "Fringed hem",
      "Relaxed fit; the model is 177 cm and wears size S/M",
      "Hand wash cold, dry flat",
    ],
    images: shots(
      "1434389677669-e08b4cac3105",
      "A cream open-knit poncho with fringed hem on a hanger.",
      { x: 0.5, y: 0.55, zoom: 2.4 },
    ),
    colors: [
      { name: "Ivory", hex: "#efe6d2" },
      { name: "Sand", hex: "#c9b18f" },
    ],
    sizes: [
      { label: "XS/S", stock: 7 },
      { label: "M/L", stock: 3 },
    ],
  },
  {
    slug: "round-sunglasses",
    sku: "ATL-AC-4007",
    name: "Round metal sunglasses",
    category: "Accessories",
    price: 49000,
    description:
      "Lightweight round sunglasses with a fine metal frame, adjustable nose pads and tinted mineral lenses offering full UV protection.",
    details: [
      "Gold-tone titanium frame",
      "Green mineral glass lenses, 100% UVA/UVB protection",
      "Lens width 49 mm, bridge 21 mm",
      "Supplied with a leather case and cleaning cloth",
    ],
    images: shots(
      "1511499767150-a48a237f0083",
      "Round sunglasses with thin gold frames on a white surface.",
      { x: 0.5, y: 0.5, zoom: 2 },
    ),
    colors: [
      { name: "Gold / Green", hex: "#b8954a" },
      { name: "Silver / Grey", hex: "#a7a9ac" },
    ],
    sizes: [{ label: "One size", stock: 2 }],
  },
  {
    slug: "leather-biker-jacket",
    sku: "ATL-RW-3020",
    name: "Leather biker jacket",
    category: "Ready-to-wear",
    price: 420000,
    description:
      "A classic biker jacket cut from supple lambskin, with an asymmetric zip, notched lapels and a belted hem. Softens and shapes to the wearer over time.",
    details: [
      "Lambskin leather, viscose lining",
      "Asymmetric front zip, zipped cuffs",
      "Three exterior zip pockets",
      "Regular fit",
      "Specialist leather clean only",
    ],
    images: shots("1551028719-00167b16eac5", "A black leather biker jacket laid flat.", {
      x: 0.5,
      y: 0.45,
      zoom: 2,
    }),
    colors: [{ name: "Black", hex: "#111111" }],
    sizes: apparelSizes([1, 3, 0, 4, 2]),
  },
  {
    slug: "structured-crossbody",
    sku: "ATL-BG-1009",
    name: "Structured crossbody bag",
    category: "Bags",
    price: 215000,
    description:
      "A compact top-handle bag in grained calf leather with a polished turn-lock closure. Carry it by hand or wear it crossbody on the adjustable strap.",
    details: [
      "Grained calf leather",
      "Gold-tone turn-lock closure",
      "Suede lining with interior card slot",
      "W 22 × H 17 × D 9 cm",
      "Made in Italy",
    ],
    images: shots(
      "1594223274512-ad4803739b7c",
      "A teal leather crossbody bag with a gold clasp.",
      { x: 0.62, y: 0.5, zoom: 2 },
    ),
    colors: [
      { name: "Teal", hex: "#1f6f78" },
      { name: "Bordeaux", hex: "#5e1f2b" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: [{ label: "One size", stock: 0 }],
  },
  {
    slug: "denim-trucker-jacket",
    sku: "ATL-RW-3031",
    name: "Denim jacket with corduroy collar",
    category: "Ready-to-wear",
    price: 98000,
    description:
      "A rigid selvedge denim jacket in a deep indigo wash, finished with a contrast corduroy collar and copper shank buttons.",
    details: [
      "100% cotton selvedge denim, 13.5 oz",
      "Cotton corduroy collar",
      "Copper shank buttons",
      "Boxy fit; size down for a closer fit",
      "Machine wash cold, inside out",
    ],
    images: shots(
      "1611312449408-fcece27cdbb7",
      "A dark-wash denim jacket with a brown corduroy collar.",
      { x: 0.5, y: 0.3, zoom: 2.2 },
    ),
    colors: [{ name: "Indigo", hex: "#23324a" }],
    sizes: apparelSizes([0, 5, 8, 6, 2]),
  },
  {
    slug: "layered-pendant-necklace",
    sku: "ATL-JW-5002",
    name: "Layered pendant necklace",
    category: "Jewellery",
    price: 72000,
    description:
      "Three fine chains layered at graduated lengths, finished with a faceted crystal pendant and a hammered crescent charm.",
    details: [
      "18k gold vermeil on sterling silver",
      "Faceted crystal pendant",
      "Lengths 40, 45 and 50 cm with 5 cm extender",
      "Lobster clasp",
      "Store in the pouch provided",
    ],
    images: shots(
      "1599643478518-a784e5dc4c8f",
      "Layered gold chains with a crystal pendant and a crescent charm.",
      { x: 0.58, y: 0.5, zoom: 2 },
    ),
    colors: [{ name: "Gold", hex: "#c9a24a" }],
    sizes: [{ label: "One size", stock: 12 }],
  },
];
