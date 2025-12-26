import React, { useMemo } from 'react';
import { DataPoint } from '../types';
import { TYPE_COLORS } from '../constants';

interface DataGridProps {
    cellData: DataPoint;
    onClose: () => void;
}

export const DataGrid: React.FC<DataGridProps> = ({ cellData, onClose }) => {
    const color = TYPE_COLORS[cellData.colorType];
    
    // Calculate Summary Stats
    const stats = useMemo(() => {
        const users = cellData.contributing_users;
        const total = users.length;
        const bingeCount = users.filter(u => u.binge).length;
        const completedCount = users.filter(u => u.completed).length;
        const recommendedCount = users.filter(u => u.recommended).length;

        // Calculate Top Country
        const countryCounts = users.reduce((acc, user) => {
            acc[user.country] = (acc[user.country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Sort by count descending
        const topCountryEntry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
        const topCountryName = topCountryEntry ? topCountryEntry[0] : 'N/A';
        const topCountryCount = topCountryEntry ? topCountryEntry[1] : 0;
        const topCountryRate = ((topCountryCount / total) * 100).toFixed(0);

        return {
            bingeRate: ((bingeCount / total) * 100).toFixed(0),
            completionRate: ((completedCount / total) * 100).toFixed(0),
            recommendedRate: ((recommendedCount / total) * 100).toFixed(0),
            topCountryName,
            topCountryRate
        };
    }, [cellData]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>
            
            <div className="relative w-full max-w-5xl max-h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></span>
                            Segment Analysis: {cellData.id}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 uppercase">{cellData.x_dim}</span>
                             <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 uppercase">{cellData.y_dim}</span>
                             <span 
                                className="text-xs font-bold font-mono px-2 py-0.5 rounded uppercase"
                                style={{ color: color, backgroundColor: `${color}22` }}
                             >
                                {cellData.colorType}
                             </span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* General Information / Summary Dashboard */}
                <div className="grid grid-cols-4 gap-4 p-6 bg-[#0E0E0E] border-b border-white/10">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Top Region</div>
                        <div className="text-xl font-bold text-white truncate" title={stats.topCountryName}>
                            {stats.topCountryName}
                        </div>
                        <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{ width: `${stats.topCountryRate}%` }}></div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 font-mono">{stats.topCountryRate}% of users</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Completion Rate</div>
                        <div className="text-2xl font-bold text-emerald-400">{stats.completionRate}%</div>
                        <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400" style={{ width: `${stats.completionRate}%` }}></div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Binge Rate</div>
                        <div className="text-2xl font-bold text-rose-500">{stats.bingeRate}%</div>
                        <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${stats.bingeRate}%` }}></div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">From Recommender</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.recommendedRate}%</div>
                        <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: `${stats.recommendedRate}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Raw Data Table */}
                <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-[#0A0A0A]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#111] z-10 shadow-lg">
                            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
                                <th className="py-4 pl-6">User ID</th>
                                <th className="py-4">Country</th>
                                <th className="py-4">Session Start</th>
                                <th className="py-4 text-right">Duration</th>
                                <th className="py-4 text-center">Recommended</th>
                                <th className="py-4 text-center">Completed</th>
                                <th className="py-4 text-center pr-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-mono divide-y divide-white/5">
                            {cellData.contributing_users.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-3 pl-6 font-medium text-gray-300 group-hover:text-white">{row.id}</td>
                                    <td className="py-3 text-gray-400">{row.country}</td>
                                    <td className="py-3 text-gray-400">{row.hour.toString().padStart(2, '0')}:{row.minutes.toString().padStart(2, '0')}</td>
                                    <td className="py-3 text-right">
                                        <span className="font-bold text-white">{row.minutes}</span>
                                        <span className="text-gray-500 text-xs ml-1">min</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        {row.recommended ? 
                                            <span className="text-emerald-400 text-[10px] bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">YES</span> : 
                                            <span className="text-gray-600 text-[10px] opacity-30">-</span>
                                        }
                                    </td>
                                    <td className="py-3 text-center">
                                         {row.completed ? 
                                            <span className="text-blue-400 text-[10px] bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">YES</span> : 
                                            <span className="text-gray-600 text-[10px] opacity-30">NO</span>
                                        }
                                    </td>
                                    <td className="py-3 text-center pr-6">
                                        {row.binge ? 
                                            <span className="text-rose-500 font-bold text-[10px] bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.2)]">BINGE</span> : 
                                            <span className="text-gray-600 text-[10px]">NORMAL</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer stats */}
                <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-gray-400 font-mono">
                    <span>Dataset: {cellData.contributing_users.length} Records</span>
                    <span>Segment ID: {cellData.id}</span>
                </div>
            </div>
        </div>
    );
};