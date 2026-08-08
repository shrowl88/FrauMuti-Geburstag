import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stars,
  OrbitControls,
  Points,
  PointMaterial,
  Text,
  Billboard,
} from "@react-three/drei";
import { AdditiveBlending, Color, MathUtils } from "three";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// --- KOMPONEN EFEK WARP TRANSITION ---
const warpStarColors = ["#ffffff", "#60a5fa", "#f472b6", "#a78bfa", "#fbbf24"];

function WarpTransition() {
  const stars = useMemo(
    () =>
      Array.from({ length: 400 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 800 + 600;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          delay: Math.random() * 0.8,
          duration: Math.random() * 1 + 0.8,
          size: Math.random() * 2 + 1,
          color:
            warpStarColors[Math.floor(Math.random() * warpStarColors.length)],
        };
      }),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black z-40 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: star.x,
              y: star.y,
              opacity: [0, 1, 0],
              scale: 5,
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeIn",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// --- 1. GALAXY BIMA SAKTI ---
function generateGalaxyData() {
  const count = 25000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const branches = 3;
  const radius = 10;
  const spin = 1.5;

  const colorCore = new Color("#fff9c4");
  const colorMid1 = new Color("#10b981");
  const colorMid2 = new Color("#8b5cf6");
  const colorOuter = new Color("#1e40af");

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 2) * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;

    const randomX =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * 0.3;
    const randomY =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * 0.1;
    const randomZ =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * 0.3;

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    const mixedColor = colorCore.clone();
    if (r / radius < 0.2) mixedColor.lerp(colorMid1, r / (radius * 0.2));
    else if (r / radius < 0.5)
      mixedColor.lerpColors(
        colorMid1,
        colorMid2,
        (r - radius * 0.2) / (radius * 0.3),
      );
    else
      mixedColor.lerpColors(
        colorMid2,
        colorOuter,
        (r - radius * 0.5) / (radius * 0.5),
      );

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  return { positions, colors };
}

function generateAccretionDiskData() {
  const count = 5000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const innerRadius = 0.5;
  const outerRadius = 1.5;
  const colorInner = new Color("#ffffff");
  const colorOuter = new Color("#ffae00");

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;

    positions[i3] = Math.cos(angle) * r;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.1;
    positions[i3 + 2] = Math.sin(angle) * r;

    const mixedColor = colorInner
      .clone()
      .lerp(colorOuter, (r - innerRadius) / (outerRadius - innerRadius));
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  return { positions, colors };
}

function MilkyWayGalaxy({ show }) {
  const outerRef = useRef();
  const coreRef = useRef();
  const galaxyData = useMemo(() => generateGalaxyData(), []);
  const nebulaData = useMemo(() => generateGalaxyData(), []);
  const diskData = useMemo(() => generateAccretionDiskData(), []);

  useFrame(() => {
    if (!outerRef.current || !coreRef.current) return;
    if (show) {
      outerRef.current.rotation.y += 0.0015;
      coreRef.current.rotation.y += 0.005;
    }
    const targetScale = show ? 1 : 0;
    outerRef.current.scale.x = MathUtils.lerp(
      outerRef.current.scale.x,
      targetScale,
      0.03,
    );
    outerRef.current.scale.y = MathUtils.lerp(
      outerRef.current.scale.y,
      targetScale,
      0.03,
    );
    outerRef.current.scale.z = MathUtils.lerp(
      outerRef.current.scale.z,
      targetScale,
      0.03,
    );
  });

  return (
    <group ref={outerRef} scale={0}>
      <Points
        positions={galaxyData.positions}
        colors={galaxyData.colors}
        stride={3}
      >
        <PointMaterial
          vertexColors
          transparent
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </Points>
      <Points
        positions={nebulaData.positions}
        colors={nebulaData.colors}
        stride={3}
      >
        <PointMaterial
          vertexColors
          transparent
          size={0.25}
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </Points>
      <group ref={coreRef}>
        <Points
          positions={galaxyData.positions.slice(0, 3000 * 3)}
          colors={galaxyData.colors.slice(0, 3000 * 3)}
          stride={3}
        >
          <PointMaterial
            vertexColors
            transparent
            size={0.08}
            sizeAttenuation
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </Points>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <Points
          positions={diskData.positions}
          colors={diskData.colors}
          stride={3}
        >
          <PointMaterial
            vertexColors
            transparent
            size={0.08}
            sizeAttenuation
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </Points>
        <Points
          positions={diskData.positions}
          colors={diskData.colors}
          stride={3}
        >
          <PointMaterial
            vertexColors
            transparent
            size={0.2}
            opacity={0.3}
            sizeAttenuation
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </Points>
      </group>
    </group>
  );
}

// --- 2. PARTIKEL LEDAKAN ---
function ExplosionParticles({ phase }) {
  const ref = useRef();
  const matRef = useRef();
  const [positions] = useState(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return arr;
  });
  useFrame(() => {
    if (!ref.current || !matRef.current) return;
    if (phase === "explode" || phase === "galaxy") {
      const targetScale = 15;
      const newScale = MathUtils.lerp(ref.current.scale.x, targetScale, 0.05);
      ref.current.scale.set(newScale, newScale, newScale);
      matRef.current.opacity = MathUtils.lerp(
        matRef.current.opacity,
        phase === "galaxy" ? 0 : 1,
        0.03,
      );
    }
  });
  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      visible={phase === "explode" || phase === "galaxy"}
    >
      <PointMaterial
        ref={matRef}
        transparent
        color="#ffffff"
        size={0.1}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </Points>
  );
}

// --- 3. PESAN MURID (NAMA BERCAHAYA) ---
function getGalaxyOrbitPosition(index, total, radius) {
  const y = 1 - (index / (total - 1)) * 2;
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  const x = Math.cos(theta) * radiusAtY;
  const z = Math.sin(theta) * radiusAtY;

  const jitter = 2.5;
  return [
    x * radius + (Math.random() - 0.5) * jitter,
    y * radius * 0.6 + (Math.random() - 0.5) * jitter,
    z * radius + (Math.random() - 0.5) * jitter,
  ];
}

function MessageItem({ msgData, targetPos, show, onSelect }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.position.x += (targetPos[0] - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetPos[1] - ref.current.position.y) * 0.05;
    ref.current.position.z += (targetPos[2] - ref.current.position.z) * 0.05;

    const baseScale = show ? (hovered ? 1.2 : 0.8) : 0;
    const lerpedScale = MathUtils.lerp(ref.current.scale.x, baseScale, 0.1);
    ref.current.scale.set(lerpedScale, lerpedScale, lerpedScale);
  });

  return (
    <Billboard ref={ref} position={[0, 0, 0]} scale={0}>
      <Text
        fontSize={0.4}
        color={hovered ? "#ffffff" : "#fbbf24"}
        outlineWidth={0.02}
        outlineColor="#ffae00"
        outlineBlur={hovered ? 0.15 : 0.08}
        outlineOpacity={0.9}
        anchorX="center"
        anchorY="middle"
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(msgData);
        }}
      >
        {msgData.name}
      </Text>
    </Billboard>
  );
}

function MessageStars({ show, onSelect }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Kita hapus orderBy agar tidak error jika ada data yang waktu-nya hilang/kosong
    const q = query(collection(db, "messages"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Ambil semua pesan, urutkan manual di frontend berdasarkan waktu (jika ada)
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        msgs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA; // Terbaru di atas
        });
        setMessages(msgs);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <group>
      {messages.map((m, i) => {
        const targetPos = getGalaxyOrbitPosition(i, messages.length, 8);
        return (
          <MessageItem
            key={m.id}
            msgData={m}
            targetPos={targetPos}
            show={show}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

// --- 4. KAMERA & UTAMA ---
function CameraZoomController({ phase }) {
  useFrame((state) => {
    if (phase === "explode")
      state.camera.position.z = MathUtils.lerp(
        state.camera.position.z,
        22,
        0.02,
      );
  });
  return null;
}

export default function GalaxyExperience({ onComplete }) {
  const [phase, setPhase] = useState("explode");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isWarping, setIsWarping] = useState(false); // State untuk transisi warp

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("galaxy"), 1500);
    return () => clearTimeout(t1);
  }, []);

  const isExploded = phase === "explode" || phase === "galaxy";
  const isGalaxy = phase === "galaxy";

  // Fungsi saat tombol Weiter diklik
  const handleWarpNext = () => {
    setIsWarping(true); // Nyalakan efek warp
    setTimeout(() => {
      onComplete(); // Pindah halaman setelah 1.5 detik
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center w-full px-4">
        <h1 className="font-script text-4xl md:text-5xl text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {phase === "galaxy"
            ? "✨ Bintang Penuntun Kami ✨"
            : "💥 Membuka Kenangan 💥"}
        </h1>
        {isGalaxy && (
          <p className="text-amber-200/80 mt-2 text-sm md:text-base font-sans tracking-wide">
            Klik nama-nama bersinar untuk membaca pesan murid-murid Ibu 💌
          </p>
        )}
      </div>

      <Canvas
        camera={{ position: [0, 2, 16], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <CameraZoomController phase={phase} />
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 0, 0]} intensity={15} color="#fff9c4" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />

        <MilkyWayGalaxy show={isExploded} />
        <ExplosionParticles phase={phase} />
        <MessageStars show={isGalaxy} onSelect={setSelectedMsg} />
        <Stars
          radius={150}
          depth={50}
          count={5000}
          factor={4}
          saturation={0.5}
          fade
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={isGalaxy && !selectedMsg}
          autoRotateSpeed={0.2}
        />
      </Canvas>

      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-amber-200/10 mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center gap-1 text-lg text-amber-300 mb-3">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>

              <h3 className="font-serif font-bold text-3xl text-amber-200 mb-3 tracking-wide">
                {selectedMsg.name}
              </h3>

              {selectedMsg.guess && (
                <p className="text-amber-100/60 text-sm italic mb-4">
                  Ciri-ciri: {selectedMsg.guess}
                </p>
              )}
              <p className="text-amber-100/90 font-sans mb-6 text-base">
                {selectedMsg.msg}
              </p>
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-6 py-2.5 rounded-full text-sm text-amber-50 font-medium bg-amber-300/10 backdrop-blur-md border border-amber-200/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-amber-300/20 hover:border-amber-200/60 transition-all whitespace-nowrap"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOMBOL TRANSPARAN MINIMALIST */}
      {isGalaxy && !isWarping && (
        <button
          onClick={handleWarpNext}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-8 py-2 text-amber-200/40 font-light tracking-[0.3em] text-xs uppercase hover:text-amber-200 transition-all bg-transparent"
        >
          Weiter ➔
        </button>
      )}

      {/* EFEK WARP TRANSITION */}
      <AnimatePresence>
        {isWarping && <WarpTransition key="warp-out" />}
      </AnimatePresence>
    </div>
  );
}
