import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

export default function FloatingHearts({ count = 15 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-300/50"
          initial={{
            y: "100vh",
            x: `${Math.random() * 100}vw`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{ y: "-10vh", rotate: Math.random() * 360 }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          <FiHeart size={Math.random() * 30 + 20} />
        </motion.div>
      ))}
    </div>
  );
}
