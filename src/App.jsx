import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fireConfetti } from "./lib/confetti";
import IntroLoader from "./components/sections/IntroLoader";
import WelcomeGate from "./components/sections/WelcomeGate";
import GuestBook from "./components/sections/GuestBook";
import LoveQuiz from "./components/sections/LoveQuiz";
import LoveLetter from "./components/sections/LoveLetter";
import VideoSurprise from "./components/sections/VideoSurprise";
import GiftBox from "./components/sections/GiftBox";
import BirthdayCake from "./components/sections/BirthdayCake";
import Celebration from "./components/sections/Celebration";
import FinalEnding from "./components/sections/FinalEnding";
import IntroGalaxy from "./components/sections/IntroGalaxy";
import SpaceCredits from "./components/sections/SpaceCredits";
import FloatingDecorations from "./components/ui/FloatingDecorations";
import BackgroundMusic from "./components/ui/BackgroundMusic";

export default function App() {
  const [stage, setStage] = useState(-1);
  const [allowMusic, setAllowMusic] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const nextStage = useCallback(() => setStage((prev) => prev + 1), []);

  // FUNGSI BARU: Dijalankan saat IntroLoader selesai
  const handleLoaderComplete = useCallback(() => {
    setAllowMusic(true); // Nyalakan musik tepat setelah loading
    setStage((prev) => prev + 1); // Lanjut ke WelcomeGate
  }, []);

  // Saat tombol "Buka Pintu Kelas" diklik, cukup lanjut halaman saja
  const handleEnter = useCallback(() => {
    setStage((prev) => prev + 1);
  }, []);

  const handleBlowCandles = useCallback(() => {
    fireConfetti();
    setTimeout(() => setStage((prev) => prev + 1), 2000);
  }, []);

  const renderStage = () => {
    switch (stage) {
      case -1:
        // Gunakan handleLoaderComplete, bukan nextStage
        return <IntroLoader onComplete={handleLoaderComplete} />;
      case 0:
        return <WelcomeGate onEnter={handleEnter} />;
      case 1:
        return <GuestBook onContinue={nextStage} />;
      case 2:
        return <LoveQuiz onContinue={nextStage} />;
      case 3:
        return <LoveLetter onContinue={nextStage} />;
      case 4:
        return (
          <VideoSurprise
            onContinue={nextStage}
            setVideoPlaying={setVideoPlaying}
          />
        );
      case 5:
        return <GiftBox onContinue={nextStage} />;
      case 6:
        return <BirthdayCake onBlow={handleBlowCandles} />;
      case 7:
        return <Celebration onContinue={nextStage} />;
      case 8:
        return <FinalEnding onContinue={nextStage} />;
      case 9:
        return <IntroGalaxy onComplete={nextStage} />;
      case 10:
        return <SpaceCredits onRestart={() => setStage(0)} />;
      default:
        return null;
    }
  };

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {stage > -1 && (
        <>
          <BackgroundMusic
            startPlaying={allowMusic}
            videoPlaying={videoPlaying}
          />
          <FloatingDecorations count={45} />

          <div className="fixed top:0 left:0 w-full h-full pointer-events-none z-0">
            <div className="absolute top[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-300/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-300/20 rounded-full blur-[100px] animate-float"></div>
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full flex items-center justify-center min-h-screen"
        >
          {renderStage()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
