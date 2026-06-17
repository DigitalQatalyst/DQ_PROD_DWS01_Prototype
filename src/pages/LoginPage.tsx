import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductIdentity } from '../components/ProductIdentity';

const trustItems = [
  { icon: ShieldCheck, title: 'Role-based access', description: 'Scoped to your function and permissions.' },
  { icon: Fingerprint, title: 'Audited & traceable', description: 'Actions recorded in the workspace audit trail.' },
  { icon: Lock, title: 'Enterprise security', description: 'DQ-issued credentials and SSO required.' },
];

function MicrosoftIcon() {
  return (
    <svg aria-hidden className="h-5 w-5" viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export function LoginPage() {
  const { isAuthenticated, signInWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const authError = searchParams.get('error');
  const authErrorDescription = searchParams.get('error_description');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithMicrosoft();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="grid min-h-screen flex-1 lg:grid-cols-2">
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-12"
          style={{ background: 'var(--mesh-hero-dark)' }}
        >
          <div aria-hidden className="absolute inset-0 hero-grid opacity-30" />
          <div className="relative">
            <ProductIdentity variant="dark" />
          </div>
          <div className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dq-orange">
              Authenticated access · DWS.01
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.03em]">
              Your governed workspace for daily execution.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Sign in to access tasks, knowledge, services, and performance visibility — all in one place.
            </p>
          </div>
          <div className="relative space-y-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-dq-orange" />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-white/60">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-50 px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <ProductIdentity />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dq-orange">
              Staff access
            </p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-dq-navy">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Use your DigitalQatalyst Microsoft account to enter DWS.01.
            </p>

            {authError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Sign-in failed</p>
                    <p className="mt-1 leading-5">
                      {authErrorDescription || authError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-dq-navy shadow-sm transition hover:border-gray-300 hover:shadow-dq focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MicrosoftIcon />
              {isSigningIn ? 'Signing in…' : 'Sign in with Microsoft'}
            </button>

            <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Microsoft Entra ID SSO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
