import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import { Edges } from '@react-three/drei';
import { DataPoint } from '../types';
import { CUBE_SPACING, BASE_SIZE, TYPE_COLORS } from '../constants';

// Declare intrinsic elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

interface CubeCellProps {
  data: DataPoint;
  isSelected: boolean;
  onHover: (data: DataPoint | null) => void;
  onSelect: (data: DataPoint) => void;
}

export const CubeCell: React.FC<CubeCellProps> = ({
  data,
  isSelected,
  onHover,
  onSelect
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Interaction State Logic
  const isActive = isSelected || hovered;
  
  // Base visual targets
  const baseColor = new Color(TYPE_COLORS[data.colorType]);
  
  // Emissive Glow Logic
  let targetEmissiveIntensity = 0.0;
  let targetScale = BASE_SIZE;

  // Only change properties if THIS cell is active. 
  // Neighbors and others remain static (no blinking).
  if (isActive) {
    targetScale = BASE_SIZE * 1.1; // Pop out slightly
    targetEmissiveIntensity = 1.0; // Strong glow on active
  } 

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Smooth Scale Transition
    const currentScale = meshRef.current.scale.x;
    const step = (targetScale - currentScale) * delta * 12; // Fast elastic snap
    meshRef.current.scale.setScalar(currentScale + step);

    const material = meshRef.current.material as any;
    
    // 2. Smooth Glow (Emissive) Transition
    const currentEmissive = material.emissiveIntensity;
    material.emissiveIntensity += (targetEmissiveIntensity - currentEmissive) * delta * 10;
    
    // Set emissive color to match the base color
    material.emissive.set(baseColor);
    
    // 3. Pulse effect ONLY if selected
    if (isSelected) {
        const time = state.clock.getElapsedTime();
        // A heartbeat pulse
        const pulse = (Math.sin(time * 6) + 1) * 0.5; 
        material.emissiveIntensity = 1.0 + (pulse * 0.5);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[
        data.position[0] * CUBE_SPACING,
        data.position[1] * CUBE_SPACING,
        data.position[2] * CUBE_SPACING
      ]}
      onClick={(e: any) => {
        e.stopPropagation();
        onSelect(data);
      }}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        onHover(data);
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      
      {/* 
        Solid Matte Material 
        roughness: High (0.6) for matte look
        metalness: Low (0.1) for plastic/ceramic feel
        emissive: Enables the glow effect
      */}
      <meshStandardMaterial
        color={baseColor}
        roughness={0.6}
        metalness={0.1}
        emissive={baseColor}
        emissiveIntensity={0}
      />

      {/* 
        Edges for the "Grid" look.
        White when active, dark grey otherwise.
      */}
      <Edges
        scale={1.0}
        threshold={15}
        color={isActive ? "white" : "#1a1a1a"}
        renderOrder={1000}
      />
    </mesh>
  );
};