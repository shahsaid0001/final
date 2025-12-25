import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { DataPoint, AxisConfig } from '../types';
import { CubeCell } from './CubeCell';
import { CUBE_SPACING } from '../constants';
import * as THREE from 'three';

// Fix for missing R3F types in JSX by augmenting the React module
// This handles cases where React.JSX is the namespace being checked
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

// Fallback for global JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface OlapCubeProps {
  data: DataPoint[];
  axes: AxisConfig;
  selectedId: string | null;
  onCellSelect: (data: DataPoint) => void;
  onHoverChange: (data: DataPoint | null, x: number, y: number) => void;
}

export const OlapCube: React.FC<OlapCubeProps> = ({ 
  data, 
  axes, 
  selectedId, 
  onCellSelect, 
  onHoverChange 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Helper to find neighbors
  const isNeighbor = (targetId: string, candidateId: string): boolean => {
    if (targetId === candidateId) return true;
    const target = data.find(d => d.id === targetId);
    const candidate = data.find(d => d.id === candidateId);
    if (!target || !candidate) return false;

    // Euclidean distance in grid units
    const dx = target.coordinates[0] - candidate.coordinates[0];
    const dy = target.coordinates[1] - candidate.coordinates[1];
    const dz = target.coordinates[2] - candidate.coordinates[2];
    
    // Immediate neighbors (including diagonals for a cluster feel) distance <= 1.5
    // Strictly orthogonal neighbors would be distSq === 1
    const distSq = dx*dx + dy*dy + dz*dz;
    return distSq <= 2.1; // Allows touching diagonals
  };

  const handleHover = (e: React.PointerEvent, cellData: DataPoint | null) => {
    if (cellData) {
      setHoveredId(cellData.id);
      onHoverChange(cellData, e.clientX, e.clientY);
    } else {
      setHoveredId(null);
      onHoverChange(null, 0, 0);
    }
  };

  // Axis lines visualizer (simple boxes to show axis direction)
  const AxisIndicator = () => (
    <group position={[
      -axes.x.length * CUBE_SPACING / 2 - 2, 
      -axes.y.length * CUBE_SPACING / 2 - 2, 
      -axes.z.length * CUBE_SPACING / 2 - 2
    ]}>
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[4, 0.1, 0.1]} />
        <meshBasicMaterial color="#666" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshBasicMaterial color="#666" />
      </mesh>
      <mesh position={[0, 0, 2]}>
        <boxGeometry args={[0.1, 0.1, 4]} />
        <meshBasicMaterial color="#666" />
      </mesh>
    </group>
  );

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4c1d95" /> {/* Purple rim light */}
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <group>
            {data.map((point) => (
            <CubeCell
                key={point.id}
                data={point}
                isSelected={selectedId === point.id}
                isNeighbor={hoveredId ? isNeighbor(hoveredId, point.id) : false}
                isHoveredAny={!!hoveredId}
                onHover={handleHover}
                onClick={onCellSelect}
            />
            ))}
            <AxisIndicator />
        </group>

        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={20} 
          autoRotate={!selectedId && !hoveredId} 
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};