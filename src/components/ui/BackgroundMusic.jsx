import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { FiVolume2, FiVolumeX, FiSkipForward } from "react-icons/fi";

export default function BackgroundMusic({ startPlaying, videoPlaying }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false); // <--- 1. TAMBAH INI
  const soundRef = useRef(null);

  const tracks = [`/audio/playlist.mp3`, `/audio/lany.mp3`];

  // 2. BUAT HOWL CUMA 1X PAS AWAL
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

    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []); // <--- dependency kosong, cuma jalan 1x

  // 3. GANTI TRACK KALAU currentTrack BERUBAH
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
    if (hasPlayed) soundRef.current.play(); // <--- play lagi kalau udah pernah play
  }, [currentTrack]);

  // 4. INI KUNCINYA: PLAY CUMA KALAU startPlaying TRUE + BELUM PERNAH PLAY
  useEffect(() => {
    if (startPlaying && soundRef.current && !hasPlayed) {
      soundRef.current.play();
      setHasPlayed(true); // <--- tandain udah play 1x
    }
  }, [startPlaying, hasPlayed]);

  // 5. FADE PAS VIDEO
  useEffect(() => {
    if (soundRef.current) {
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
        className="text-rose-700 hover:text-rose-900 transition-colors p-1"
      >
        {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>
      <button
        onClick={nextTrack}
        className="text-rose-700 hover:text-rose-900 transition-colors p-1"
      >
        <FiSkipForward size={20} />
      </button>
    </div>
  );
}
