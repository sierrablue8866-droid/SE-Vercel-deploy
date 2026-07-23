'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseClientConfigured } from '@/lib/firebase';

/**
 * Auth guard only — no chrome. The portal (AdminPortal.tsx) brings its own
 * sidebar/topbar. Staff-gating matches the previous admin layout and the
 * Firestore rules: users/{uid}.role must be 'admin' or 'manager'.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      // 1. Check server-side session cookie via /api/auth
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.signedIn && (data.role === 'admin' || data.role === 'manager')) {
            if (isMounted) {
              setIsAuth(true);
              setIsLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('[AdminLayout] Session check warning:', err);
      }

      // 2. If client Firebase is configured, check Firebase client auth state
      if (isFirebaseClientConfigured) {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            if (isMounted) {
              setIsAuth(false);
              setIsLoading(false);
              router.replace('/admin/login');
            }
            return;
          }

          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const role = userDoc.data()?.role;

            if (role === 'admin' || role === 'manager') {
              if (isMounted) setIsAuth(true);
            } else {
              if (isMounted) router.replace('/admin/login');
            }
          } catch (error) {
            console.error('Error checking admin role:', error);
            if (isMounted) router.replace('/admin/login');
          } finally {
            if (isMounted) setIsLoading(false);
          }
        });

        return () => unsubscribe();
      } else {
        // No valid session and Firebase not configured -> redirect to login
        if (isMounted) {
          setIsAuth(false);
          setIsLoading(false);
          router.replace('/admin/login');
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07111E',
          color: 'rgba(240,237,229,.58)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: '.2em',
        }}
      >
        AUTHENTICATING…
      </div>
    );
  }

  if (!isAuth) return null;

  return <>{children}</>;
}
