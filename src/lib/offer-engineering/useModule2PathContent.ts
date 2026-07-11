import { useMemo } from 'react';
import { useOpportunityMapStore } from '../opportunity-map';
import {
  resolveOfferEngineeringPathContent,
} from './pathContentResolver';
import {
  getEngineeringDataForService,
} from '../../data/offer-engineering/master-data';
import type { ResolvePathContentResult } from './pathContentResolver';
import type { ServiceEngineeringData } from '../../data/offer-engineering/master-data';
import type { ScopeLimits } from '../../types/offer-engineering';

export interface Module2ResolvedContent {
  pathContent: ResolvePathContentResult | null;
  engineeringData: ServiceEngineeringData | undefined;
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
}

export function useModule2ResolvedContent(): Module2ResolvedContent {
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);

  const pathContent = useMemo(() => {
    if (!careerTrackId || !marketId) return null;
    return resolveOfferEngineeringPathContent({
      subTrackId: careerTrackId,
      marketId,
      nicheId: nicheId ?? undefined,
      serviceId,
    });
  }, [careerTrackId, marketId, nicheId, serviceId]);

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  return { pathContent, engineeringData, serviceId, marketId, nicheId };
}

function extractFirstNumber(str: string): number {
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function scopeDefaultsToScopeLimits(
  sd: { deliveryTime: string; revisions: string; feedbackRounds: string; communication: string; responseTime: string },
): ScopeLimits {
  return {
    deliveryTime: sd.deliveryTime,
    revisionCount: extractFirstNumber(sd.revisions),
    includedRounds: extractFirstNumber(sd.feedbackRounds),
    communicationMethod: sd.communication,
    responseTime: sd.responseTime,
  };
}
