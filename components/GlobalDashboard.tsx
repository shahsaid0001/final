import React, { useMemo } from 'react';
import { DataPoint } from '../types';
import { TYPE_COLORS } from '../constants';

interface GlobalDashboardProps {
  data: DataPoint[];
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalUsers = data.reduce((acc, curr) => acc + curr.user_count, 0);
    const avgDuration = data.reduce((acc, curr) => acc + curr.avg_session_minutes, 0) / data.length;
    
    return {
      users: totalUsers.toLocaleString(),
      avgDuration: avgDuration.toFixed(1)
    };
  }, [data]);

  return (
    <div className="absolute top-0 left-0 h-full w-72 p-6 z-10 pointer-events-none flex flex-col justify-center">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl pointer-events-auto shadow-2xl space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold text-white tracking-tighter">YANDEX<span className="text-rose-500">CUBE</span></h1>
                <p className="text-xs text-gray-500 font-mono mt-1">OLAP ANALYTICS ENGINE</p>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                    <p className="text-2xl font-mono text-white font-bold">{stats.users}</p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Avg Session</p>
                    <p className="text-2xl font-mono text-emerald-400 font-bold">{stats.avgDuration} <span className="text-sm text-gray-500">min</span></p>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Categories</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {Object.entries(TYPE_COLORS).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                            ></div>
                            <span className="text-[10px] text-gray-300 font-mono uppercase tracking-wide">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};