import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { apiClient } from '../api/client';
import ROIView from '../components/ROIView';
import DebateView from '../components/DebateView';
import type { ApiEnvelope, ChatResult } from '../types';

const suggestions = [
  'Dream11 ROI in MI vs CSK',
  'Dhoni vs Rohit impact',
  'CEAT visibility score',
  'Hardik Pandya vs Surya sentiment',
];

const AskAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChatResult | null>(null);

  const handleChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await apiClient.post<ApiEnvelope<ChatResult>>('/api/chat', { query: finalQuery });
      setResult(data.data);
    } catch (err) {
      console.error('API Error:', err);
      setResult({
        route_taken: 'Mock Intelligence Route',
        message: 'The AI engine is currently in simulation mode. Connect your backend for live data.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Ask the Orchestrator</h2>
        <p className="text-sm text-gray-400">
          Multi-modal AI engine that routes your query to specialized analytics or debate agents.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <form onSubmit={handleChat}>
          <textarea
            className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 resize-none min-h-[120px] transition-colors"
            placeholder="Ask about sponsor ROI, brand visibility, or IPL player/team debates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2 overflow-x-auto">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQuery(s); handleChat(undefined, s); }}
                  className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 w-9 h-9 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <Sparkles size={16} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Route</p>
              <p className="text-sm font-medium text-white">{result.route_taken}</p>
            </div>
          </div>

          {result.module_a_output && <ROIView data={result.module_a_output} />}
          {result.module_b_output && <DebateView data={result.module_b_output} />}

          {result.message && !result.module_a_output && !result.module_b_output && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-sm text-gray-300 leading-relaxed">{result.message}</p>
            </div>
          )}
        </div>
      )}

      {loading && !result && (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Processing query...</p>
        </div>
      )}
    </div>
  );
};

export default AskAI;
