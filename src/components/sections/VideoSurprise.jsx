import { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";

export default function VideoSurprise({ onContinue, setVideoPlaying }) {
  // Karena kita pakai Google Drive Iframe, kita tidak bisa mendeteksi onPlay/onEnded.
  // Jadi musik dimatikan saat halaman ini dibuka, dan dinyalakan lagi saat tombol diklik.
  useEffect(() => {
    setVideoPlaying(true); // Memberhentikan musik latar
    return () => {
      setVideoPlaying(false); // Menyalakan kembali musik jika pindah halaman
    };
  }, [setVideoPlaying]);

  // GANTI DENGAN ID VIDEO GOOGLE DRIVE ANDA
  // Contoh link drive: https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view
  // Maka ID-nya adalah: 1AbCdEfGhIjKlMnOpQrStUvWxYz
  const googleDriveVideoId = "1gXet8LNi2lyvYWbhj5a5mC2POkEmVsIY";
  const driveEmbedUrl = `https://drive.google.com/file/d/${googleDriveVideoId}/preview`;

  const handleContinue = () => {
    setVideoPlaying(false);
    onContinue();
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8 px-4">
      <h2 className="font-serif text-4xl text-amber-100/80 text-center">
        Eine kleine Überraschung 🥰
      </h2>

      <GlassCard className="p-2 md:p-4 bg-black/10 w-full">
        {/* Menggunakan Iframe Google Drive */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={driveEmbedUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Surprise Video"
          ></iframe>
        </div>
      </GlassCard>

      <button
        onClick={handleContinue}
        className="
          flex items-center gap-2
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
    </div>
  );
}
