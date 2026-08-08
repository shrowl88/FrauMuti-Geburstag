import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function GuestBook({ onContinue }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !msg || isSending) return; // Cegah double click

    setIsSending(true); // Kunci form saat mengirim

    try {
      await addDoc(collection(db, "messages"), {
        name: name,
        msg: msg,
        createdAt: serverTimestamp(),
      });

      // Kosongkan form
      setName("");
      setMsg("");

      // Tunggu 2 detik agar user sempat melihat pop-up, lalu pindah halaman
      setTimeout(() => {
        onContinue();
      }, 2000);
    } catch (error) {
      console.error("Error saving message: ", error);
      alert("Gagal mengirim pesan. Coba lagi ya.");
      setIsSending(false); // Buka kunci form jika gagal
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-10">
        {/* HEADER DENGAN GOLD GRADIENT TEXT */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]"
          >
            Klassen-Pinnwand 📝
          </motion.h1>
          <p className="font-fredoka text-amber-100/80 max-w-md text-sm md:text-base">
            Schreiben Sie eine Nachricht für Frau Mutiara Safarina! <br />
            <span className="text-amber-100/50 text-xs">
              (Pesan Anda akan menjadi kejutan bintang di akhir halaman)
            </span>
          </p>
        </div>

        {/* FORM GLASSMORPHISM */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-amber-200/20 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-2xl"
        >
          <div className="text-left flex flex-col gap-2">
            <label className="font-fredoka text-amber-200 text-sm font-medium tracking-wide">
              Dein Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              disabled={isSending}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-all font-fredoka disabled:opacity-50"
              required
            />
          </div>

          <div className="text-left flex flex-col gap-2">
            <label className="font-fredoka text-amber-200 text-sm font-medium tracking-wide">
              Deine Nachricht
            </label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Schreib deine Nachricht und Wünsche hier..."
              rows="4"
              disabled={isSending}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-all resize-none font-fredoka disabled:opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="font-fredoka flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-black font-bold hover:scale-[1.02] transition-transform shadow-[0_0_25px_rgba(252,211,77,0.4)] mt-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSending ? "Wird gesendet..." : "Absenden"} <FiSend />
          </button>
        </form>
      </div>

      {/* TOMBOL SKIP TRANSPARAN (Menyatu dengan background, warna putih) */}
      <button
        onClick={onContinue}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-8 py-2 text-white/40 font-light tracking-[0.3em] text-xs uppercase hover:text-white transition-all bg-transparent"
      >
        Weiter ➔
      </button>

      {/* POP UP BERHASIL KIRIM */}
      <AnimatePresence>
        {isSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{
                scale: 1,
                y: 0,
                boxShadow: [
                  "0px 0px 10px rgba(252,211,77,0.2)",
                  "0px 0px 40px rgba(252,211,77,0.6)",
                  "0px 0px 10px rgba(252,211,77,0.2)",
                ],
              }}
              transition={{ duration: 1 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-amber-300/40"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl text-amber-300 mb-4 flex justify-center"
              >
                <FiCheckCircle />
              </motion.div>
              <h3 className="font-serif text-3xl text-amber-200 mb-2 tracking-wide">
                Nachricht gesendet! ✨
              </h3>
              <p className="font-fredoka text-amber-100/80 text-sm">
                Vielen Dank für Ihre Nachricht. <br /> Weiterleitung zur
                nächsten Seite...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
