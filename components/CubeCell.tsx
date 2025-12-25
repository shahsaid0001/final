import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, Vector3 } from 'three';
import { DataPoint } from '../types';
import { CONTENT_TYPE_COLORS, CELL_SIZE, CUBE_SPACING } from '../constants';

// Fix for missing R3F types in JSX by augmenting the React module
// This handles cases where React.JSX is the namespace being checked
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshPhysicalMaterial: any;
    }
  }
}

// Fallback for global JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshPhysicalMaterial: any;
    }
  }
}

interface CubeCellProps {
  data: DataPoint;
  isSelected: boolean;
  isNeighbor: boolean;
  isHoveredAny: boolean; // Is ANY cell currently hovered in the scene?
  onHover: (e: React.PointerEvent, data: DataPoint | null) => void;
  onClick: (data: DataPoint) => void;
}

export const CubeCell: React.FC<CubeCellProps> = ({ 
  data, 
  isSelected, 
  isNeighbor, 
  isHoveredAny,
  onHover, 
  onClick 
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate position based on grid coordinates and spacing
  const position = useMemo(() => new Vector3(
    data.coordinates[0] * CUBE_SPACING,
    data.coordinates[1] * CUBE_SPACING,
    data.coordinates[2] * CUBE_SPACING
  ), [data.coordinates]);

  // Base color
  const baseColor = useMemo(() => new Color(CONTENT_TYPE_COLORS[data.content_type]), [data.content_type]);
  
  // Scale based on metric: avg_session_minutes
  // Range is approx 5 to 110. Normalize roughly 0-120.
  const scaleMetric = 0.8 + (Math.min(data.avg_session_minutes, 120) / 120) * 0.3; 
  const targetScale = isSelected || hovered ? 1.15 : scaleMetric;

  // Opacity logic
  const getTargetOpacity = () => {
    if (isSelected) return 1.0;
    if (hovered) return 0.95;
    if (isHoveredAny && !isNeighbor) return 0.1; // Dim others significantly
    
    // Base transparency on intensity (minutes)
    const baseOpacity = 0.4 + (Math.min(data.avg_session_minutes, 100) / 200);
    return baseOpacity;
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth scaling
    meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), delta * 10);
    
    // Material prop updates (handled via ref to avoid React render overhead on material)
    const material = meshRef.current.material as any;
    
    // Color pulsing if selected
    if (isSelected) {
       const time = state.clock.getElapsedTime();
       const pulse = (Math.sin(time * 3) + 1) / 2 * 0.2; // 0 to 0.2
       material.emissive.set(baseColor).multiplyScalar(0.6 + pulse);
    } else if (hovered) {
       material.emissive.set(baseColor).multiplyScalar(0.5);
    } else {
       // Idle emission based on metric
       material.emissive.set(baseColor).multiplyScalar(0.1 + (data.avg_session_minutes / 200));
    }
    
    // Smooth opacity transition
    material.opacity += (getTargetOpacity() - material.opacity) * delta * 8;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(data);
      }}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        onHover(e, data);
      }}
      onPointerOut={(e: any) => {
        setHovered(false);
        onHover(e, null);
      }}
    >
      <boxGeometry args={[CELL_SIZE, CELL_SIZE, CELL_SIZE]} />
      {/* Physical material for glass effect */}
      <meshPhysicalMaterial
        color={baseColor}
        transparent
        roughness={0.1}
        metalness={0.3}
        transmission={0.5} // Glass-like
        thickness={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};