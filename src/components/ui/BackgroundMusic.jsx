import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import { FiVolume2, FiVolumeX, FiSkipForward } from "react-icons/fi";

export default function BackgroundMusic({ startPlaying, videoPlaying }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const soundRef = useRef(null);

  const tracks = [`/audio/playlist.mp3`, `/audio/lany.mp3`];

  // 1. Inisialisasi Howl
  useEffect(() => {
    Howler.autoUnlock = true;

    soundRef.current = new Howl({
      src: [tracks[currentTrack]],
      volume: 0.4,
      html5: true,
      loop: false,
      onend: () => {
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
      },
    });

    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []);

  // 2. Ganti Track
  useEffect(() => {
    if (!soundRef.current) return;
    soundRef.current.unload();
    soundRef.current = new Howl({
      src: [tracks[currentTrack]],
      volume: isMuted ? 0 : 0.4,
      html5: true,
      loop: false,
      onend: () => setCurrentTrack((prev) => (prev + 1) % tracks.length),
    });
    if (hasPlayed) soundRef.current.play();
  }, [currentTrack]);

  // 3. Play Music saat startPlaying TRUE (Anti-Bug Multiple Play)
  useEffect(() => {
    if (!startPlaying || hasPlayed || !soundRef.current) return;

    const sound = soundRef.current;

    const playOnce = () => {
      // Pastikan hanya play jika belum playing
      if (!sound.playing()) {
        sound.play();
      }
      setHasPlayed(true); // Tandai sudah play agar fungsi ini tidak jalan lagi
    };

    // Jika audio sudah selesai di-load, coba langsung play
    if (sound.state() === "loaded") {
      playOnce();
    } else {
      // Jika belum selesai load, tunggu sampai load baru play
      sound.once("load", playOnce);
    }

    // Fallback: Jika browser memblokir, dengarkan klik pertama di layar
    const handleInteraction = () => playOnce();
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    // Cleanup function untuk menghapus event listener agar tidak nabrak
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [startPlaying, hasPlayed]);

  // 4. Fade Pas Video (Anti-Bug Mati Total)
  useEffect(() => {
    if (soundRef.current && hasPlayed) {
      const currentVol = soundRef.current.volume();
      if (videoPlaying) {
        // Fade out musik
        soundRef.current.fade(currentVol, 0.0, 500);
      } else {
        // Pastikan audio sedang playing, lalu fade in musik kembali
        if (!soundRef.current.playing()) {
          soundRef.current.play();
        }
        soundRef.current.fade(currentVol, 0.4, 500);
      }
    }
  }, [videoPlaying]);

  const toggleMute = () => {
    if (soundRef.current) {
      const newMuteState = !isMuted;
      soundRef.current.mute(newMuteState);
      setIsMuted(newMuteState);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 p-3 glass rounded-full shadow-lg">
      <button
        onClick={toggleMute}
        className="text-amber-700 hover:text-amber-900 transition-colors p-1"
      >
        {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>
      <button
        onClick={nextTrack}
        className="text-amber-700 hover:text-amber-900 transition-colors p-1"
      >
        <FiSkipForward size={20} />
      </button>
    </div>
  );
}
