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
  Vote,
  Trophy,
  PieChart,
  Shirt,
  Bell,
  Settings,
  CircleUser,
  Activity,
  Download,
  Share2,
  Filter,
  Users,
  ArrowRight,
  Eye,
  Flame,
  GitCompare,
  RotateCw,
  Plus,
  Sparkles,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from './api/client';
import JerseyEngine from './components/JerseyEngine';

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
  const [activeTab, setActiveTab] = useState('3D Jersey');
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



  const handleChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await apiClient.post('/api/chat', { query: finalQuery });
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
      const data = await apiClient.post('/api/sponsors/roi', { brand: selectedBrand, match: matchContext });
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
      const data = await apiClient.post('/api/debates', { topic: debateTopic });
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
      const data = await apiClient.post('/api/debates/vote', { debate_id: debateResult.debate_id, side });
      setDebateResult({ ...debateResult, fan_voting: data.data });
    } catch (err) {
      console.error('Vote Error:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await apiClient.get('/api/reports/summary');
      setSummary(data.data);
    } catch (err) {
      console.error('Summary Error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'Reports') fetchSummary();
  }, [activeTab]);

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Ask AI', icon: <MessageSquare size={20} /> },
    { name: 'Sponsor ROI', icon: <TrendingUp size={20} /> },
    { name: '3D Jerseys', icon: <Shirt size={20} /> },
    { name: 'Debate Arena', icon: <Swords size={20} /> },
    { name: 'Reports', icon: <BarChart3 size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-bg-dark text-white selection:bg-primary/30">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full glass border-r border-white/10 transition-all duration-500 z-50 ${isSidebarOpen ? 'w-[260px]' : 'w-20'} flex flex-col`}>
        <div className="p-8 flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="text-white fill-white" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="clash-font text-2xl tracking-tight leading-none">IPL<br/><span className="text-primary">ENGINE</span></h1>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`sidebar-link w-full group ${activeTab === tab.name ? 'active' : ''}`}
            >
              <span className={`transition-colors duration-300 ${activeTab === tab.name ? 'text-primary' : 'group-hover:text-white'}`}>
                {tab.icon}
              </span>
              {isSidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                  {tab.name}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 transition-all ${!isSidebarOpen && 'items-center p-2'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <CircleUser size={24} className="text-slate-400" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Premium User</p>
                  <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full mt-4 p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center text-slate-500 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'ml-[260px]' : 'ml-20'} relative`}>
        {/* Top Navbar */}
        <header className="h-20 glass border-b border-white/5 sticky top-0 z-40 px-8 flex justify-between items-center">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics, brands, or debate topics..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Activity size={14} className="text-green-500" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Live: CSK vs MI</span>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-[#020617]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <button className="btn-primary py-2 px-6 text-sm">
              <Zap size={14} className="fill-white" /> Upgrade
            </button>
          </div>
        </header>

        <div className="p-8 pb-20 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {activeTab === 'Dashboard' && <DashboardView onLaunch={() => setActiveTab('3D Jerseys')} />}
              {activeTab === '3D Jerseys' && (
                <div className="max-w-7xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-bold mb-2">3D Jersey Intelligence</h2>
                      <p className="text-slate-400">Interactive sponsorship analytics and brand visualization</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-glass"><Download size={18} /> Export</button>
                      <button className="btn-glass"><Share2 size={18} /> Share</button>
                    </div>
                  </div>
                  <JerseyEngine />
                </div>
              )}

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

            {activeTab === 'Reports' && <ReportsView summary={summary} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
  );
};

// --- World-Class View Components ---

const DashboardView: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => (
  <div className="space-y-12">
    {/* Hero Section */}
    <section className="relative min-h-[500px] flex items-center">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 neon-glow"></div>
      <div className="absolute top-40 right-0 w-80 h-80 bg-secondary/10 neon-glow" style={{ animationDelay: '2s' }}></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="hero-title mb-6"
          >
            IPL<br/>INFLUENCE<br/>ENGINE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed"
          >
            Next-generation AI orchestration for real-time sponsor ROI analytics, jersey intelligence, and fan sentiment mapping.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button onClick={onLaunch} className="btn-primary py-4 px-10 text-lg">
              Launch Live Dashboard <ChevronRight size={20} />
            </button>
            <button className="btn-glass py-4 px-10 text-lg">
              Watch Demo
            </button>
          </motion.div>
        </div>
        <div className="hidden lg:block relative perspective-1000">
           <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[48px] border border-white/5 flex items-center justify-center p-12 relative"
           >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none rounded-[48px]"></div>
             <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Shirt size={280} className="text-white/20 drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-bounce-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
                  <div className="w-80 h-80 border border-secondary/10 rounded-full animate-reverse-spin-slow"></div>
                </div>
             </div>
             
             {/* Floating Info Cards */}
             <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-10 left-10 glass p-4 rounded-2xl border border-white/10"
             >
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Live ROI</p>
               <p className="text-2xl font-bold text-green-400">+124.5%</p>
             </motion.div>
             <motion.div 
               animate={{ y: [0, 10, 0] }} 
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute bottom-20 right-10 glass p-4 rounded-2xl border border-white/10"
             >
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Fan Sentiment</p>
               <p className="text-2xl font-bold text-primary">Bullish</p>
             </motion.div>
           </motion.div>
        </div>
      </div>
    </section>

    {/* Stat Cards Grid */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Brand Reach', value: '1.2B+', trend: '+14%', icon: <Users className="text-primary" />, color: 'primary' },
        { label: 'Live Sponsor ROI', value: '₹420 Cr', trend: '+8.2%', icon: <TrendingUp className="text-success" />, color: 'success' },
        { label: 'Fan Sentiment', value: '88/100', trend: '+2.4%', icon: <Activity className="text-secondary" />, color: 'secondary' },
        { label: 'Debate Volume', value: '4.8M', trend: '+22%', icon: <MessageSquare className="text-accent" />, color: 'accent' },
      ].map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="premium-card group relative overflow-hidden"
        >
          <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : stat.color === 'secondary' ? 'secondary' : 'accent'}/10 rounded-full blur-2xl group-hover:bg-${stat.color}/20 transition-all`}></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 transition-all">
              {stat.icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : stat.color === 'secondary' ? 'secondary' : 'accent'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : stat.color === 'secondary' ? 'secondary' : 'accent'}`}>
              {stat.trend}
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
          <h3 className="stat-value">{stat.value}</h3>
        </motion.div>
      ))}
    </section>

    {/* Secondary Grid */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 premium-card">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold">Brand Performance Index</h3>
            <p className="text-slate-500 text-sm">Real-time cross-platform sponsorship impact analysis</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/5 text-xs font-bold border border-white/10">WEEKLY</button>
            <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary text-xs font-bold border border-primary/20">MONTHLY</button>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center border border-white/5 rounded-2xl bg-white/[0.02]">
          <p className="text-slate-600 font-mono text-sm uppercase tracking-[0.2em]">Interactive Intelligence Visualization</p>
        </div>
      </div>
      <div className="lg:col-span-4 premium-card">
        <h3 className="text-2xl font-bold mb-6">Top Sponsors</h3>
        <div className="space-y-4">
          {[
            { name: 'Dream11', value: '98', trend: 'up' },
            { name: 'Tata Group', value: '96', trend: 'up' },
            { name: 'Ceat Tyres', value: '84', trend: 'down' },
            { name: 'Puma India', value: '79', trend: 'up' },
            { name: 'Jio 5G', value: '72', trend: 'down' },
          ].map((brand) => (
            <div key={brand.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-xs uppercase">
                  {brand.name.substring(0, 2)}
                </div>
                <span className="font-bold">{brand.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="mono-font font-bold text-slate-300">{brand.value}</span>
                <div className={`w-2 h-2 rounded-full ${brand.trend === 'up' ? 'bg-success' : 'bg-red-500'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const ReportsView: React.FC<{ summary: any }> = ({ summary }) => (
  <div className="max-w-6xl mx-auto space-y-8">
    <div className="flex justify-between items-end mb-4">
      <div>
        <h2 className="text-4xl font-bold mb-2">Intelligence Reports</h2>
        <p className="text-slate-400">Comprehensive summaries and historical trend analysis</p>
      </div>
      <button className="btn-primary px-8">
        <Download size={18} /> Generate PDF
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {[
         { title: 'Brand ROI Summary', icon: <TrendingUp className="text-primary" />, desc: 'Monthly sponsorship ROI calculations across all teams.' },
         { title: 'Sentiment Analysis', icon: <Activity className="text-secondary" />, desc: 'Fan sentiment mapping from social media & news feeds.' },
         { title: 'Sponsor Heatmap', icon: <Filter className="text-accent" />, desc: 'Geographic distribution of brand impact during matches.' },
       ].map((report, i) => (
         <motion.div 
          key={report.title}
          whileHover={{ y: -10 }}
          className="premium-card cursor-pointer border-white/5 hover:border-primary/20 transition-all"
         >
           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
             {report.icon}
           </div>
           <h3 className="text-xl font-bold mb-2">{report.title}</h3>
           <p className="text-slate-500 text-sm mb-6 leading-relaxed">{report.desc}</p>
           <button className="flex items-center gap-2 text-primary font-bold text-sm group">
             View Report <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
           </button>
         </motion.div>
       ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="premium-card">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy size={18} /> Top Performing Sponsors</h3>
        <div className="space-y-4">
          {(summary?.sponsor_metrics || []).map((item: any, i: number) => (
            <div key={item.brand_name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{i+1}</span>
                <span className="font-bold">{item.brand_name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-success font-bold text-lg">{item.estimated_roi_pct}% ROI</span>
                <span className="text-xs text-slate-500 font-mono">EXPOSURE: {item.exposure_score}</span>
              </div>
            </div>
          ))}
          {(!summary?.sponsor_metrics || summary.sponsor_metrics.length === 0) && (
            <div className="py-12 text-center text-slate-600 font-mono uppercase tracking-widest">
              Awaiting Live Intelligence Stream...
            </div>
          )}
        </div>
      </div>
      <div className="premium-card">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare size={18} /> Recent Intelligence Inquiries</h3>
        <div className="space-y-3">
           {(summary?.recent_queries || []).map((item: any, i: number) => (
             <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.route}</span>
                 <ChevronRight size={14} className="text-slate-600 group-hover:text-primary transition-colors" />
               </div>
               <p className="text-slate-300 text-sm font-medium">{item.query}</p>
             </div>
           ))}
           {(!summary?.recent_queries || summary.recent_queries.length === 0) && (
            <div className="py-12 text-center text-slate-600 font-mono uppercase tracking-widest">
              No recent inquiries logged.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// --- Subcomponents ---

const ROIView: React.FC<{ data: any }> = ({ data }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 neon-glow"></div>
    
    <div className="flex justify-between items-start relative z-10 mb-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-success/10 text-success">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-3xl font-bold">{data.brand_name} Intelligence</h3>
        </div>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">{data.match_scope} • LIVE STREAM: {data.data_status}</p>
      </div>
      <div className="px-4 py-1.5 rounded-full border border-success/30 bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest">
        Sentiment: {data.sponsor_sentiment?.label}
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
      {[
        { label: 'Exposure Score', value: data.exposure_score, icon: <Eye size={16} />, color: 'white' },
        { label: 'Estimated ROI', value: `${data.estimated_roi_pct}%`, icon: <TrendingUp size={16} />, color: 'success' },
        { label: 'Social Mentions', value: data.social_mentions?.total_mentions?.toLocaleString(), icon: <Users size={16} />, color: 'white' },
        { label: 'Meme Impressions', value: data.meme_virality?.estimated_meme_impressions?.toLocaleString(), icon: <Sparkles size={16} />, color: 'white' },
      ].map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
          <div className="flex items-center gap-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-widest">
            {stat.icon} {stat.label}
          </div>
          <div className={`text-3xl font-bold text-${stat.color === 'success' ? 'success' : 'white'}`}>{stat.value}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
        <h4 className="text-xs font-bold mb-4 uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Target size={14} className="text-primary" /> Strategic Brand Recommendations
        </h4>
        <div className="space-y-3">
          {data.brand_recommendations?.map((rec: string, i: number) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i+1}</div>
              <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
          <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-primary flex items-center gap-2">
            <Zap size={14} /> AI Optimization Tip
          </h4>
          <p className="text-sm text-slate-300 italic">"{data.do_not_misrepresent}"</p>
        </div>
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
          <h4 className="text-xs font-bold mb-4 uppercase tracking-widest text-slate-500">Confidence Metric</h4>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-gradient-to-r from-primary to-secondary"></motion.div>
          </div>
          <p className="text-[10px] text-slate-600 mt-2 text-right font-mono">CONFIDENCE: 92.4%</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const DebateView: React.FC<{ data: any, onVote?: (side: string) => void }> = ({ data, onVote }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center px-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Swords size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Arena Simulation</h3>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{data.topic}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lens: {data.lens}</span>
        <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${data.bias_detection?.bias_label === 'low' ? 'border-success/30 text-success' : 'border-red-500/30 text-red-400'}`}>BIAS: {data.bias_detection?.bias_label}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Central VS Badge */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-bg-dark border-4 border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        >
          <span className="clash-font text-xl text-white">VS</span>
        </motion.div>
      </div>

      {[
        { name: data.side_a, score: data.comparison?.score_a, color: 'primary', args: data.balanced_arguments?.for_a },
        { name: data.side_b, score: data.comparison?.score_b, color: 'secondary', args: data.balanced_arguments?.for_b }
      ].map((competitor, i) => (
        <motion.div 
          key={competitor.name}
          initial={{ x: i === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`premium-card p-0 overflow-hidden group border-${competitor.color}/20`}
        >
          <div className={`h-2 w-full bg-${competitor.color}`}></div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h4 className={`text-2xl font-bold text-${competitor.color}`}>{competitor.name}</h4>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Power Score</p>
                <p className="text-3xl font-bold mono-font">{competitor.score}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-10">
              {competitor.args?.map((arg: string, idx: number) => (
                <div key={idx} className="flex gap-3 text-sm text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                  <ChevronRight size={16} className={`text-${competitor.color} flex-shrink-0 mt-0.5`} />
                  {arg}
                </div>
              ))}
            </div>

            <button 
              onClick={() => onVote?.(competitor.name)}
              className={`w-full py-4 rounded-2xl border border-${competitor.color}/30 bg-${competitor.color}/5 hover:bg-${competitor.color}/10 transition-all flex items-center justify-center gap-3 font-bold group`}
            >
              <Vote size={18} className="transition-transform group-hover:rotate-12" /> 
              VOTE FOR {competitor.name.split(' ')[0].toUpperCase()}
              <span className="ml-2 px-2 py-0.5 rounded-lg bg-white/5 text-[10px]">{data.fan_voting?.votes?.[competitor.name] || 0}</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Judicial Verdict */}
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="premium-card border-amber-500/20 bg-amber-500/5 relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[100px]"></div>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
          <Trophy size={20} />
        </div>
        <h4 className="text-xl font-bold">Judicial Verdict</h4>
      </div>
      <p className="text-2xl font-medium text-slate-200 italic leading-relaxed mb-8">
        "{data.final_judge?.verdict}"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">AI Winner</p>
          <p className="font-bold text-amber-500">{data.final_judge?.winner}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Confidence</p>
          <p className="font-bold">{data.final_judge?.confidence_pct}%</p>
        </div>
        <div className="md:col-span-2 text-right flex flex-col justify-end">
           <div className="flex gap-2 justify-end">
              {data.viral_shareable?.hashtags?.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold text-primary">{tag}</span>
              ))}
           </div>
        </div>
      </div>
    </motion.div>

    {/* Viral Share Engine */}
    <div className="premium-card bg-white/[0.02] border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Share2 size={14} /> Viral Content Generator
        </h4>
        <button className="text-xs font-bold text-primary hover:underline">Copy Post</button>
      </div>
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 text-sm leading-relaxed italic">
        {data.viral_shareable?.short_post}
      </div>
    </div>
  </div>
);

export default App;
