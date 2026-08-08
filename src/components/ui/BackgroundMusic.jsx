import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { FiVolume2, FiVolumeX, FiSkipForward } from "react-icons/fi";

export default function BackgroundMusic({ startPlaying, videoPlaying }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const soundRef = useRef(null);

  const tracks = [`/audio/playlist.mp3`, `/audio/lany.mp3`];

  // 1. Inisialisasi Howl
  useEffect(() => {
    soundRef.current = new Howl({
      src: [tracks[currentTrack]],
      volume: 0.4,
      html5: true,
      loop: false,
      onend: () => {
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
      },
    });

    // PENTING: Paksa browser unlock audio context
    Howler.autoUnlock = true;

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

  // 3. Play Music saat startPlaying TRUE
  useEffect(() => {
    if (startPlaying && soundRef.current && !hasPlayed) {
      // Gunakan play() yang mengembalikan promise untuk menangkap error browser
      const playPromise = soundRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            setHasPlayed(true); // Berhasil diputar
          })
          .catch((error) => {
            console.error("Browser memblokir autoplay:", error);
            // Jika diblokir, kita tunggu user klik satu kali lagi di mana saja
            const unlockAudio = () => {
              soundRef.current.play();
              setHasPlayed(true);
              document.removeEventListener("click", unlockAudio);
            };
            document.addEventListener("click", unlockAudio);
          });
      }
    }
  }, [startPlaying, hasPlayed]);

  // 4. Fade Pas Video
  useEffect(() => {
    if (soundRef.current) {
      if (videoPlaying) {
        soundRef.current.fade(0.4, 0.0, 1000);
      } else {
        if (hasPlayed) soundRef.current.fade(0.0, 0.4, 1000);
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
