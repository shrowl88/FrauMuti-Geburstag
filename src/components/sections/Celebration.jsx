import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "../ui/FloatingHearts";
import { FiArrowRight } from "react-icons/fi";

// DATA 5 QUOTES (Bisa Anda edit teksnya di sini)
const quotes = [
  {
    title: "Syaikh Muhammad bin Shalih Al-Utsaimin",
    text: "Kedudukan guru itu seperti kedudukan para Nabi dalam menyampaikan ilmu. Mereka adalah pewaris para Nabi. Maka muliakanlah gurumu, karena memuliakan guru adalah bagian dari memuliakan ilmu. — Syaikh Utsaimin",
    btnText: "Weiter",
  },
  {
    title: "Hermann Hesse",
    text: "Wissen kann man lernen. Weisheit muss man leben. Und einen Lehrer erkennt man daran, dass er beides lehrt. — Hermann Hesse",
    btnText: "Weiter",
  },
  {
    title: "Theodor Fontane",
    text: "Ein Lehrer ist jemand, der schwierige Dinge leicht macht, unmögliche Dinge möglich macht und vergessene Träume wahr werden lässt. Was ein Lehrer heute in unsere Herzen sät, wird die Welt von morgen ernten. — Theodor Fontane",
    btnText: "Weiter",
  },
  {
    title: "HR. Tirmidzi",
    text: "Sesungguhnya Allah, para malaikat-Nya, penghuni langit dan bumi, sampai semut di dalam lubangnya dan ikan di lautan, bershalawat kepada orang yang mengajarkan kebaikan kepada manusia. — HR. Tirmidzi",
    btnText: "Weiter",
  },
  {
    title: "Mustafa Kemal Atatürk",
    text: "Ein guter Lehrer ist wie eine Kerze – er verzehrt sich selbst, um anderen den Weg zu leuchten. — Mustafa Kemal Atatürk",
    btnText: "Weiter",
  },
  {
    title: "Albert Einstein",
    text: "Es ist die Kunst, das, was lehrbar ist, so zu lehren, dass es als Geschenk empfunden wird.  — Albert Einstein",
    btnText: "Weiter",
  },
];

export default function Celebration({ onContinue }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < quotes.length - 1) {
      setStep(step + 1);
    } else {
      onContinue();
    }
  };

  const currentQuote = quotes[step];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-12 text-center">
      <FloatingHearts count={30} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          {/* JUDUL QUOTE */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="font-script text-3xl md:text-6xl text-amber-200 z-10 drop-shadow-lg leading-tight max-w-xl mb-8"
          >
            {currentQuote.title}
          </motion.h1>

          {/* KARTU PESAN */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="z-10 max-w-md md:max-w-xl w-full bg-white/5 backdrop-blur-md border border-amber-200/20 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(252,211,77,0.15)]"
          >
            <p className="font-serif text-sm md:text-base text-amber-100/90 text-justify leading-loose md:leading-relaxed">
              {currentQuote.text}
            </p>
          </motion.div>

          {/* TOMBOL LANJUT */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={handleNext}
            className="
              mt-8 md:mt-12 z-20 flex items-center gap-2
              px-10 md:px-20 py-3 md:py-4 rounded-full
              text-amber-50 font-semibold tracking-wider text-sm md:text-base
              bg-amber-300/10 backdrop-blur-md border border-amber-200/40
              shadow-[0_0_30px_rgba(252,211,77,0.3)]
              hover:bg-amber-300/20 hover:border-amber-200/60 transition-all
            "
          >
            {currentQuote.btnText} <FiArrowRight />
          </motion.button>

          {/* INDIKATOR TITIK PROGRES (1/5, 2/5, dst) */}
          <div className="flex gap-2 mt-8 z-20">
            {quotes.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "bg-amber-300 w-6" : "bg-amber-200/30"}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
