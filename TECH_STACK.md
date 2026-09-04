# Confera — Technology Stack & Architecture

A concise guide to the technologies, frameworks, and protocols powering the features in Confera (Frontend & Backend).

---

## 🏗️ High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 19 + TypeScript)         │
│  - Media Capture (getUserMedia / getDisplayMedia)      │
│  - Peer-to-Peer Video/Audio (RTCPeerConnection)       │
│  - Audio Detection (Web Audio API AnalyserNode)        │
│  - UI State (Zustand) & Navigation (React Router v7)   │
└──────────────┬──────────────────────────┬──────────────┘
               │ HTTP REST (/api)         │ WebSockets (/ws)
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│               Backend (C++20 / Drogon)                 │
│  - HTTP REST Controllers (Auth, Meetings, Users)       │
│  - WebSocket Signaling Server (Room / Target Routing)  │
│  - In-memory AppStore & Session Management             │
│  - PostgreSQL / Supabase Persistence Layer             │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Stack

| Technology | Purpose & Feature Implementation |
| :--- | :--- |
| **React 19 & TypeScript** | Component architecture, strict type contracts, and reactive UI state. |
| **WebRTC API** (`RTCPeerConnection`) | Direct peer-to-peer audio and video streaming, ICE/STUN negotiation (`stun.l.google.com`). |
| **Screen Capture API** (`getDisplayMedia`) | In-call full-screen, window, and tab sharing with audio/video tracks. |
| **Web Audio API** (`AudioContext`, `AnalyserNode`) | Real-time audio frequency analysis for the active speaker green ring and wave animation. |
| **WebSocket API** (`WebSocket`) | Low-latency bi-directional signaling for WebRTC offers, answers, ICE candidates, and chat. |
| **Zustand** | Lightweight, high-performance global store for authentication (`authStore`) and meeting state (`meetingStore`). |
| **React Router v7** | Client-side routing with authentication guards (`PageWrapper`), Lobby preview, and Meeting room. |
| **Axios** | Typed HTTP client with request/response interceptors for Bearer token authorization and auto-refresh. |
| **Vanilla CSS & Design Tokens** | Custom dark design system (`#080a0f`, `#161923`), glassmorphism, and responsive CSS grid. |
| **Lucide React** | Clean, modern icons for meeting controls, camera/mic states, and dashboard stats. |
| **Vite** | Modern ES-module build tool with local reverse proxy (`/api` and `/ws` to port `8080`). |

---

## ⚙️ Backend Stack

| Technology | Purpose & Feature Implementation |
| :--- | :--- |
| **C++20** | High-performance compiled backend for ultra-low latency and minimal memory overhead. |
| **Drogon Framework** | Non-blocking, event-driven C++ web framework powering both REST controllers and WebSocket handlers. |
| **Drogon WebSocket Controller** | Manages WebSocket sessions, rooms, client joins/leaves, and target-forwarded WebRTC signals. |
| **JsonCpp** | Fast JSON serialization and deserialization for API bodies and signaling packets. |
| **CMake & MSYS2 UCRT64** | Cross-platform build automation and modern C++ compilation toolchain for Windows. |
| **Supabase / PostgreSQL** | Relational database layer with schema migrations for user accounts, credentials, and meeting records. |

---

## 📋 Feature-to-Technology Matrix

| Feature | Frontend Implementation | Backend Implementation |
| :--- | :--- | :--- |
| **User Authentication** | `authApi.ts`, `useAuthStore` (JWT in localStorage) | `AuthController.cpp` (Bearer tokens, hash verification) |
| **Meeting Management** | `meetingsApi.ts`, `DashboardPage`, `ScheduleModal` | `MeetingController.cpp` (CRUD, room IDs) |
| **Pre-call Lobby** | `LobbyPage.tsx`, `useMedia.ts` (device permission & stream test) | `MeetingController::get` |
| **Signaling Handshake** | `useWebSocket.ts` (room join & leave frames) | `SignalingController.cpp` (`/ws` path routing) |
| **Peer-to-Peer Video/Audio**| `useWebRTC.ts` (offers, answers, ICE exchange) | `SignalingController::forwardToTarget` |
| **Camera / Mic Toggle** | `useMedia.ts` (`track.enabled`, track replacement) | WebSocket broadcast (`mute`, `camera` events) |
| **Screen Sharing** | `handleScreenShare` (`getDisplayMedia`) | WebRTC renegotiation via `replaceTrack` |
| **In-Call Real-Time Chat** | `ChatPanel.tsx`, `meetingStore` (ID deduplication) | `SignalingController::broadcastToRoom` |
| **Active Speaker Indicator**| `VideoTile.tsx` (`AudioContext` frequency analysis) | Client-side real-time stream analysis |
| **Real Identity Exchange** | Peer announcement signal on join (`user-announce`) | WebSocket `reaction` broadcast relay |
