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
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
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
                    INFEX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section
        id="how-it-works"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-2xl font-bold text-center text-gray-900">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                  <path d="M18 10.5a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25V17a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1 0-1.5h2.25v-2.25a.75.75 0 0 1 .75-.75Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Add a contact</h3>
              <p className="text-gray-600">Add people in your network to your InfeX list.</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Log reported conditions</h3>
              <p className="text-gray-600">Record when someone reports a condition.</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.477a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243V3.75a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-.5.707 10.72 10.72 0 0 1-2.25.54 10.72 10.72 0 0 1-2.25-.54.75.75 0 0 1-.5-.707V3.75a.75.75 0 0 1 1.5 0v9.5a9.22 9.22 0 0 0 4.331-1.043 8.25 8.25 0 0 0-1.581-1.302A5.25 5.25 0 0 0 6.75 9.75v.75ZM3 15a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V15.75a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V15.75A.75.75 0 0 1 3 15Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Get notified about new reports</h3>
              <p className="text-gray-600">Receive alerts when new conditions are added.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example use case */}
      <section id="example-use-case" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Example use case</h2>
          <p className="mb-12 text-center text-gray-600">
            See how InfeX keeps your network informed when new risk signals appear.
          </p>
          <div className="md:grid md:grid-cols-2 md:gap-10 md:items-start">
            {/* Left: Timeline */}
            <div className="space-y-0">
              {[
                { step: 1, title: 'Match', text: 'You connect with a new match and save the profile in InfeX.' },
                { step: 2, title: 'Confirm', text: 'A condition is confirmed after the connection.' },
                { step: 3, title: 'Report', text: 'You add a condition to the saved profile. InfeX links it to matching entries.' },
                { step: 4, title: 'Notify', text: 'Other users with the same saved profile receive an alert and can review details.' },
              ].map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-medium text-primary">
                      {item.step}
                    </div>
                    {index < 3 && (
                      <div className="min-h-16 w-px bg-gray-200" aria-hidden />
                    )}
                  </div>
                  <div className={index < 3 ? 'pb-4' : ''}>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Product preview mock */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Recent Alerts</span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">New</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-2 rounded-lg py-2.5 pr-2 transition hover:bg-gray-50">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">New report linked: Alex (Tallinn)</p>
                    <p className="text-xs text-gray-500">Condition added</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg py-2.5 pr-2 transition hover:bg-gray-50">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Condition added: HSV signal</p>
                    <p className="text-xs text-gray-500">Review recommended</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg py-2.5 pr-2 transition hover:bg-gray-50">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" aria-hidden />
                  <p className="text-sm text-primary transition hover:text-primary/80">Review profile →</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Notifications are triggered when multiple users save the same profile and new conditions are reported.
          </p>
        </div>
      </section>

      <section
        id="what-users-say"
        className="py-24 pb-32"
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-2xl font-bold text-gray-900 text-center">What users say</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex gap-0.5 text-amber-400" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "Simple and clear. I finally have a place to track who in my circle has reported something."
              </p>
              <p className="mt-4 font-medium text-gray-900">Maya K.</p>
              <p className="text-sm text-gray-500">Healthcare worker</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex gap-0.5 text-amber-400" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "No clutter, no drama. Just the information I need to make better decisions."
              </p>
              <p className="mt-4 font-medium text-gray-900">James T.</p>
              <p className="text-sm text-gray-500">Parent</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="mb-3 flex gap-0.5 text-amber-400" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "Fits into my routine. Add contacts, log when something comes up, get notified. Done."
              </p>
              <p className="mt-4 font-medium text-gray-900">Sarah L.</p>
              <p className="text-sm text-gray-500">Small business owner</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="text-lg font-semibold uppercase tracking-[0.35em]">
                INF
                <span className="text-white">EX</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60 max-w-xs">
                Exposure tracking and signal logging for modern networks.
              </p>
              <a
                href="mailto:support@infex.app"
                className="inline-block text-sm text-white/70 transition hover:text-white"
              >
                support@infex.app
              </a>
            </div>

            {/* Column 2: Product */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Product
              </h3>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-white/70 transition hover:text-white">Dashboard</Link></li>
                <li><Link to="/partners" className="text-white/70 transition hover:text-white">Partners</Link></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Reports</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Notifications</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Security</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Company
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 transition hover:text-white">About</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Contact</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Careers</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Press</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Blog</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Legal
              </h3>
              <ul className="space-y-3">
                <li><a href="#privacy" className="text-white/70 transition hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="text-white/70 transition hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Data Protection</a></li>
                <li><a href="#" className="text-white/70 transition hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/60 sm:flex-row">
            <span>© 2026 InfeX</span>
            <span>Tallinn, Estonia</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
