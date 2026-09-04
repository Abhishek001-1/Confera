import { create } from 'zustand';
import type { Participant, Message } from '@/types';

interface MeetingState {
  meetingId: string | null;
  roomId: string | null;
  participants: Participant[];
  messages: Message[];
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;

  setMeeting: (meetingId: string, roomId: string) => void;
  clearMeeting: () => void;
  addParticipant: (p: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, patch: Partial<Participant>) => void;
  addMessage: (msg: Message) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetingId: null,
  roomId: null,
  participants: [],
  messages: [],
  isMuted: false,
  isCameraOff: false,
  isScreenSharing: false,
  isChatOpen: false,
  isParticipantsOpen: false,

  setMeeting: (meetingId, roomId) => set({ meetingId, roomId }),
  clearMeeting: () =>
    set({
      meetingId: null,
      roomId: null,
      participants: [],
      messages: [],
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isChatOpen: false,
      isParticipantsOpen: false,
    }),

  addParticipant: (p) =>
    set((s) => ({
      participants: s.participants.some((x) => x.userId === p.userId)
        ? s.participants.map((x) => (x.userId === p.userId ? { ...x, ...p } : x))
        : [...s.participants, p],
    })),
  removeParticipant: (userId) =>
    set((s) => ({ participants: s.participants.filter((p) => p.userId !== userId) })),
  updateParticipant: (userId, patch) =>
    set((s) => ({
      participants: s.participants.map((p) => (p.userId === userId ? { ...p, ...patch } : p)),
    })),

  addMessage: (msg) =>
    set((s) => ({
      messages: s.messages.some((m) => m.id === msg.id)
        ? s.messages
        : [...s.messages, msg],
    })),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleCamera: () => set((s) => ({ isCameraOff: !s.isCameraOff })),
  toggleScreenShare: () => set((s) => ({ isScreenSharing: !s.isScreenSharing })),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen, isParticipantsOpen: false })),
  toggleParticipants: () =>
    set((s) => ({ isParticipantsOpen: !s.isParticipantsOpen, isChatOpen: false })),
}));
