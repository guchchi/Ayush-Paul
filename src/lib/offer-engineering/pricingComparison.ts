/**
 * Structured Pricing Comparison & Feature Matrix Generator
 * Builds side-by-side comparison tables for Tiered and Value-Based pricing models.
 */

import type { TieredPricing } from '../../types/offer-engineering';

export interface TierComparisonRow {
  feature: string;
  starter: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
}

export interface TierMatrix {
  starterTitle: string;
  starterPrice: number | null;
  proTitle: string;
  proPrice: number | null;
  premiumTitle: string;
  premiumPrice: number | null;
  rows: TierComparisonRow[];
}

export function generateTierComparisonMatrix(
  tieredPricing: TieredPricing,
  serviceDeliverables: string[] = []
): TierMatrix {
  const defaultDeliverables = serviceDeliverables.length > 0
    ? serviceDeliverables
    : ['Core Architecture Setup', 'System Implementation', 'Deployment & Handoff'];

  const rows: TierComparisonRow[] = [
    {
      feature: defaultDeliverables[0] || 'Core Architecture Setup',
      starter: 'Foundational',
      pro: 'Full Standard',
      premium: 'Custom Advanced',
    },
    {
      feature: defaultDeliverables[1] || 'System Implementation',
      starter: 'Core Scope',
      pro: 'Extended Scope',
      premium: 'Enterprise Scope',
    },
    {
      feature: defaultDeliverables[2] || 'Post-Launch Optimization',
      starter: false,
      pro: '14 Days Support',
      premium: '30 Days Dedicated Support',
    },
    {
      feature: 'Revision Turnaround',
      starter: '48 Hours',
      pro: '24 Hours',
      premium: 'Priority Same-Day',
    },
    {
      feature: 'Dedicated Slack / Sync Channel',
      starter: false,
      pro: true,
      premium: true,
    },
  ];

  return {
    starterTitle: 'Starter Sprint',
    starterPrice: tieredPricing.starterPrice,
    proTitle: 'Professional Growth',
    proPrice: tieredPricing.proPrice,
    premiumTitle: 'Enterprise Partner',
    premiumPrice: tieredPricing.premiumPrice,
    rows,
  };
}
