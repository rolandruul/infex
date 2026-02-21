import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function Landing() {
  const { session, loading } = useAuth();

  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10">
        <svg
          className="h-64 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#FEE2E2"
            d="M0,192L80,181.3C160,171,320,149,480,149.3C640,149,800,171,960,176C1120,181,1280,171,1360,165.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      <Navbar variant="landing" />

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-0 space-y-24">
        <section className="flex min-h-screen flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Know the risk before you connect.
            </h1>
            <p className="max-w-xl text-lg text-gray-600">
              InfeX helps you track exposure signals across your personal network.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 justify-center lg:w-80">
            <div className="relative mx-auto w-[280px] rounded-[2.5rem] border-[10px] border-gray-800 bg-gray-800 shadow-xl">
              <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-gray-800" />
              <div className="aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-white">
                <div className="flex h-full items-center justify-center bg-white">
                  <div className="text-xl font-semibold uppercase tracking-[0.35em] text-gray-900">
                    INF
                    <span className="text-primary">EX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section
        id="how-it-works"
        className="flex min-h-screen flex-col justify-center bg-primary text-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-10 text-2xl font-bold text-center">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                  <path d="M18 10.5a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25V17a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1 0-1.5h2.25v-2.25a.75.75 0 0 1 .75-.75Z" />
                </svg>
              </div>
              <h3 className="font-semibold">Add a contact</h3>
              <p className="text-white/80">Add people in your network to your InfeX list.</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold">Log reported conditions</h3>
              <p className="text-white/80">Record when someone reports a condition.</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.477a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243V3.75a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-.5.707 10.72 10.72 0 0 1-2.25.54 10.72 10.72 0 0 1-2.25-.54.75.75 0 0 1-.5-.707V3.75a.75.75 0 0 1 1.5 0v9.5a9.22 9.22 0 0 0 4.331-1.043 8.25 8.25 0 0 0-1.581-1.302A5.25 5.25 0 0 0 6.75 9.75v.75ZM3 15a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V15.75a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V15.75A.75.75 0 0 1 3 15Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold">Get notified about new reports</h3>
              <p className="text-white/80">Receive alerts when new conditions are added.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="what-users-say"
        className="flex min-h-screen flex-col justify-center pt-16"
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-2xl font-bold text-gray-900 text-center">What users say</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                "Simple and clear. I finally have a place to track who in my circle has reported something."
              </p>
              <p className="mt-4 font-medium text-gray-900">Maya K.</p>
              <p className="text-sm text-gray-500">Healthcare worker</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                "No clutter, no drama. Just the information I need to make better decisions."
              </p>
              <p className="mt-4 font-medium text-gray-900">James T.</p>
              <p className="text-sm text-gray-500">Parent</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <p className="text-gray-600">
                "Fits into my routine. Add contacts, log when something comes up, get notified. Done."
              </p>
              <p className="mt-4 font-medium text-gray-900">Sarah L.</p>
              <p className="text-sm text-gray-500">Small business owner</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-8 text-white">
        <div className="mx-auto max-w-5xl px-6 flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold uppercase tracking-[0.35em]">
              INF
              <span className="text-white">EX</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 InfeX</span>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-white/80">Privacy</a>
              <a href="#terms" className="hover:text-white/80">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
