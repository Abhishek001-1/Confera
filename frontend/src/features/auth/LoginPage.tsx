import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Invalid email or password.'
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)' }} />

      <div className="w-full max-w-[380px] animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-ring"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,.4)' }}
          >
            <Video size={24} color="#fff" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Sign in to Confera</p>
          </div>
        </div>

        {/* Card */}
        <div className="auth-card">
          {error && (
            <div
              className="flex items-center gap-2 text-sm rounded-xl p-3 mb-4"
              style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171' }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-2)' }}>Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-2)' }}>Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-1"
              style={{ padding: '.75rem 1.25rem', fontSize: '1rem', borderRadius: '.875rem' }}
            >
              {isLoading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" style={{ animation: 'spin .7s linear infinite', display:'inline-block' }} />
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-2)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium transition-colors" style={{ color: '#818cf8' }}
            onMouseEnter={e => (e.currentTarget.style.color='#a5b4fc')}
            onMouseLeave={e => (e.currentTarget.style.color='#818cf8')}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
