import React, { useState } from 'react';
import { ContentPostItem } from '../../../../data/module3/authority-suite-engine';
import { Calendar, Copy, Check, Filter, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  posts: ContentPostItem[];
}

export const AuthorityContentEngineSection = React.memo(function AuthorityContentEngineSection({ posts }: Props) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [copiedPostDay, setCopiedPostDay] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredPosts = posts.filter((p) => p.weekNumber === selectedWeek);

  const handleCopyPost = (post: ContentPostItem) => {
    const text = `Title: ${post.title}\nPlatform: ${post.platform} (${post.format})\nAngle: ${post.contentAngle}\n\nHook:\n${post.hook}\n\nBody:\n${post.body}\n\nCTA:\n${post.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedPostDay(post.dayNumber);
    setTimeout(() => setCopiedPostDay(null), 2000);
  };

  const handleCopyAll30 = () => {
    const fullCalendar = posts
      .map(
        (p) =>
          `### Day ${p.dayNumber} [${p.platform} - ${p.format}]\n**Angle:** ${p.contentAngle}\n**Hook:** ${p.hook}\n**Body:**\n${p.body}\n**CTA:** ${p.cta}`
      )
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(fullCalendar);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-amber-400" />
            <h3 className="text-xl font-black tracking-tight">4. 30-Day Authority Content Engine</h3>
          </div>
          <p className="text-xs text-blue-100 font-medium">
            30 pre-structured authority content post blueprints across 4 weeks. Copy ready for LinkedIn & X.
          </p>
        </div>

        <button
          onClick={handleCopyAll30}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shrink-0"
        >
          {copiedAll ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedAll ? '30 Posts Copied!' : 'Copy All 30 Posts'}</span>
        </button>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-neutral-200 shadow-2xs">
        <span className="text-xs font-bold text-neutral-500 pl-2 flex items-center gap-1.5">
          <Filter size={13} /> Select Week:
        </span>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedWeek === w
                  ? 'bg-[#0058be] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              Week {w} (Days {(w - 1) * 7 + 1} - {Math.min(w * 7, 30)})
            </button>
          ))}
        </div>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const isCopied = copiedPostDay === post.dayNumber;
          return (
            <motion.div
              key={post.dayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-3 flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-[10px] font-black uppercase tracking-wider">
                    Day {post.dayNumber} • {post.platform}
                  </span>
                  <span className="text-xs font-bold text-neutral-500">{post.format}</span>
                </div>

                <h4 className="text-sm font-black text-[#0b1c30]">{post.title}</h4>
                <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100/80 inline-block">
                  Angle: {post.contentAngle}
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-neutral-900 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    "{post.hook}"
                  </p>
                  <p className="text-xs text-neutral-700 font-medium whitespace-pre-line leading-relaxed">
                    {post.body}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-[11px] font-bold text-blue-600 truncate max-w-[200px]">CTA: {post.cta}</span>
                <button
                  onClick={() => handleCopyPost(post)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCopied ? 'bg-emerald-500 text-white shadow-xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{isCopied ? 'Copied Post!' : 'Copy Post'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
