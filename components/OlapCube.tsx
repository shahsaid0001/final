import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Sparkles } from '@react-three/drei';
import { DataPoint } from '../types';
import { CubeCell } from './CubeCell';

// Declare intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      ambientLight: any;
      pointLight: any;
      gridHelper: any;
      color: any;
    }
  }
}

interface OlapCubeProps {
  data: DataPoint[];
  selectedId: string | null;
  onSelect: (data: DataPoint) => void;
}

export const OlapCube: React.FC<OlapCubeProps> = ({ data, selectedId, onSelect }) => {
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  return (
    <div className="w-full h-full bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        {/* Deep space black background */}
        <color attach="background" args={['#020205']} />
        
        {/* Camera positioned closer for the 3x3x3 unit cube */}
        <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={40} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2.0} color="white" />
        <pointLight position={[-10, -5, -5]} intensity={1.5} color="#4c1d95" />
        
        {/* Enhanced Star Field */}
        <Stars 
          radius={100} 
          depth={50} 
          count={7000} 
          factor={6} 
          saturation={0.5} 
          fade 
          speed={0.5} 
        />
        
        {/* Floating sparkles for extra depth and "magical" space feel */}
        <Sparkles 
          count={500} 
          scale={[20, 20, 20]} 
          size={3} 
          speed={0.3} 
          opacity={0.7} 
          noise={0.1}
        />

        <Environment preset="city" />

        <group>
          {data.map((point) => (
            <CubeCell
              key={point.id}
              data={point}
              isSelected={selectedId === point.id}
              onHover={(d) => setHoveredData(d)}
              onSelect={onSelect}
            />
          ))}
        </group>

        {/* Visual Guide Grid */}
        <gridHelper 
            args={[20, 20, 0x333333, 0x111111]} 
            position={[0, -3.5, 0]} 
        />

        <OrbitControls 
            enablePan={false}
            autoRotate={!selectedId && !hoveredData}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={20}
            target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};