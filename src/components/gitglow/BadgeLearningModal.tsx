import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { GitHubBadge } from '../../data/gitglow/github-badges';
import { BadgePedagogy } from '../../data/gitglow/badge-curriculum';
import { BadgeCurriculumView } from '../../pages/blueprints/gitglow/BadgeCurriculumView';

interface BadgeLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBadge: GitHubBadge;
  pedagogy?: BadgePedagogy;
  onGoToExecution: () => void;
}

export const BadgeLearningModal: React.FC<BadgeLearningModalProps> = ({
  isOpen,
  onClose,
  activeBadge,
  pedagogy,
  onGoToExecution,
}) => {
  if (!isOpen) return null;

  const handleOpenStandaloneTab = () => {
    window.open(`/blueprints/gitglow/learn?badge=${activeBadge.id}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-[32px] bg-white border border-[#E5E3DA] shadow-2xl flex flex-col overflow-hidden text-left"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-[#ECEAE1] bg-white/90 backdrop-blur-sm flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] p-1.5 flex items-center justify-center shrink-0">
                <img
                  src={activeBadge.image}
                  alt={activeBadge.name}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-[#101114]">
                    {activeBadge.name}: Deep Learning & Concepts
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E] text-[10px] font-bold">
                    Chapter Curriculum
                  </span>
                </div>
                <p className="text-[11px] text-[#65666A]">
                  Industry Context, Engineering Concepts, Interactive Architecture & Knowledge Quiz
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenStandaloneTab}
                title="Open in a dedicated new browser tab / window"
                className="h-8 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Popout Tab</span>
                <ExternalLink size={12} />
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#65666A] hover:text-[#101114] transition-colors cursor-pointer"
                title="Close learning window"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Reader Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {pedagogy ? (
              <BadgeCurriculumView
                pedagogy={pedagogy}
                onGoToExecution={() => {
                  onClose();
                  onGoToExecution();
                }}
              />
            ) : (
              <div className="p-12 text-center text-xs text-[#65666A] space-y-3">
                <BookOpen size={28} className="mx-auto text-slate-400" />
                <p>Curriculum guide for {activeBadge.name} is being prepared.</p>
              </div>
            )}
          </div>

          {/* Sticky Reader Footer */}
          <div className="px-6 py-3.5 border-t border-[#ECEAE1] bg-[#FAF9F5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-[#65666A]">
              <Sparkles size={14} className="text-[#84CC16]" />
              <span>Finished reading? Head straight into the 1-click execution sandbox.</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onGoToExecution();
              }}
              className="h-9 px-5 rounded-full bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span>Start 1-Click Sandbox</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

