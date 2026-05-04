import React from 'react';
import { BarChart3 } from 'lucide-react';

const ROIChart: React.FC = () => {
  const data = [
    { label: 'MI', value: 85 },
    { label: 'CSK', value: 92 },
    { label: 'RCB', value: 70 },
    { label: 'KKR', value: 65 },
    { label: 'GT', value: 78 },
    { label: 'RR', value: 55 },
    { label: 'SRH', value: 72 },
    { label: 'DC', value: 60 },
    { label: 'PBKS', value: 48 },
    { label: 'LSG', value: 58 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Sponsor ROI by Team</h3>
        </div>
        <div className="flex gap-1">
          {['D', 'W', 'M', 'Y'].map((t) => (
            <button
              key={t}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                t === 'M'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-end gap-2 p-5 pb-4 pt-6">
        {data.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative group">
              <div
                className="w-full bg-blue-500/20 rounded-t-md transition-colors group-hover:bg-blue-500/30"
                style={{ height: `${(item.value / maxValue) * 200}px` }}
              >
                <div
                  className="w-full bg-blue-500 rounded-t-md"
                  style={{ height: `${(item.value / maxValue) * 200}px` }}
                />
              </div>
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#020617] px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
                {item.value}%
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ROIChart;
