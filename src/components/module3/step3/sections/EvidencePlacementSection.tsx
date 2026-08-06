import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { useModule3Store } from '../../../../lib/module3/store';
import type { ClaimToAssetMapping } from '../../../../types/module3-step3-authority';
import { cn } from '../../../../lib/utils';
import { DURATION, EASING } from '../../../../lib/motion-presets';

interface Props {
  onContinue: () => void;
}

export const EvidencePlacementSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, proofAssets, step3ClaimToAssetMap, setStep3ClaimToAssetMap } = useModule3Store();

  const claims: ClaimToAssetMapping[] = useMemo(() => {
    if (!authoritySuite?.profileSystem) return [];
    const result: ClaimToAssetMapping[] = [];
    for (const platform of authoritySuite.profileSystem) {
      for (const field of platform.fields) {
        if (!field.value || field.value.trim().length < 10) continue;
        result.push({
          claimId: `${platform.platform}_${field.key}`,
          claimText: field.value,
          claimPlatform: platform.platform,
          claimField: field.key,
          claimLabel: `${platform.title}: ${field.label}`,
          assetIds: [],
        });
      }
    }
    return result;
  }, [authoritySuite]);

  const [localMap, setLocalMap] = useState<ClaimToAssetMapping[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (step3ClaimToAssetMap && step3ClaimToAssetMap.length > 0) {
      setLocalMap(step3ClaimToAssetMap);
    } else {
      setLocalMap(claims);
    }
  }, [step3ClaimToAssetMap, claims]);

  const selectedClaim = localMap.find(c => c.claimId === selectedClaimId) || null;

  const toggleAssetForClaim = (claimId: string, assetId: string) => {
    setLocalMap(prev => prev.map(claim => {
      if (claim.claimId !== claimId) return claim;
      const isSelected = claim.assetIds.includes(assetId);
      return {
        ...claim,
        assetIds: isSelected 
          ? claim.assetIds.filter(id => id !== assetId)
          : [...claim.assetIds, assetId]
      };
    }));
  };

  const claimsWithProof = localMap.filter(c => c.assetIds.length > 0).length;
  const totalClaims = localMap.length;
  const isComplete = totalClaims > 0 && claimsWithProof === totalClaims;

  const handleSave = () => {
    setStep3ClaimToAssetMap(localMap);
    onContinue();
  };

  const getPlatformColor = (platform: string) => {
    if (platform.toLowerCase() === 'linkedin') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (platform.toLowerCase() === 'twitter' || platform.toLowerCase() === 'x') return 'bg-slate-100 text-slate-700 border-slate-200';
    if (platform.toLowerCase() === 'personal_site' || platform.toLowerCase() === 'website') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Section 5 — Evidence Placement</h2>
        <p className="mt-2 text-slate-600">
          Map each profile claim to the proof assets that back it. Every claim your profile makes needs at least one asset behind it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
        {/* Left Column */}
        <div className="w-full lg:w-2/5 flex flex-col border rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-800">Profile Claims</h3>
            <p className="text-sm text-slate-500">Select a claim to assign proof</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {localMap.map(claim => {
              const mappedCount = claim.assetIds.length;
              const isSelected = selectedClaimId === claim.claimId;
              
              return (
                <button
                  key={claim.claimId}
                  onClick={() => setSelectedClaimId(claim.claimId)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200",
                    isSelected ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getPlatformColor(claim.claimPlatform))}>
                      {claim.claimPlatform}
                    </span>
                    {mappedCount === 0 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {mappedCount}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-slate-900 text-sm mb-1">{claim.claimLabel}</div>
                  <div className="text-xs text-slate-500 line-clamp-2">
                    "{claim.claimText.length > 80 ? claim.claimText.substring(0, 80) + '...' : claim.claimText}"
                  </div>
                </button>
              );
            })}
            {localMap.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No claims found in your profile system.
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-3/5 flex flex-col border rounded-xl bg-slate-50 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-slate-800">Proof Library</h3>
            <p className="text-sm text-slate-500">
              {selectedClaim ? 'Select assets that support the chosen claim' : 'Select a claim on the left to map proof assets to it.'}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedClaim ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <LinkIcon className="w-12 h-12 text-slate-300" />
                <p>Select a claim to map evidence</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proofAssets.map(asset => {
                  const isChecked = selectedClaim.assetIds.includes(asset.id);
                  return (
                    <div 
                      key={asset.id}
                      onClick={() => toggleAssetForClaim(selectedClaim.claimId, asset.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-4 bg-white hover:shadow-sm",
                        isChecked ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200 hover:border-indigo-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                        isChecked ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                      )}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{asset.title}</div>
                        {asset.scenario && (
                          <div className="text-xs text-slate-500 mt-1 line-clamp-2">{asset.scenario}</div>
                        )}
                        <div className="mt-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-100 inline-block px-2 py-0.5 rounded border border-slate-200">
                          {asset.assetType}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {proofAssets.length === 0 && (
                  <div className="text-center text-slate-500 text-sm p-4">
                    No proof assets available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-sm font-medium">
          <span className={cn(
            isComplete ? "text-emerald-600" : "text-amber-600"
          )}>
            {claimsWithProof} of {totalClaims} claims have proof
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={!isComplete || totalClaims === 0}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Evidence Map
        </button>
      </div>
    </motion.div>
  );
});
