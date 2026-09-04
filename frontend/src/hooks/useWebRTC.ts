import { useRef, useCallback } from 'react';
import type { Signal } from '@/types';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useWebRTC(
  localStream: MediaStream | null,
  sendSignal: (s: Signal) => void,
  onRemoteStream: (userId: string, stream: MediaStream) => void,
  userName?: string
) {
  const peers = useRef<Map<string, RTCPeerConnection>>(new Map());
  const candidateQueues = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(localStream);
  localStreamRef.current = localStream;

  const createPeer = useCallback(
    (userId: string): RTCPeerConnection => {
      const existing = peers.current.get(userId);
      if (existing && existing.signalingState !== 'closed') {
        return existing;
      }

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendSignal({ type: 'ice-candidate', to: userId, payload: e.candidate, userName });
        }
      };

      pc.ontrack = (e) => {
        if (e.streams?.[0]) {
          onRemoteStream(userId, e.streams[0]);
        }
      };

      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, stream);
          } catch {
            /* track already added */
          }
        });
      }

      peers.current.set(userId, pc);
      return pc;
    },
    [sendSignal, onRemoteStream, userName]
  );

  // Sync tracks when localStream changes
  const syncLocalTracks = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    peers.current.forEach((pc) => {
      if (pc.signalingState === 'closed') return;
      const senders = pc.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track).catch(() => {});
        } else {
          try {
            pc.addTrack(track, stream);
          } catch {}
        }
      });
    });
  }, []);

  const initiateCall = useCallback(
    async (userId: string) => {
      try {
        const pc = createPeer(userId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal({ type: 'offer', to: userId, payload: offer, userName });
      } catch (err) {
        console.error('Error initiating call:', err);
      }
    },
    [createPeer, sendSignal, userName]
  );

  const handleSignal = useCallback(
    async (signal: Signal) => {
      const { type, from, payload } = signal;
      if (!from) return;

      try {
        if (type === 'offer') {
          const pc = createPeer(from);
          await pc.setRemoteDescription(new RTCSessionDescription(payload as RTCSessionDescriptionInit));

          // Process any queued candidates
          const queued = candidateQueues.current.get(from) || [];
          for (const cand of queued) {
            await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
          }
          candidateQueues.current.delete(from);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({ type: 'answer', to: from, payload: answer, userName });
        } else if (type === 'answer') {
          const pc = peers.current.get(from);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(payload as RTCSessionDescriptionInit));

            // Process any queued candidates
            const queued = candidateQueues.current.get(from) || [];
            for (const cand of queued) {
              await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
            }
            candidateQueues.current.delete(from);
          }
        } else if (type === 'ice-candidate') {
          const pc = peers.current.get(from);
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(payload as RTCIceCandidateInit)).catch(() => {});
          } else {
            const queue = candidateQueues.current.get(from) || [];
            queue.push(payload as RTCIceCandidateInit);
            candidateQueues.current.set(from, queue);
          }
        }
      } catch (err) {
        console.error('Error handling WebRTC signal:', err);
      }
    },
    [createPeer, sendSignal, userName]
  );

  const closePeer = useCallback((userId: string) => {
    peers.current.get(userId)?.close();
    peers.current.delete(userId);
    candidateQueues.current.delete(userId);
  }, []);

  const closeAll = useCallback(() => {
    peers.current.forEach((pc) => pc.close());
    peers.current.clear();
    candidateQueues.current.clear();
  }, []);

  return { initiateCall, handleSignal, syncLocalTracks, closePeer, closeAll };
}
