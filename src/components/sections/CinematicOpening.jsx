import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../ui/GlassCard";

export default function CinematicOpening({ onContinue }) {
  const base = import.meta.env.BASE_URL;

  const text =
    "Selamat ulang tahun, Kharis 'Babybrot' ku ❤️ Makasih udah jadi rumah paling tenang di tengah dunia yang ribet ini.";
  const [displayed, setDisplayed] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  const [clickCount, setClickCount] = useState(0);
  const [popupMsg, setPopupMsg] = useState("");

  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const messages = [
    "Hai cantik 😍",
    "Hai gemes 😙",
    "Babybrotttttt 🤗",
    "Aku sayang kamu ❤️",
    "Klik lagi pliss 🥰",
  ];

  const targetDate = new Date("2027-03-03").getTime();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 60);

    const now = new Date().getTime();
    const diff = targetDate - now;
    setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)));

    return () => clearInterval(interval);
  }, [text, targetDate]);

  const handleButtonClick = () => {
    if (clickCount < 5) {
      setPopupMsg(messages[clickCount]);
      setPopupPos({
        x: Math.random() * 300 - 150,
        y: Math.random() * 80 - 120,
      });
      setClickCount(clickCount + 1);
      setTimeout(() => setPopupMsg(""), 3500);
    } else {
      onContinue();
    }
  };

  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      <GlassCard className="relative z-10 max-w-2xl text-center min-h-[350px] flex flex-col items-center justify-center p-8 md:p-12">
        <div className="flex justify-center items-center gap-4 mb-6">
          <img
            src={`${base}images/k1.jpeg`}
            alt="Foto 1"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white/80 shadow-md rotate-[-8deg]"
          />
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="title-script text-4xl md:text-6xl"
          >
            Alles Gute zum Geburtstag, Kharis!
          </motion.h1>
          <img
            src={`${base}images/k2.jpg`}
            alt="Foto 2"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white/80 shadow-md rotate-[8deg]"
          />
        </div>

        <p className="text-amber-200 font-semibold tracking-widest text-sm md:text-base mb-6">
          {daysLeft} Tage bis zum Flug nach Deutschland! 03.03.2027
        </p>

        {/* Teks panjang memakai font Playfair Display agar mudah dibaca */}
        <h2 className="font-['Playfair_Display'] italic text-lg md:text-2xl text-white leading-relaxed min-h-[100px] flex items-center justify-center px-4">
          {displayed}
          {!isTypingDone && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-1"
            >
              |
            </motion.span>
          )}
        </h2>

        {isTypingDone && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
            className="mt-8 relative"
          >
            <AnimatePresence>
              {popupMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    x: popupPos.x,
                    y: popupPos.y,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-0 left-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-rose-600 font-bold text-sm whitespace-nowrap z-20"
                >
                  {popupMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* TOMBOL DENGAN GAYA TRANSPARAN MODERN */}
            <button
              onClick={handleButtonClick}
              className="
                relative z-10 inline-flex items-center justify-center
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
              Los geht's! ✈️
            </button>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
