import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function MemoryPhotos() {
  // PENTING: pastikan ekstensi sama dengan file di public/images
  const photos = [
    "/images/memory1.jpeg",
    "/images/memory2.jpeg",
    "/images/memory3.jpeg",
    "/images/memory4.jpeg",
    "/images/memory5.jpeg",
    "/images/memory6.jpeg",
  ];

  return (
    <group>
      {photos.map((src, i) => {
        const angle = (i / photos.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i) * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial
              map={useLoader(TextureLoader, src)}
              side={DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Tambah import ini di atas
import { TextureLoader, DoubleSide } from "three";
import { useLoader } from "@react-three/fiber";

export default function MemoryGalaxy() {
  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white text-5xl z-10 font-script">
        Our Memory Galaxy 🌌
      </div>
      <Canvas camera={{ position: [0, 2, 15] }}>
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <MemoryPhotos />
        <OrbitControls enableZoom={false} autoRotate speed={0.3} />
      </Canvas>
    </div>
  );
}
