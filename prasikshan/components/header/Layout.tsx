'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import LoginHeader from './LoginHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted flag
    setIsMounted(true);

    // Check if user is signed in (from localStorage)
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsSignedIn(!!token);
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Also listen for storage changes (cross-tab communication)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <>
        <Header />
        <main className="pt-[90px] md:pt-[110px]">{children}</main>
      </>
    );
  }

  return (
    <>
      {isSignedIn ? <LoginHeader /> : <Header />}
      <main className="bg-[#0A2A55] pt-[84px] md:pt-[96px] min-h-screen">
        {children}
      </main>
    </>
  );
}
