import React from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Shield, Star, Briefcase, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

export const AuthoritySnapshotSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authorityPosition,
    coreTrustPromise,
    mod2OfferType,
    mod2UniqueMechanism,
    proofAssets,
    isUpstreamStale,
  } = useModule3Store();

  const acceptedProofCount = proofAssets.filter((a) => a.isAccepted).length;

  const capitalize = (s: string | null) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900">
          Section 1 — Authority Foundation Snapshot
        </h2>
        <p className="text-sm text-neutral-600">
          Before building your profile and portfolio strategy, confirm your authority foundation. This is the upstream context all sections below are built on.
        </p>
      </div>

      {isUpstreamStale && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <h4 className="font-medium text-sm text-amber-800">Upstream changes detected</h4>
            <p className="text-sm text-amber-700/80 mt-1">
              You've made changes in previous steps. Your authority suite might need to be regenerated to reflect the latest context.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm"
        >
          <div className="bg-indigo-950 px-4 py-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-300" />
            <h3 className="text-sm font-medium text-white">Authority Position</h3>
          </div>
          <div className="p-4 flex-1 flex items-center">
            <p className="text-base font-medium text-neutral-900">
              {capitalize(authorityPosition) || 'Not set'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.05 }}
          className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm"
        >
          <div className="bg-indigo-950 px-4 py-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-300" />
            <h3 className="text-sm font-medium text-white">Trust Promise</h3>
          </div>
          <div className="p-4 flex-1 flex items-center">
            <p className="text-sm text-neutral-700 font-medium">
              {coreTrustPromise || 'Not set'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
          className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm md:col-span-2"
        >
          <div className="bg-indigo-950 px-4 py-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-300" />
            <h3 className="text-sm font-medium text-white">Offer Context</h3>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">Offer:</span> {mod2OfferType || 'Not set'}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              <span className="font-semibold text-neutral-900">Mechanism:</span> {mod2UniqueMechanism || 'Not set'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.15 }}
          className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm md:col-span-2"
        >
          <div className="bg-indigo-950 px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-300" />
            <h3 className="text-sm font-medium text-white">Proof Assets</h3>
          </div>
          <div className="p-4 flex-1 flex items-center">
            <p className="text-sm font-medium text-neutral-700">
              {acceptedProofCount} accepted asset{acceptedProofCount !== 1 ? 's' : ''} ready for placement.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200"
        >
          Confirm Foundation & Continue
        </button>
      </div>
    </div>
  );
});

AuthoritySnapshotSection.displayName = 'AuthoritySnapshotSection';
