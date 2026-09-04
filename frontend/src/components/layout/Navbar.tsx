import { Link, useNavigate } from 'react-router-dom';
import { Video, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ background: 'rgba(15,17,24,.92)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold no-underline" style={{ color: 'var(--text-1)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Video size={14} color="#fff" />
          </div>
          <span className="text-[15px] tracking-tight">Confera</span>
        </Link>

        {/* Right */}
        {user && (
          <div className="flex items-center gap-1">
            <Link to="/dashboard">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-2)', background: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </Link>

            <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

            {/* Avatar */}
            <div className="flex items-center gap-2 px-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-2)' }}>{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--bg-elevated)'; e.currentTarget.style.color='var(--text-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)'; }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
