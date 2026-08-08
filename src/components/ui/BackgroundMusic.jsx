import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import { FiVolume2, FiVolumeX, FiSkipForward } from "react-icons/fi";

export default function BackgroundMusic({ startPlaying, videoPlaying }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const soundRef = useRef(null);

  const tracks = [`/audio/playlist.mp3`, `/audio/lany.mp3`];

  // 1. Inisialisasi Howl & Unlock Browser
  useEffect(() => {
    Howler.autoUnlock = true; // Paksa browser mengizinkan audio

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

  // 3. Play Music saat startPlaying TRUE (Dengan Trik Pendeteksi Klik Layar)
  useEffect(() => {
    if (startPlaying && soundRef.current && !hasPlayed) {
      // Coba putar langsung (biasanya diblokir browser jika belum ada klik)
      soundRef.current.play();

      // Trik: Jika diblokir, dengarkan klik pertama di layar mana pun
      const unlockAndPlay = () => {
        if (!hasPlayed) {
          soundRef.current.play();
          setHasPlayed(true);
          document.removeEventListener("click", unlockAndPlay);
          document.removeEventListener("touchstart", unlockAndPlay);
        }
      };

      document.addEventListener("click", unlockAndPlay);
      document.addEventListener("touchstart", unlockAndPlay);

      // Tandai sudah play agar tidak diulang
      setHasPlayed(true);
    }
  }, [startPlaying, hasPlayed]);

  // 4. Fade Pas Video
  useEffect(() => {
    if (soundRef.current && hasPlayed) {
      if (videoPlaying) {
        soundRef.current.fade(0.4, 0.0, 1000);
      } else {
        soundRef.current.fade(0.0, 0.4, 1000);
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
