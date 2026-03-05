'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

function Hotspot({ position, title, description }: { position: [number, number, number], title: string, description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Html position={position} center distanceFactor={8}>
      <div className="relative group">
        {/* Pulsing Dot */}
        <button 
          onClick={() => setOpen(!open)}
          className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-transform hover:scale-125 relative z-10"
        >
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />
        </button>

        {/* Glassmorphic Bubble */}
        <div className={`absolute left-6 top-0 w-48 transition-all duration-500 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{title}</h4>
            <p className="text-zinc-300 text-[10px] leading-tight font-medium">{description}</p>
          </div>
        </div>
      </div>
    </Html>
  );
}

function AetherSphere() {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current && !hovered) {
      mesh.current.rotation.x = Math.cos(time / 4) * 0.2;
      mesh.current.rotation.y = Math.sin(time / 4) * 0.2;
    }
  });

  return (
    <group 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Sphere
        ref={mesh}
        args={[1, 100, 200]}
        scale={1.8}
      >
        <MeshDistortMaterial
          color={hovered ? '#4f46e5' : '#6366f1'}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Technical Hotspots */}
      <Hotspot 
        position={[1.2, 0.5, 0.5]} 
        title="Neural Engine" 
        description="8-core dedicated AI processor for real-time intuition." 
      />
      <Hotspot 
        position={[-1.2, -0.8, 0.5]} 
        title="Haptic Sync" 
        description="Sub-millisecond feedback for absolute immersion." 
      />
      <Hotspot 
        position={[0, 1.2, -0.5]} 
        title="Optical Array" 
        description="120-degree spatial tracking with LIDAR depth." 
      />
    </group>
  );
}

export default function ProductStage() {
  return (
    <div className="w-full h-full min-h-[500px] bg-[#050505] rounded-[40px] overflow-hidden relative border border-zinc-800/50 shadow-2xl">
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-2xl tracking-tighter uppercase">Spatial Rig</h3>
        <p className="text-zinc-500 text-sm font-medium">Neural Interface v1.0</p>
      </div>
      
      <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <AetherSphere />
          </Float>
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={3}
            maxDistance={8}
            autoRotate={false}
          />
        </Canvas>
      </div>
      
      <div className="absolute bottom-10 right-10 z-10 pointer-events-none text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
        Tap hotspots for specifications
      </div>
    </div>
  );
}
