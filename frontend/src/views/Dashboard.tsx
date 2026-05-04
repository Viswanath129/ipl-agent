import React, { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, Flame, Radio, Swords, Target, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import ROIChart from '../components/ROIChart';
import { teams } from '../data/teamData';
import type { SponsorZone } from '../data/teamData';

const Jersey3DViewer = lazy(() => import('../components/Jersey3D'));

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
  { name: 'Jio 5G', team: 'MI', value: '₹6Cr', score: 72.4, zone: 'Collar' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState<SponsorZone | null>(teams[1].sponsors[0]);
  const selectedTeam = teams[1];

  const heatmapZones = useMemo(
    () => selectedTeam.sponsors.slice(0, 5).sort((a, b) => b.visibility_score - a.visibility_score),
    [selectedTeam]
  );

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.20),transparent_34%),#020617] px-4 py-4 sm:px-6 sm:py-6">
      <section className="grid min-h-[calc(100vh-6.5rem)] grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(420px,560px)_1fr]">
        <div className="flex flex-col gap-4">
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

        <div className="relative min-h-[560px] overflow-hidden rounded-xl border border-blue-300/20 bg-slate-950 shadow-[0_0_70px_rgba(37,99,235,0.18)]">
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/35 px-3 py-2 backdrop-blur">
            <Radio size={14} className="text-red-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Live 3D Jersey ROI</span>
          </div>
          <Suspense
            fallback={
              <div className="flex h-full min-h-[560px] items-center justify-center">
                <div className="h-14 w-14 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-300" />
              </div>
            }
          >
            <Jersey3DViewer
              team={selectedTeam}
              activeZone={activeZone?.zone || null}
              onZoneClick={setActiveZone}
              autoSpin
              showHeatmap
            />
          </Suspense>
          <div className="absolute bottom-4 left-4 right-4 z-10 grid gap-3 rounded-xl border border-white/10 bg-black/45 p-4 backdrop-blur md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Click-to-see ROI zone</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{activeZone?.sponsor || 'Samsung'} · {activeZone?.estimated_value || '₹35 Cr'}</h2>
              <p className="mt-1 text-sm text-slate-300">
                {activeZone?.label || 'Front Center'} is scoring {activeZone?.visibility_score || 90}/100 visibility with {activeZone?.camera_exposure || 'high'} camera exposure.
              </p>
            </div>
            <button onClick={() => navigate('/jerseys')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
              <Target size={16} />
              Optimize Zones
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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

          <button
            onClick={() => navigate('/debate')}
            className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-500/10 p-5 text-left shadow-[0_0_50px_rgba(217,70,239,0.10)] transition hover:-translate-y-0.5 hover:bg-fuchsia-500/15"
          >
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
