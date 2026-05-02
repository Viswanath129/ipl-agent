import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Swords, 
  Search, 
  LayoutDashboard,
  Menu,
  X,
  Send,
  Zap,
  ChevronRight,
  Download,
  Vote,
  Trophy,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface DashboardData {
  route_taken?: string;
  module_a_output?: any;
  module_b_output?: any;
  message?: string;
}

interface SummaryData {
  sponsor_metrics: any[];
  recent_queries: any[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Ask AI');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DashboardData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sponsor ROI State
  const [selectedBrand, setSelectedBrand] = useState('Dream11');
  const [matchContext, setMatchContext] = useState('MI vs CSK');
  const [roiResult, setRoiResult] = useState<any>(null);

  // Debate State
  const [debateTopic, setDebateTopic] = useState('Dhoni vs Rohit as IPL captain');
  const [debateResult, setDebateResult] = useState<any>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery }),
      });
      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorROI = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sponsors/roi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: selectedBrand, match: matchContext }),
      });
      const data = await res.json();
      setRoiResult(data.data);
    } catch (err) {
      console.error('ROI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDebate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/debates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: debateTopic }),
      });
      const data = await res.json();
      setDebateResult(data.data);
    } catch (err) {
      console.error('Debate Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (side: string) => {
    if (!debateResult) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/debates/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debate_id: debateResult.debate_id, side }),
      });
      const data = await res.json();
      setDebateResult({ ...debateResult, fan_voting: data.data });
    } catch (err) {
      console.error('Vote Error:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/summary`);
      const data = await res.json();
      setSummary(data.data);
    } catch (err) {
      console.error('Summary Error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'Reports') fetchSummary();
  }, [activeTab]);

  const tabs = [
    { name: 'Ask AI', icon: <MessageSquare size={20} /> },
    { name: 'Sponsor ROI', icon: <TrendingUp size={20} /> },
    { name: 'Debate Arena', icon: <Swords size={20} /> },
    { name: 'Reports', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100">
      {/* Sidebar */}
      <aside className={`glass border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} p-4 flex flex-col`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-xl">
            <Zap className="text-white" size={24} />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">IPL Influence</h1>}
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`nav-link w-full ${activeTab === tab.name ? 'active' : ''}`}
            >
              {tab.icon}
              {isSidebarOpen && <span>{tab.name}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="nav-link justify-center mt-auto"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">{activeTab}</h2>
            <p className="text-slate-400 mt-1">IPL Sponsor Intelligence & Debate Platform</p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'Ask AI' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="premium-card">
                  <form onSubmit={handleChat} className="relative">
                    <textarea
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 pr-16 focus:border-primary outline-none text-lg resize-none min-h-[120px]"
                      placeholder="Ask about sponsor ROI, brand visibility, or IPL player/team debates..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className="absolute bottom-4 right-4 btn-primary p-3 rounded-full"
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={20} />}
                    </button>
                  </form>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {['Dream11 ROI in MI vs CSK', 'Dhoni vs Rohit impact', 'CEAT visibility score'].map(t => (
                      <button key={t} onClick={() => { setQuery(t); handleChat(undefined, t); }} className="text-xs glass px-3 py-1.5 whitespace-nowrap hover:bg-white/10">{t}</button>
                    ))}
                  </div>
                </div>

                {result && (
                  <div className="space-y-6 animate-fade">
                    <div className="glass p-4 border-l-4 border-primary bg-primary/5 flex items-center justify-between">
                      <span className="font-semibold text-primary">Intelligence Route: {result.route_taken}</span>
                      <ChevronRight size={16} />
                    </div>
                    
                    {result.module_a_output && <ROIView data={result.module_a_output} />}
                    {result.module_b_output && <DebateView data={result.module_b_output} onVote={handleVote} />}
                    {result.message && (
                      <div className="premium-card bg-blue-500/5 border-blue-500/20">
                        <p className="text-blue-300">{result.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Sponsor ROI' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="premium-card grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm text-slate-400">Target Brand</label>
                     <select 
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-primary"
                     >
                        <option>Dream11</option>
                        <option>CEAT</option>
                        <option>Puma</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-slate-400">Match Context</label>
                     <input 
                      type="text" 
                      value={matchContext}
                      onChange={(e) => setMatchContext(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-primary" 
                      placeholder="e.g. MI vs CSK" 
                     />
                   </div>
                   <button 
                    onClick={handleSponsorROI}
                    disabled={loading}
                    className="md:col-span-2 btn-primary justify-center mt-2"
                   >
                     {loading ? 'Calculating...' : 'Calculate Sponsor Intelligence'}
                   </button>
                </div>
                
                {roiResult && <ROIView data={roiResult} />}
              </div>
            )}

            {activeTab === 'Debate Arena' && (
               <div className="max-w-4xl mx-auto space-y-6">
                  <div className="premium-card">
                    <h3 className="text-xl font-bold mb-4">Initialize Debate Simulator</h3>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={debateTopic}
                        onChange={(e) => setDebateTopic(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:border-primary"
                        placeholder="Enter debate topic (e.g. Kohli vs ABD in T20)"
                      />
                      <button onClick={handleDebate} disabled={loading} className="btn-primary">
                        {loading ? 'Judging...' : 'Generate'}
                      </button>
                    </div>
                  </div>
                  
                  {debateResult && <DebateView data={debateResult} onVote={handleVote} />}
               </div>
            )}

            {activeTab === 'Reports' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LayoutDashboard size={18} /> Top Performing Sponsors</h3>
                    <div className="space-y-4">
                      {(summary?.sponsor_metrics || []).map((item: any, i: number) => (
                        <div key={item.brand_name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{i+1}</span>
                            <span className="font-medium">{item.brand_name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-green-400 font-bold">{item.estimated_roi_pct}% ROI</span>
                            <span className="text-xs text-slate-500">Score: {item.exposure_score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} /> Recent AI Inquiries</h3>
                    <div className="space-y-2">
                       {(summary?.recent_queries || []).map((item: any, i: number) => (
                         <div key={i} className="text-sm p-2 border-b border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors">
                           <span className="text-primary mr-2">[{item.route}]</span>
                           {item.query}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Subcomponents ---

const ROIView: React.FC<{ data: any }> = ({ data }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card border-green-500/20 bg-green-500/5">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2"><TrendingUp size={20} /> {data.brand_name} ROI Intel</h3>
        <p className="text-xs text-slate-500 mt-1">Scope: {data.match_scope} • {data.data_status}</p>
      </div>
      <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {data.sponsor_sentiment?.label}
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="text-2xl font-bold text-white">{data.exposure_score}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Exposure</div>
      </div>
      <div className="text-center p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="text-2xl font-bold text-green-400">{data.estimated_roi_pct}%</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Est. ROI</div>
      </div>
      <div className="text-center p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="text-2xl font-bold text-white">{data.social_mentions?.total_mentions?.toLocaleString()}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Mentions</div>
      </div>
      <div className="text-center p-3 bg-black/40 rounded-xl border border-white/5">
        <div className="text-2xl font-bold text-white">{data.meme_virality?.estimated_meme_impressions?.toLocaleString()}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Meme Imp.</div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-black/30 p-4 rounded-xl border border-white/5">
        <h4 className="text-xs font-bold mb-3 uppercase text-slate-500 flex items-center gap-2"><PieChart size={14} /> Strategic Insights</h4>
        <ul className="space-y-2">
          {data.brand_recommendations?.map((rec: string, i: number) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2">
              <ChevronRight size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-slate-400 italic">
        <Zap size={14} className="text-amber-400" />
        {data.do_not_misrepresent}
      </div>
    </div>
  </motion.div>
);

const DebateView: React.FC<{ data: any, onVote?: (side: string) => void }> = ({ data, onVote }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card border-amber-500/20 bg-amber-500/5">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2"><Swords size={20} /> AI Debate Synthesis</h3>
        <p className="text-xs text-slate-500 mt-1">Topic: {data.topic} • Lens: {data.lens}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        data.bias_detection?.bias_label === 'low' ? 'bg-green-500/20 text-green-400' : 
        data.bias_detection?.bias_label === 'moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
      }`}>
        Bias: {data.bias_detection?.bias_label}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="premium-card bg-blue-500/5 border-blue-500/20">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-blue-400 flex items-center gap-2"><Trophy size={16} /> {data.side_a}</h4>
          <span className="text-xs font-mono bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">Score: {data.comparison?.score_a}</span>
        </div>
        <ul className="space-y-3">
          {data.balanced_arguments?.for_a?.map((s: string, i: number) => (
            <li key={i} className="text-sm flex gap-2 text-slate-300"><ChevronRight className="text-blue-500 flex-shrink-0 mt-1" size={14} /> {s}</li>
          ))}
        </ul>
        <button 
          onClick={() => onVote?.(data.side_a)}
          className="mt-6 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border border-blue-500/30"
        >
          <Vote size={16} /> Vote for {data.side_a} ({data.fan_voting?.votes?.[data.side_a] || 0})
        </button>
      </div>
      
      <div className="premium-card bg-red-500/5 border-red-500/20">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-red-400 flex items-center gap-2"><Trophy size={16} /> {data.side_b}</h4>
          <span className="text-xs font-mono bg-red-500/20 px-2 py-0.5 rounded text-red-300">Score: {data.comparison?.score_b}</span>
        </div>
        <ul className="space-y-3">
          {data.balanced_arguments?.for_b?.map((s: string, i: number) => (
            <li key={i} className="text-sm flex gap-2 text-slate-300"><ChevronRight className="text-red-500 flex-shrink-0 mt-1" size={14} /> {s}</li>
          ))}
        </ul>
        <button 
          onClick={() => onVote?.(data.side_b)}
          className="mt-6 w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30"
        >
          <Vote size={16} /> Vote for {data.side_b} ({data.fan_voting?.votes?.[data.side_b] || 0})
        </button>
      </div>
    </div>

    <div className="bg-amber-400/10 p-5 rounded-xl border border-amber-400/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10"><Zap size={48} className="text-amber-400" /></div>
      <h4 className="text-xs font-bold mb-2 uppercase text-amber-500 flex items-center gap-2"><Search size={14} /> Judicial Verdict</h4>
      <p className="italic text-lg text-slate-200 leading-relaxed font-medium">"{data.final_judge?.verdict}"</p>
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <div className="text-sm text-amber-200/80">Winner Edge: <span className="text-white font-bold">{data.final_judge?.winner}</span></div>
        <div className="text-sm text-amber-200/80">Confidence: <span className="text-white font-bold">{data.final_judge?.confidence_pct}%</span></div>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
      <h4 className="text-xs font-bold mb-3 uppercase text-slate-500 flex items-center gap-2"><Send size={14} /> Viral Post Engine</h4>
      <p className="text-sm text-slate-300 mb-3">{data.viral_shareable?.short_post}</p>
      <div className="flex gap-2">
        {data.viral_shareable?.hashtags?.map((tag: string) => (
          <span key={tag} className="text-xs text-primary font-bold">{tag}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default App;
