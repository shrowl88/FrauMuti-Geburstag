import { useState, useRef, useCallback, useEffect } from "react";

export const useMicrophone = (onVolumeThresholdMet) => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafIdRef = useRef(null);
  const thresholdMetRef = useRef(false);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolume(avg);

        // Adjust threshold (e.g., 30) based on testing
        if (avg > 30 && !thresholdMetRef.current) {
          thresholdMetRef.current = true;
          onVolumeThresholdMet();
          stopListening();
          return;
        }
        rafIdRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to blow the candles!");
    }
  }, [onVolumeThresholdMet]);

  const stopListening = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { isListening, volume, startListening, stopListening };
};
