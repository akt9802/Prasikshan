'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import LoginHeader from './LoginHeader';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/aboutssb',
  '/signin',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/alltest',
  '/fivequestion/displayfivequestion',
  '/tenquestion/displaytenquestion',
  '/userdetails',
  '/ranking',
  '/admin',
];

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname);
};

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Route protection logic
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Check if current route is protected and user is not logged in
    if (isProtectedRoute(pathname) && !isLoggedIn) {
      router.push('/signin');
    } else {
      setIsChecking(false);
      setIsMounted(true);
    }
  }, [pathname, router]);

  // For public routes, set mounted immediately
  useEffect(() => {
    if (isPublicRoute(pathname)) {
      setIsChecking(false);
      setIsMounted(true);
    }
  }, [pathname]);

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    // For protected routes during auth check, show nothing (prevents flash)
    if (isProtectedRoute(pathname)) {
      return null;
    }
    // For public routes, render normally
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
