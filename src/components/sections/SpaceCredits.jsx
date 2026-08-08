import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { AdditiveBlending, Color } from "three";
import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

// --- KOMPONEN BINTANG BERBAGAI WARNA DAN UKURAN ---
function generateStarData(count, range, colors) {
  const positions = new Float32Array(count * 3);
  const colorArr = new Float32Array(count * 3);
  const colorObj = new Color();

  for (let i = 0; i < count; i++) {
    // Posisi acak di ruang 3D
    positions[i * 3] = (Math.random() - 0.5) * range;
    positions[i * 3 + 1] = (Math.random() - 0.5) * range;
    positions[i * 3 + 2] = (Math.random() - 0.5) * range;

    // Warna acak dari array warna
    const c = colors[Math.floor(Math.random() * colors.length)];
    colorObj.set(c);
    colorArr[i * 3] = colorObj.r;
    colorArr[i * 3 + 1] = colorObj.g;
    colorArr[i * 3 + 2] = colorObj.b;
  }
  return { positions, colorArr };
}

function FlyingStars() {
  const groupRef = useRef();

  // Lapisan 1: Bintang kecil putih (banyak)
  const smallStars = useMemo(
    () => generateStarData(2000, 40, ["#ffffff", "#e5e7eb"]),
    [],
  );
  // Lapisan 2: Bintang sedang warna-warni (emas & hijau)
  const medStars = useMemo(
    () => generateStarData(500, 30, ["#fbbf24", "#34d399", "#60a5fa"]),
    [],
  );
  // Lapisan 3: Bintang besar (sedikit, melayang lambat)
  const largeStars = useMemo(
    () => generateStarData(100, 20, ["#ffffff", "#fde68a"]),
    [],
  );

  useFrame(() => {
    if (!groupRef.current) return;
    // Melayang perlahan ke atas dan berputar
    groupRef.current.rotation.y += 0.0005;
    groupRef.current.rotation.x += 0.0002;
    groupRef.current.position.y += 0.005; // Bergerak ke atas

    // Reset posisi agar tidak jauh meninggalkan kamera
    if (groupRef.current.position.y > 5) {
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Bintang Kecil */}
      <Points
        positions={smallStars.positions}
        colors={smallStars.colorArr}
        stride={3}
      >
        <PointMaterial
          vertexColors
          transparent
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={0.8}
        />
      </Points>

      {/* Bintang Sedang */}
      <Points
        positions={medStars.positions}
        colors={medStars.colorArr}
        stride={3}
      >
        <PointMaterial
          vertexColors
          transparent
          size={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={0.9}
        />
      </Points>

      {/* Bintang Besar (Berkedip sedang) */}
      <Points
        positions={largeStars.positions}
        colors={largeStars.colorArr}
        stride={3}
      >
        <PointMaterial
          vertexColors
          transparent
          size={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={1}
        />
      </Points>
    </group>
  );
}

// --- KOMPONEN UTAMA ---
export default function SpaceCredits({ onRestart }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-black px-4 py-10">
      {/* BACKGROUND BINTANG BERBAGAI WARNA DAN UKURAN */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <FlyingStars />
        </Canvas>
        {/* Overlay gradient agar teks tetap terbaca di tengah bintang */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0.95)_100%)] pointer-events-none"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-2xl"
      >
        {/* JUDUL DENGAN EFEK NEON GLOW BERDENYUT */}
        <motion.h1
          className="font-script text-4xl md:text-6xl text-amber-200 mb-8"
          animate={{
            textShadow: [
              "0 0 5px rgba(252,211,77,0.5)",
              "0 0 20px rgba(252,211,77,0.8), 0 0 40px rgba(252,211,77,0.4)",
              "0 0 5px rgba(252,211,77,0.5)",
            ],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Terima Kasih, Frau Mutiara Safarina
        </motion.h1>

        <p className="font-serif text-amber-100/90 text-base md:text-lg leading-loose mb-10 drop-shadow-lg">
          Setiap bintang di langit malam ini adalah perwujudan dari rasa terima
          kasih kami. Terima kasih sudah menjadi cahaya yang menuntun kami di
          masa gelap, dan menjadi bintang penuntun yang tak pernah lelah
          menerangi jalan kami.
          <br />
          <br />
          Semoga kebaikan, ilmu, dan dedikasi Frau kembali berlipat ganda di
          dunia maupun di akhirat.
        </p>

        {/* Credit Pembuat */}
        <div className="border-t border-amber-200/20 pt-6 mt-4 w-full backdrop-blur-sm">
          <p className="text-amber-200/60 text-sm tracking-widest uppercase mb-2">
            MIT LIEBE GEMACHT VON
          </p>
          <p className="font-serif text-amber-100 text-xl mb-6">
            Die Schüler von Frau Mutiara Safarina
          </p>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(252,211,77,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full text-amber-50 font-semibold bg-amber-300/10 backdrop-blur-md border border-amber-200/40 hover:bg-amber-300/20 transition-all"
          >
            <FiRefreshCw /> Erinnerungen neu abspielen
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
