import { Product } from "../types";

export interface HomeBlueprintCard {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryLabel: string;
  tier: string;
  slug: string;
  status: "active" | "coming_soon";
  ctaLink: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI Workflows",
  web: "Website Systems",
  seo: "SEO Systems",
  automation: "Automation Playbooks",
};

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  premium: "Flagship Tier",
};

function mapProductToHomeCard(product: Product): HomeBlueprintCard {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    image: product.thumbnail,
    categoryLabel: CATEGORY_LABELS[product.category] || product.category,
    tier: TIER_LABELS[product.productTier || ""] || "Free",
    slug: product.slug,
    status: product.status === "COMING_SOON" ? "coming_soon" : "active",
    ctaLink: `/blueprints/${product.slug}`,
  };
}

export function getFeaturedBlueprints(products: Product[]): HomeBlueprintCard[] {
  if (!products.length) return [];
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);
  const source = featured.length >= 3 ? featured : products.slice(0, 3);
  return source.map(mapProductToHomeCard);
}
