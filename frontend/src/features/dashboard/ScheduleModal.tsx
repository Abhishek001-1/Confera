import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingsApi } from '@/api/meetings';

interface Props { isOpen: boolean; onClose: () => void; }

export function ScheduleModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await meetingsApi.create({ title, startTime, password: password || undefined });
      onClose();
      navigate(`/lobby/${data.id}`);
    } catch {
      setError('Failed to create meeting.');
    } finally { setLoading(false); }
  };

  const overlay: React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(8px)' };
  const modal: React.CSSProperties = { background:'#161923', border:'1px solid #252839', borderRadius:20, padding:'1.75rem', width:'100%', maxWidth:420, boxShadow:'0 24px 64px rgba(0,0,0,.65)' };
  const fieldWrap: React.CSSProperties = { display:'flex', flexDirection:'column', gap:6 };
  const lbl: React.CSSProperties = { fontSize:'.72rem', fontWeight:700, color:'#8b8fa8', textTransform:'uppercase', letterSpacing:'.08em' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontWeight:700, color:'#eef0ff', marginBottom:20, fontSize:'1.1rem' }}>Schedule a Meeting</h2>

        {error && <p style={{ fontSize:'.8rem', color:'#f87171', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:10, padding:'10px 14px', marginBottom:16 }}>{error}</p>}

        <form id="schedule-form" onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={fieldWrap}>
            <label htmlFor="sched-title" style={lbl}>Meeting Title</label>
            <input id="sched-title" className="field" placeholder="Team Standup" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div style={fieldWrap}>
            <label htmlFor="sched-time" style={lbl}>Date & Time</label>
            <input id="sched-time" className="field" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div style={fieldWrap}>
            <label htmlFor="sched-password" style={lbl}>Password (optional)</label>
            <input id="sched-password" className="field" type="password" placeholder="Leave blank for open meeting" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose}
              style={{ padding:'8px 18px', borderRadius:10, background:'#1e2235', border:'1px solid #252839', color:'#eef0ff', fontWeight:600, cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit" id="btn-create-meeting" disabled={loading}
              style={{ padding:'8px 18px', borderRadius:10, background:'#6366f1', border:'none', color:'#fff', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 14px rgba(99,102,241,.35)' }}>
              {loading
                ? <span style={{ width:16,height:16,borderRadius:'50%',border:'2px solid #fff',borderTopColor:'transparent',animation:'spin .7s linear infinite',display:'inline-block' }} />
                : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
