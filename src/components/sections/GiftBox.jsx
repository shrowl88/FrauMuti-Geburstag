import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

// Komponen Kembang Api (Confetti Effect)
const ConfettiBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-2xl"
        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
        animate={{
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
          opacity: 0,
          scale: 1.5,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {["🎉", "✨", "🎊", "💖", "🌟"][i % 5]}
      </motion.div>
    ))}
  </div>
);

export default function GiftBox({ onContinue }) {
  const [stage, setStage] = useState("closed"); // closed -> choosing -> selected
  const [selectedGift, setSelectedGift] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const giftBoxImage = "images/giftbox.png";

  // Data untuk 4 pilihan hadiah + pesan rahasia masing-masing
  // Ditambahkan properti 'title' untuk menggantikan 'Meow/Miaw' saat diklik
  const gifts = [
    {
      id: 0,
      text: "Meow",
      title: "Das Dumme Klassenfoto 🤪",
      emoji: "🐾",
      message:
        "Geschenk: Foto mit der Klasse in der dümmsten Pose! Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe!",
    },
    {
      id: 1,
      text: "Miaw",
      title: "Anti-Stress Paket ☕",
      emoji: "😁",
      message:
        "Kaffee, Tee und Schokolade für extra Energie beim Unterrichten. Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe. Die Klasse hat eine Überraschung für Sie!",
    },
    {
      id: 2,
      text: "Meow",
      title: "Gutschein-Box 🎫",
      emoji: "💖",
      message:
        "Gutscheine von der Klasse: 1x Freiklasse, 1x Keine Hausaufgaben, 1x Tianlala. Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe, um Ihren Gutschein einzulösen!",
    },
    {
      id: 3,
      text: "Miaw",
      title: "Klassen-Konzert 🎤",
      emoji: "🤩",
      message:
        "Geschenk: Die ganze Klasse singt ein Lied nur für Sie! Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe!",
    },
    {
      id: 4,
      text: "Miaw",
      title: "Königin für einen Tag 👑",
      emoji: "🌸",
      message:
        "Geschenk: Sie sind 1 Tag die Königin. Wir machen alles, was Sie sagen! Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe!",
    },
    {
      id: 5,
      text: "Miaw",
      title: "ZONK - PR Doppel 💀",
      emoji: "🤭",
      message:
        "ZONK! Doppelte Hausaufgaben für nächste Woche. Bitte machen Sie einen Screenshot und schicken Sie ihn in die Klassengruppe!",
    },
  ];

  const handleOpenBox = () => {
    setShowConfetti(true);
    setStage("choosing");

    setTimeout(() => {
      setShowConfetti(false);
    }, 1000);
  };

  const handleSelectGift = (id) => {
    if (selectedGift !== null) return; // Cegah klik ganda
    setSelectedGift(id);
    setStage("selected");
  };

  const handleNextPage = () => {
    if (typeof onContinue === "function") onContinue();
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-8 py-10 relative overflow-hidden">
      {/* Efek Kembang Api */}
      <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>

      {/* TAMPILAN 1: KADO AWAL */}
      <AnimatePresence>
        {stage === "closed" && (
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            animate={{
              y: [0, -15, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            onClick={handleOpenBox}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
          >
            <img
              src={giftBoxImage}
              alt="Gift Box"
              className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(255,182,193,0.4)] pointer-events-none select-none"
            />
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-300 font-serif text-xl animate-pulse whitespace-nowrap">
              Tippen zum Öffnen
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAMPILAN 2 & 3: PILIHAN HADIAH & TAMPILAN TERPILIH */}
      <AnimatePresence>
        {stage === "choosing" || stage === "selected" ? (
          <motion.div
            className="flex flex-col items-center justify-center gap-8 z-10 w-full px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* JUDUL (Hilang saat sudah memilih) */}
            <motion.h2
              className="font-script text-4xl md:text-5xl text-amber-200 text-center drop-shadow-[0_0_15px_rgba(255,182,193,0.5)]"
              animate={{
                opacity: stage === "selected" ? 0 : 1,
                height: stage === "selected" ? 0 : "auto",
                marginBottom: stage === "selected" ? 0 : 16,
              }}
            >
              Wählen Sie ein Geschenk aus
            </motion.h2>

            {/* KONTAINER HADIAH */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 min-h-[200px] items-center">
              {gifts.map((gift) => {
                const isSelected = selectedGift === gift.id;

                if (stage === "selected" && !isSelected) return null;

                return (
                  <motion.button
                    key={gift.id}
                    layout
                    initial={{ scale: 0, y: 50, opacity: 0 }}
                    animate={{
                      scale: isSelected && stage === "selected" ? 1.1 : 1,
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                    }}
                    whileHover={
                      stage === "choosing" ? { scale: 1.1, y: -5 } : {}
                    }
                    onClick={() => handleSelectGift(gift.id)}
                    className="relative w-36 h-36 md:w-44 md:h-44 flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border-2 border-amber-300/40 shadow-[0_0_20px_rgba(255,182,193,0.2)] p-4"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-md text-sm">
                      🎀
                    </div>

                    <span className="text-4xl md:text-5xl mb-2">
                      {gift.emoji}
                    </span>

                    {/* LOGIKA GANTI TEKS: Jika sudah dipilih, tampilkan 'title', jika belum tampilkan 'text' */}
                    <span className="text-amber-100 font-serif text-base md:text-lg text-center px-2">
                      {isSelected && stage === "selected"
                        ? gift.title
                        : gift.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* PESAN & TOMBOL LANJUT */}
            <AnimatePresence>
              {stage === "selected" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center gap-6 mt-4 w-full max-w-lg"
                >
                  {/* Teks Pesan */}
                  <div className="bg-amber-500/10 backdrop-blur-md border border-amber-300/40 px-6 py-5 rounded-2xl shadow-[0_0_30px_rgba(255,182,193,0.2)] text-center">
                    <p className="text-sm md:text-base text-amber-100 font-semibold tracking-wider drop-shadow-[0_0_10px_rgba(255,182,193,0.5)] leading-relaxed">
                      {gifts[selectedGift].message} 🤍
                    </p>
                  </div>

                  {/* Tombol Transparan Modern */}
                  <button
                    onClick={handleNextPage}
                    className="
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
                      flex items-center gap-2
                    "
                  >
                    Mein Geschenk speichern
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
