import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { getAuthUser, setToken } from './utils/auth';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import UserDashboardPage from './pages/UserDashboardPage.jsx';
import MyTicketsPage from './pages/MyTicketsPage.jsx';
import CreateTicketPage from './pages/CreateTicketPage.jsx';
import UserTicketDetailsPage from './pages/UserTicketDetailsPage.jsx';
import UserNotificationsPage from './pages/UserNotificationsPage.jsx';

import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminAllTicketsPage from './pages/AdminAllTicketsPage.jsx';
import AdminTicketManagementPage from './pages/AdminTicketManagementPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

function Layout({ children }) {
  const nav = useNavigate();
  const [tick, setTick] = useState(0);
  const user = useMemo(() => {
    // simple way to update when token changes
    void tick;
    return getAuthUser();
  }, [tick]);

  useEffect(() => {
    const onStorage = () => setTick((x) => x + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">Customer Support</div>
        <nav className="nav">
          {!user ? (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                Register
              </NavLink>
            </>
          ) : user.role === 'ADMIN' ? (
            <>
              <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Admin
              </NavLink>
              <NavLink to="/admin/tickets" className={({ isActive }) => (isActive ? 'active' : '')}>
                Tickets
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
                Reports
              </NavLink>
              <button
                className="btn"
                onClick={() => {
                  setToken('');
                  setTick((x) => x + 1);
                  nav('/login', { replace: true });
                }}
              >
                Logout ({user.username})
              </button>
            </>
          ) : (
            <>
              <NavLink to="/user" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard
              </NavLink>
              <NavLink to="/user/tickets" className={({ isActive }) => (isActive ? 'active' : '')}>
                My Tickets
              </NavLink>
              <NavLink to="/user/notifications" className={({ isActive }) => (isActive ? 'active' : '')}>
                Notifications
              </NavLink>
              <button
                className="btn"
                onClick={() => {
                  setToken('');
                  setTick((x) => x + 1);
                  nav('/login', { replace: true });
                }}
              >
                Logout ({user.username})
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="footer">Local dev UI • React (Vite) + Axios</footer>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowRoles={['USER']}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets"
          element={
            <ProtectedRoute allowRoles={['USER']}>
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets/new"
          element={
            <ProtectedRoute allowRoles={['USER']}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets/:id"
          element={
            <ProtectedRoute allowRoles={['USER']}>
              <UserTicketDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <ProtectedRoute allowRoles={['USER', 'ADMIN']}>
              <UserNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowRoles={['ADMIN']}>
              <AdminAllTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets/:id/manage"
          element={
            <ProtectedRoute allowRoles={['ADMIN']}>
              <AdminTicketManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowRoles={['ADMIN']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}

