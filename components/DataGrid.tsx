import React from 'react';
import { DataPoint } from '../types';
import { CONTENT_TYPE_COLORS } from '../constants';

interface DataGridProps {
    cellData: DataPoint;
    onClose: () => void;
}

export const DataGrid: React.FC<DataGridProps> = ({ cellData, onClose }) => {
    const color = CONTENT_TYPE_COLORS[cellData.content_type];
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></span>
                            Raw Data Inspector
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 uppercase">{cellData.day_type}</span>
                             <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 uppercase">{cellData.device}</span>
                             <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 uppercase">{cellData.content_type}</span>
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

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0F0F0F] z-10 shadow-sm">
                            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
                                <th className="py-4 pl-6">User ID</th>
                                <th className="py-4">Time</th>
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
                                    <td className="py-3 text-gray-400">{row.hour}:00</td>
                                    <td className="py-3 text-right">
                                        <span className="font-bold text-white">{row.minutes}</span>
                                        <span className="text-gray-500 text-xs ml-1">min</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        {row.recommended ? 
                                            <span className="text-emerald-400 text-[10px] bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">YES</span> : 
                                            <span className="text-gray-600 text-[10px]">-</span>
                                        }
                                    </td>
                                    <td className="py-3 text-center">
                                         {row.completed ? 
                                            <span className="text-blue-400 text-[10px] bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">YES</span> : 
                                            <span className="text-gray-600 text-[10px]">NO</span>
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
                    <span>Total Rows: {cellData.contributing_users.length}</span>
                    <span>Avg Duration: {cellData.avg_session_minutes.toFixed(1)} min</span>
                </div>
            </div>
        </div>
    );
};