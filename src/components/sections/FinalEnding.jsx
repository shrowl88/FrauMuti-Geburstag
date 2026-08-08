import { motion } from "framer-motion";
import FloatingHearts from "../ui/FloatingHearts";
import { FiCompass } from "react-icons/fi";

export default function FinalEnding({ onContinue }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4">
      <FloatingHearts count={50} />

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        // Warna diubah ke amber muda agar terlihat di background gelap
        className="font-serif text-3xl md:text-5xl text-amber-100 leading-relaxed z-10 max-w-3xl"
      >
        "Ein guter Lehrer berührt die Seele und verändert die Zukunft. Danke,
        Frau Muti."
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
        className="font-script text-2xl text-amber-200 mt-8 z-10"
      >
        Alles Gute zum Geburtstag. Wir danken Ihnen von Herzen.
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 4, type: "spring" }}
        className="mt-12 z-10 text-4xl text-rose-400"
      >
        ❤
      </motion.div>

      {/* Tombol menuju Galaxy 3D (Gaya Transparan Modern) */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5 }}
        onClick={onContinue}
        className="
          mt-12 z-10 flex items-center gap-2
          px-14 md:px-20
          py-3 md:py-4
          rounded-full
          text-amber-50
          font-semibold
          tracking-wider
          bg-amber-300/10
          backdrop-blur-md
          border border-amber-200/40
          shadow-[0_0_30px_rgba(255,182,193,0.3)]
          hover:bg-amber-300/20
          hover:border-amber-200/60
          transition-all
        "
      >
        Für unsere beste Lehrerin
        <FiCompass />
      </motion.button>
    </div>
  );
}
