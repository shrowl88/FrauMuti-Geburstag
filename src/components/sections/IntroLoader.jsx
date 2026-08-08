import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const bgFlowers = "/images/bg-2.png";

export default function IntroLoader({ onComplete }) {
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsOpening(true);
    }, 3000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {!isOpening ? (
        <>
          {/* Background bunga fullscreen */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgFlowers})`,
            }}
            animate={{
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Overlay gelap */}
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

          {/* Loading Content */}
          <div className="relative z-20 flex h-full flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-7xl mb-6"
            >
              🌸
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-xl"
            >
              Ein Momment Bitte...
            </motion.h1>

            <div className="mt-8 w-64 h-2 rounded-full bg-white/30 overflow-hidden">
              <motion.div
                className="h-full bg-amber-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Kiri Atas */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-1/2"
            style={{
              backgroundImage: `url(${bgFlowers})`,
              backgroundSize: "200% 200%",
              backgroundPosition: "left top",
            }}
            animate={{
              x: -900,
              y: -900,
              rotate: -20,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
          />

          {/* Kanan Atas */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-1/2"
            style={{
              backgroundImage: `url(${bgFlowers})`,
              backgroundSize: "200% 200%",
              backgroundPosition: "right top",
            }}
            animate={{
              x: 900,
              y: -900,
              rotate: 20,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
          />

          {/* Kiri Bawah */}
          <motion.div
            className="absolute bottom-0 left-0 w-1/2 h-1/2"
            style={{
              backgroundImage: `url(${bgFlowers})`,
              backgroundSize: "200% 200%",
              backgroundPosition: "left bottom",
            }}
            animate={{
              x: -900,
              y: 900,
              rotate: -20,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
          />

          {/* Kanan Bawah */}
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-1/2"
            style={{
              backgroundImage: `url(${bgFlowers})`,
              backgroundSize: "200% 200%",
              backgroundPosition: "right bottom",
            }}
            animate={{
              x: 900,
              y: 900,
              rotate: 20,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
          />

          {/* Tulisan Tengah */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <h1 className="text-white text-5xl md:text-7xl font-bold drop-shadow-2xl">
                Willkommen ❤️
              </h1>

              <p className="mt-4 text-white/90 text-lg md:text-2xl">
                Eine besondere Geburtstagsreise erwartet Sie.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
