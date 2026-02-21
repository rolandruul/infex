import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfiles } from '../lib/store';
import Navbar from '../components/Navbar';

export default function Partners() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfiles()
      .then(setProfiles)
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dashboard" />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Partners</h1>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                to={`/profile/${profile.id}`}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-sm">
                  {profile.photo ? 'IMG' : 'Photo'}
                </div>
                <h2 className="font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-600">{profile.city}</p>
                {profile.conditions && profile.conditions.length > 0 && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Has conditions
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
