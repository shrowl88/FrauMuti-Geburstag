import { motion } from "framer-motion";

// Variasi warna bintang galaxy
const starColors = ["#ffffff", "#60a5fa", "#f472b6", "#a78bfa", "#fbbf24"];

// Data bintang dibuat di luar komponen agar posisinya tidak berubah saat re-render
const generateStars = (count) =>
  Array.from({ length: count }).map(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 800 + 600;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
      size: Math.random() * 2 + 1,
      color: starColors[Math.floor(Math.random() * starColors.length)], // Warna acak
    };
  });

// Diperbanyak jadi 800 partikel
const stars = generateStars(800);

export default function WarpScreen() {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-black overflow-hidden z-10 flex items-center justify-center"
    >
      {/* EFEK WARPSPEED: Bintang muncul dari tengah dan menyebar ke luar */}
      <div className="absolute inset-0 flex items-center justify-center">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`, // Efek glow warna-warni
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: star.x,
              y: star.y,
              opacity: [0, 1, 0],
              scale: 4,
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

      {/* TEKS SCI-FI: Disesuaikan agar kecil di HP tapi tetap di 1 barisan */}
      <motion.h1
        className="relative z-10 text-white text-[0.65rem] md:text-2xl font-sans tracking-[0.1em] md:tracking-[0.3em] uppercase font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-center px-4 whitespace-nowrap"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨Aufbruch zu einer neuen Galaxie✨
      </motion.h1>
    </motion.div>
  );
}
