import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/** Redirect to /login if not authenticated */
export function useRequireAuth() {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken && !user) {
      navigate('/login', { replace: true });
    }
  }, [accessToken, user, navigate]);

  return { user, isAuthenticated: !!accessToken };
}

/** Redirect to /dashboard if already authenticated */
export function useRedirectIfAuth() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, navigate]);
}
