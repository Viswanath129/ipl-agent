import React, { useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, Flame, Swords, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import ROIChart from '../components/ROIChart';
import { teams } from '../data/teamData';
import type { SponsorZone } from '../data/teamData';

const kpiData = [
  { label: 'Live Sponsor ROI', value: '₹420.5 Cr', change: '+8.2% today', changeType: 'up' as const },
  { label: 'Camera Recall Lift', value: '31.4%', change: '+6.8% vs baseline', changeType: 'up' as const },
  { label: 'Debate Velocity', value: '42', change: '+6 live threads', changeType: 'up' as const },
  { label: 'Brand Impact Reach', value: '1.24B', change: '+22.1% impressions', changeType: 'up' as const },
];

const sponsorData = [
  { name: 'Marriott Bonvoy', team: 'MI', value: '₹48Cr', score: 98.4, zone: 'Front chest' },
  { name: 'India Cements', team: 'CSK', value: '₹45Cr', score: 96.8, zone: 'Front chest' },
  { name: 'Samsung', team: 'MI', value: '₹35Cr', score: 93.2, zone: 'Front center' },
  { name: 'Myntra', team: 'CSK', value: '₹32Cr', score: 89.7, zone: 'Front center' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const selectedTeam = teams[1];
  const [activeZone, setActiveZone] = useState<SponsorZone | null>(selectedTeam.sponsors[0]);
  const heatmapZones = useMemo(
    () => selectedTeam.sponsors.slice(0, 5).sort((a, b) => b.visibility_score - a.visibility_score),
    [selectedTeam]
  );

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.20),transparent_34%),#020617] px-4 py-4 sm:px-6 sm:py-6">
      <section className="grid min-h-[calc(100vh-6.5rem)] grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.45fr_0.95fr]">
        <div className="order-1 relative min-h-[560px] overflow-hidden rounded-xl border border-blue-300/20 bg-slate-950 shadow-[0_0_70px_rgba(37,99,235,0.18)] xl:order-2">
          {/* Static Jersey Display */}
          <div className="flex h-full min-h-[560px] items-center justify-center p-8">
            <div className="relative">
              {/* Jersey SVG */}
              <svg viewBox="0 0 200 240" className="h-[400px] w-auto drop-shadow-2xl">
                {/* Jersey Body */}
                <defs>
                  <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={selectedTeam.gradient[0]} />
                    <stop offset="100%" stopColor={selectedTeam.gradient[1]} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Main Jersey Shape */}
                <path
                  d="M50 20 L20 50 L35 65 L60 45 L60 220 L140 220 L140 45 L165 65 L180 50 L150 20 Q100 35 50 20Z"
                  fill="url(#jerseyGrad)"
                  stroke={selectedTeam.secondaryColor}
                  strokeWidth="2"
                />

                {/* Collar */}
                <ellipse cx="100" cy="25" rx="25" ry="8" fill={selectedTeam.secondaryColor} />

                {/* Sleeve Stripes */}
                <rect x="22" y="52" width="12" height="8" fill={selectedTeam.secondaryColor} transform="rotate(-45 28 56)" />
                <rect x="166" y="52" width="12" height="8" fill={selectedTeam.secondaryColor} transform="rotate(45 172 56)" />

                {/* Team Logo Area */}
                <circle cx="100" cy="80" r="20" fill="rgba(255,255,255,0.9)" />
                <text x="100" y="86" textAnchor="middle" fontSize="14" fontWeight="bold" fill={selectedTeam.primaryColor}>{selectedTeam.shortName}</text>

                {/* Main Sponsor - Front Chest */}
                <rect x="55" y="110" width="90" height="30" rx="4" fill="rgba(255,255,255,0.95)" />
                <text x="100" y="130" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333">{selectedTeam.sponsors[0]?.sponsor}</text>

                {/* Secondary Sponsor - Front Center */}
                <rect x="70" y="150" width="60" height="20" rx="3" fill="rgba(255,255,255,0.8)" />
                <text x="100" y="164" textAnchor="middle" fontSize="8" fill="#555">{selectedTeam.sponsors[1]?.sponsor}</text>

                {/* Sleeve Sponsors */}
                <rect x="25" y="70" width="30" height="15" rx="2" fill="rgba(255,255,255,0.7)" transform="rotate(-15 40 77)" />
                <text x="40" y="80" textAnchor="middle" fontSize="6" fill="#333" transform="rotate(-15 40 80)">{selectedTeam.sponsors[2]?.sponsor?.slice(0, 6)}</text>

                <rect x="145" y="70" width="30" height="15" rx="2" fill="rgba(255,255,255,0.7)" transform="rotate(15 160 77)" />
                <text x="160" y="80" textAnchor="middle" fontSize="6" fill="#333" transform="rotate(15 160 80)">{selectedTeam.sponsors[3]?.sponsor?.slice(0, 6)}</text>

                {/* Zone Highlight Overlay */}
                {activeZone && (
                  <g filter="url(#glow)">
                    {activeZone.zone === 'front_chest' && <rect x="50" y="105" width="100" height="40" rx="5" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5" />}
                    {activeZone.zone === 'front_center' && <rect x="65" y="145" width="70" height="30" rx="3" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5" />}
                    {activeZone.zone === 'right_sleeve' && <rect x="20" y="65" width="40" height="25" rx="2" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5" transform="rotate(-15 40 77)" />}
                    {activeZone.zone === 'left_sleeve' && <rect x="140" y="65" width="40" height="25" rx="2" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5" transform="rotate(15 160 77)" />}
                  </g>
                )}
              </svg>

              {/* Zone Info Panel */}
              <div className="absolute -right-4 top-4 w-[180px] rounded-xl border border-white/10 bg-black/60 p-3 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">Active Zone</p>
                <h3 className="mt-1 text-sm font-bold text-white">{activeZone?.sponsor || selectedTeam.sponsors[0]?.sponsor}</h3>
                <p className="text-xs font-semibold text-emerald-300">{activeZone?.estimated_value || selectedTeam.sponsors[0]?.estimated_value}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-300">
                  {activeZone?.label || selectedTeam.sponsors[0]?.label}: {activeZone?.visibility_score || selectedTeam.sponsors[0]?.visibility_score}/100
                </p>
              </div>
            </div>
          </div>

          {/* Zone Selection Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur">
            {selectedTeam.sponsors.slice(0, 5).map((zone) => (
              <button
                key={zone.zone}
                onClick={() => setActiveZone(zone)}
                className={`flex-1 min-w-[80px] rounded-lg px-2 py-2 text-[10px] font-semibold transition ${
                  activeZone?.zone === zone.zone
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <div className="truncate">{zone.sponsor}</div>
                <div className="text-[8px] opacity-70">{zone.visibility_score}/100</div>
              </button>
            ))}
            <button
              onClick={() => navigate('/jerseys')}
              className="rounded-lg bg-emerald-500/80 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-emerald-400"
            >
              View 3D →
            </button>
          </div>
        </div>

        <div className="order-2 flex flex-col gap-4 xl:order-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {kpiData.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-[0_0_40px_rgba(16,185,129,0.10)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-emerald-300" />
                <h3 className="text-sm font-semibold text-white">Top Sponsor Leaderboard</h3>
              </div>
              <button onClick={() => navigate('/sponsor-roi')} className="rounded-lg p-2 text-emerald-200 hover:bg-white/10" aria-label="Open sponsor ROI">
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {sponsorData.map((sponsor, index) => (
                <button
                  key={sponsor.name}
                  onClick={() => navigate('/sponsor-roi')}
                  className="group grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-white/10"
                >
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{sponsor.name}</span>
                    <span className="block text-xs text-slate-400">{sponsor.team} · {sponsor.zone} · {sponsor.value}</span>
                  </span>
                  <span className="text-sm font-bold text-emerald-300 tabular-nums">{sponsor.score}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="order-3 flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Flame size={16} className="text-rose-300" />
              <h3 className="text-sm font-semibold text-white">ROI Heatmap</h3>
            </div>
            <div className="space-y-3">
              {heatmapZones.map((zone) => (
                <button
                  key={zone.zone}
                  onClick={() => setActiveZone(zone)}
                  className="w-full rounded-lg border border-white/5 bg-white/5 p-3 text-left transition hover:border-rose-300/30 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{zone.label}</span>
                    <span className="text-xs font-bold text-rose-200">{zone.visibility_score}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-300 to-emerald-300" style={{ width: `${zone.visibility_score}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/debate')} className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-500/10 p-5 text-left shadow-[0_0_50px_rgba(217,70,239,0.10)] transition hover:-translate-y-0.5 hover:bg-fuchsia-500/15">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords size={16} className="text-fuchsia-200" />
                <h3 className="text-sm font-semibold text-white">Trending Debate</h3>
              </div>
              <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200">Live</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <p className="text-lg font-bold text-white">Dhoni</p>
                <p className="text-xs text-slate-400">Legacy captaincy</p>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white">VS</span>
              <div className="text-right">
                <p className="text-lg font-bold text-white">Rohit</p>
                <p className="text-xs text-slate-400">Trophy efficiency</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[58%] rounded-full bg-fuchsia-400" />
            </div>
          </button>

          <div className="rounded-xl border border-blue-300/20 bg-blue-500/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <BrainCircuit size={16} className="text-blue-200" />
              <h3 className="text-sm font-semibold text-white">AI Insight</h3>
            </div>
            <p className="text-sm leading-6 text-slate-200">
              Move MI’s secondary sponsor from collar to front-center during powerplay clips. The model projects +18% recall and +₹7.4Cr equivalent media value.
            </p>
            <button onClick={() => navigate('/ask-ai')} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-white/10">
              Ask Orchestrator
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="min-h-[240px]">
            <ROIChart />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
