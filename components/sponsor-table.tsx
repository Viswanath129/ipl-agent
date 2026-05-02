const sponsors = [
  { brand: "Dream11", roi: "312%", exposure: 92, channel: "Instagram reels", player: "Rohit Sharma" },
  { brand: "Puma", roi: "450%", exposure: 98, channel: "YouTube Shorts", player: "Virat Kohli" },
  { brand: "CEAT", roi: "250%", exposure: 85, channel: "Twitter threads", player: "Shreyas Iyer" },
  { brand: "JioCinema", roi: "286%", exposure: 88, channel: "Second-screen clips", player: "MS Dhoni" },
];

export function SponsorTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Brand</th>
            <th className="px-4 py-3 font-medium">ROI</th>
            <th className="px-4 py-3 font-medium">Exposure</th>
            <th className="px-4 py-3 font-medium">Best Channel</th>
            <th className="px-4 py-3 font-medium">Player Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {sponsors.map((sponsor) => (
            <tr key={sponsor.brand} className="bg-slate-950/20 text-slate-200 transition hover:bg-white/[0.04]">
              <td className="px-4 py-4 font-semibold text-white">{sponsor.brand}</td>
              <td className="px-4 py-4 text-cyan-200">{sponsor.roi}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"
                      style={{ width: `${sponsor.exposure}%` }}
                    />
                  </div>
                  <span>{sponsor.exposure}</span>
                </div>
              </td>
              <td className="px-4 py-4">{sponsor.channel}</td>
              <td className="px-4 py-4">{sponsor.player}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
