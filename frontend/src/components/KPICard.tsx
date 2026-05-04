import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, change, changeType }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${
        changeType === 'up' ? 'text-green-400' : 'text-red-400'
      }`}>
        {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{change}</span>
      </div>
    </div>
  );
};

export default KPICard;
