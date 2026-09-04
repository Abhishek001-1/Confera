# Confera 🎥

> A modern, full-stack, real-time video conferencing platform built with WebRTC.

Confera is a Jitsi/Google Meet-inspired video conferencing application that enables users to create and join virtual meeting rooms, communicate through real-time audio/video, share their screens, exchange messages, and collaborate with other participants.

The project is designed as a complete full-stack application covering **frontend, backend, authentication, WebRTC, real-time communication, meeting management, and scalable system architecture**.

---

## 🚀 Project Vision

Build a production-style video conferencing platform from scratch with:

* Real-time audio/video communication
* WebRTC-based peer connections
* Meeting rooms
* User authentication
* Screen sharing
* Real-time chat
* Participant management
* Meeting history
* Meeting controls
* Recording support
* Backend APIs
* WebSocket-based signaling
* Scalable architecture

The goal is to understand how modern video-conferencing systems work internally rather than simply embedding an existing meeting solution.

---

# ✨ Core Features

## 1. Authentication

Users can create accounts and securely access the platform.

### Features

* Sign up
* Login
* Logout
* JWT-based authentication
* Password hashing
* Refresh tokens
* Protected routes
* User profile
* Profile picture
* Change password
* Forgot password
* Reset password

### User Model

```text
User
 ├── id
 ├── name
 ├── email
 ├── passwordHash
 ├── avatar
 ├── createdAt
 └── updatedAt
```

---

# 2. Dashboard

After login, users land on a dashboard.

### Dashboard features

* Start instant meeting
* Schedule meeting
* Join meeting
* Recent meetings
* Upcoming meetings
* Meeting history
* Personal meeting rooms
* Profile/settings

Example:

```text
+------------------------------------------------+
| Confera                         Profile   Logout |
+------------------------------------------------+
|                                                |
|   Good morning, Abhishek 👋                   |
|                                                |
|   [ Start Meeting ] [ Join Meeting ]           |
|                                                |
|   Upcoming Meetings                            |
|   ------------------------------------------   |
|   Team Standup             10:00 AM            |
|   Interview                2:00 PM             |
|                                                |
|   Recent Meetings                             |
|   ------------------------------------------   |
|   Project Discussion                           |
|   Client Meeting                               |
|                                                |
+------------------------------------------------+
```

---

# 3. Meeting Rooms

Each meeting gets a unique room ID.

Example:

```text
https://Confera.app/meeting/abc123
```

Users can:

* Create a room
* Join a room
* Leave a room
* Share meeting link
* Copy invitation link
* End meeting
* Rejoin meeting

---

# 4. Pre-Meeting Lobby

Before entering a meeting, users should see a preview screen.

### Features

* Camera preview
* Microphone test
* Camera selection
* Microphone selection
* Speaker selection
* Enable/disable microphone
* Enable/disable camera
* Enter display name
* Join meeting

Example:

```text
+--------------------------------------+
|             Join Meeting             |
|                                      |
|        ┌──────────────────┐          |
|        │                  │          |
|        │   Camera Preview │          |
|        │                  │          |
|        └──────────────────┘          |
|                                      |
|   🎤 Mic      📹 Camera              |
|                                      |
|   Name: [ Abhishek             ]     |
|                                      |
|             [ Join Meeting ]          |
+--------------------------------------+
```

---

# 5. Real-Time Video Calling

This is the core feature.

Use:

```text
WebRTC
```

for actual audio/video communication.

WebRTC provides:

* Camera streaming
* Microphone streaming
* Peer connections
* Media tracks
* ICE candidates
* SDP negotiation

Basic architecture:

```text
             Signaling Server
                    |
          ┌─────────┴─────────┐
          ↓                   ↓
       Browser A          Browser B
          │                   │
          └──── WebRTC ───────┘
              Audio/Video
```

---

# 6. WebRTC Signaling

WebRTC itself does not provide the signaling mechanism.

Your backend will handle:

```text
Offer
Answer
ICE Candidates
Join
Leave
Participant events
```

Use WebSockets for signaling.

Possible implementation:

```text
Frontend
   |
   | WebSocket
   ↓
Signaling Server
   |
   ├── Room Management
   ├── Offer forwarding
   ├── Answer forwarding
   └── ICE candidate forwarding
```

---

# 7. Meeting Controls

During a meeting users should have:

```text
🎤 Mute / Unmute
📹 Camera On / Off
🖥️ Screen Share
💬 Chat
👥 Participants
🔊 Speaker
⚙️ Settings
📞 Leave
```

Advanced controls:

* Toggle microphone
* Toggle camera
* Switch camera
* Switch microphone
* Switch speaker
* Picture-in-picture
* Full screen
* Raise hand
* Reactions

---

# 8. Screen Sharing

Implement screen sharing using:

```javascript
navigator.mediaDevices.getDisplayMedia()
```

Users should be able to share:

* Entire screen
* Application window
* Browser tab

Example:

```text
User
 |
 ├── Camera Track
 ├── Microphone Track
 └── Screen Track
```

The screen track can replace the camera track during presentation mode.

---

# 9. Participants

A participant panel displays everyone currently inside the room.

Example:

```text
Participants (5)

🟢 Abhishek
   🎤 📹

🟢 Rahul
   🎤 📹

🔴 Priya
   🔇 📹

🟢 Ankit
   🎤 📹

🟢 Sneha
   🎤 📵
```

Features:

* Participant list
* Mute indicator
* Camera indicator
* Hand raised indicator
* Participant name
* Host indicator

---

# 10. Meeting Chat

Real-time chat inside the meeting.

Example:

```text
┌─────────────────────────────┐
│ Chat                        │
├─────────────────────────────┤
│ Rahul: Hi everyone!         │
│                             │
│ Abhishek: Let's start.      │
│                             │
│ Priya: Sure 👍              │
├─────────────────────────────┤
│ [ Type a message... ] [➤]  │
└─────────────────────────────┘
```

Use WebSockets for real-time messages.

Message model:

```text
Message
 ├── id
 ├── roomId
 ├── userId
 ├── message
 ├── createdAt
 └── type
```

---

# 11. Reactions

Users can send reactions:

```text
👍
❤️
😂
👏
🎉
😮
```

These should appear temporarily on the meeting UI.

Implementation:

```text
Client
  ↓
WebSocket
  ↓
Signaling Server
  ↓
All participants
```

---

# 12. Raise Hand

Participants can raise/lower their hand.

```text
Abhishek ✋
Rahul
Priya
```

The event is broadcast through WebSockets.

---

# 13. Host Controls

The meeting creator becomes the host.

Host capabilities:

* Remove participant
* Mute participant
* Lock meeting
* End meeting
* Allow/disallow screen sharing
* Manage participants
* Promote participant
* Transfer host role

---

# 14. Waiting Room

Optional advanced feature.

Users attempting to join a locked meeting enter:

```text
Waiting for host approval...

You can join when the host lets you in.
```

Host sees:

```text
Waiting Room

Rahul       [Admit] [Reject]
Priya       [Admit] [Reject]
```

---

# 15. Meeting Security

Security features:

* JWT authentication
* HTTPS
* Secure WebSocket connection
* Meeting access tokens
* Random room IDs
* Optional meeting passwords
* Host permissions
* Waiting room
* Room locking
* Server-side authorization

---

# 16. Meeting Scheduling

Users can schedule meetings.

```text
Create Meeting

Title:
[ Project Discussion ]

Date:
[ 10 Sept 2026 ]

Time:
[ 10:00 AM ]

Duration:
[ 60 minutes ]

Password:
[ ******** ]

[ Create Meeting ]
```

Meeting model:

```text
Meeting
 ├── id
 ├── roomId
 ├── hostId
 ├── title
 ├── startTime
 ├── endTime
 ├── password
 ├── status
 └── createdAt
```

---

# 17. Meeting History

Users can see previous meetings.

```text
Meeting History

Project Discussion
10 Sept 2026
Duration: 52 min
Participants: 6

Team Standup
8 Sept 2026
Duration: 21 min
Participants: 8
```

---

# 18. Meeting Recording

Advanced feature.

Record:

* Audio
* Video
* Screen share

Possible approaches:

### Browser recording

Use:

```javascript
MediaRecorder
```

### Server-side recording

For a more production-like architecture, use a media server/recording pipeline.

Possible technologies:

* FFmpeg
* mediasoup
* Janus
* LiveKit
* SFU-based architecture

---

# 19. Notifications

Notify users about:

* Upcoming meetings
* Meeting invitations
* Meeting starting
* Participant joining
* Participant leaving

Possible channels:

```text
Email
Browser notifications
In-app notifications
```

---

# 20. User Profile

Profile page:

```text
Profile

Avatar
Name
Email

[ Edit Profile ]

Preferences

Microphone
Camera
Theme
Notifications
```

---

# 🏗️ System Architecture

## Initial Architecture

For the first version:

```text
                    ┌──────────────────┐
                    │     React UI     │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
              REST API               WebSocket
                 │                       │
                 ↓                       ↓
          ┌──────────────┐       ┌──────────────┐
          │ Backend API  │       │  Signaling   │
          │              │       │   Server     │
          └──────┬───────┘       └──────┬───────┘
                 │                      │
                 ↓                      │
          ┌──────────────┐              │
          │ PostgreSQL   │              │
          └──────────────┘              │
                                        │
                         ┌──────────────┴──────────────┐
                         │          WebRTC             │
                         ↓                             ↓
                    Participant A                 Participant B
```

---

# 🧑‍💻 Recommended Tech Stack

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
React Router
WebRTC APIs
WebSocket
Zustand / Redux Toolkit
```

Optional:

```text
Framer Motion
shadcn/ui
Lucide Icons
```

---

# Backend

Since the goal is to understand full-stack development, you can build the backend in **C++** as well.

Recommended:

```text
C++20
Crow / Drogon
WebSocket
REST APIs
JWT
PostgreSQL
Redis
CMake
```

Architecture:

```text
C++ Backend
│
├── REST API
├── Authentication
├── User Management
├── Meeting Management
├── Room Management
├── WebSocket Signaling
├── Chat
└── Participant Management
```

---

# Database

Use:

```text
PostgreSQL
```

Main tables:

```text
users
meetings
meeting_participants
messages
meeting_recordings
notifications
```

Relationship:

```text
User
 │
 ├──── Meetings
 │
 ├──── MeetingParticipants
 │
 ├──── Messages
 │
 └──── Notifications

Meeting
 │
 ├──── Participants
 ├──── Messages
 └──── Recordings
```

---

# Redis

Use Redis for real-time / ephemeral state.

Examples:

```text
Active rooms
Online users
Participant presence
WebSocket sessions
Room locks
Temporary meeting state
```

Example:

```text
room:abc123

participants:
    user1
    user2
    user3
```

---

# 🌐 REST API

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Users

```http
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
```

---

## Meetings

```http
POST   /api/meetings
GET    /api/meetings
GET    /api/meetings/:id
PATCH  /api/meetings/:id
DELETE /api/meetings/:id
POST   /api/meetings/:id/join
POST   /api/meetings/:id/leave
```

---

## Participants

```http
GET    /api/meetings/:id/participants
DELETE /api/meetings/:id/participants/:userId
PATCH  /api/meetings/:id/participants/:userId
```

---

## Chat

```http
GET /api/meetings/:id/messages
```

Real-time messages should use WebSockets.

---

# 🔌 WebSocket Protocol

Connection:

```text
/ws
```

Client → Server:

```json
{
  "type": "join-room",
  "roomId": "abc123",
  "userId": "user123"
}
```

Offer:

```json
{
  "type": "offer",
  "roomId": "abc123",
  "target": "user456",
  "payload": {}
}
```

Answer:

```json
{
  "type": "answer",
  "roomId": "abc123",
  "target": "user123",
  "payload": {}
}
```

ICE candidate:

```json
{
  "type": "ice-candidate",
  "roomId": "abc123",
  "target": "user456",
  "payload": {}
}
```

Chat:

```json
{
  "type": "chat",
  "roomId": "abc123",
  "message": "Hello!"
}
```

---

# 📹 WebRTC Architecture

## MVP: Mesh

For a small number of participants:

```text
       A
      / \
     /   \
    B-----C
```

Every browser connects directly to every other browser.

### Advantages

* Easy to understand
* Easy to implement
* No media server required

### Disadvantages

For N users:

```text
Connections ≈ N × (N - 1)
```

So bandwidth and CPU increase quickly.

---

# 🚀 Production Architecture: SFU

For a scalable application, move toward an SFU.

```text
               ┌─────────────┐
               │     SFU     │
               │ Media Server│
               └──────┬──────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
       User A        User B        User C
```

Possible technologies:

```text
mediasoup
Janus
LiveKit
Jitsi Videobridge
```

The SFU receives media from participants and forwards the appropriate streams to other participants.

---

# 🔐 STUN / TURN

WebRTC requires NAT traversal.

Use:

```text
STUN
TURN
```

Example:

```text
Browser A
    |
    ↓
STUN Server
    |
    ↓
Internet
    |
    ↓
Browser B
```

If direct connectivity fails:

```text
Browser A
    |
    ↓
TURN Server
    |
    ↓
Browser B
```

A common TURN implementation is:

```text
coturn
```

---

# 📁 Project Structure

```text
Confera/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── websocket/
│   │   ├── auth/
│   │   └── utils/
│   │
│   ├── include/
│   ├── tests/
│   └── CMakeLists.txt
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── coturn/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── webrtc/
│
├── docker-compose.yml
└── README.md
```

---

# 🛠️ Development Roadmap

## Phase 1 — Project Setup

* [ ] Create Git repository
* [ ] Setup React + TypeScript
* [ ] Setup C++ backend
* [ ] Setup CMake
* [ ] Setup PostgreSQL
* [ ] Setup Docker
* [ ] Setup environment variables
* [ ] Setup CI/CD

---

# Phase 2 — Authentication

* [ ] User registration
* [ ] Login
* [ ] JWT authentication
* [ ] Password hashing
* [ ] Protected routes
* [ ] User profile

---

# Phase 3 — Meeting Management

* [ ] Create meeting
* [ ] Generate room ID
* [ ] Join meeting
* [ ] Leave meeting
* [ ] Meeting dashboard
* [ ] Meeting history

---

# Phase 4 — WebSocket Signaling

* [ ] WebSocket server
* [ ] Connect/disconnect events
* [ ] Room management
* [ ] Join/leave events
* [ ] Offer forwarding
* [ ] Answer forwarding
* [ ] ICE candidate forwarding

---

# Phase 5 — WebRTC

* [ ] Request camera permission
* [ ] Request microphone permission
* [ ] Local video
* [ ] Remote video
* [ ] Peer connection
* [ ] SDP offer
* [ ] SDP answer
* [ ] ICE candidates
* [ ] Multiple participants

---

# Phase 6 — Meeting UI

* [ ] Video grid
* [ ] Mute/unmute
* [ ] Camera toggle
* [ ] Leave meeting
* [ ] Participant panel
* [ ] Full screen
* [ ] Responsive UI

---

# Phase 7 — Collaboration

* [ ] Chat
* [ ] Reactions
* [ ] Raise hand
* [ ] Screen sharing
* [ ] Participant presence

---

# Phase 8 — Host Features

* [ ] Host identification
* [ ] Remove participant
* [ ] Mute participant
* [ ] Lock room
* [ ] Waiting room
* [ ] Host transfer

---

# Phase 9 — Advanced Features

* [ ] Meeting scheduling
* [ ] Meeting invitations
* [ ] Notifications
* [ ] Recording
* [ ] Meeting analytics
* [ ] Transcription
* [ ] AI meeting summary

---

# Phase 10 — Scalability

Move from:

```text
WebRTC Mesh
```

to:

```text
WebRTC + SFU
```

Add:

```text
Redis
PostgreSQL
Load Balancer
Multiple signaling servers
Media servers
TURN servers
```

Architecture:

```text
                    Load Balancer
                         |
              ┌──────────┴──────────┐
              ↓                     ↓
        API Server 1          API Server 2
              │                     │
              └──────────┬──────────┘
                         ↓
                       Redis
                         |
                    PostgreSQL
                         
                         +
                         
                    Media Layer
                         |
             ┌───────────┴───────────┐
             ↓                       ↓
           SFU 1                   SFU 2
             │                       │
        Participants            Participants
```

---

# 🤖 AI Features

As an advanced version, integrate AI.

Possible features:

### AI Meeting Summary

```text
Meeting ends
      ↓
Audio / transcript
      ↓
Speech-to-text
      ↓
LLM
      ↓
Summary
      ↓
Action Items
```

Output:

```text
Meeting Summary

Key Discussion:
• Discussed project architecture
• Reviewed deployment strategy
• Finalized database schema

Action Items:

☐ Rahul — Setup PostgreSQL
☐ Priya — Build frontend
☐ Abhishek — Implement WebRTC

Next Meeting:
Friday, 10 AM
```

---

# 📊 Meeting Analytics

Track:

```text
Meeting duration
Number of participants
Average participant duration
Join/leave events
Network quality
Packet loss
Latency
Audio/video quality
```

---

# 🧪 Testing

## Frontend

```text
Unit Tests
Integration Tests
Component Tests
E2E Tests
```

Tools:

```text
Vitest
React Testing Library
Playwright
```

## Backend

Test:

```text
Authentication
REST APIs
Database
WebSocket
Room management
Authorization
```

---

# 🐳 Docker

Services:

```text
frontend
backend
postgres
redis
coturn
nginx
```

Example:

```text
docker-compose

        ┌───────────┐
        │   Nginx   │
        └─────┬─────┘
              │
      ┌───────┴────────┐
      ↓                ↓
  Frontend          Backend
                       │
                ┌──────┴──────┐
                ↓             ↓
            PostgreSQL       Redis

                       +
                    Coturn
```

---

# 🔒 Security Checklist

* [ ] HTTPS
* [ ] Secure WebSockets
* [ ] JWT validation
* [ ] Password hashing
* [ ] Input validation
* [ ] Rate limiting
* [ ] CORS configuration
* [ ] SQL injection protection
* [ ] Authorization checks
* [ ] Meeting access control
* [ ] Secure room IDs
* [ ] TURN authentication

---

# 📈 Future Improvements

* [ ] Mobile application
* [ ] Calendar integration
* [ ] Google authentication
* [ ] Microsoft authentication
* [ ] Meeting recordings
* [ ] Live transcription
* [ ] AI summaries
* [ ] Background blur
* [ ] Virtual backgrounds
* [ ] Noise cancellation
* [ ] Breakout rooms
* [ ] Whiteboard
* [ ] Collaborative documents
* [ ] Webinar mode
* [ ] Large-scale SFU infrastructure

---

# 🎯 Final Feature Set

The completed Confera platform should support:

```text
                    Confera
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
 Authentication    Dashboard      Meetings
       │              │              │
       │              │              ├── Create
       │              │              ├── Join
       │              │              ├── Schedule
       │              │              └── History
       │              │
       │              └── Profile
       │
       └───────────────────────────────┐
                                       ↓
                                  Meeting Room
                                       │
                    ┌──────────────────┼──────────────────┐
                    ↓                  ↓                  ↓
                 WebRTC             WebSocket          Backend
                    │                  │                  │
             ┌──────┼──────┐      ┌────┼────┐       ┌────┼────┐
             ↓      ↓      ↓      ↓    ↓    ↓       ↓    ↓    ↓
           Audio  Video  Screen  Chat  Reactions  DB  Redis  API
```

---

# 🏆 Project Goal

The ultimate goal is to build a **production-style video conferencing platform** rather than just a video-call demo.

The project should demonstrate knowledge of:

* React
* TypeScript
* C++
* REST APIs
* WebSockets
* WebRTC
* Networking
* Authentication
* PostgreSQL
* Redis
* Docker
* System Design
* Distributed Systems
* Real-Time Systems
* Media Streaming
* Cloud Deployment
* AI integration

---

## ⭐ Portfolio Description

> **Confera — Real-Time Video Conferencing Platform**
>
> Built a full-stack video conferencing platform using React, TypeScript, C++, WebSockets and WebRTC. Implemented secure authentication, meeting rooms, real-time signaling, peer-to-peer audio/video communication, screen sharing, chat, participant management and meeting scheduling. Designed the architecture to evolve from WebRTC mesh networking to an SFU-based scalable media architecture using Redis, TURN and media servers.

---

## 📌 Development Principle

Build it progressively:

```text
MVP
 ↓
Authentication
 ↓
Meeting Rooms
 ↓
WebSockets
 ↓
WebRTC
 ↓
Multi-user Calls
 ↓
Chat + Screen Share
 ↓
Host Controls
 ↓
Recording
 ↓
SFU
 ↓
Scalability
 ↓
AI Features
```

**Do not start with the full distributed architecture.**

First make:

```text
Browser A ↔ Browser B
```

work reliably.

Then move to:

```text
A ↔ B ↔ C ↔ D
```

and finally:

```text
Users → SFU → Users
```

That progression will give you a much deeper understanding of how systems like Jitsi Meet actually work.
