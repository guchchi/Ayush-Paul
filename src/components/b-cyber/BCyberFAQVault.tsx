import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  Minus,
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
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Sticky Intro, Search & Categories */}
        <div className="lg:col-span-5 text-left lg:sticky lg:top-36 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-4">
              FAQ VAULT
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] mb-4">
              Questions Worth Asking About B.Cyber
            </h2>
            <p className="text-[#424754] text-sm leading-relaxed font-medium">
              Verbatim word-for-word citations from official IIT Kanpur Senate resolutions and WSAIS FAQs 1 to 26.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keyword ('JEE', 'exit options', 'stipend', 'NIOS')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c2c6d6]/40 bg-white text-xs text-[#0b1c30] placeholder:text-[#424754]/60 focus:outline-none focus:ring-2 focus:ring-[#0b1c30] transition-all shadow-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Categories ({categories.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                    selectedCategory === cat.id
                      ? 'bg-[#0b1c30] text-white shadow-sm'
                      : 'bg-white border border-[#c2c6d6]/40 text-[#424754] hover:text-[#0b1c30] hover:border-[#0b1c30]/40'
                  )}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Accordion Cards */}
        <div className="lg:col-span-7 space-y-3.5 w-full">
          {filteredFaqs.length === 0 ? (
            <div className="py-16 text-center space-y-2 rounded-2xl border border-dashed border-[#c2c6d6]/40 bg-white p-8">
              <p className="text-sm font-bold text-[#0b1c30]">No matching FAQs found for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-[#424754]">Try searching for &ldquo;entrance&rdquo;, &ldquo;credits&rdquo;, or &ldquo;age&rdquo;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-bold text-[#0b1c30] underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!expandedFaqIds[faq.id];

              return (
                <div
                  key={faq.id}
                  className={cn(
                    'bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm text-left',
                    isOpen ? 'border-[#0b1c30]' : 'border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider',
                          faq.id === 23
                            ? 'bg-[#d1f34d] text-[#0b1c30]'
                            : faq.id === 12
                            ? 'bg-rose-100 text-rose-900 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        FAQ {faq.id}
                      </span>
                      <span className="text-sm font-extrabold tracking-tight leading-snug text-[#0b1c30]">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border',
                        isOpen
                          ? 'bg-[#f0fbe8] border-[#d1f34d] text-[#0b1c30]'
                          : 'bg-slate-50 border-[#c2c6d6]/30 text-[#424754]/60 group-hover:border-[#0b1c30]/20 group-hover:text-[#0b1c30]'
                      )}
                    >
                      {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 space-y-3 border-t border-slate-100">
                      <p className="text-xs text-[#424754] font-medium leading-relaxed font-sans pt-2">
                        {faq.answer}
                      </p>

                      {faq.highlights && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {faq.highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0b1c30] border border-slate-200/60"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>WSAIS Section: #{faq.anchor}</span>
                        <a
                          href={`${faq.sourceUrl}#${faq.anchor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0b1c30] hover:underline font-semibold"
                        >
                          <span>Verify Official Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


