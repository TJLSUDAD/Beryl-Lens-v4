import { useState, useCallback, useEffect } from 'react';
import { audioManager } from '../lib/audio-manager';

export function useAudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    audioManager.initialize().catch(err => {
      setError(err.message);
    });
  }, []);

  const startRecording = useCallback(async () => {
    try {
      await audioManager.startRecording();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      const audioBlob = await audioManager.stopRecording();
      setIsRecording(false);
      setError(null);
      return audioBlob;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording
  };
}