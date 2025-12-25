import React, { useMemo } from 'react';
import { DataPoint } from '../types';
import { CONTENT_TYPE_COLORS } from '../constants';

interface GlobalDashboardProps {
  data: DataPoint[];
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    let totalMinutes = 0;
    let totalSessions = 0;
    let totalBinge = 0;
    let completedSessions = 0;
    
    const contentPerformance: Record<string, number> = {};

    data.forEach(cell => {
      totalMinutes += cell.total_session_minutes;
      totalSessions += cell.user_count;
      totalBinge += (cell.binge_rate * cell.user_count);
      completedSessions += (cell.completion_rate * cell.user_count);

      contentPerformance[cell.content_type] = (contentPerformance[cell.content_type] || 0) + cell.total_session_minutes;
    });

    // Find top content type
    const topContentEntry = Object.entries(contentPerformance).sort((a, b) => b[1] - a[1])[0];
    const topCategory = topContentEntry ? topContentEntry[0] : 'video'; // default fallback

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      totalSessions,
      bingeRate: totalSessions ? ((totalBinge / totalSessions) * 100).toFixed(1) : '0',
      completionRate: totalSessions ? ((completedSessions / totalSessions) * 100).toFixed(1) : '0',
      topCategory
    };
  }, [data]);

  // Determine top category color safely
  const topColor = CONTENT_TYPE_COLORS[stats.topCategory as keyof typeof CONTENT_TYPE_COLORS] || '#fff';

  return (
    <div className="absolute left-8 top-28 w-64 flex flex-col gap-4 pointer-events-none animate-in slide-in-from-left duration-500 z-10">
       {/* Metrics Card */}
       <div className="bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-xl pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"/>
                Global Metrics
            </h2>
            <span className="text-[9px] font-mono text-gray-500 border border-white/10 px-1 rounded">LIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
             <div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Total Vol</div>
                <div className="text-xl font-mono font-bold text-white tracking-tight">{stats.totalHours}<span className="text-sm text-gray-500 ml-1">hrs</span></div>
             </div>
             <div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Sessions</div>
                <div className="text-xl font-mono font-bold text-white tracking-tight">{stats.totalSessions}</div>
             </div>
             <div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Completion</div>
                <div className="text-xl font-mono font-bold text-blue-400 tracking-tight">{stats.completionRate}<span className="text-sm text-blue-400/50 ml-0.5">%</span></div>
             </div>
             <div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Binge Avg</div>
                <div className="text-xl font-mono font-bold text-rose-400 tracking-tight">{stats.bingeRate}<span className="text-sm text-rose-400/50 ml-0.5">%</span></div>
             </div>
          </div>

          <div>
             <div className="text-[9px] text-gray-400 uppercase mb-1.5">Dominant Segment</div>
             <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5">
                <span className="text-sm font-bold capitalize text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: topColor }}></span>
                    {stats.topCategory}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold uppercase tracking-wide">
                    #{stats.topCategory.toUpperCase()}
                </span>
             </div>
          </div>
       </div>

       {/* AI Prediction Module */}
       <div className="bg-gradient-to-br from-[#1a1a2e] to-black/80 backdrop-blur-md border border-indigo-500/30 p-5 rounded-xl pointer-events-auto relative overflow-hidden group shadow-[0_0_20px_rgba(79,70,229,0.1)]">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,19,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
          
          <div className="flex items-center justify-between mb-3 relative z-10">
             <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Model Inference
             </h3>
             <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
          
          <div className="space-y-3 relative z-10">
             <div className="flex justify-between items-center text-xs border-b border-indigo-500/10 pb-2">
                <span className="text-gray-400">Completion Prob.</span>
                <span className="text-emerald-400 font-mono font-bold">{(parseFloat(stats.completionRate) + 5).toFixed(1)}%</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400">Binge Probability</span>
                 <span className="text-rose-400 font-mono font-bold">{(parseFloat(stats.bingeRate) * 1.1).toFixed(1)}%</span>
             </div>
             
             {/* Terminal Output Simulation */}
             <div className="mt-2 font-mono text-[9px] text-gray-400 bg-black/50 p-2 rounded border border-white/5 shadow-inner">
                <div className="flex gap-2">
                    <span className="text-purple-400">➜</span>
                    <span className="text-gray-300">client.predict(context)</span>
                </div>
                <div className="mt-1 text-gray-500 pl-4 opacity-80">
                    {'>>'} Rec: ['video', 'music']<br/>
                    {'>>'} Confidence: 0.94
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};