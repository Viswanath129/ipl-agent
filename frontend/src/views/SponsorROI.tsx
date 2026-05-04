import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { apiClient } from '../api/client';
import ROIView from '../components/ROIView';
import type { ApiEnvelope, RoiResult } from '../types';

const brands = ['Dream11', 'Tata Group', 'Ceat Tyres', 'Puma India', 'Jio 5G', 'BKT Tyres'];

const SponsorROI: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('Dream11');
  const [matchContext, setMatchContext] = useState('MI vs CSK');
  const [loading, setLoading] = useState(false);
  const [roiResult, setRoiResult] = useState<RoiResult | null>(null);

  const handleSponsorROI = async () => {
    setLoading(true);
    try {
      const data = await apiClient.post<ApiEnvelope<RoiResult>>('/api/sponsors/roi', { brand: selectedBrand, match: matchContext });
      setRoiResult(data.data);
    } catch (err) {
      console.error('ROI Error:', err);
      setRoiResult({
        brand_name: selectedBrand,
        match_scope: matchContext,
        data_status: 'SIMULATED',
        exposure_score: 88.5,
        estimated_roi_pct: 124.2,
        sponsor_sentiment: { label: 'very positive' },
        social_mentions: { total_mentions: 45000 },
        meme_virality: { estimated_meme_impressions: 1200000 },
        brand_recommendations: [
          'Increase logo size on non-striker end perimeter boards',
          'Deploy real-time AR overlays during strategic timeouts',
          'Launch influencer-led "Dream XI of the Match" campaign'
        ],
        do_not_misrepresent: 'Focus on high-engagement segments during the second innings surge.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Sponsor Intelligence</h2>
        <p className="text-sm text-gray-400">
          Quantify brand impact with high-fidelity ROI modeling and spatial recall analysis.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Target Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
            >
              {brands.map(b => (
                <option key={b} className="bg-[#0f172a]">{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Match Context</label>
            <input
              type="text"
              value={matchContext}
              onChange={(e) => setMatchContext(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g. MI vs CSK"
            />
          </div>
          <button
            onClick={handleSponsorROI}
            disabled={loading}
            className="h-10 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                <span>Audit ROI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {roiResult ? (
        <ROIView data={roiResult} />
      ) : (
        <div className="py-16 text-center">
          <TrendingUp size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Select a brand and match context to generate an ROI audit.</p>
        </div>
      )}
    </div>
  );
};

export default SponsorROI;
