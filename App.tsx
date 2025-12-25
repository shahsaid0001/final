import React, { useState, useEffect, useMemo } from 'react';
import { OlapCube } from './components/OlapCube';
import { InfoPanel } from './components/InfoPanel';
import { DataGrid } from './components/DataGrid';
import { GlobalDashboard } from './components/GlobalDashboard';
import { generateOlapData } from './services/dataService';
import { DataPoint, TooltipData } from './types';
import { CONTENT_TYPE_COLORS, AXIS_LABELS } from './constants';

const App: React.FC = () => {
  // Initialize data
  const { data, axes } = useMemo(() => generateOlapData(), []);
  
  const [selectedCell, setSelectedCell] = useState<DataPoint | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, data: null });
  const [isGridOpen, setIsGridOpen] = useState(false);

  const handleCellSelect = (cellData: DataPoint) => {
    setSelectedCell(cellData);
    // Optionally close grid when switching cells, or keep it open if you prefer persistent view
    // setIsGridOpen(false); 
  };

  const handleHoverChange = (cellData: DataPoint | null, x: number, y: number) => {
    setTooltip({ x, y, data: cellData });
  };

  return (
    <div className="relative w-screen h-screen bg-[#050505] overflow-hidden text-white selection:bg-rose-500 selection:text-white">
      
      {/* Header / Brand */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold tracking-tighter mb-1">
          HYPER<span className="text-rose-500">CUBE</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
          Multi-Dimensional Data Explorer
        </p>
      </div>

      {/* Global Dashboard (New Separate Information Board) */}
      <GlobalDashboard data={data} />

      {/* Legend */}
      <div className="absolute bottom-8 left-8 z-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{AXIS_LABELS.z}</h3>
        <div className="space-y-2">
          {(Object.keys(CONTENT_TYPE_COLORS) as Array<keyof typeof CONTENT_TYPE_COLORS>).map(type => (
            <div key={type} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: CONTENT_TYPE_COLORS[type], boxShadow: `0 0 8px ${CONTENT_TYPE_COLORS[type]}` }}></span>
              <span className="text-xs font-medium capitalize text-gray-200">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main 3D View */}
      <main className="w-full h-full cursor-crosshair">
        <OlapCube 
          data={data} 
          axes={axes} 
          selectedId={selectedCell?.id || null}
          onCellSelect={handleCellSelect}
          onHoverChange={handleHoverChange}
        />
      </main>

      {/* Detail Panel */}
      <InfoPanel 
        data={selectedCell} 
        onClose={() => {
            setSelectedCell(null);
            setIsGridOpen(false);
        }}
        onOpenGrid={() => setIsGridOpen(true)}
      />

      {/* Data Grid Modal */}
      {isGridOpen && selectedCell && (
          <DataGrid 
            cellData={selectedCell} 
            onClose={() => setIsGridOpen(false)} 
          />
      )}

      {/* Dynamic Cursor Tooltip */}
      {tooltip.data && !selectedCell && (
        <div 
          className="fixed z-50 pointer-events-none transition-opacity duration-75"
          style={{ 
            left: tooltip.x + 20, 
            top: tooltip.y - 20,
            opacity: tooltip.data ? 1 : 0
          }}
        >
          <div className="bg-black/90 backdrop-blur border border-white/20 p-3 rounded shadow-xl min-w-[180px]">
             <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-500">{tooltip.data.content_type}</span>
                <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: CONTENT_TYPE_COLORS[tooltip.data.content_type] }}
                />
             </div>
             <div className="font-bold text-white text-sm mb-1 capitalize">
                {tooltip.data.day_type} / {tooltip.data.device}
             </div>
             <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/10">
                <span className="text-xs text-gray-400">Avg Mins</span>
                <span className="font-mono text-rose-400 font-bold">{tooltip.data.avg_session_minutes.toFixed(0)}</span>
             </div>
             <div className="flex justify-between items-end mt-1">
                <span className="text-xs text-gray-400">Users</span>
                <span className="font-mono text-gray-200 font-bold">{tooltip.data.user_count}</span>
             </div>
          </div>
        </div>
      )}
      
      {/* Hint */}
      {!selectedCell && (
        <div className="absolute bottom-8 right-8 text-xs text-gray-500 font-mono pointer-events-none animate-pulse">
           /// CLICK CUBE TO INSPECT DATA
        </div>
      )}

    </div>
  );
};

export default App;