import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from './App.module.css';
import { useSelector } from 'react-redux';
import Loader from './Components/Loader/Loader';
import { Toaster } from 'sonner';
import MobileNavbar from './Components/MobileNavbar/MobileNavbar';
import { useMediaQuery } from 'react-responsive';

// Lazy-loaded components
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const LogIn = lazy(() => import('./pages/LogIn/LogIn'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Links = lazy(() => import('./pages/Links/Links'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const App = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen)
  return (
    <>
    <Link to={user === null ? '/login' : `${user.id}/dashboard`} className={styles.logo}>
        <img className={styles.logoImg} src="/images/LogoImg.png" alt="Logo" />
      </Link>
      {isMobile && isAuthenticated && <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} />}
      <Suspense fallback={<div className={styles.loader}><Loader /></div>}>
      
      <Routes>
      {!isOpen &&
      <>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to={`/${user.id}/dashboard`} /> : <SignUp />} />
        <Route path='/login' element={isAuthenticated ? <Navigate to={`/${user.id}/dashboard`} /> : <LogIn />} />
        <Route path='/:id/dashboard' element={<Dashboard />} />
        <Route path='/:id/links' element={<Links />} />
        <Route path='/:id/settings' element={<Settings />} />
        <Route path='/:id/analytics' element={<Analytics />} />
        </>
      }
      </Routes>
      </Suspense>
      <Toaster position="bottom-left"/>
      </>
  )
}

export default App
