import React from 'react';
import { DataPoint } from '../types';
import { CONTENT_TYPE_COLORS } from '../constants';

interface InfoPanelProps {
  data: DataPoint | null;
  onClose: () => void;
  onOpenGrid: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, onOpenGrid }) => {
  if (!data) return null;

  const color = CONTENT_TYPE_COLORS[data.content_type];

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl z-20 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
            <span 
                className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" 
                style={{ backgroundColor: `${color}33`, color: color }}
            >
                {data.content_type}
            </span>
            <h2 className="text-2xl font-bold mt-2 text-white capitalize">{data.day_type}</h2>
            <p className="text-gray-400 text-sm capitalize">{data.device} Device</p>
        </div>
        <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="space-y-6">
            {/* Primary Metric */}
            <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Avg. Session Duration</label>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-mono font-bold text-white">{data.avg_session_minutes.toFixed(1)}</span>
                    <span className="text-sm text-gray-400 mb-1">min</span>
                </div>
                {/* Simple bar viz */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="h-full rounded-full" 
                        style={{ width: `${Math.min(100, (data.avg_session_minutes / 100) * 100)}%`, backgroundColor: color }}
                    />
                </div>
            </div>

            {/* Secondary Metric Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Users</label>
                    <p className="text-xl font-mono text-white">{data.user_count}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Binge Rate</label>
                    <p className="text-xl font-mono text-white">{(data.binge_rate * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Completion</label>
                    <p className="text-xl font-mono text-white">{(data.completion_rate * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Rec. Click</label>
                    <p className="text-xl font-mono text-white">{(data.recommendation_rate * 100).toFixed(0)}%</p>
                </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/5 mt-4">
                <h3 className="text-sm font-semibold text-white mb-2">Automated Insight</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                    {data.binge_rate > 0.5 
                        ? `High binge behavior detected on ${data.day_type}s. Consider interstitial ads.` 
                        : `Lower engagement stability. Recommend push notifications for ${data.content_type}.`}
                </p>
            </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
         <button 
            onClick={onOpenGrid}
            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-widest text-white rounded transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 5h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Open Data Table
         </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 font-mono">
        CELL: {data.id}<br/>
        COORD: [{data.coordinates.map(c => c.toFixed(1)).join(', ')}]
      </div>
    </div>
  );
};