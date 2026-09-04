import { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, VideoOff } from 'lucide-react';
import type { Participant } from '@/types';

interface Props {
  participant: Participant;
  isLocal?: boolean;
  className?: string;
}

export function VideoTile({ participant, isLocal = false, className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reliable stream assignment to video element
  useEffect(() => {
    if (videoRef.current && participant.stream) {
      if (videoRef.current.srcObject !== participant.stream) {
        videoRef.current.srcObject = participant.stream;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [participant.stream, participant.isCameraOff]);

  // Real-time audio volume detection for speaking indicator
  useEffect(() => {
    if (!participant.stream || participant.isMuted) {
      setIsSpeaking(false);
      return;
    }

    const audioTracks = participant.stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setIsSpeaking(false);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let animId: number;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtxClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      const source = audioCtx.createMediaStreamSource(participant.stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        setIsSpeaking(avg > 18);
        animId = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch {
      // AudioContext could be blocked by browser policy
    }

    return () => {
      cancelAnimationFrame(animId);
      audioCtx?.close().catch(() => {});
    };
  }, [participant.stream, participant.isMuted]);

  const initials =
    participant.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'P';

  const showVideo = !!participant.stream && !participant.isCameraOff;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0f1118',
        border: isSpeaking ? '2px solid #4ade80' : '1px solid #252839',
        boxShadow: isSpeaking
          ? '0 0 0 2px rgba(74,222,128,.4), 0 0 24px rgba(74,222,128,.25)'
          : 'none',
        minHeight: 120,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {/* Video element is permanently mounted to prevent stream detach */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isLocal ? 'scaleX(-1)' : 'none',
          display: showVideo ? 'block' : 'none',
        }}
      />

      {/* Avatar fallback when camera is off */}
      {!showVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: '1.35rem',
              boxShadow: isSpeaking ? '0 0 0 4px #4ade80, 0 0 20px rgba(74,222,128,.5)' : 'none',
              transition: 'all .15s ease',
            }}
          >
            {initials}
          </div>
        </div>
      )}

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Name tag & Audio Wave Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,0,0,.65)',
          backdropFilter: 'blur(6px)',
          borderRadius: 8,
          padding: '3px 8px',
        }}
      >
        {participant.isMuted ? (
          <MicOff size={12} color="#f87171" />
        ) : isSpeaking ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 12 }}>
            <span style={{ width: 2, height: 10, background: '#4ade80', borderRadius: 1, animation: 'pulse 0.4s infinite alternate' }} />
            <span style={{ width: 2, height: 14, background: '#4ade80', borderRadius: 1, animation: 'pulse 0.6s infinite alternate' }} />
            <span style={{ width: 2, height: 8, background: '#4ade80', borderRadius: 1, animation: 'pulse 0.3s infinite alternate' }} />
          </div>
        ) : (
          <Mic size={12} color="#8b8fa8" />
        )}

        <span
          style={{
            fontSize: '.75rem',
            color: '#fff',
            fontWeight: 600,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {participant.name || 'Participant'}
          {isLocal && ' (You)'}
        </span>
        {participant.isHost && (
          <span style={{ fontSize: '.6rem', color: '#fbbf24', fontWeight: 700 }}>Host</span>
        )}
      </div>

      {/* Cam off icon */}
      {participant.isCameraOff && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,.6)',
            borderRadius: 6,
            padding: 4,
          }}
        >
          <VideoOff size={12} color="#f87171" />
        </div>
      )}

      {/* Raise hand indicator */}
      {participant.hasRaisedHand && (
        <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 18 }}>✋</div>
      )}
    </div>
  );
}
