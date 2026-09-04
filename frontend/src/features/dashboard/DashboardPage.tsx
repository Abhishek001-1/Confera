import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, LogIn, Calendar, Clock, Users, Copy, CheckCheck, ArrowRight, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { meetingsApi } from '@/api/meetings';
import type { Meeting } from '@/types';
import { ScheduleModal } from './ScheduleModal';

/* ─── Helpers ──────────────────── */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/* ─── Sub-components ───────────── */
function Btn({ children, onClick, loading, secondary, id }: {
  children: React.ReactNode; onClick?: () => void; loading?: boolean;
  secondary?: boolean; id?: string;
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '0.6rem 1.1rem', borderRadius: 12,
    fontSize: '.875rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all .15s', border: '1px solid transparent',
  };
  const style: React.CSSProperties = secondary
    ? { ...base, background: '#1e2235', border: '1px solid #252839', color: '#eef0ff' }
    : { ...base, background: '#6366f1', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,.3)' };

  return (
    <button id={id} style={style} onClick={onClick} disabled={loading}
      onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {loading
        ? <span style={{ width:16,height:16,borderRadius:'50%',border:'2px solid currentColor',borderTopColor:'transparent',animation:'spin .7s linear infinite',display:'inline-block' }} />
        : children}
    </button>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#161923', border: '1px solid #252839', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function StatTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ color, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#eef0ff', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '.75rem', color: '#4b4f6a', marginTop: 2 }}>{label}</p>
      </div>
    </Card>
  );
}

function MeetingRow({ m, onJoin, onCopy, copied }: { m: Meeting; onJoin: () => void; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #1a1d2e', transition:'background .12s' }}
      onMouseEnter={e => (e.currentTarget.style.background='#1e2235')}
      onMouseLeave={e => (e.currentTarget.style.background='transparent')}
    >
      <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Video size={16} color="#818cf8" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'.875rem', fontWeight:600, color:'#eef0ff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</p>
        <p style={{ fontSize:'.75rem', color:'#4b4f6a', marginTop:2 }}>{fmtDate(m.startTime)}{m.participantCount ? ` · ${m.participantCount} people` : ''}</p>
      </div>
      <button onClick={onCopy} title="Copy link" style={{ padding:6, borderRadius:8, background:'transparent', border:'none', cursor:'pointer', color: copied ? '#4ade80' : '#4b4f6a' }}>
        {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
      </button>
      <button onClick={onJoin} style={{ padding:'6px 14px', borderRadius:8, background:'#1e2235', border:'1px solid #252839', color:'#eef0ff', fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>
        Join
      </button>
    </div>
  );
}

function EmptySlot({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'36px 0', color:'#4b4f6a' }}>
      {icon}
      <p style={{ fontSize:'.875rem', color:'#8b8fa8', fontWeight:500 }}>{title}</p>
      <p style={{ fontSize:'.75rem' }}>{hint}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <>
      {[0,1,2].map(i => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #1a1d2e' }}>
          <div style={{ width:36,height:36,borderRadius:10,background:'#1e2235',animation:'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ flex:1 }}>
            <div style={{ height:12,width:'65%',borderRadius:6,background:'#1e2235',marginBottom:6,animation:'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height:10,width:'40%',borderRadius:6,background:'#1e2235',animation:'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Main Component ───────────── */
export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [joinId, setJoinId] = useState('');
  const [joinOpen, setJoinOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    meetingsApi.list()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data as any)?.meetings || [];
        setMeetings(list);
      })
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const startInstant = async () => {
    setCreating(true);
    try {
      const { data } = await meetingsApi.create({ title: 'Instant Meeting' });
      navigate(`/lobby/${data.id}`);
    } catch { setCreating(false); }
  };

  const doJoin = () => {
    const id = joinId.trim();
    if (id) { navigate(`/lobby/${id}`); setJoinOpen(false); }
  };

  const copyLink = (roomId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/lobby/${roomId}`);
    setCopied(roomId); setTimeout(() => setCopied(null), 2000);
  };

  const upcoming = meetings.filter(m => m.status === 'scheduled');
  const recent = meetings.filter(m => m.status === 'ended');
  const active = meetings.filter(m => m.status === 'active');

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1rem', display:'flex', flexDirection:'column', gap:24 }}>

      {/* Hero */}
      <Card style={{ padding:'2rem 2.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, right:120, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        <p style={{ fontSize:'.8rem', color:'#4b4f6a', marginBottom:6 }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
        <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#eef0ff', marginBottom:20 }}>
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          <Btn id="btn-start" onClick={startInstant} loading={creating}>
            <Video size={16} /> Start Meeting
          </Btn>
          <Btn id="btn-join" secondary onClick={() => setJoinOpen(true)}>
            <LogIn size={16} /> Join Meeting
          </Btn>
          <Btn id="btn-schedule" secondary onClick={() => setScheduleOpen(true)}>
            <Calendar size={16} /> Schedule
          </Btn>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
        <StatTile icon={<Video size={18} />}    label="Total Meetings" value={meetings.length} color="#818cf8" />
        <StatTile icon={<Calendar size={18} />} label="Upcoming"       value={upcoming.length} color="#a78bfa" />
        <StatTile icon={<Clock size={18} />}    label="Completed"      value={recent.length}   color="#4ade80" />
        <StatTile icon={<Users size={18} />}    label="In Progress"    value={active.length}   color="#fbbf24" />
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div>
          <p style={{ fontSize:'.7rem', fontWeight:700, color:'#4b4f6a', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 }}>🔴 Live Now</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {active.map(m => (
              <Card key={m.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', border:'1px solid rgba(74,222,128,.2)' }}>
                <Video size={20} color="#4ade80" />
                <div style={{ flex:1 }}><p style={{ fontWeight:600, color:'#eef0ff' }}>{m.title}</p></div>
                <Btn onClick={() => navigate(`/lobby/${m.id}`)}>Join Now <ArrowRight size={14} /></Btn>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tables */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[
          { title:'Upcoming', icon:<Calendar size={15} />, items: upcoming },
          { title:'Recent',   icon:<Clock size={15} />,    items: recent.slice(0,5) },
        ].map(({ title, icon, items }) => (
          <div key={title}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <span style={{ color:'#4b4f6a' }}>{icon}</span>
              <p style={{ fontSize:'.7rem', fontWeight:700, color:'#4b4f6a', textTransform:'uppercase', letterSpacing:'.1em' }}>{title}</p>
            </div>
            <Card>
              {loading ? <Skeleton /> : items.length === 0 ? (
                <EmptySlot
                  icon={title === 'Upcoming' ? <Calendar size={24} /> : <Clock size={24} />}
                  title={title === 'Upcoming' ? 'No upcoming meetings' : 'No past meetings'}
                  hint={title === 'Upcoming' ? 'Schedule one to get started' : 'Past meetings appear here'}
                />
              ) : items.map(m => (
                <MeetingRow
                  key={m.id} m={m}
                  copied={copied === m.roomId}
                  onCopy={() => copyLink(m.roomId)}
                  onJoin={() => navigate(`/lobby/${m.id}`)}
                />
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Join overlay */}
      {joinOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(6px)' }}
          onClick={() => setJoinOpen(false)}>
          <div style={{ background:'#161923', border:'1px solid #252839', borderRadius:20, padding:'1.75rem', width:'100%', maxWidth:400, boxShadow:'0 24px 64px rgba(0,0,0,.6)' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight:700, color:'#eef0ff', marginBottom:16, fontSize:'1.1rem' }}>Join a Meeting</h2>
            <p style={{ fontSize:'.875rem', color:'#8b8fa8', marginBottom:16 }}>Enter the meeting ID or paste the invite link.</p>
            <input
              id="join-input"
              className="field"
              placeholder="e.g. abc-123-xyz"
              value={joinId}
              onChange={e => setJoinId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doJoin()}
              autoFocus
              style={{ marginBottom:16 }}
            />
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
              <Btn secondary onClick={() => setJoinOpen(false)}>Cancel</Btn>
              <Btn id="btn-confirm-join" onClick={doJoin}>Join Now</Btn>
            </div>
          </div>
        </div>
      )}

      <ScheduleModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
