import React from 'react';
import { DataPoint } from '../types';
import { TYPE_COLORS } from '../constants';

interface InfoPanelProps {
  data: DataPoint | null;
  onClose: () => void;
  onOpenGrid: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, onOpenGrid }) => {
  if (!data) return null;

  const color = TYPE_COLORS[data.colorType];

  return (
    <div className="absolute right-6 top-6 bottom-6 w-80 z-10 pointer-events-none flex flex-col justify-center">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span 
                        className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded"
                        style={{ backgroundColor: `${color}33`, color: color }}
                    >
                        {data.colorType}
                    </span>
                    <h2 className="text-xl font-bold mt-3 text-white">Segment Details</h2>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Dimensional Context */}
            <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-500">Time</span>
                    <span className="text-white font-mono">{data.x_dim}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-500">Device</span>
                    <span className="text-white font-mono">{data.y_dim}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-500">Category</span>
                    <span className="text-white font-mono">{data.z_dim}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-white mb-1">{data.user_count}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Active Users</div>
                </div>
                <div className="bg-white/5 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-white mb-1">{data.avg_session_minutes.toFixed(0)}m</div>
                    <div className="text-[10px] text-gray-500 uppercase">Avg Duration</div>
                </div>
            </div>

            {/* Action */}
            <button 
              onClick={onOpenGrid}
              className="w-full py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7-4h14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                Open Data Table
            </button>
            
            <div className="mt-4 text-center text-[10px] text-gray-600 font-mono">
                ID: {data.id} • POS: [{data.position.join(',')}]
            </div>
        </div>
    </div>
  );
};