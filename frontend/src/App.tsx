import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LandingPage } from '@/features/landing/LandingPage';
import { NotFoundPage } from '@/features/landing/NotFoundPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LobbyPage } from '@/features/lobby/LobbyPage';
import { MeetingPage } from '@/features/meeting/MeetingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — with Navbar */}
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <DashboardPage />
            </PageWrapper>
          }
        />
        <Route
          path="/lobby/:meetingId"
          element={
            <PageWrapper>
              <LobbyPage />
            </PageWrapper>
          }
        />

        {/* Meeting — protected, full-screen, own topbar */}
        <Route
          path="/meeting/:meetingId"
          element={
            <PageWrapper requireAuth showNav={false}>
              <MeetingPage />
            </PageWrapper>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
