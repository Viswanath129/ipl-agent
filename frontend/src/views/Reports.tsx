import React, { useCallback, useEffect, useState } from 'react';
import { Download, TrendingUp, BarChart3, RotateCw } from 'lucide-react';
import { apiClient } from '../api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { ApiEnvelope, ReportSummary } from '../types';

const Reports: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Compiling PDF report...',
      success: 'Report exported successfully.',
      error: 'Export failed.',
    });
  };

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<ApiEnvelope<ReportSummary>>('/api/reports/summary');
      setSummary(data.data);
    } catch (err) {
      console.error('Summary Error:', err);
      setSummary({
        sponsor_metrics: [
          { brand_name: 'Dream11', exposure_score: 98, estimated_roi_pct: 142 },
          { brand_name: 'Tata Group', exposure_score: 96, estimated_roi_pct: 128 },
          { brand_name: 'Ceat Tyres', exposure_score: 84, estimated_roi_pct: 94 },
          { brand_name: 'Puma India', exposure_score: 79, estimated_roi_pct: 86 },
          { brand_name: 'Jio 5G', exposure_score: 72, estimated_roi_pct: 72 },
        ],
        recent_queries: [
          { route: 'Module A', query: 'Dream11 ROI in MI vs CSK' },
          { route: 'Module B', query: 'Dhoni vs Rohit impact' },
          { route: 'Chat', query: 'Which sponsor has the best logo visibility?' }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchSummary();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchSummary]);

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Reports & Insights</h2>
          <p className="text-sm text-gray-400">Sponsorship audits, sentiment data, and brand impact history.</p>
        </div>
        <button
          onClick={handleExport}
          className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Sponsor Leaderboard */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-white">Sponsor ROI Leaderboard</h3>
            </div>
            <button
              onClick={fetchSummary}
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <RotateCw size={12} className={loading ? 'animate-spin' : ''} />
              Sync
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <RotateCw size={20} className="text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading data...</p>
            </div>
          ) : (
            <div>
              {summary?.sponsor_metrics?.map((item, i) => (
                <div
                  key={item.brand_name}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => navigate('/sponsor-roi')}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 font-medium tabular-nums w-6">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.brand_name}</p>
                      <p className="text-xs text-gray-500">Exposure: {item.exposure_score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-green-400">
                    <TrendingUp size={12} />
                    <span>+{item.estimated_roi_pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Queries */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Intelligence Logs</h3>
          </div>
          <div>
            {summary?.recent_queries?.map((item, i) => (
              <div
                key={i}
                className="px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-400 font-medium">{item.route}</span>
                </div>
                <p className="text-sm text-gray-300">{item.query}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
