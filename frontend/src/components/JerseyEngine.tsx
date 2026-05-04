import React, { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCw, Flame, Upload, GitCompare, Play, Pause,
  Trophy, Target, TrendingUp, Shield, Star,
  X, Camera, Radio, Image as ImageIcon,
  Sparkles, Shirt
} from 'lucide-react';
import { teams, matchPhases } from '../data/teamData';
import type { TeamData, SponsorZone } from '../data/teamData';

const Jersey3DViewer = lazy(() => import('./Jersey3D'));

// ─── ROI Info Panel ───
function ROIPanel({ zone, onClose }: { zone: SponsorZone; onClose: () => void }) {
  const exposureColor = zone.camera_exposure === 'very high' ? '#22c55e' : zone.camera_exposure === 'high' ? '#3b82f6' : zone.camera_exposure === 'medium' ? '#f59e0b' : '#ef4444';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: 20 }}
      className="absolute top-8 right-8 z-20 w-80 bg-white/5 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Target size={18} className="text-primary" />{zone.label}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={18} /></button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="text-slate-400 text-sm">Sponsor</span>
          <span className="font-bold text-white">{zone.sponsor}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="text-slate-400 text-sm">Visibility Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${zone.visibility_score}%` }} transition={{ duration: 1 }}
                className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #e11d48, #f59e0b)` }} />
            </div>
            <span className="font-bold text-white">{zone.visibility_score}</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="text-slate-400 text-sm">Estimated Value</span>
          <span className="font-bold text-green-400">{zone.estimated_value}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="text-slate-400 text-sm">Camera Exposure</span>
          <span className="font-bold" style={{ color: exposureColor }}>{zone.camera_exposure}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="text-slate-400 text-sm">Fan Recall</span>
          <span className="font-bold text-purple-400">{zone.fan_recall}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Team Selector Carousel ───
function TeamSelector({ teams: teamList, selected, onSelect }: { teams: TeamData[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto py-6 px-1 no-scrollbar items-center justify-center">
      <div className="p-2 bg-white/5 border border-white/10 rounded-xl flex gap-2 items-center flex-nowrap min-w-max shadow-lg">
        {teamList.map((t) => (
          <button key={t.id} onClick={() => onSelect(t.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 relative overflow-hidden group ${selected === t.id ? 'text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            style={{
              background: selected === t.id ? t.primaryColor : 'transparent',
              boxShadow: selected === t.id ? `0 15px 35px ${t.primaryColor}40` : 'none',
              color: selected === t.id ? t.textColor : undefined
            }}>
            {selected === t.id && (
              <motion.div layoutId="active-team-bg" className="absolute inset-0 z-0 bg-white/10" />
            )}
            <span className="relative z-10">{t.shortName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Compare Panel ───
function ComparePanel({ teams: teamList, onClose }: { teams: TeamData[]; onClose: () => void }) {
  const [teamA, setTeamA] = useState('csk');
  const [teamB, setTeamB] = useState('mi');
  const a = teamList.find(t => t.id === teamA)!;
  const b = teamList.find(t => t.id === teamB)!;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><GitCompare size={20} className="text-primary" />Compare Sponsor Zones</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select value={teamA} onChange={e => setTeamA(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold">
          {teamList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={teamB} onChange={e => setTeamB(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold">
          {teamList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {a.sponsors.map((sponsorA, i) => {
          const sponsorB = b.sponsors[i];
          if (!sponsorB) return null;
          const aWins = sponsorA.visibility_score >= sponsorB.visibility_score;
          return (
            <div key={sponsorA.zone} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">{sponsorA.label}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-sm ${aWins ? 'text-green-400' : 'text-slate-400'}`}>
                  <div className="font-bold">{sponsorA.sponsor}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${sponsorA.visibility_score}%`, background: a.primaryColor }} />
                    </div>
                    <span className="text-xs font-mono">{sponsorA.visibility_score}</span>
                  </div>
                  <div className="text-xs mt-1 text-green-400">{sponsorA.estimated_value}</div>
                </div>
                <div className={`text-sm ${!aWins ? 'text-green-400' : 'text-slate-400'}`}>
                  <div className="font-bold">{sponsorB.sponsor}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${sponsorB.visibility_score}%`, background: b.primaryColor }} />
                    </div>
                    <span className="text-xs font-mono">{sponsorB.visibility_score}</span>
                  </div>
                  <div className="text-xs mt-1 text-green-400">{sponsorB.estimated_value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ background: `${a.primaryColor}15`, border: `1px solid ${a.primaryColor}40` }}>
          <div className="text-2xl font-bold" style={{ color: a.primaryColor }}>{a.brandScore}</div>
          <div className="text-xs text-slate-400 mt-1">{a.shortName} Brand Score</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: `${b.primaryColor}15`, border: `1px solid ${b.primaryColor}40` }}>
          <div className="text-2xl font-bold" style={{ color: b.primaryColor }}>{b.brandScore}</div>
          <div className="text-xs text-slate-400 mt-1">{b.shortName} Brand Score</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Match Mode Simulator ───
function MatchSimulator({ team, onClose }: { team: TeamData; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setTimeout(() => {
        setPhaseIdx(prev => (prev + 1) % matchPhases.length);
      }, matchPhases[phaseIdx].duration);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, phaseIdx]);

  const phase = matchPhases[phaseIdx];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><Radio size={20} className="text-red-400 animate-pulse" />Match Mode — {team.shortName}</h3>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} className="btn-primary px-4 py-2 text-sm">
            {playing ? <><Pause size={14} />Pause</> : <><Play size={14} />Simulate</>}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={16} /></button>
        </div>
      </div>
      <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-2">
          <Camera size={16} className="text-primary" />
          <span className="font-bold text-white">{phase.phase}</span>
          {playing && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full animate-pulse">LIVE</span>}
        </div>
        <p className="text-sm text-slate-400">{phase.description}</p>
      </div>
      <div className="space-y-2">
        {team.sponsors.map(sponsor => {
          const exposure = phase.zoneExposure[sponsor.zone] || 0;
          const barColor = exposure > 80 ? '#22c55e' : exposure > 50 ? '#f59e0b' : '#ef4444';
          return (
            <div key={sponsor.zone} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-slate-500 w-24 flex-shrink-0">{sponsor.label}</span>
              <span className="text-xs text-slate-300 w-20 flex-shrink-0 font-bold">{sponsor.sponsor}</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${exposure}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full" style={{ background: barColor }} />
              </div>
              <span className="text-xs font-mono w-8 text-right" style={{ color: barColor }}>{exposure}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-1 overflow-x-auto">
        {matchPhases.map((p, i) => (
          <button key={p.phase} onClick={() => { setPhaseIdx(i); setPlaying(false); }}
            className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
            style={{ background: i === phaseIdx ? 'rgba(225,29,72,0.2)' : 'rgba(255,255,255,0.03)', color: i === phaseIdx ? '#e11d48' : '#64748b', border: `1px solid ${i === phaseIdx ? 'rgba(225,29,72,0.3)' : 'transparent'}` }}>
            {p.phase}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Logo Upload Preview ───
function LogoUploader({ team, onClose }: { team: TeamData; onClose: () => void }) {
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState('front_chest');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><Upload size={20} className="text-primary" />Upload Brand Logo</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Target Zone</label>
          <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mb-4">
            {team.sponsors.map(s => <option key={s.zone} value={s.zone}>{s.label}</option>)}
          </select>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="btn-primary w-full justify-center">
            <Upload size={16} />{logo ? 'Change Logo' : 'Select Logo File'}
          </button>
        </div>
        <div className="flex items-center justify-center min-h-[200px] rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          {logo ? (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden mb-3 p-2" style={{ background: team.primaryColor }}>
                <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm text-slate-400">Preview on <span className="text-white font-bold">{team.shortName}</span> — <span className="text-primary">{team.sponsors.find(s => s.zone === selectedZone)?.label}</span></p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Upload a logo to preview placement</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Premium Jersey Gallery ───
function JerseyGallery({ team, onClose }: { team: TeamData; onClose: () => void }) {
  const [view, setView] = useState<'front' | 'back'>('front');
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden" style={{ minHeight: '600px' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
            <ImageIcon size={24} className="text-primary" /> Premium 8K Render Preview
          </h3>
          <p className="text-slate-400 text-sm mt-1">AI-generated high-fidelity visualization using Gemini Nano style</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><X size={20} /></button>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setView('front')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'front' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
          Front View
        </button>
        <button onClick={() => setView('back')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'back' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
          Back View
        </button>
      </div>

      <div className="relative group">
        <motion.div key={view} initial={{ opacity: 0, x: view === 'front' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
          <img src={view === 'front' ? team.frontImage : team.backImage}
            alt={`${team.name} ${view} view`}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </motion.div>
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Jersey DNA</div>
              <div className="text-lg font-bold text-white">{team.name} — {view.toUpperCase()}</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              HD PREVIEW
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stats Bar ───
function StatsBar({ team }: { team: TeamData }) {
  const stats = [
    { label: 'Brand Score', value: team.brandScore, icon: <Trophy size={18} />, color: 'primary' },
    { label: 'Total Value', value: team.totalSponsorValue, icon: <TrendingUp size={18} />, color: 'success' },
    { label: 'Top Sponsor', value: team.sponsors[0].sponsor, icon: <Star size={18} />, color: 'secondary' },
    { label: 'Zones Active', value: team.sponsors.length, icon: <Shield size={18} />, color: 'accent' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div 
          key={s.label} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-colors p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-${s.color} transition-transform group-hover:scale-110`}>
              {s.icon}
            </div>
            <div className="h-2 w-2 rounded-full bg-primary/20 animate-pulse"></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">{s.label}</p>
          <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN ENGINE COMPONENT
// ═══════════════════════════════════════════════
export default function JerseyEngine() {
  const [selectedTeamId, setSelectedTeamId] = useState('csk');
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [selectedZoneData, setSelectedZoneData] = useState<SponsorZone | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showMatchMode, setShowMatchMode] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const team = teams.find(t => t.id === selectedTeamId)!;

  const handleZoneClick = useCallback((zone: SponsorZone) => {
    setActiveZone(zone.zone);
    setSelectedZoneData(zone);
    setAutoSpin(false);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header - Elite Style */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
             <Shirt size={14} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Spatial Intelligence Engine</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-4">
             3D JERSEY <span className="text-slate-500 font-light">ANALYTICS</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
            High-fidelity interactive visualization of sponsorship placement effectiveness for <span className="text-white font-black">{team.name}</span>.
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => setAutoSpin(!autoSpin)} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${autoSpin ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <RotateCw size={18} className={autoSpin ? 'animate-spin' : ''} /> {autoSpin ? 'AUTO-ORBIT ON' : 'MANUAL ORBIT'}
          </button>
          <button onClick={() => setShowHeatmap(!showHeatmap)} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${showHeatmap ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <Flame size={18} /> HEATMAP
          </button>
          <div className="w-[1px] h-10 bg-white/10 hidden xl:block"></div>
          <button onClick={() => { setShowCompare(!showCompare); setShowMatchMode(false); setShowLogoUpload(false); setShowGallery(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${showCompare ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <GitCompare size={18} /> COMPARE
          </button>
          <button onClick={() => { setShowMatchMode(!showMatchMode); setShowCompare(false); setShowLogoUpload(false); setShowGallery(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${showMatchMode ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <Play size={18} /> SIMULATE
          </button>
          <button onClick={() => { setShowLogoUpload(!showLogoUpload); setShowCompare(false); setShowMatchMode(false); setShowGallery(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${showLogoUpload ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <Upload size={18} /> UPLOAD
          </button>
          <button onClick={() => { setShowGallery(!showGallery); setShowCompare(false); setShowMatchMode(false); setShowLogoUpload(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-colors ${showGallery ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'}`}>
            <Sparkles size={18} className="fill-white" /> 8K RENDERS
          </button>
        </div>
      </div>

      {/* Team Selector */}
      <TeamSelector teams={teams} selected={selectedTeamId} onSelect={(id) => { setSelectedTeamId(id); setSelectedZoneData(null); setActiveZone(null); }} />

      {/* Stats Bar */}
      <StatsBar team={team} />

      {/* 3D Viewer */}
      <div className="bg-[#0f172a] border border-white/10 rounded-xl p-0 overflow-hidden relative" style={{ minHeight: '600px' }}>
        <Suspense fallback={
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-300" />
          </div>
        }>
          <Jersey3DViewer team={team} activeZone={activeZone} onZoneClick={handleZoneClick} autoSpin={autoSpin} showHeatmap={showHeatmap} />
        </Suspense>
        <AnimatePresence>
          {selectedZoneData && <ROIPanel zone={selectedZoneData} onClose={() => { setSelectedZoneData(null); setActiveZone(null); }} />}
        </AnimatePresence>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(transparent, rgba(2,6,23,0.8))' }} />
        <div className="absolute bottom-4 left-4 text-xs text-slate-600">Click any sponsor zone for ROI intel • Scroll to zoom • Drag to rotate</div>
      </div>

      {/* Sponsor Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {team.sponsors.map((sponsor, i) => (
          <motion.button key={sponsor.zone} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => handleZoneClick(sponsor)}
            className="text-left p-6 rounded-2xl transition-all hover:scale-[1.02] shadow-xl"
            style={{ background: activeZone === sponsor.zone ? `${sponsor.color}20` : 'rgba(255,255,255,0.02)', border: `1px solid ${activeZone === sponsor.zone ? `${sponsor.color}50` : 'rgba(255,255,255,0.05)'}` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{sponsor.label}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${sponsor.color}20`, color: sponsor.color }}>{sponsor.visibility_score}%</span>
            </div>
            <div className="font-bold text-white text-sm">{sponsor.sponsor}</div>
            <div className="text-xs text-green-400 mt-1">{sponsor.estimated_value}</div>
            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${sponsor.visibility_score}%`, background: `linear-gradient(90deg, ${sponsor.color}, ${team.primaryColor})` }} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Feature Panels */}
      <AnimatePresence>
        {showCompare && <ComparePanel teams={teams} onClose={() => setShowCompare(false)} />}
        {showMatchMode && <MatchSimulator team={team} onClose={() => setShowMatchMode(false)} />}
        {showLogoUpload && <LogoUploader team={team} onClose={() => setShowLogoUpload(false)} />}
        {showGallery && <JerseyGallery team={team} onClose={() => setShowGallery(false)} />}
      </AnimatePresence>
    </div>
  );
}
