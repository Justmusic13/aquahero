import { useCallback } from 'react';

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', delay: number = 0) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
};

export const useAudio = () => {
  const playStartSound = useCallback(() => {
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    // Ascending cheerful chime: "Let's go!"
    playTone(523, 0.15, 'sine', 0);      // C5
    playTone(659, 0.15, 'sine', 0.12);    // E5
    playTone(784, 0.15, 'sine', 0.24);    // G5
    playTone(1047, 0.3, 'sine', 0.36);    // C6 (hold)
  }, []);

  const playStopSound = useCallback(() => {
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    // Celebration fanfare: "You did it!"
    playTone(784, 0.12, 'sine', 0);       // G5
    playTone(988, 0.12, 'sine', 0.1);     // B5
    playTone(1175, 0.12, 'sine', 0.2);    // D6
    playTone(1568, 0.15, 'sine', 0.3);    // G6
    playTone(1568, 0.1, 'sine', 0.5);     // G6 (repeat)
    playTone(1760, 0.4, 'sine', 0.6);     // A6 (big finish)
  }, []);

  const playPointsSound = useCallback(() => {
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    // Quick coin sound
    playTone(987, 0.08, 'square', 0);
    playTone(1319, 0.15, 'square', 0.08);
  }, []);

  return { playStartSound, playStopSound, playPointsSound };
};
