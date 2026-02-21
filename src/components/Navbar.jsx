import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import Button from './Button';

function DashboardIcon({ active }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function PartnersIcon({ active }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export default function Navbar({ variant = 'landing' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, signOut } = useAuth();

  if (variant === 'landing') {
    return (
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-semibold uppercase tracking-[0.35em] text-gray-900"
          >
            INFEX
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm text-gray-700 sm:flex">
              <a href="#how-it-works" className="hover:text-gray-900">
                How it works
              </a>
              <a href="#example-use-case" className="hover:text-gray-900">
                Example use case
              </a>
              <a href="#what-users-say" className="hover:text-gray-900">
                What users say
              </a>
            </nav>
            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="secondary">Login</Button>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 shadow-sm sm:hidden">
            <nav className="flex flex-col gap-3">
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                How it works
              </a>
              <a
                href="#example-use-case"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Example use case
              </a>
              <a
                href="#what-users-say"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                What users say
              </a>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="pt-2">
                <Button variant="secondary" className="w-full justify-center">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    );
  }

  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isPartners = location.pathname === '/partners';

  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="text-xl font-semibold uppercase tracking-[0.35em] text-gray-900"
          >
            INF
            <span className="text-primary">EX</span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/partners" className="text-gray-600 hover:text-gray-900">
              Partners
            </Link>
          <Link
            to="/"
            onClick={() => signOut()}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Log out"
          >
              <LogoutIcon />
            </Link>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 shadow-sm sm:hidden">
            <nav className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/partners"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Partners
              </Link>
              <Link
                to="/"
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <LogoutIcon />
                <span>Log out</span>
              </Link>
            </nav>
          </div>
        )}
      </nav>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:hidden">
        <div className="flex">
          <Link
            to="/dashboard"
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition ${
              isDashboard ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <DashboardIcon active={isDashboard} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/partners"
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition ${
              isPartners ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <PartnersIcon active={isPartners} />
            <span>Partners</span>
          </Link>
        </div>
      </div>
    </>
  );
}
