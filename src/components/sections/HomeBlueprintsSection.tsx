import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
interface HomeBlueprintsSectionProps {
  loadingProducts: boolean;
  featuredBlueprints: any[];
}

export const HomeBlueprintsSection = ({ loadingProducts, featuredBlueprints }: HomeBlueprintsSectionProps) => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-center border-b border-gray-100 mt-0">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center mb-16 text-center select-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
            FEATURED SYSTEMS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] max-w-4xl mb-6">
            Ready-To-Use Systems<br className="hidden sm:block" /> For Faster Execution
          </h2>
          <p className="text-base md:text-lg text-[#424754] max-w-2xl mx-auto font-medium leading-relaxed">
            Access frameworks, templates, prompts, and implementation guides designed to help you build, launch, and grow faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch max-w-6xl mx-auto text-left">
          {loadingProducts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="group bg-white rounded-[32px] border border-[#c2c6d6]/30 overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden border-b border-[#c2c6d6]/10" />
                <div className="p-8 flex flex-col flex-grow gap-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#eff4ff]">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))
            ) : featuredBlueprints.length > 0 ? (
            featuredBlueprints.map((item) => (
              <Link
                key={item.id}
                to={item.ctaLink}
                className="group bg-white rounded-[32px] border border-[#c2c6d6]/30 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#d1f34d] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden border-b border-[#c2c6d6]/10">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={400}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 border border-[#c2c6d6]/20 text-[9px] font-bold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-extrabold text-[#0b1c30] group-hover:text-black transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#424754] text-xs line-clamp-3 mb-8 flex-grow leading-relaxed font-semibold">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#eff4ff]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d] bg-[#0b1c30] px-2.5 py-1 rounded-full">
                      {item.tier}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0b1c30] group-hover:text-[#d1f34d] transition-colors flex items-center gap-1">
                      OPEN BLUEPRINT <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-[32px] border border-dashed border-[#c2c6d6]/40">
                <p className="text-sm text-[#424754] font-semibold">Blueprints being prepared. Check back soon.</p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};
