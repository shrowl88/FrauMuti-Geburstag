import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMicrophone } from "../../hooks/useMicrophone";

export default function BirthdayCake({ onBlow }) {
  const [isLit, setIsLit] = useState(true);
  const [showPitchBlack, setShowPitchBlack] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  const handleBlow = () => {
    setIsLit(false);
    setShowPitchBlack(true);

    setTimeout(() => {
      setShowPitchBlack(false);
      setShowSurprise(true);
    }, 1500);

    setTimeout(() => onBlow(), 4000);
  };

  const { isListening, volume, startListening } = useMicrophone(handleBlow);
  const volumeScale = 1 + volume / 100;

  const cakeImage = "images/cake.png";

  const Smoke = () => (
    <motion.div
      className="absolute top-0 w-5 h-5 bg-amber-100/40 rounded-full blur-md"
      initial={{ y: 0, opacity: 0.8, scale: 1 }}
      animate={{ y: -80, opacity: 0, scale: 3 }}
      transition={{ duration: 3, ease: "easeOut" }}
    />
  );

  const LightBurst = () => (
    <motion.div
      className="absolute top-0 w-1.5 h-1.5 rounded-full bg-amber-200"
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{
        x: (Math.random() - 0.5) * 150,
        y: -Math.random() * 100 - 20,
        opacity: [1, 1, 0],
        scale: Math.random() * 2 + 1,
      }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  );

  const Flame = () => (
    <div className="relative flex flex-col items-center">
      {isLit ? (
        <>
          <motion.div
            className="absolute -top-8 w-20 h-20 rounded-full blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,100,0.6) 0%, rgba(0,0,0,0) 70%)",
            }}
            animate={{
              scale: [1, 1.15, 0.9, 1.1, 1],
              opacity: [0.7, 1, 0.6, 0.9, 0.7],
            }}
            transition={{ duration: 0.2, repeat: Infinity }}
          />
          <motion.div
            className="w-3.5 h-9 md:w-4 md:h-10 bg-gradient-to-t from-orange-700 via-orange-400 to-yellow-200 rounded-full origin-bottom shadow-[0_0_15px_rgba(255,200,100,0.8)]"
            style={{ scale: isListening ? volumeScale * 1.8 : 1 }}
            animate={{ rotate: [-3, 3, -2, 4, -3], skewX: [-1, 1, -2, 1, -1] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
        </>
      ) : (
        <AnimatePresence>
          <Smoke />
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden gap-6 py-10"
      style={{
        background:
          "radial-gradient(circle at center, #8b5cf6 0%, #6d28d9 35%, #2e1065 100%)",
      }}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isLit
            ? "radial-gradient(circle at 50% 50%, rgba(75, 30, 120, 0.2) 0%, rgba(20, 10, 40, 0.8) 80%)"
            : "transparent",
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? "bg-amber-300" : "bg-amber-200"} blur-[1px]`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: isLit ? [0, 0.8, 0] : 0,
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-amber-200 text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-5%",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, 50, -50, 20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showPitchBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSurprise && (
          <>
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <LightBurst key={i} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <h1 className="font-script text-7xl md:text-9xl text-amber-200/90 drop-shadow-[0_0_20px_rgba(253,230,138,0.8)]">
                YEAY!!!
              </h1>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background:
            "radial-gradient(circle, rgba(255,180,255,.25) 0%, rgba(180,120,255,.15) 35%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      <div className="relative z-20 flex flex-col items-center w-full px-4">
        <motion.h2
          className="font-serif text-4xl md:text-6xl text-center text-amber-50 drop-shadow-[0_0_15px_rgba(255,182,193,0.6)] mb-3"
          animate={{ opacity: showSurprise ? 0 : 1 }}
        >
          Wünsche dir etwas!
        </motion.h2>

        {/* GARIS HATI (LOVE DIVIDER) */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          animate={{ opacity: showSurprise ? 0 : 1 }}
        >
          <div className="h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent to-amber-200/70"></div>
          <span className="text-amber-300 text-lg">♥</span>
          <div className="h-[1px] w-12 md:w-16 bg-gradient-to-l from-transparent to-amber-200/70"></div>
        </motion.div>

        <motion.p
          className="text-amber-100/80 text-center max-w-md font-sans tracking-wide mb-4"
          animate={{ opacity: showSurprise ? 0 : 1 }}
        >
          {isListening
            ? "Puste in Richtung Mikrofon..."
            : "Jetzt ist es Zeit, dass Sie die Kerzen auf dem Kuchen auspusten, Frau Muti!"}
        </motion.p>

        {/* WRAPPER KUE PNG & API LILIN */}
        <div className="relative w-[450px] h-[400px] md:w-[650px] md:h-[550px] flex items-end justify-center mb-4">
          <img
            src={cakeImage}
            alt="Birthday Cake"
            className="absolute bottom-0 w-full h-full object-contain pointer-events-none"
            style={{
              filter: isLit
                ? "brightness(1.15) saturate(1.2) drop-shadow(0 0 50px rgba(255,180,255,.45))"
                : "brightness(0.4)",
              transition: "filter 1s ease",
            }}
          />

          {/* 
            API LILIN DENGAN POSISI MANUAL 
            Ubah nilai left dan bottom pada style di bawah ini agar pas di atas lilin gambar PNG Anda.
            - left: 0% (paling kiri) s/d 100% (paling kanan)
            - bottom: 0% (paling bawah) s/d 100% (paling atas)
          */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute" style={{ left: "38.2%", bottom: "74%" }}>
              <Flame />
            </div>
            <div className="absolute" style={{ left: "43.5%", bottom: "74%" }}>
              <Flame />
            </div>
            <div
              className="absolute"
              style={{ left: "48.7%", bottom: "75.9%" }}
            >
              <Flame />
            </div>
            <div className="absolute" style={{ left: "54.1%", bottom: "74%" }}>
              <Flame />
            </div>
            <div
              className="absolute"
              style={{ left: "59.7%", bottom: "74.1%" }}
            >
              <Flame />
            </div>
          </div>
        </div>

        <div className="h-24 flex flex-col items-center gap-3 mt-4">
          <AnimatePresence mode="wait">
            {!isListening && isLit ? (
              <motion.button
                key="amber-btn"
                onClick={startListening}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                "
              >
                Kerzen ausblasen
              </motion.button>
            ) : isLit && isListening ? (
              <motion.div
                key="listening"
                className="font-serif italic text-xl text-amber-100"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Warten auf das Pusten... 🎤
              </motion.div>
            ) : null}
          </AnimatePresence>

          {isLit && !isListening && (
            <p className="text-amber-200/50 text-xs text-center max-w-xs">
              Akses mikrofon hanya digunakan untuk meniup lilin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
