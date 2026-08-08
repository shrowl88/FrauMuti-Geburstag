import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function WelcomeGate({ onEnter }) {
  // GANTI INI: Masukkan nama file foto guru Anda di folder public/images/
  const guruImage = "/images/muti2.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md text-center p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-amber-200/20 shadow-[0_0_40px_rgba(252,211,77,0.1)]"
    >
      {/* FOTO PNG GURU DENGAN EFEK MELAYANG */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto w-32 h-32 md:w-40 md:h-40 mb-6 relative"
      >
        <img
          src={guruImage}
          alt="Frau Mutiara Safarina"
          className="w-full h-full object-cover rounded-full border-4 border-amber-200/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
        />
        {/* Glow cahaya di belakang foto */}
        <div className="absolute inset-0 rounded-full blur-2xl bg-amber-300/20 -z-10 scale-110"></div>
      </motion.div>

      {/* JUDUL: Menggunakan font-fredoka, dipotong jadi 2 baris manual */}
      <h1 className="font-fredoka font-semibold text-2xl md:text-4xl tracking-wide text-amber-200 mb-4 drop-shadow-lg leading-tight">
        Willkommen zu einem <br /> besonderen Tag
      </h1>

      {/* NAMA: whitespace-nowrap agar tidak pernah patah ke bawah */}
      <h2 className="font-script text-3xl md:text-5xl text-amber-100 mb-6 whitespace-nowrap">
        Frau Mutiara Safarina
      </h2>

      <p className="font-fredoka text-amber-100/80 text-sm md:text-base mb-8 leading-relaxed">
        Eine kleine Überraschung als Zeichen unserer aufrichtigen Dankbarkeit
        für Ihre Hingabe und Liebe.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEnter}
        className="font-fredoka inline-flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-4 rounded-full text-amber-50 font-semibold tracking-wider text-xs md:text-base bg-amber-300/10 backdrop-blur-md border border-amber-200/40 shadow-[0_0_30px_rgba(252,211,77,0.3)] hover:bg-amber-300/20 hover:border-amber-200/60 transition-all"
      >
        Lasst uns die Klassenzimmertür öffnen
      </motion.button>
    </motion.div>
  );
}
