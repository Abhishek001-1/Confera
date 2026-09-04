import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from './Navbar';

interface PageWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showNav?: boolean;
}

export function PageWrapper({ children, requireAuth = true, showNav = true }: PageWrapperProps) {
  const { accessToken } = useAuthStore();

  if (requireAuth && !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#080a0f' }}>
      {requireAuth && showNav && <Navbar />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
