import type { Product } from '../types';
import { resolveTier, TIER_ORDER } from './pricing';

export interface ContinueLearningItem {
  type: 'course' | 'blueprint';
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  description?: string;
  category?: string;
  lastAccessed?: any;
  progress?: number;
  totalLessons?: number;
}

export interface RecommendedUnlock {
  type: 'course' | 'blueprint';
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  reason: string;
}

export interface UpgradeOffer {
  tier: string;
  label: string;
  description: string;
  products: Product[];
  badge?: string;
}

export function getContinueLearning(
  enrolledCourses: any[],
  ownedProducts: Product[],
): ContinueLearningItem[] {
  const items: ContinueLearningItem[] = [];

  // Most recently updated enrollments first
  const sortedCourses = [...enrolledCourses].sort((a, b) => {
    const aTime = a.progressData?.updatedAt?.toMillis?.() || 0;
    const bTime = b.progressData?.updatedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });

  for (const course of sortedCourses.slice(0, 2)) {
    const completed = course.progressData?.progress?.length || 0;
    const total = course.lessonsCount || 10;
    items.push({
      type: 'course',
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail,
      description: course.description,
      category: course.category,
      lastAccessed: course.progressData?.updatedAt,
      progress: Math.min(100, Math.round((completed / total) * 100)),
      totalLessons: total,
    });
  }

  // Recently purchased products (no timestamp tracking — show first owned)
  for (const product of ownedProducts.slice(0, 1)) {
    items.push({
      type: 'blueprint',
      id: product.id,
      title: product.title,
      slug: product.slug,
      thumbnail: product.thumbnail,
      description: product.description,
      category: product.category,
    });
  }

  return items;
}

export function getRecommendedUnlocks(
  ownedProducts: Product[],
  enrolledCourses: any[],
  discoverProducts: Product[],
  allCourses: any[],
): RecommendedUnlock[] {
  const recommendations: RecommendedUnlock[] = [];
  const ownedCategories = new Set(ownedProducts.map(p => p.category?.toLowerCase()).filter(Boolean));
  const enrolledCourseIds = new Set(enrolledCourses.map(c => c.id));

  // If user owns any product, suggest a course in the same category
  if (ownedProducts.length > 0) {
    const matchingCourses = allCourses.filter(
      c => ownedCategories.has(c.category?.toLowerCase()) && !enrolledCourseIds.has(c.id)
    );
    for (const course of matchingCourses.slice(0, 2)) {
      recommendations.push({
        type: 'course',
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        description: course.description,
        price: course.price,
        reason: 'Deepen your skills in this area',
      });
    }
  }

  // If user is enrolled in any course, suggest a premium blueprint
  if (enrolledCourses.length > 0) {
    const premiumBlueprints = discoverProducts.filter(
      p => resolveTier(p) !== 'free' && !ownedProducts.find(op => op.id === p.id)
    );
    for (const bp of premiumBlueprints.slice(0, 2)) {
      recommendations.push({
        type: 'blueprint',
        id: bp.id,
        title: bp.title,
        slug: bp.slug,
        thumbnail: bp.thumbnail,
        description: bp.description,
        price: bp.salePrice || bp.basePrice,
        reason: 'Production-ready system to apply what you learned',
      });
    }
  }

  // Fallback: if no recommendations yet, suggest starter blueprints
  if (recommendations.length === 0 && discoverProducts.length > 0) {
    const cheapFirst = [...discoverProducts].sort(
      (a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice)
    );
    for (const bp of cheapFirst.slice(0, 2)) {
      recommendations.push({
        type: 'blueprint',
        id: bp.id,
        title: bp.title,
        slug: bp.slug,
        thumbnail: bp.thumbnail,
        description: bp.description,
        price: bp.salePrice || bp.basePrice,
        reason: 'Perfect entry point to start building',
      });
    }
  }

  return recommendations.slice(0, 3);
}

export function getUpgradePaths(
  ownedProducts: Product[],
  allProducts: Product[],
): UpgradeOffer[] {
  const offers: UpgradeOffer[] = [];
  const ownedTiers = new Set(ownedProducts.map(p => resolveTier(p)));

  // If user owns any Starter, suggest Pro upgrade
  if (ownedTiers.has('starter')) {
    const proProducts = allProducts.filter(
      p => resolveTier(p) === 'pro' && !ownedProducts.find(op => op.id === p.id) && p.isPublished
    );
    if (proProducts.length > 0) {
      offers.push({
        tier: 'pro',
        label: 'Upgrade to Pro',
        description: 'Get deep systems with production-ready code, templates, and workflows.',
        products: proProducts.slice(0, 3),
        badge: 'Popular',
      });
    }
  }

  // If user owns Starter or Pro, suggest Bundle (2+ products)
  if (ownedTiers.has('starter') || ownedTiers.has('pro')) {
    const ownedCount = ownedProducts.length;
    const suggestBundle = ownedCount >= 1 && ownedCount <= 3;
    if (suggestBundle) {
      const bundleCandidates = allProducts.filter(
        p => !ownedProducts.find(op => op.id === p.id) && p.isPublished && resolveTier(p) !== 'free'
      );
      const bundleItems = bundleCandidates.slice(0, 3);
      if (bundleItems.length >= 2) {
        const totalPrice = bundleItems.reduce((sum, p) => sum + (p.salePrice || p.basePrice), 0);
        offers.push({
          tier: 'bundle',
          label: 'Bundle & Save',
          description: `Get ${bundleItems.length} premium systems together at ₹${totalPrice.toLocaleString('en-IN')}.`,
          products: bundleItems,
          badge: `Save ~20%`,
        });
      }
    }
  }

  // If user has no paid products, suggest Starter
  if (!ownedTiers.has('starter') && !ownedTiers.has('pro') && !ownedTiers.has('premium')) {
    const starterProducts = allProducts.filter(
      p => resolveTier(p) === 'starter' && !ownedProducts.find(op => op.id === p.id) && p.isPublished
    );
    if (starterProducts.length > 0) {
      offers.push({
        tier: 'starter',
        label: 'Start with a Blueprint',
        description: 'Pick up a ₹99 starter system — instant download, zero setup.',
        products: starterProducts.slice(0, 3),
        badge: 'Best Value',
      });
    }
  }

  return offers;
}
