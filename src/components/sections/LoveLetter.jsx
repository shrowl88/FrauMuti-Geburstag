import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoveLetter({ onContinue }) {
  const [phase, setPhase] = useState(0); // 0: Amplop, 1: Pecah Segel, 2: Surat Keluar, 3: Selesai Ngetik
  const [typedLength, setTypedLength] = useState(0);
  const [isExiting, setIsExiting] = useState(false); // State untuk animasi hancur
  const [showPopup, setShowPopup] = useState(false); // State untuk pop-up make a wish

  // GANTI INI: Masukkan nama file gambar Anda di folder public/images/
  const envelopeImage = "images/amplop.png";
  const paperImage = "images/paper.png";
  const sealImage = "images/stempel.png";

  const fullText = `Heute ist ein wunderbarer Mensch geboren.  
Und wir sind so dankbar, dass dieser Mensch Sie sind, liebe Frau Mutiara Safarina.  

Danke für Ihr Wissen und Ihre Geduld.  
Danke, dass Sie für uns ein Ort des Friedens sind.  
Danke für Ihr Lächeln, das unsere Laune heller macht.  
Und danke, dass Sie jeden Tag mit Ihnen zu etwas Schönem machen.  

Herzlichen Glückwunsch zum Geburtstag.  
Möge es noch viele Erinnerungen geben,  
noch mehr Lachen  
und noch viele gemeinsame Momente mit Ihnen.`;

  useEffect(() => {
    if (phase === 2 && typedLength < fullText.length) {
      const char = fullText[typedLength];
      const delay = char === "." || char === "," ? 400 : 45;
      const timeout = setTimeout(() => setTypedLength(typedLength + 1), delay);
      return () => clearTimeout(timeout);
    } else if (phase === 2 && typedLength === fullText.length) {
      setTimeout(() => setPhase(3), 800);
    }
  }, [phase, typedLength, fullText]);

  const handleOpenSeal = () => {
    if (phase > 0) return;
    setPhase(1);
    setTimeout(() => setPhase(2), 1200);
  };

  const handleWishClick = () => {
    setShowPopup(true); // Munculin pop up dulu saat stempel diklik
  };

  const handleConfirmWish = () => {
    setShowPopup(false); // Tutup pop up
    setIsExiting(true); // Memicu animasi kertas hancur
    setTimeout(() => onContinue(), 1800); // Pindah halaman setelah 1.8 detik
  };

  // Partikel debu emas saat segel pertama pecah
  const GoldParticles = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * 360;
        const x = Math.cos((angle * Math.PI) / 180) * (50 + Math.random() * 50);
        const y = Math.sin((angle * Math.PI) / 180) * (50 + Math.random() * 50);
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );

  // Partikel Ledakan Magis saat kertas dihancurkan
  const MagicBurst = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = Math.random() * 360;
        const distance = 200 + Math.random() * 400;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-200"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x,
              y,
              opacity: [1, 1, 0],
              scale: [0, Math.random() * 2 + 1, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: Math.random() * 0.3,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-10">
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          // FASE 1: AMPLOP MELAYANG (Diperbesar)
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              duration: 0.5,
            }}
            className="relative z-10 cursor-pointer flex flex-col items-center"
            onClick={handleOpenSeal}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-rose-500/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img
              src={envelopeImage}
              alt="Amplop"
              className="relative z-10 w-80 md:w-96 object-contain drop-shadow-2xl"
            />
            <motion.p
              className="absolute bottom-[-2rem] text-amber-200/80 text-sm font-['Google_Sans','Roboto',sans-serif] tracking-widest uppercase"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              --Zum Öffnen aufreißen--
            </motion.p>
          </motion.div>
        ) : (
          // FASE 2 & 3: SURAT KELUAR & EFEK MESIN TIK
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={
              isExiting
                ? { opacity: 0, scale: 0.8, filter: "blur(8px)" }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{
              duration: isExiting ? 1.2 : 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 w-full max-w-lg px-4"
          >
            {/* Cahaya warm di belakang kertas */}
            <motion.div
              className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full"
              animate={{
                opacity: phase === 3 ? [0.2, 0.5, 0.2] : 0.2,
                scale: phase === 3 ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div
              className="relative rounded-lg p-10 md:p-14 shadow-2xl bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${paperImage})` }}
            >
              <h2 className="title-script text-5xl text-rose-800 mb-8 text-center">
                An unsere liebste Lehrerin,,
              </h2>

              <div className="font-['Playfair_Display'] italic text-stone-800 text-base md:text-lg space-y-4 leading-relaxed min-h-[200px] whitespace-pre-wrap">
                {fullText.split("").map((char, i) => {
                  if (i < typedLength) {
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        {char}
                      </motion.span>
                    );
                  }
                  return null;
                })}
                {phase === 2 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-rose-800 font-bold"
                  >
                    |
                  </motion.span>
                )}
              </div>

              {/* FASE 4: TOMBOL STEMPEL PNG DENGAN TEKS */}
              <AnimatePresence>
                {phase === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center mt-10"
                  >
                    <p className="title-script text-3xl text-rose-800 mb-8">
                      Mit Liebe, Ihre Klasse.
                    </p>

                    <motion.button
                      onClick={handleWishClick}
                      whileHover={{ scale: 1.1 }}
                      className="relative w-28 h-28 cursor-pointer flex items-center justify-center"
                    >
                      {/* Sparkles berkumpul di sekitar tombol PNG */}
                      {Array.from({ length: 6 }).map((_, i) => {
                        const angle = (i / 6) * 360;
                        const x = Math.cos((angle * Math.PI) / 180) * 50;
                        const y = Math.sin((angle * Math.PI) / 180) * 50;
                        return (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-amber-200 z-10"
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            whileHover={{
                              x,
                              y,
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        );
                      })}

                      {/* Gambar Stempel PNG Anda */}
                      <img
                        src={sealImage}
                        alt="Make a Wish Seal"
                        className="w-full h-full object-contain drop-shadow-lg relative z-0"
                      />

                      {/* TEKS "Make a Wish" DI TENGAH STEMPEL */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                        <span className="font-['Playfair_Display'] italic font-bold text-amber-200 text-xs sm:text-sm text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight transform -rotate-12">
                          Ein Wunsch <br /> für Sie
                        </span>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VISUAL BURST (Pecah Segel Awal) */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <GoldParticles />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EFEK KERTAS HANCUR JADI PARTIKEL CAHAYA */}
      <AnimatePresence>
        {isExiting && (
          <motion.div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
            <MagicBurst />
          </motion.div>
        )}
      </AnimatePresence>

      {/* POP UP "MAKE A WISH" */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md text-center shadow-2xl border border-white/20 mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="title-script text-4xl mb-4 text-amber-200">
                Hast du dir schon etwas gewünscht? 🌟
              </h3>
              <p className="font-['Google_Sans','Roboto',sans-serif] text-amber-100/90 mb-8 text-base">
                Möge all deine Wünsche und Gebete in Erfüllung gehen, liebe Frau
                Safarina
              </p>

              {/* TOMBOL SAMA KAYA LANJUT BABYBROTT (Kecil, Transparan, Modern) */}
              <div className="flex justify-center w-full">
                <button
                  onClick={handleConfirmWish}
                  className="
                    px-6 py-2.5 rounded-full 
                    text-sm text-amber-50 font-medium 
                    bg-amber-300/10 backdrop-blur-md border border-amber-200/40 
                    shadow-[0_0_20px_rgba(255,182,193,0.2)] 
                    hover:bg-amber-300/20 hover:border-amber-200/60 
                    transition-all whitespace-nowrap
                  "
                >
                  Weiter, liebe Frau ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
