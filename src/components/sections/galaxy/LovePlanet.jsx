import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Points, PointMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { AdditiveBlending, MathUtils } from "three";
import * as random from "maath/random/dist/maath-random.esm";

function HeartPlanet({ exploded }) {
  return (
    <Float speed={2} rotationIntensity={0.5}>
      <mesh scale={exploded ? 0 : 1}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#ff4d6d"
          emissive="#ff1744"
          emissiveIntensity={3}
        />
      </mesh>
    </Float>
  );
}

// EFEK BINTANG BERJALAN (Space Traveling)
function SpaceTravelStars() {
  const ref = useRef();
  const [positions] = useState(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = Math.random() * -40;
    }
    return arr;
  });

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z += 0.3; // Bintang bergerak maju ke arah kamera
    ref.current.rotation.z += 0.001;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function Particles({ show }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 5 }),
  );

  return (
    <Points ref={ref} positions={sphere} stride={3} visible={show}>
      <PointMaterial
        transparent
        color="#c084fc"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

// KAMERA OTOMATIS MUNDUR SAAT MELEDAK
function CameraController({ phase }) {
  useFrame((state) => {
    let targetZ = 8; // Awalnya dekat
    if (phase === "explode") targetZ = 14; // Mundur saat meledak
    state.camera.position.z = MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.03,
    );
  });
  return null;
}

export default function LovePlanet({ onExplode }) {
  const [phase, setPhase] = useState("normal");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("crack"), 3000);
    const t2 = setTimeout(() => setPhase("explode"), 3500);
    const t3 = setTimeout(() => onExplode(), 5500); // 5.5s
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onExplode]);

  return (
    // motion.div ini untuk efek fade out saat pindah ke Galaxy
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-20"
      >
        <h1 className="text-white text-5xl font-bold font-script text-center px-4">
          {phase === "explode" ? "✨ Memory Unlocked ✨" : "❤️ Love Planet"}
        </h1>
      </motion.div>

      <Canvas camera={{ position: [0, 0, 8] }}>
        <CameraController phase={phase} />
        <ambientLight intensity={2} />
        <pointLight position={[5, 5, 5]} intensity={5} />

        <SpaceTravelStars />
        <HeartPlanet exploded={phase === "explode"} />
        <Particles show={phase === "explode"} />
        <Sparkles count={1000} scale={20} size={3} speed={0.5} />
      </Canvas>

      <AnimatePresence>
        {phase === "crack" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white mix-blend-screen pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
