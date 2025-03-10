import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, Link, Outlet, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';

import styles from './App.module.css';
import Loader from './Components/Loader/Loader';
import Layout from './Components/Layout/Layout';
import Logo from './Components/Logo/Logo';
import { useMediaQuery } from 'react-responsive';
import WebSocketListener from './WebSocket/WebSocketListener';
import LinkExpired from './pages/LinkExpired/LinkExpired';

// Lazy-loaded components
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const LogIn = lazy(() => import('./pages/LogIn/LogIn'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Links = lazy(() => import('./pages/Links/Links'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  return isAuthenticated ? <Navigate to={`/${user.id}/dashboard`} /> : children;
};

const ProtectedLayout = () => {
  const [search, setSearch] = useState(null);
  return (
    <>
      <Layout search={search} setSearch={setSearch}>
        <Outlet context={{ search }} />
      </Layout>
    </>
  );
};

const AppRoutes = ({ isOpen, formOn }) => {
  const { user } = useSelector(state => state.auth);

  if (isOpen || formOn) return null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Routes */}
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <LogIn />
        </PublicRoute>
      } />
      <Route path="/link-expired" element={
        <PublicRoute>
          <LinkExpired />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/:id" element={
        <PrivateRoute>
          <ProtectedLayout />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="links" element={<Links />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  
  const { isAuthenticated } = useSelector(state => state.auth);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      { !(isAuthenticated && isMobile) && <Logo /> }
      <Suspense fallback={<div className={styles.loader}><Loader /></div>}>
        <AppRoutes />
      </Suspense>
      <Toaster position="bottom-left" />
      <WebSocketListener />
    </>
  );
};

export default App;