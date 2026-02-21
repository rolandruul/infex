import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfiles, deleteProfile } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function Partners() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    getProfiles()
      .then(setProfiles)
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

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
              <div
                key={profile.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <Link
                  to={`/profile/${profile.id}`}
                  className="block flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg -m-1 p-1"
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
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-auto w-full !py-1.5 !text-xs text-red-600 hover:!bg-red-50"
                  onClick={(e) => handleDelete(e, profile.id)}
                  disabled={deletingId === profile.id}
                >
                  {deletingId === profile.id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
