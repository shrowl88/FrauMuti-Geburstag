import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import { FiArrowRight } from "react-icons/fi";

const questions = [
  {
    q: "Was ist Frau Safarinas Lieblingsfarbe?",
    a: "Blau",
    options: ["Blau", "Rosa", "Grün"],
  },
  {
    q: "Welches Fach unterrichtet Frau Safarina am liebsten?",
    a: "Deutsch",
    options: ["Deutsch", "Mathematik", "Kunst"],
  },
  {
    q: "Was sagt Frau Safarina am häufigsten im Unterricht?",
    a: "Ok teman teman jetzt..",
    options: ["Habt ihr Fragen?", "Schon fertig?", "Ok teman teman jetzt.."],
  },
  {
    q: "Was würde Frau Safarina machen, wenn kein Schüler die Hausaufgaben macht?",
    a: "Ein langes Gesicht machen",
    options: [
      "Ein langes Gesicht machen",
      "Extra Hausaufgaben geben",
      "Geheim feiern",
    ],
  },
  {
    q: "Was ist Frau Safarinas Superkraft als Lehrerin?",
    a: "Mit dem Topf bestrafen",
    options: [
      "Gedanken lesen",
      "Mit den Augen strafen",
      "Mit dem Topf bestrafen",
    ],
  },
];

export default function LoveQuiz({ onContinue }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer) => {
    if (answer === questions[current].a) setScore(score + 1);
    if (current < questions.length - 1) setCurrent(current + 1);
    else setFinished(true);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-8 px-4">
      {!finished ? (
        <GlassCard className="w-full text-center">
          <div className="flex justify-between mb-6">
            <span className="font-serif text-amber-100/80">
              Frage {current + 1}/{questions.length}
            </span>
            <span className="font-serif text-amber-100/80">
              Korrekter Betrag: {score}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="font-serif text-2xl text-amber-100 mb-8">
                {questions[current].q}
              </h2>
              <div className="flex flex-col gap-4">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    // Pilihan ganda juga dibuat transparan modern agar konsisten
                    className="px-6 py-3 bg-white/10 backdrop-blur-md border border-amber-200/40 rounded-xl text-amber-50 transition-all hover:bg-amber-300/20 hover:border-amber-200/60"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      ) : (
        <GlassCard className="text-center">
          <h2 className="font-script text-5xl text-white/80 mb-4">Perfect!</h2>
          <p className="text-white/80 text-xl mb-6">
            Korrekter Betrag {score}/{questions.length}.
          </p>
          <p className="text-white/80 mb-8">
            Ganz gleich, wie der Spielstand ist – du bist immer perfekt!
          </p>

          {/* TOMBOL DENGAN GAYA TIUP LILIN */}
          <button
            onClick={onContinue}
            className="
              flex items-center gap-2 mx-auto
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
            Nächste Seite <FiArrowRight />
          </button>
        </GlassCard>
      )}
    </div>
  );
}
