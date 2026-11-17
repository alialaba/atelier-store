import { getAllProductSlugs, getProductBySlug } from "@/lib/data/catalog";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/products/[slug]">,
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
}
