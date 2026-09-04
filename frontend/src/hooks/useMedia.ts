import { useState, useCallback, useEffect, useRef } from 'react';

export function useMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMedia = useCallback(async (video = true, audio = true): Promise<MediaStream | null> => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video, audio });
      streamRef.current = s;
      setStream(s);
      setError(null);
      return s;
    } catch (err) {
      setError('Could not access camera or microphone. Please check permissions.');
      console.error(err);
      return null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCameraOff((c) => !c);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(setDevices)
      .catch(() => {});
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => () => stopMedia(), [stopMedia]);

  return {
    stream,
    isMuted,
    isCameraOff,
    devices,
    error,
    startMedia,
    stopMedia,
    toggleMute,
    toggleCamera,
  };
}
