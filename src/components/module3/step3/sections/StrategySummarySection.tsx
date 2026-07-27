import React from 'react';
import { StrategySummary } from '../../../../types/module3';
import { Target, Users, Layout, PenTool, Hash, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  summary: StrategySummary;
}

export const StrategySummarySection = React.memo(function StrategySummarySection({ summary }: Props) {
  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center">
        <Target className="w-5 h-5 mr-2 text-indigo-600" />
        Strategy Executive Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Primary Platform</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.primaryPlatform}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Primary Goal</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.primaryGoal}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Target Client</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.targetClient}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-2 mb-2">
            <Layout className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Portfolio Style</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.portfolioStyle}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-2">
            <PenTool className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Content Strategy</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.contentStrategy}</p>
        </div>
      </div>

      {summary.biggestOpportunity && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Biggest Opportunity</h4>
          </div>
          <p className="text-sm font-medium text-neutral-900">{summary.biggestOpportunity}</p>
        </div>
      )}

      {summary.confidenceScore && (
        <div className="mt-6 pt-6 border-t border-indigo-100/50">
          <h4 className="text-sm font-semibold text-neutral-900 flex items-center mb-4">
            Authority Blueprint Score: 
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              summary.confidenceScore.level === 'Strong' ? 'bg-green-100 text-green-700' :
              summary.confidenceScore.level === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {summary.confidenceScore.score} / 100 - {summary.confidenceScore.level} Foundation
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.confidenceScore.factors.map((factor, idx) => (
              <div key={idx} className="flex items-start bg-white/50 p-3 rounded-lg border border-neutral-100">
                {factor.isMet ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 shrink-0" />
                )}
                <div>
                  <h5 className="text-xs font-semibold text-neutral-900">{factor.label}</h5>
                  <p className="text-xs text-neutral-600 mt-0.5">{factor.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
