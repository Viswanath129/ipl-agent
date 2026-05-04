import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SponsorItem {
  name: string;
  team: string;
  value: string;
  score: string;
  trend: 'up' | 'down';
}

interface RecentActivityProps {
  sponsors: SponsorItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ sponsors }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.name}
            className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-gray-300">
                {sponsor.name.substring(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{sponsor.name}</p>
                <p className="text-xs text-gray-500">{sponsor.team} · {sponsor.value}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white tabular-nums">{sponsor.score}</p>
              <div className={`flex items-center justify-end gap-0.5 text-xs ${
                sponsor.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp size={10} className={sponsor.trend === 'down' ? 'rotate-180' : ''} />
                <span>{sponsor.trend === 'up' ? 'Up' : 'Down'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
