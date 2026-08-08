import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WarpScreen from "./galaxy/WarpScreen";
import GalaxyExperience from "./galaxy/GalaxyExperience";

export default function IntroGalaxy({ onComplete }) {
  const [phase, setPhase] = useState("warp");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase("galaxy");
    }, 5000); // Warp screen 5 detik

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence>
        {phase === "warp" && <WarpScreen key="warp" />}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "galaxy" && (
          <motion.div
            key="galaxy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0"
          >
            {/* Meneruskan onComplete ke GalaxyExperience */}
            <GalaxyExperience onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
