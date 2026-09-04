import { X, Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';
import { useMeetingStore } from '@/store/meetingStore';

export function ParticipantsPanel() {
  const { participants, toggleParticipants } = useMeetingStore();

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0f1118', borderLeft:'1px solid #252839' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #252839' }}>
        <span style={{ fontWeight:700, fontSize:'.875rem', color:'#eef0ff' }}>
          Participants <span style={{ color:'#4b4f6a', fontWeight:400 }}>({participants.length})</span>
        </span>
        <button onClick={toggleParticipants} style={{ padding:6, borderRadius:8, background:'transparent', border:'none', cursor:'pointer', color:'#4b4f6a', display:'flex' }}>
          <X size={15} />
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
        {participants.length === 0 ? (
          <p style={{ textAlign:'center', color:'#4b4f6a', fontSize:'.8rem', marginTop:40 }}>No other participants yet.</p>
        ) : participants.map(p => (
          <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom:'1px solid #1a1d2e', transition:'background .12s' }}
            onMouseEnter={e => (e.currentTarget.style.background='#161923')}
            onMouseLeave={e => (e.currentTarget.style.background='transparent')}
          >
            {/* Avatar */}
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', fontSize:'.875rem', flexShrink:0 }}>
              {p.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:'.875rem', fontWeight:600, color:'#eef0ff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                {p.isHost && <span style={{ fontSize:'.65rem', color:'#fbbf24', background:'rgba(251,191,36,.1)', padding:'1px 6px', borderRadius:4, fontWeight:600 }}>Host</span>}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {p.hasRaisedHand && <Hand size={13} color="#fbbf24" />}
              {p.isMuted ? <MicOff size={13} color="#f87171" /> : <Mic size={13} color="#4ade80" />}
              {p.isCameraOff ? <VideoOff size={13} color="#f87171" /> : <Video size={13} color="#4ade80" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
