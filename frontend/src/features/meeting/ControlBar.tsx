import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, Users, PhoneOff, Hand } from 'lucide-react';
import { useMeetingStore } from '@/store/meetingStore';

interface Props {
  onLeave: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
}

function CtrlBtn({ icon, label, active, danger, onClick, id }: {
  icon: React.ReactNode; label: string;
  active?: boolean; danger?: boolean; onClick: () => void; id: string;
}) {
  const base: React.CSSProperties = { display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'10px 14px', borderRadius:14, border:'1px solid', cursor:'pointer', transition:'all .12s', minWidth:60 };
  const s: React.CSSProperties = danger
    ? { ...base, background:'#ef4444', borderColor:'#ef4444', color:'#fff' }
    : active
    ? { ...base, background:'rgba(239,68,68,.1)', borderColor:'rgba(239,68,68,.3)', color:'#f87171' }
    : { ...base, background:'#161923', borderColor:'#252839', color:'#8b8fa8' };

  return (
    <button id={id} style={s} onClick={onClick}
      onMouseEnter={e => !danger && !active && (e.currentTarget.style.borderColor='#4b4f6a', e.currentTarget.style.color='#eef0ff')}
      onMouseLeave={e => !danger && !active && (e.currentTarget.style.borderColor='#252839', e.currentTarget.style.color='#8b8fa8')}
      title={label}
    >
      <span style={{ fontSize:18, lineHeight:1, display:'flex' }}>{icon}</span>
      <span style={{ fontSize:'.65rem', fontWeight:600, whiteSpace:'nowrap' }}>{label}</span>
    </button>
  );
}

export function ControlBar({ onLeave, onToggleMute, onToggleCamera, onScreenShare, onRaiseHand }: Props) {
  const { isMuted, isCameraOff, isScreenSharing, isChatOpen, isParticipantsOpen, toggleChat, toggleParticipants } = useMeetingStore();

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 20px', flexWrap:'wrap' }}>
      <CtrlBtn id="ctrl-mute"         onClick={onToggleMute}       active={isMuted}            icon={isMuted ? <MicOff size={20}/> : <Mic size={20}/>}                label={isMuted ? 'Unmute' : 'Mute'} />
      <CtrlBtn id="ctrl-cam"          onClick={onToggleCamera}     active={isCameraOff}        icon={isCameraOff ? <VideoOff size={20}/> : <Video size={20}/>}        label={isCameraOff ? 'Show Cam' : 'Camera'} />
      <CtrlBtn id="ctrl-screen"       onClick={onScreenShare}      active={isScreenSharing}    icon={<MonitorUp size={20}/>}                                           label={isScreenSharing ? 'Stop' : 'Share'} />
      <CtrlBtn id="ctrl-hand"         onClick={onRaiseHand}                                    icon={<Hand size={20}/>}                                               label="Hand" />
      <CtrlBtn id="ctrl-chat"         onClick={toggleChat}         active={isChatOpen}         icon={<MessageSquare size={20}/>}                                       label="Chat" />
      <CtrlBtn id="ctrl-participants" onClick={toggleParticipants} active={isParticipantsOpen} icon={<Users size={20}/>}                                              label="People" />
      <div style={{ width:1, height:40, background:'#252839', margin:'0 4px' }} />
      <CtrlBtn id="ctrl-leave"        onClick={onLeave}            danger                      icon={<PhoneOff size={20}/>}                                            label="Leave" />
    </div>
  );
}
