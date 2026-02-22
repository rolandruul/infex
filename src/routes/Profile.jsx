import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState('');
  const [instagram, setInstagram] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedSocials, setSavedSocials] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getProfile(id)
      .then((p) => {
        setProfile(p);
        if (p) {
          setNotes(p.notes || '');
          setInstagram(p.instagram || '');
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSaveNotes() {
    if (!id) return;
    try {
      await updateProfile(id, { notes });
      setSaved(true);
      const p = await getProfile(id);
      if (p) setProfile(p);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveSocials() {
    if (!id) return;
    const value = (instagram || '').trim().replace(/^@/, '');
    try {
      await updateProfile(id, { instagram: value });
      setInstagram(value);
      setSavedSocials(true);
      const p = await getProfile(id);
      if (p) setProfile(p);
      setTimeout(() => setSavedSocials(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddCondition(e) {
    e.preventDefault();
    const input = e.currentTarget.elements.condition;
    const value = input?.value?.trim();
    if (!value || !profile) return;
    const nextConditions = [...(profile.conditions || []), value];
    try {
      await updateProfile(id, { conditions: nextConditions });
      const p = await getProfile(id);
      if (p) setProfile(p);
      input.value = '';
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="dashboard" />
        <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
          <p className="text-gray-500">Loading…</p>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="dashboard" />
        <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
          <p className="text-gray-600">Profile not found.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dashboard" />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-sm">
            {profile.photo ? 'IMG' : 'Photo'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.city}</p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Reported Conditions</h2>
          <div className="flex flex-wrap gap-2">
            {(profile.conditions || []).length === 0 ? (
              <p className="text-gray-500">None reported.</p>
            ) : (
              (profile.conditions || []).map((c) => (
                <span
                  key={c}
                  className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {c}
                </span>
              ))
            )}
          </div>
          <form onSubmit={handleAddCondition} className="mt-4 flex gap-2">
            <input
              name="condition"
              type="text"
              placeholder="Add condition"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit">Add</Button>
          </form>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Socials</h2>
          <p className="mb-4 text-sm text-gray-600">
            Add an Instagram username to link to this profile. You can use @ or leave it out.
          </p>
          {profile.instagram ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <a
                href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <InstagramIcon className="h-5 w-5 shrink-0 text-pink-600" />
                <span className="font-medium">@{profile.instagram.replace(/^@/, '')}</span>
              </a>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="profile-instagram" className="sr-only">Instagram username</label>
            <input
              id="profile-instagram"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="e.g. johndoe or @johndoe"
              className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button onClick={handleSaveSocials}>
              {savedSocials ? 'Saved' : 'Save Instagram'}
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button onClick={handleSaveNotes} className="mt-3">
            {saved ? 'Saved' : 'Save'}
          </Button>
        </section>
      </main>
    </div>
  );
}
