import { Link } from 'react-router-dom';
import {
  Video,
  Zap,
  Shield,
  Users,
  ArrowRight,
  MonitorUp,
  MessageSquare,
  Sparkles,
  Mic,
  MicOff,
  Radio,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  {
    icon: <Zap size={22} color="#fbbf24" />,
    iconBg: 'rgba(251,191,36,0.12)',
    iconBorder: 'rgba(251,191,36,0.25)',
    title: 'Instant Meetings',
    desc: 'Launch a secure video room in one click. No downloads, installations, or waiting rooms required.',
  },
  {
    icon: <Shield size={22} color="#34d399" />,
    iconBg: 'rgba(52,211,153,0.12)',
    iconBorder: 'rgba(52,211,153,0.25)',
    title: 'Secure by Default',
    desc: 'Direct peer-to-peer WebRTC connections with optional meeting passwords and cryptographically verified JWT tokens.',
  },
  {
    icon: <Users size={22} color="#818cf8" />,
    iconBg: 'rgba(129,140,248,0.12)',
    iconBorder: 'rgba(129,140,248,0.25)',
    title: 'Adaptive Video Grid',
    desc: 'Responsive multi-participant layout that automatically balances video feeds and spotlights active speakers.',
  },
  {
    icon: <MonitorUp size={22} color="#c084fc" />,
    iconBg: 'rgba(192,132,252,0.12)',
    iconBorder: 'rgba(192,132,252,0.25)',
    title: 'HD Screen Sharing',
    desc: 'Stream your complete desktop, specific application window, or browser tab with crisp audio-visual clarity.',
  },
  {
    icon: <MessageSquare size={22} color="#38bdf8" />,
    iconBg: 'rgba(56,189,248,0.12)',
    iconBorder: 'rgba(56,189,248,0.25)',
    title: 'Real-Time In-Call Chat',
    desc: 'Fast, synchronous messaging powered by low-latency WebSockets with live notifications and participant sync.',
  },
  {
    icon: <Lock size={22} color="#f472b6" />,
    iconBg: 'rgba(244,114,182,0.12)',
    iconBorder: 'rgba(244,114,182,0.25)',
    title: 'WebRTC & C++ Engine',
    desc: 'Backed by a high-performance C++ Drogon server handling high-throughput signaling and STUN/ICE routing.',
  },
];

export function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080a0f',
        color: '#eef0ff',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ─── Navigation ──────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid #252839',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: '#eef0ff',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 18px rgba(99,102,241,.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Video size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Confera
            </span>
          </Link>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="md">
                Sign in
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Glow ambient background blobs */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,.18) 0%, rgba(139,92,246,.08) 45%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 99,
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.28)',
              color: '#818cf8',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: 28,
              boxShadow: '0 2px 16px rgba(99,102,241,.15)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 10px #4ade80',
              }}
            />
            WebRTC · Direct Peer-to-Peer · Ultra-low Latency
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.14,
              letterSpacing: '-0.03em',
              color: '#eef0ff',
              marginBottom: 24,
            }}
          >
            Video meetings{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              built from scratch
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#8b8fa8',
              maxWidth: 680,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Confera is an open-source, production-grade video conferencing platform.
            Connect instantly, share your screen, and collaborate with crystal-clear audio and video.
          </p>

          {/* Buttons Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 28,
            }}
          >
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button size="lg" style={{ padding: '14px 32px', fontSize: '1.05rem', gap: 10 }}>
                Start for free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="secondary" style={{ padding: '14px 30px', fontSize: '1.05rem' }}>
                Sign in to room
              </Button>
            </Link>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#4b4f6a' }}>
            Instant setup · No plugins required · Encrypted signaling
          </p>

          {/* ─── Mock Video Conference Window (Hero Graphic) ──────────── */}
          <div
            style={{
              marginTop: 56,
              background: '#0f1118',
              border: '1px solid #252839',
              borderRadius: 20,
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
              overflow: 'hidden',
              textAlign: 'left',
            }}
          >
            {/* Window header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: '#161923',
                borderBottom: '1px solid #252839',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '0.75rem', color: '#8b8fa8', marginLeft: 12, fontWeight: 500 }}>
                  Confera Meeting · Room #confera-live
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#4ade80' }}>
                <Radio size={13} />
                <span>Encrypted P2P</span>
              </div>
            </div>

            {/* Window body with 2 participant tiles */}
            <div
              style={{
                padding: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 14,
                background: '#080a0f',
              }}
            >
              {/* Tile 1 */}
              <div
                style={{
                  position: 'relative',
                  height: 220,
                  borderRadius: 14,
                  background: 'linear-gradient(145deg, #161923 0%, #1e2235 100%)',
                  border: '1px solid #252839',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
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
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(99,102,241,.3)',
                  }}
                >
                  A
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#eef0ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Mic size={12} color="#4ade80" /> Abhishek (Host)
                </div>
              </div>

              {/* Tile 2 */}
              <div
                style={{
                  position: 'relative',
                  height: 220,
                  borderRadius: 14,
                  background: 'linear-gradient(145deg, #161923 0%, #1a1d2e 100%)',
                  border: '1px solid #252839',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#ec4899,#f43f5e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(236,72,153,.3)',
                  }}
                >
                  S
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#eef0ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <MicOff size={12} color="#f87171" /> Sarah (Guest)
                </div>
              </div>
            </div>

            {/* Bottom mini bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '12px 18px',
                background: '#161923',
                borderTop: '1px solid #252839',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1e2235', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}><Mic size={16} /></div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1e2235', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eef0ff' }}><Video size={16} /></div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1e2235', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}><MonitorUp size={16} /></div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1e2235', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}><MessageSquare size={16} /></div>
              <div style={{ width: 70, height: 34, borderRadius: 10, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>Leave</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px 100px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#818cf8',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            <Sparkles size={14} /> Production Ready
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#eef0ff',
              letterSpacing: '-0.02em',
              marginBottom: 14,
            }}
          >
            Everything you need for video conferencing
          </h2>
          <p style={{ color: '#8b8fa8', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
            Built with pure WebRTC and C++ Drogon. Designed for speed, security, and low latency.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {FEATURES.map((item) => (
            <div
              key={item.title}
              style={{
                background: '#161923',
                border: '1px solid #252839',
                borderRadius: 18,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#383d58';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#252839';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: item.iconBg,
                  border: `1px solid ${item.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#eef0ff', marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#8b8fa8', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom Call to Action ───────────────────────────────────── */}
      <section
        style={{
          padding: '0 24px 90px',
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 24,
            padding: '56px 36px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#eef0ff',
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            Ready to experience seamless video calls?
          </h2>
          <p
            style={{
              color: '#8b8fa8',
              fontSize: '1.05rem',
              maxWidth: 540,
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Join Confera today. Host instant meetings, collaborate with your team, and enjoy private, low-latency conferencing.
          </p>

          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button size="lg" style={{ padding: '14px 36px', fontSize: '1.05rem', gap: 10 }}>
              Create a free account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid #1a1d2e',
          padding: '28px 24px',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#4b4f6a',
        }}
      >
        <p>© 2026 Confera. Powered by WebRTC & C++ Drogon.</p>
      </footer>
    </div>
  );
}
