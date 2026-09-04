import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMedia } from '@/hooks/useMedia';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useMeetingStore } from '@/store/meetingStore';
import { useAuthStore } from '@/store/authStore';
import { meetingsApi } from '@/api/meetings';
import { VideoGrid } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { ChatPanel } from './ChatPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import type { Signal, Participant, Message } from '@/types';

export function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const {
    roomId, participants, isMuted, isCameraOff, isScreenSharing,
    isChatOpen, isParticipantsOpen,
    setMeeting, clearMeeting,
    addParticipant, removeParticipant, updateParticipant,
    addMessage, toggleMute, toggleCamera, toggleScreenShare,
  } = useMeetingStore();

  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const { stream, startMedia, stopMedia, toggleMute: toggleLocalMute, toggleCamera: toggleLocalCamera } = useMedia();

  const onRemoteStream = useCallback((userId: string, remoteStream: MediaStream) => {
    updateParticipant(userId, { stream: remoteStream });
  }, [updateParticipant]);

  // Use a ref to break circular dep between handleSignal ↔ handleWebRTCSignal
  const webRTCSignalRef = useRef<((s: Signal) => void) | null>(null);
  const initiateCallRef = useRef<((userId: string) => void) | null>(null);

  const handleSignal = useCallback((signal: Signal) => {
    const fromId = signal.userId || signal.from || signal.sender;
    if (signal.type === 'participant-joined') {
      if (fromId && fromId !== user?.id) {
        addParticipant({
          id: fromId,
          userId: fromId,
          name: signal.userName || `Participant ${fromId.slice(-4)}`,
          isHost: false,
          isMuted: false,
          isCameraOff: false,
          hasRaisedHand: false,
        });

        // Existing client initiates the WebRTC offer to the newly joined peer
        setTimeout(() => {
          initiateCallRef.current?.(fromId);
        }, 300);

        // Announce our real identity back to the newcomer
        send({
          type: 'reaction',
          action: 'user-announce',
          userId: user?.id,
          userName: user?.name,
        });
      }
    } else if (signal.type === 'reaction' && signal.action === 'user-announce') {
      const uId = signal.userId;
      if (uId && uId !== user?.id) {
        addParticipant({
          id: uId,
          userId: uId,
          name: signal.userName || `Participant ${uId.slice(-4)}`,
          isHost: false,
          isMuted: false,
          isCameraOff: false,
          hasRaisedHand: false,
        });
        if (signal.userName) {
          updateParticipant(uId, { name: signal.userName });
        }
      }
    } else if (signal.type === 'participant-left') {
      if (fromId) removeParticipant(fromId);
    } else if (signal.type === 'mute') {
      if (fromId) updateParticipant(fromId, { isMuted: signal.payload as boolean });
    } else if (signal.type === 'camera') {
      if (fromId) updateParticipant(fromId, { isCameraOff: signal.payload as boolean });
    } else if (signal.type === 'chat') {
      if (signal.payload) addMessage(signal.payload as Message);
    } else if (signal.type === 'raise-hand') {
      if (fromId) updateParticipant(fromId, { hasRaisedHand: signal.payload as boolean });
    } else {
      if ((signal.type === 'offer' || signal.type === 'answer') && signal.userName && signal.from) {
        updateParticipant(signal.from, { name: signal.userName });
      }
      webRTCSignalRef.current?.(signal);
    }
  }, [addParticipant, removeParticipant, updateParticipant, addMessage, user?.id, user?.name]);

  const { send } = useWebSocket(roomId, user?.id || null, handleSignal);
  const { initiateCall, handleSignal: handleWebRTCSignal, syncLocalTracks, closeAll } = useWebRTC(
    stream,
    send,
    onRemoteStream,
    user?.name
  );

  // Wire refs after hooks are initialized
  useEffect(() => {
    webRTCSignalRef.current = handleWebRTCSignal;
    initiateCallRef.current = initiateCall;
  }, [handleWebRTCSignal, initiateCall]);

  // Announce our real identity when room is ready
  useEffect(() => {
    if (roomId && user?.name) {
      const timer = setTimeout(() => {
        send({
          type: 'reaction',
          action: 'user-announce',
          userId: user.id,
          userName: user.name,
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [roomId, user?.id, user?.name, send]);

  // Join meeting on mount
  useEffect(() => {
    if (!meetingId) return;

    const initMeeting = async () => {
      try {
        let actualRoomId = meetingId;
        try {
          const { data } = await meetingsApi.get(meetingId);
          if (data?.roomId) actualRoomId = data.roomId;
        } catch { /* use meetingId as roomId */ }

        await meetingsApi.join(meetingId).catch(() => {});
        setMeeting(meetingId, actualRoomId);
      } catch {
        navigate('/dashboard');
      }
    };

    initMeeting();

    startMedia().then((s) => {
      if (user) {
        setLocalParticipant({
          id: user.id,
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          isHost: false,
          isMuted: false,
          isCameraOff: false,
          hasRaisedHand: false,
          stream: s ?? undefined,
        });
      }
    });

    return () => {
      stopMedia();
      closeAll();
      clearMeeting();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  // Sync local stream into participant state and peers
  useEffect(() => {
    if (stream) {
      setLocalParticipant((p) => p ? { ...p, stream } : p);
      syncLocalTracks();
    }
  }, [stream, syncLocalTracks]);

  const handleToggleMute = () => {
    toggleLocalMute();
    toggleMute();
    const nextMuted = !isMuted;
    send({ type: 'mute', payload: nextMuted });
    setLocalParticipant((p) => p ? { ...p, isMuted: nextMuted } : p);
  };

  const handleToggleCamera = () => {
    toggleLocalCamera();
    toggleCamera();
    const nextCameraOff = !isCameraOff;
    send({ type: 'camera', payload: nextCameraOff });
    setLocalParticipant((p) => p ? { ...p, isCameraOff: nextCameraOff } : p);
    setTimeout(syncLocalTracks, 50);
  };

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const track = screenStream.getVideoTracks()[0];
        track.onended = () => toggleScreenShare();
        toggleScreenShare();
      } catch { /* user cancelled */ }
    } else {
      toggleScreenShare();
    }
  };

  const handleRaiseHand = () => {
    send({ type: 'raise-hand', payload: true });
    setLocalParticipant((p) => p ? { ...p, hasRaisedHand: !p.hasRaisedHand } : p);
  };

  const handleSendChat = (message: string) => {
    if (!user) return;
    const msg: Message = {
      id: `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      roomId: roomId ?? '',
      userId: user.id,
      senderName: user.name,
      message,
      createdAt: new Date().toISOString(),
      type: 'text',
    };
    addMessage(msg);
    send({ type: 'chat', payload: msg });
  };

  const handleLeave = async () => {
    if (meetingId) await meetingsApi.leave(meetingId).catch(() => {});
    navigate('/dashboard');
  };

  const sidebarOpen = isChatOpen || isParticipantsOpen;

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#080a0f', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 20px', background:'rgba(15,17,24,.95)', borderBottom:'1px solid #252839', zIndex:10, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontSize:11, fontWeight:800 }}>C</span>
          </div>
          <span style={{ fontSize:'.9rem', fontWeight:700, color:'#eef0ff' }}>Confera</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.75rem', color:'#4b4f6a' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'pulseRing 2s infinite' }} />
          Live · {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
        </div>
      </div>

      {/* Main */}
      <div style={{ display:'flex', flex:1, minHeight:0, overflow:'hidden' }}>
        {/* Video */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
          <VideoGrid participants={participants} localParticipant={localParticipant} />
        </div>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width:288, flexShrink:0, display:'flex', flexDirection:'column', minHeight:0 }}>
            {isChatOpen && <ChatPanel onSend={handleSendChat} />}
            {isParticipantsOpen && <ParticipantsPanel />}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div style={{ background:'rgba(15,17,24,.95)', borderTop:'1px solid #252839', flexShrink:0 }}>
        <ControlBar
          onLeave={handleLeave}
          onToggleMute={handleToggleMute}
          onToggleCamera={handleToggleCamera}
          onScreenShare={handleScreenShare}
          onRaiseHand={handleRaiseHand}
        />
      </div>
    </div>
  );
}
