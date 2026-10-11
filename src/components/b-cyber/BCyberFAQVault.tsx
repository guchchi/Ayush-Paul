import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { OFFICIAL_FAQS, OfficialFAQ } from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

export const BCyberFAQVault: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Record<number, boolean>>({
    23: true, // Default expand FAQ 23 (crucial pivot)
    12: true, // Default expand FAQ 12 (branch change)
  });

  const toggleFaq = (id: number) => {
    setExpandedFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = [
    { id: 'all', label: 'All FAQs', count: OFFICIAL_FAQS.length },
    {
      id: 'admissions',
      label: 'Admissions & Tests',
      count: OFFICIAL_FAQS.filter((f) => f.category === 'admissions').length,
    },
    {
      id: 'curriculum',
      label: 'Curriculum & Labs',
      count: OFFICIAL_FAQS.filter((f) => f.category === 'curriculum').length,
    },
    {
      id: 'eligibility_rules',
      label: 'Eligibility & Rules',
      count: OFFICIAL_FAQS.filter((f) => f.category === 'eligibility_rules').length,
    },
    {
      id: 'internship_careers',
      label: 'Careers & Internship',
      count: OFFICIAL_FAQS.filter((f) => f.category === 'internship_careers').length,
    },
  ];

  const filteredFaqs = OFFICIAL_FAQS.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.id.toString().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Verbatim Senate &amp; Institute Records</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            All 26 Official FAQs Indexed
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Official Verbatim FAQ Knowledge Vault (FAQs 1 to 26)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Direct word-for-word citations from the official IIT Kanpur WSAIS portal. Search by keywords like &ldquo;JEE&rdquo;, &ldquo;exit options&rdquo;, &ldquo;stipend&rdquo;, &ldquo;branch change&rdquo;, or &ldquo;NIOS&rdquo;.
        </p>

        {/* Live Search & Filter Row */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search all 26 FAQs by topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 transition-colors shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="p-5 sm:p-8 divide-y divide-slate-100">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No matching FAQs found for &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-slate-500">Try a different search term like &ldquo;entrance&rdquo;, &ldquo;credits&rdquo;, or &ldquo;age&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs font-semibold text-slate-900 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = !!expandedFaqIds[faq.id];

            return (
              <div key={faq.id} className="py-3.5 space-y-2">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5',
                        faq.id === 23
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : faq.id === 12
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      FAQ {faq.id}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="shrink-0 p-1 rounded-md text-slate-400 group-hover:text-slate-900 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="pl-8 sm:pl-9 pr-2 space-y-2.5 pt-1">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/80 space-y-2">
                      <p className="text-xs text-slate-800 leading-relaxed font-sans">
                        {faq.answer}
                      </p>

                      {faq.highlights && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {faq.highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-medium"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>WSAIS Section: #{faq.anchor}</span>
                        <a
                          href={`${faq.sourceUrl}#${faq.anchor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:underline"
                        >
                          <span>Verify Official Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
