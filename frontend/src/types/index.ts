// Shared TypeScript types for Confera

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  id: string;
  roomId: string;
  hostId: string;
  title: string;
  startTime: string;
  endTime?: string;
  password?: string;
  status: 'scheduled' | 'active' | 'ended';
  participantCount?: number;
  createdAt: string;
}

export interface Participant {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  avatar?: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  hasRaisedHand: boolean;
  stream?: MediaStream;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  senderName: string;
  message: string;
  createdAt: string;
  type: 'text' | 'system';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokens?: AuthTokens;
}

// WebSocket signal types
export type SignalType =
  | 'join-room'
  | 'leave-room'
  | 'participant-joined'
  | 'participant-left'
  | 'offer'
  | 'answer'
  | 'ice-candidate'
  | 'chat'
  | 'reaction'
  | 'raise-hand'
  | 'mute'
  | 'camera';

export interface Signal {
  type: SignalType | string;
  roomId?: string;
  userId?: string;
  userName?: string;
  action?: string;
  target?: string;
  to?: string;
  from?: string;
  sender?: string;
  senderName?: string;
  payload?: unknown;
  message?: unknown;
}
