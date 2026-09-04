import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Registration failed. Email may already be in use.'
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,.10) 0%, transparent 70%)' }} />

      <div className="w-full max-w-[380px] animate-slide-up">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,.4)' }}
          >
            <Video size={24} color="#fff" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Create account</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Start conferencing for free</p>
          </div>
        </div>

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
            {[
              { id: 'reg-name',     label: 'Full Name', type: 'text',     ph: 'Abhishek',          val: name,     set: setName,     ac: 'name' },
              { id: 'reg-email',    label: 'Email',     type: 'email',    ph: 'you@example.com',   val: email,    set: setEmail,    ac: 'email' },
              { id: 'reg-password', label: 'Password',  type: 'password', ph: 'Min. 8 characters', val: password, set: setPassword, ac: 'new-password' },
            ].map(f => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label htmlFor={f.id} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-2)' }}>{f.label}</label>
                <input
                  id={f.id}
                  type={f.type}
                  placeholder={f.ph}
                  className="field"
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  required
                  autoComplete={f.ac}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-1"
              style={{ padding: '.75rem 1.25rem', fontSize: '1rem', borderRadius: '.875rem' }}
            >
              {isLoading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" style={{ animation: 'spin .7s linear infinite', display:'inline-block' }} />
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: '#818cf8' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
