import { CampaignBanner } from "@/components/home/campaign-banner";
import { CollectionTiles } from "@/components/home/collection-tiles";
import { DepartmentSplit } from "@/components/home/department-split";
import { EditorialSplit } from "@/components/home/editorial-split";
import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { ServicesStrip } from "@/components/home/services-strip";
import {
  atelierStory,
  departments,
  featureCampaign,
  heroCampaign,
  services,
} from "@/lib/content";
import { getFeaturedCategories, getNewArrivals } from "@/lib/data/catalog";

export default async function Home() {
  const [categories, newArrivals] = await Promise.all([
    getFeaturedCategories(),
    getNewArrivals(),
  ]);

  return (
    <main id="main" className="flex-1">
      <Hero campaign={heroCampaign} />
      <CollectionTiles items={categories} />
      <NewArrivals products={newArrivals} />
      <DepartmentSplit items={departments} />
      <CampaignBanner campaign={featureCampaign} />
      <EditorialSplit story={atelierStory} />
      <ServicesStrip services={services} />
    </main>
  );
}
