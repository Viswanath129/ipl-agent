import React from 'react';
import { Swords, Vote, Trophy, Share2 } from 'lucide-react';
import type { DebateResult } from '../types';

interface DebateViewProps {
  data: DebateResult;
  onVote?: (side: string) => void;
}

const DebateView: React.FC<DebateViewProps> = ({ data, onVote }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Swords size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Arena Simulation</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{data.topic}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
             <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Analytical Lens</p>
             <span className="px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-[10px] font-semibold text-gray-300">{data.lens}</span>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Bias Threshold</p>
             <span className={`px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${data.bias_detection?.bias_label === 'low' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}>{data.bias_detection?.bias_label?.toUpperCase() || 'LOW'} DETECTED</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { name: data.side_a, score: data.comparison?.score_a, side: 'left', args: data.balanced_arguments?.for_a },
          { name: data.side_b, score: data.comparison?.score_b, side: 'right', args: data.balanced_arguments?.for_b }
        ].map((competitor, i) => (
          <div key={competitor.name} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className={`h-1 w-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-500'}`} />
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">CONTENDER {i+1}</p>
                  <h4 className="text-xl font-bold text-white">{competitor.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">Power Score</p>
                  <p className="text-3xl font-bold text-white tabular-nums leading-none">{competitor.score}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                {(competitor.args || []).map((arg, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-gray-400 leading-relaxed group hover:text-gray-200 transition-colors">
                    <div className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-500'} mt-1.5 flex-shrink-0`} />
                    {arg}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onVote?.(competitor.name)}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-3 text-xs font-semibold"
              >
                <Vote size={14} /> 
                CAST VOTE
                <span className="ml-2 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono">{data.fan_voting?.votes?.[competitor.name] || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6">
            <Trophy size={24} />
          </div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-4">Supreme AI Verdict</p>
          <h2 className="text-2xl font-bold text-white leading-tight mb-8 max-w-2xl">
            "{data.final_judge?.verdict}"
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8 border-t border-white/10">
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">AI Winner</p>
              <p className="text-lg font-bold text-blue-400">{data.final_judge?.winner}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">Confidence</p>
              <p className="text-lg font-bold text-white tabular-nums">{data.final_judge?.confidence_pct}%</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">Viral Assets</p>
              <div className="flex gap-1.5 justify-center">
                {(data.viral_shareable?.hashtags || []).slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-semibold text-blue-400">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Viral Assets */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Share2 size={14} /> Generated Viral Asset
          </h4>
          <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Copy to Clipboard</button>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-300 italic leading-relaxed">
          {data.viral_shareable?.short_post}
        </div>
      </div>
    </div>
  );
};

export default DebateView;
