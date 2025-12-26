import React, { useMemo, useState } from 'react';
import { OlapCube } from './components/OlapCube';
import { GlobalDashboard } from './components/GlobalDashboard';
import { InfoPanel } from './components/InfoPanel';
import { DataGrid } from './components/DataGrid';
import { generateCubeData } from './services/dataService';
import { DataPoint } from './types';

const App: React.FC = () => {
  const data = useMemo(() => generateCubeData(), []);
  const [selectedCell, setSelectedCell] = useState<DataPoint | null>(null);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const handleCellSelect = (cell: DataPoint) => {
    setSelectedCell(cell);
    setIsGridOpen(false); // Reset grid view when changing selection
  };

  return (
    <div className="w-screen h-screen bg-[#050505] overflow-hidden relative">
      {/* 3D Visualization */}
      <OlapCube 
        data={data} 
        selectedId={selectedCell?.id || null} 
        onSelect={handleCellSelect} 
      />

      {/* UI Overlay */}
      <GlobalDashboard data={data} />
      
      <InfoPanel 
        data={selectedCell} 
        onClose={() => setSelectedCell(null)}
        onOpenGrid={() => setIsGridOpen(true)}
      />

      {/* Full Screen Data Table */}
      {isGridOpen && selectedCell && (
        <DataGrid 
          cellData={selectedCell} 
          onClose={() => setIsGridOpen(false)} 
        />
      )}
      
      {/* Bottom hint */}
      {!selectedCell && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono pointer-events-none animate-pulse">
            /// CLICK A CUBE CELL TO INSPECT SEGMENT
        </div>
      )}
    </div>
  );
};

export default App;