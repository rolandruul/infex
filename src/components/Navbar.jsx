import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  function handleLogoClick(e) {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', location.pathname + location.search);
    }
  }

  if (variant === 'landing') {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-semibold uppercase tracking-[0.35em] text-gray-900"
            onClick={handleLogoClick}
          >
            INFEX
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm text-gray-700 sm:flex">
              <Link to="/#how-it-works" className="hover:text-gray-900">
                How it works
              </Link>
              <Link to="/#example-use-case" className="hover:text-gray-900">
                Example use case
              </Link>
              <Link to="/#what-users-say" className="hover:text-gray-900">
                What users say
              </Link>
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
              <Link
                to="/#how-it-works"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                How it works
              </Link>
              <Link
                to="/#example-use-case"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Example use case
              </Link>
              <Link
                to="/#what-users-say"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                What users say
              </Link>
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
            INFEX
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/partners" className="text-gray-600 hover:text-gray-900">
              Partners
            </Link>
            <div className="relative border-l border-gray-200 pl-4" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 min-w-0 max-w-[200px]"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <span className="truncate">{session?.user?.email ?? 'Account'}</span>
                <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                      navigate('/', { replace: true });
                    }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Log out</span>
                    <LogoutIcon />
                  </button>
                </div>
              )}
            </div>
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
