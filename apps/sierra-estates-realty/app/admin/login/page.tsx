'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, isFirebaseClientConfigured } from '@/lib/firebase';
import '../admin-portal.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let idToken: string | undefined = undefined;
      if (isFirebaseClientConfigured) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCred.user.getIdToken();
      }

      // Mint HTTP-only session cookie via /api/auth
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password, token: idToken }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        router.replace('/admin');
      } else {
        setError(data.error || 'Invalid credentials. Staff access only.');
      }
    } catch (_err) {
      setError('Invalid credentials. Staff access only.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    if (!isFirebaseClientConfigured) {
      setError('Firebase is not configured in this environment.');
      return;
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const idToken = await userCred.user.getIdToken();

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'signin',
          email: userCred.user.email,
          token: idToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        router.replace('/admin');
      } else {
        setError(data.error || 'Google sign-in failed or access denied.');
      }
    } catch (_err: any) {
      setError(_err?.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(900px 600px at 85% 0%, rgba(0,174,255,.10), transparent 60%), #07111E',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'rgba(255,255,255,.055)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            className="gold-text"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '.22em',
            }}
          >
            SIERRA ESTATES 3.0
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: '.18em',
              color: 'rgba(240,237,229,.32)',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            Intelligence OS · Staff Portal
          </div>
        </div>

        <label
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'rgba(240,237,229,.58)',
            marginBottom: 6,
          }}
        >
          Email
        </label>
        <input
          className="f-in"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@sierra-estates.net"
          required
          style={{ marginBottom: 16, color: '#F0EDE5' }}
        />

        <label
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'rgba(240,237,229,.58)',
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          className="f-in"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          style={{ marginBottom: 20, color: '#F0EDE5' }}
        />

        {error && (
          <div
            style={{
              color: '#E63946',
              fontSize: 12,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px 0',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #00AEFF, #5FC9FF)',
            color: '#071422',
            fontWeight: 700,
            fontSize: 13,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 14px', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
          <span style={{ fontSize: 10, color: 'rgba(240,237,229,.38)', textTransform: 'uppercase', letterSpacing: '.12em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,.15)',
            background: 'rgba(255,255,255,.06)',
            color: '#F0EDE5',
            fontWeight: 600,
            fontSize: 12,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
          </svg>
          Sign in with Google
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: 'rgba(240,237,229,.32)',
            marginTop: 16,
          }}
        >
          Staff only. Unauthorized access prohibited.
        </p>
      </form>
    </div>
  );
}
