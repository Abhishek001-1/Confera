import { useRef, useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import { useMeetingStore } from '@/store/meetingStore';
import { useAuthStore } from '@/store/authStore';

export function ChatPanel({ onSend }: { onSend: (msg: string) => void }) {
  const { messages, toggleChat } = useMeetingStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = () => {
    if (text.trim()) { onSend(text.trim()); setText(''); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0f1118', borderLeft:'1px solid #252839' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #252839' }}>
        <span style={{ fontWeight:700, fontSize:'.875rem', color:'#eef0ff' }}>In-Call Chat</span>
        <button onClick={toggleChat} style={{ padding:6, borderRadius:8, background:'transparent', border:'none', cursor:'pointer', color:'#4b4f6a', display:'flex' }}>
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {messages.length === 0
          ? <p style={{ textAlign:'center', color:'#4b4f6a', fontSize:'.8rem', marginTop:32 }}>No messages yet. Say hi! 👋</p>
          : messages.map(msg => {
              const isMe = msg.userId === user?.id;
              return (
                <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap:3 }}>
                  <span style={{ fontSize:'.72rem', color:'#4b4f6a' }}>{isMe ? 'You' : msg.senderName}</span>
                  <div style={{ padding:'8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isMe ? '#6366f1' : '#161923', border: isMe ? 'none' : '1px solid #252839', color:'#eef0ff', fontSize:'.875rem', maxWidth:'80%', wordBreak:'break-word' }}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'10px 12px', borderTop:'1px solid #252839', display:'flex', alignItems:'center', gap:8 }}>
        <input
          id="chat-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type a message…"
          style={{ flex:1, background:'#161923', border:'1px solid #252839', borderRadius:10, padding:'8px 12px', color:'#eef0ff', fontSize:'.875rem', outline:'none' }}
        />
        <button id="chat-send" onClick={send} disabled={!text.trim()}
          style={{ width:34, height:34, borderRadius:10, background:'#6366f1', border:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: text.trim() ? 1 : 0.4 }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
