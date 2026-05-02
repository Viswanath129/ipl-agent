"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeIndianRupee, Download, MessageSquare, Scale, Send, Vote, Zap } from "lucide-react";

type ApiEnvelope<T> = { success: boolean; data: T };

type SponsorRow = {
  brand_name: string;
  exposure_score: number;
  estimated_roi_pct: number;
  estimated_media_value_lakh: number;
  sentiment: string;
  meme_impressions: number;
  best_player_association: string;
};

type SponsorReport = {
  brand_name: string;
  data_status: string;
  do_not_misrepresent: string;
  exposure_score: number;
  estimated_media_value_lakh: number;
  assumed_spend_lakh: number;
  estimated_roi_pct: number;
  best_player_association: string;
  jersey_logo_visibility: { visibility_score: number; detections: Array<Record<string, string | number>> };
  social_mentions: { total_mentions: number; total_impressions: number; sentiment_label: string; engagement_rate_pct: number };
  meme_virality: { estimated_meme_impressions: number; meme_share_of_voice_pct: number };
  brand_recommendations: string[];
};

type DebateReport = {
  debate_id: string;
  topic: string;
  side_a: string;
  side_b: string;
  lens: string;
  final_judge: { verdict: string; winner: string; confidence_pct: number; caveat: string };
  bias_detection: { bias_score: number; bias_label: string; loaded_terms: string[]; mitigation: string };
  balanced_arguments: { for_a: string[]; for_b: string[] };
  fan_voting: { votes: Record<string, number>; total_votes: number };
  viral_shareable: { short_post: string; poll_text: string; hashtags: string[] };
  data_status: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await response.text());
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export default function Page() {
  const [brand, setBrand] = useState("Dream11");
  const [match, setMatch] = useState("MI vs CSK");
  const [topic, setTopic] = useState("Dhoni vs Rohit as IPL captain");
  const [chatQuery, setChatQuery] = useState("Compare Puma sponsor ROI and Kohli vs ABD");
  const [sponsor, setSponsor] = useState<SponsorReport | null>(null);
  const [comparison, setComparison] = useState<SponsorRow[]>([]);
  const [debate, setDebate] = useState<DebateReport | null>(null);
  const [chatResult, setChatResult] = useState<Record<string, unknown> | null>(null);
  const [exportedReport, setExportedReport] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const chartRows = useMemo(
    () => comparison.map((row) => ({ brand: row.brand_name, exposure: row.exposure_score, roi: row.estimated_roi_pct })),
    [comparison],
  );

  async function refreshSponsor() {
    setLoading(true);
    setError("");
    try {
      const [roi, compare] = await Promise.all([
        apiPost<SponsorReport>("/api/sponsors/roi", { brand, match }),
        apiPost<{ brands: SponsorRow[] }>("/api/sponsors/compare", { match }),
      ]);
      setSponsor(roi);
      setComparison(compare.brands);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sponsor API failed");
    } finally {
      setLoading(false);
    }
  }

  async function generateDebate() {
    setLoading(true);
    setError("");
    try {
      setDebate(await apiPost<DebateReport>("/api/debates", { topic }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Debate API failed");
    } finally {
      setLoading(false);
    }
  }

  async function vote(side: string) {
    if (!debate) return;
    const next = await apiPost<{ votes: Record<string, number>; total_votes: number }>("/api/debates/vote", {
      debate_id: debate.debate_id,
      side,
    });
    setDebate({ ...debate, fan_voting: next });
  }

  async function askEngine() {
    setLoading(true);
    setError("");
    try {
      setChatResult(await apiPost<Record<string, unknown>>("/api/chat", { query: chatQuery }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat API failed");
    } finally {
      setLoading(false);
    }
  }

  async function exportReport() {
    const report = await apiPost<{ report: string }>("/api/reports/sponsor", { brand, match });
    setExportedReport(report.report);
  }

  useEffect(() => {
    refreshSponsor();
    generateDebate();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#02040a] px-4 py-5 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">IPL Influence Engine</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Sponsor ROI and Debate Judge Workbench</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Simulation-labeled pipelines for jersey logo visibility, social virality, sponsor ROI, evidence debates, bias detection, voting, and exports.
            </p>
          </div>
          <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            No live-data claim: backend responses disclose simulation provenance.
          </div>
        </header>

        {error ? <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div> : null}

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <label className="flex-1 text-sm text-slate-300">
                Sponsor brand
                <select value={brand} onChange={(event) => setBrand(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white">
                  {["Dream11", "CEAT", "Puma"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="flex-1 text-sm text-slate-300">
                Match scope
                <input value={match} onChange={(event) => setMatch(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white" />
              </label>
              <button onClick={refreshSponsor} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                <Zap className="h-4 w-4" />
                Run ROI
              </button>
            </div>

            {sponsor ? (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label="Exposure" value={sponsor.exposure_score} />
                  <Metric label="ROI" value={`${sponsor.estimated_roi_pct}%`} />
                  <Metric label="Media Value" value={`INR ${sponsor.estimated_media_value_lakh}L`} />
                  <Metric label="Meme Impressions" value={sponsor.meme_virality.estimated_meme_impressions.toLocaleString()} />
                </div>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <Panel title="Logo Visibility Pipeline">
                    <p>Visibility score: {sponsor.jersey_logo_visibility.visibility_score}</p>
                    <p>Detections: {sponsor.jersey_logo_visibility.detections.length}</p>
                    <p>Best player link: {sponsor.best_player_association}</p>
                  </Panel>
                  <Panel title="Social and Sentiment Pipeline">
                    <p>Mentions: {sponsor.social_mentions.total_mentions.toLocaleString()}</p>
                    <p>Impressions: {sponsor.social_mentions.total_impressions.toLocaleString()}</p>
                    <p>Sentiment: {sponsor.social_mentions.sentiment_label}</p>
                  </Panel>
                </div>
                <Panel title="Brand Recommendations" className="mt-4">
                  <ul className="space-y-2">
                    {sponsor.brand_recommendations.map((item) => (
                      <li key={item} className="text-sm text-slate-300">- {item}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-amber-200">{sponsor.do_not_misrepresent}</p>
                </Panel>
              </>
            ) : null}
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Brand Comparison</h2>
              <BadgeIndianRupee className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartRows}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="brand" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)" }} />
                  <Bar dataKey="exposure" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="roi" fill="#fb923c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr><th>Brand</th><th>ROI</th><th>Sentiment</th><th>Player</th></tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.brand_name} className="border-t border-white/10">
                      <td className="py-3 font-semibold text-white">{row.brand_name}</td>
                      <td>{row.estimated_roi_pct}%</td>
                      <td>{row.sentiment}</td>
                      <td>{row.best_player_association}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <label className="flex-1 text-sm text-slate-300">
                Debate topic
                <input value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white" />
              </label>
              <button onClick={generateDebate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-300">
                <Scale className="h-4 w-4" />
                Judge Debate
              </button>
            </div>
            {debate ? (
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <Panel title={`${debate.side_a} Case`}>
                  {debate.balanced_arguments.for_a.map((item) => <p key={item}>{item}</p>)}
                  <button onClick={() => vote(debate.side_a)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><Vote className="h-4 w-4" />Vote</button>
                </Panel>
                <Panel title={`${debate.side_b} Case`}>
                  {debate.balanced_arguments.for_b.map((item) => <p key={item}>{item}</p>)}
                  <button onClick={() => vote(debate.side_b)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><Vote className="h-4 w-4" />Vote</button>
                </Panel>
                <Panel title="Final Judge" className="xl:col-span-2">
                  <p>{debate.final_judge.verdict}</p>
                  <p className="mt-2 text-cyan-200">Winner: {debate.final_judge.winner} | Confidence: {debate.final_judge.confidence_pct}% | Bias: {debate.bias_detection.bias_label}</p>
                  <p className="mt-2 text-sm text-slate-400">{debate.bias_detection.mitigation}</p>
                  <p className="mt-3 text-sm text-orange-200">{debate.viral_shareable.short_post}</p>
                  <p className="mt-3 text-sm">Votes: {Object.entries(debate.fan_voting.votes).map(([side, count]) => `${side} ${count}`).join(" | ")}</p>
                </Panel>
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><MessageSquare className="h-5 w-5 text-cyan-300" />Agent Router</h2>
            <textarea value={chatQuery} onChange={(event) => setChatQuery(event.target.value)} className="mt-4 h-28 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={askEngine} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"><Send className="h-4 w-4" />Ask</button>
              <button onClick={exportReport} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"><Download className="h-4 w-4" />Export Sponsor Report</button>
            </div>
            {loading ? <p className="mt-3 text-sm text-slate-400">Working...</p> : null}
            {chatResult ? <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-200">{JSON.stringify(chatResult, null, 2)}</pre> : null}
            {exportedReport ? <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-200">{exportedReport}</pre> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-slate-950/50 p-4 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{title}</h3>
      <div className="space-y-2 text-sm leading-6 text-slate-300">{children}</div>
    </div>
  );
}
