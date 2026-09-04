import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Settings, ChevronRight, AlertTriangle } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';
import { useAuthStore } from '@/store/authStore';
import { meetingsApi } from '@/api/meetings';

export function LobbyPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [joining, setJoining] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Meeting');

  const { stream, isMuted, isCameraOff, error, startMedia, stopMedia, toggleMute, toggleCamera } = useMedia();

  useEffect(() => {
    if (meetingId) meetingsApi.get(meetingId).then(({ data }) => setMeetingTitle(data.title)).catch(() => {});
    startMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      if (meetingId) { await meetingsApi.join(meetingId); stopMedia(); navigate(`/meeting/${meetingId}`); }
    } catch { setJoining(false); }
  };

  const s = (cond: boolean): React.CSSProperties =>
    cond
      ? { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171' }
      : { background:'#161923', border:'1px solid #252839', color:'#8b8fa8' };

  return (
    <div style={{ minHeight:'calc(100vh - 3.5rem)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', background:'var(--bg-base)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:40, left:'28%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.09) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:800, animation:'slideUp .4s ease both' }}>
        {/* Title */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <p style={{ fontSize:'.7rem', color:'#4b4f6a', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>Ready to join?</p>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#eef0ff' }}>{meetingTitle}</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="md:!flex-row">
          {/* Preview */}
          <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position:'relative', aspectRatio:'16/9', background:'#0f1118', borderRadius:16, overflow:'hidden', border:'1px solid #252839' }}>
              {stream && !isCameraOff
                ? <video ref={videoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)' }} />
                : (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
                    <div style={{ width:56,height:56,borderRadius:'50%',background:'#1e2235',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <span style={{ fontSize:20,fontWeight:700,color:'#6366f1' }}>{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize:'.8rem', color:'#4b4f6a' }}>{error ? 'Camera unavailable' : 'Camera is off'}</p>
                  </div>
                )}
              {/* Ready badge */}
              <div style={{ position:'absolute', top:10, right:10, fontSize:'.7rem', fontWeight:600, padding:'4px 10px', borderRadius:99, ...(stream && !error ? { background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.2)', color:'#4ade80' } : { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', color:'#f87171' }) }}>
                {stream && !error ? '● Ready' : '✕ No video'}
              </div>
              {/* Name */}
              <div style={{ position:'absolute', bottom:10, left:10, background:'rgba(0,0,0,.6)', backdropFilter:'blur(4px)', borderRadius:8, padding:'4px 10px', fontSize:'.75rem', color:'#fff', fontWeight:500 }}>
                {user?.name ?? 'You'} (You)
              </div>
              {error && (
                <div style={{ position:'absolute', inset:'10px 10px auto', display:'flex', alignItems:'flex-start', gap:8, background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.25)', borderRadius:10, padding:'10px 14px', fontSize:'.8rem', color:'#f87171' }}>
                  <AlertTriangle size={14} style={{ flexShrink:0, marginTop:1 }} />{error}
                </div>
              )}
            </div>

            {/* Toggle buttons */}
            <div style={{ display:'flex', justifyContent:'center', gap:12 }}>
              {[
                { id:'lobby-mic', active:isMuted, onIco:<Mic size={20}/>, offIco:<MicOff size={20}/>, onLbl:'Mute', offLbl:'Unmute', fn:toggleMute },
                { id:'lobby-cam', active:isCameraOff, onIco:<Video size={20}/>, offIco:<VideoOff size={20}/>, onLbl:'Hide', offLbl:'Show', fn:toggleCamera },
              ].map(b => (
                <button key={b.id} id={b.id} onClick={b.fn} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, width:64, height:64, borderRadius:16, cursor:'pointer', transition:'all .15s', ...(b.active ? { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171' } : { background:'#161923', border:'1px solid #252839', color:'#8b8fa8' }) }}>
                  {b.active ? b.offIco : b.onIco}
                  <span style={{ fontSize:'.7rem', fontWeight:600 }}>{b.active ? b.offLbl : b.onLbl}</span>
                </button>
              ))}
              <button id="lobby-settings" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, width:64, height:64, borderRadius:16, cursor:'pointer', background:'#161923', border:'1px solid #252839', color:'#8b8fa8', transition:'all .15s' }}>
                <Settings size={20} />
                <span style={{ fontSize:'.7rem', fontWeight:600 }}>Settings</span>
              </button>
            </div>
          </div>

          {/* Panel */}
          <div style={{ flex: 1, background:'#161923', border:'1px solid #252839', borderRadius:16, padding:'1.25rem', display:'flex', flexDirection:'column', gap:18 }}>
            {/* User */}
            <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:16, borderBottom:'1px solid #252839' }}>
              <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff',fontSize:'1rem',flexShrink:0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontWeight:600,fontSize:'.875rem',color:'#eef0ff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize:'.75rem',color:'#4b4f6a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.email}</p>
              </div>
            </div>

            {/* Status */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontSize:'.7rem',color:'#4b4f6a',textTransform:'uppercase',letterSpacing:'.08em',fontWeight:700 }}>Device Status</p>
              {[
                { label:'Microphone', ok:!isMuted },
                { label:'Camera', ok:!isCameraOff },
                { label:'Network', ok:true },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'.875rem', color:'#8b8fa8' }}>{item.label}</span>
                  <span style={{ fontSize:'.72rem', fontWeight:600, padding:'3px 10px', borderRadius:99, ...(item.ok ? { color:'#4ade80', background:'rgba(74,222,128,.1)' } : { color:'#f87171', background:'rgba(239,68,68,.1)' }) }}>
                    {item.ok ? 'Ready' : 'Off'}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:8 }}>
              <button id="btn-join-now" onClick={handleJoin} disabled={joining}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.75rem', borderRadius:12, background:'#6366f1', border:'none', color:'#fff', fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 4px 18px rgba(99,102,241,.35)', transition:'all .15s' }}>
                {joining
                  ? <span style={{ width:18,height:18,borderRadius:'50%',border:'2px solid #fff',borderTopColor:'transparent',animation:'spin .7s linear infinite',display:'inline-block' }} />
                  : <><span>Join Now</span><ChevronRight size={16} /></>}
              </button>
              <button onClick={() => navigate('/dashboard')} style={{ padding:'0.6rem', borderRadius:12, background:'transparent', border:'none', color:'#4b4f6a', fontWeight:600, cursor:'pointer', fontSize:'.875rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
