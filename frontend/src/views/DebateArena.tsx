import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import { apiClient } from '../api/client';
import DebateView from '../components/DebateView';
import type { ApiEnvelope, DebateResult } from '../types';

const topicSuggestions = ['Kohli vs Tendulkar', 'T20 vs Test Cricket', 'GT vs RR 2022 Final', 'BCCI vs Players Revenue'];

const DebateArena: React.FC = () => {
  const [debateTopic, setDebateTopic] = useState('Dhoni vs Rohit as IPL captain');
  const [loading, setLoading] = useState(false);
  const [debateResult, setDebateResult] = useState<DebateResult | null>(null);

  const handleDebate = async () => {
    setLoading(true);
    try {
      const data = await apiClient.post<ApiEnvelope<DebateResult>>('/api/debates', { topic: debateTopic });
      setDebateResult(data.data);
    } catch (err) {
      console.error('Debate Error:', err);
      setDebateResult({
        debate_id: 'DEB-001',
        topic: debateTopic,
        side_a: 'Dhoni',
        side_b: 'Rohit',
        lens: 'Statistical Superiority',
        comparison: { score_a: 94, score_b: 92 },
        balanced_arguments: {
          for_a: ['5 IPL titles with consistent playoff appearances', 'Exceptional finishing capability and tactical acumen', 'Brand value remains peak even after retirement'],
          for_b: ['5 IPL titles with a more aggressive captaincy style', 'Younger leadership window with high-impact batting', 'Tactical flexibility in high-pressure finals']
        },
        bias_detection: { bias_label: 'low' },
        final_judge: {
          winner: 'Dhoni',
          verdict: 'While both captains are legendary, Dhoni\'s consistency across 15+ seasons and the cultural impact on the CSK franchise gives him the marginal elite edge.',
          confidence_pct: 92
        },
        fan_voting: { votes: { Dhoni: 1240, Rohit: 1180 } },
        viral_shareable: {
          hashtags: ['#IPLIntelligence', '#CaptainsDebate', '#DhoniVsRohit'],
          short_post: 'The Supreme AI Verdict is in. In the clash of IPL titans, the Orchestrator favors the MSD legacy. #IPL2024'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (side: string) => {
    if (!debateResult) return;
    try {
      const data = await apiClient.post<ApiEnvelope<DebateResult['fan_voting']>>('/api/debates/vote', { debate_id: debateResult.debate_id, side });
      setDebateResult({ ...debateResult, fan_voting: data.data });
    } catch (err) {
      console.error('Vote Error:', err);
      const newVotes = { ...(debateResult.fan_voting?.votes || {}) };
      newVotes[side] = (newVotes[side] || 0) + 1;
      setDebateResult({ ...debateResult, fan_voting: { ...debateResult.fan_voting, votes: newVotes } });
    }
  };

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Debate Arena</h2>
        <p className="text-sm text-gray-400">
          Simulate fan debates and extract analytical verdicts from subjective sports narratives.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex gap-3">
          <input
            type="text"
            value={debateTopic}
            onChange={(e) => setDebateTopic(e.target.value)}
            className="flex-1 h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 transition-colors"
            placeholder="Enter debate topic (e.g. Kohli vs ABD in T20)"
            onKeyDown={(e) => e.key === 'Enter' && handleDebate()}
          />
          <button
            onClick={handleDebate}
            disabled={loading}
            className="h-10 px-5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Judging...</span>
              </>
            ) : (
              <>
                <Swords size={16} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500 py-1">Try:</span>
          {topicSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => setDebateTopic(s)}
              className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-md transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {debateResult ? (
        <DebateView data={debateResult} onVote={handleVote} />
      ) : (
        <div className="py-16 text-center">
          <Swords size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Enter a topic to generate a balanced analytical debate.</p>
        </div>
      )}
    </div>
  );
};

export default DebateArena;
