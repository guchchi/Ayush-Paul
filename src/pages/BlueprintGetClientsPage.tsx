import React from 'react';
import { motion } from 'motion/react';
import type { Product } from '../types';
import { BackButton } from '../components/ui/back-button';
import { BlueprintStickyMobileBar } from '../components/sections/BlueprintStickyMobileBar';
import { BlueprintPurchaseSidebar } from '../components/sections/BlueprintPurchaseSidebar';

// Sections (We will create these)
import { HeroSection } from '../components/blueprints/get-clients/HeroSection';
import { HowItWorksSection } from '../components/blueprints/get-clients/HowItWorksSection';
import { WhyThisExistsSection } from '../components/blueprints/get-clients/WhyThisExistsSection';
import { WhyThisWorksSection } from '../components/blueprints/get-clients/WhyThisWorksSection';
import { WhatYouWillBuildSection } from '../components/blueprints/get-clients/WhatYouWillBuildSection';
import { JourneySection } from '../components/blueprints/get-clients/JourneySection';
import { SuccessLooksLikeSection } from '../components/blueprints/get-clients/SuccessLooksLikeSection';
import { ImplementationExpectationsSection } from '../components/blueprints/get-clients/ImplementationExpectationsSection';
import { CostOfInactionSection } from '../components/blueprints/get-clients/CostOfInactionSection';
import { BetaVsPremiumSection } from '../components/blueprints/get-clients/BetaVsPremiumSection';
import { FAQSection } from '../components/blueprints/get-clients/FAQSection';
import { IdentityFooterSection } from '../components/blueprints/get-clients/IdentityFooterSection';

interface Props {
  product: Product;
  isOwned: boolean;
  hasDiscount: boolean;
  isDownloading: boolean;
  isCheckingOut: boolean;
  onFreeDownload: () => void;
  onPremiumUpgrade: () => void;
}

export const BlueprintGetClientsPage: React.FC<Props> = ({
  product,
  isOwned,
  hasDiscount,
  isDownloading,
  isCheckingOut,
  onFreeDownload,
  onPremiumUpgrade,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-20 pb-24 lg:pb-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <div className="mb-10">
          <BackButton to="/blueprints" label="Back to Blueprints" />
        </div>

        {/* Hero — Full Width */}
        <div className="mb-20">
          <HeroSection 
            onPrimaryAction={isOwned ? onFreeDownload : onPremiumUpgrade} 
            isOwned={isOwned}
          />
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left — Main Content (70%) */}
          <div className="flex-1 min-w-0">
            <div className="space-y-16 lg:space-y-20">
              <HowItWorksSection />
              <WhyThisExistsSection />
              <WhyThisWorksSection />
              <WhatYouWillBuildSection />
              <JourneySection />
              <SuccessLooksLikeSection />
              <ImplementationExpectationsSection />
              <CostOfInactionSection />
              <BetaVsPremiumSection />
              <FAQSection />
            </div>
          </div>

          {/* Right — Sticky Sidebar (30%) */}
          <div className="lg:w-[320px] shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <BlueprintPurchaseSidebar
                product={product}
                isOwned={isOwned}
                isCheckingOut={isCheckingOut}
                isDownloading={isDownloading}
                hasDiscount={hasDiscount}
                onPremiumUpgrade={onPremiumUpgrade}
                onFreeDownload={onFreeDownload}
              />
            </div>
          </div>
        </div>
        
        {/* Footer CTA - Full Width */}
        <div className="mt-24">
          <IdentityFooterSection 
            onPrimaryAction={isOwned ? onFreeDownload : onPremiumUpgrade}
            isOwned={isOwned}
          />
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <BlueprintStickyMobileBar
        product={product}
        isOwned={isOwned}
        isCheckingOut={isCheckingOut}
        isDownloading={isDownloading}
        onPremiumUpgrade={onPremiumUpgrade}
        onFreeDownload={onFreeDownload}
      />
    </motion.div>
  );
};
