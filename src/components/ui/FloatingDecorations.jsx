import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function FloatingDecorations({ count = 20 }) {
  const items = [
    "🎈",
    "❤️",
    "✨",
    "♪",
    "💖",
    "🎈",
    "✨",
    "🎁",
    "🍕",
    "🍟",
    "🍿",
    "🍻",
    "🍢",
    "🥳",
  ];

  const popBalloon = (e, item) => {
    if (item === "🎈") {
      // Kembang api kecil saat balon diklik
      confetti({
        particleCount: 30,
        spread: 70,
        origin: {
          y: e.clientY / window.innerHeight,
          x: e.clientX / window.innerWidth,
        },
        colors: ["#ff0000", "#ff77aa", "#ffccd5"],
      });
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const randomItem = items[i % items.length];
        const isBalloon = randomItem === "🎈";
        const size = Math.random() * 30 + 25;
        const leftPos = Math.random() * 100;
        const duration = Math.random() * 8 + 10;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            // Balon dikasih pointer-events-auto biar bisa diklik, yang lain tidak
            className={`absolute ${isBalloon ? "pointer-events-auto cursor-pointer" : ""}`}
            style={{
              fontSize: `${size}px`,
              left: `${leftPos}%`,
              bottom: "-50px",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: "-110vh",
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 40 - 20,
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
            onClick={(e) => popBalloon(e, randomItem)}
          >
            {randomItem}
          </motion.div>
        );
      })}
    </div>
  );
}
