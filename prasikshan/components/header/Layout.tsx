'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import LoginHeader from './LoginHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is signed in (from localStorage)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsSignedIn(!!token);

    // Listen for auth changes
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('token');
      setIsSignedIn(!!newToken);
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <>
      {isSignedIn ? <LoginHeader /> : <Header />}
      <div style={{ marginTop: '60px' }}>{children}</div>
    </>
  );
}
