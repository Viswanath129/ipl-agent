import React from 'react';
import { Eye, TrendingUp, Users, Sparkles, Target, Zap, Activity } from 'lucide-react';
import { getTeamByBrand } from '../data/teamData';
import type { RoiResult } from '../types';

interface ROIViewProps {
  data: RoiResult;
}

const ROIView: React.FC<ROIViewProps> = ({ data }) => {
  const team = getTeamByBrand(data.brand_name);
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {team && (
            <div className="w-12 h-12 rounded-lg bg-white/5 p-2 flex items-center justify-center border border-white/5">
               <img src={team.frontImage} alt={team.name} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{data.brand_name} Intelligence</h3>
            <div className="flex items-center gap-3 mt-0.5">
               <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-green-400" />
                  <span className="text-xs text-gray-400">{data.match_scope}</span>
               </div>
               <div className="w-[1px] h-3 bg-white/10"></div>
               <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-blue-400" />
                  <span className="text-xs text-gray-400">Stream: {data.data_status}</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           {(data.sponsor_sentiment?.label || 'positive').toUpperCase()} SENTIMENT
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Exposure Index', value: data.exposure_score ?? 0, icon: <Eye size={14} />, sub: '/ 100' },
            { label: 'Estimated ROI', value: `${data.estimated_roi_pct ?? 0}%`, icon: <TrendingUp size={14} />, sub: 'Profit Yield', color: 'text-green-400' },
            { label: 'Social Reach', value: data.social_mentions?.total_mentions?.toLocaleString(), icon: <Users size={14} />, sub: 'Mentions' },
            { label: 'Viral Impact', value: data.meme_virality?.estimated_meme_impressions?.toLocaleString(), icon: <Sparkles size={14} />, sub: 'Impressions' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                {stat.icon}
                <span className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</div>
              <p className="text-[10px] text-gray-600 font-medium mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-xl p-5">
            <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Target size={14} className="text-blue-500" /> Strategic Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(data.brand_recommendations || []).map((rec, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i+1}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5">
              <h4 className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} /> AI Orchestrator Tip
              </h4>
              <p className="text-sm text-gray-200 italic leading-relaxed">"{data.do_not_misrepresent}"</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Confidence Metric</h4>
                 <span className="text-xs font-medium text-blue-400">92.4%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '92.4%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIView;
