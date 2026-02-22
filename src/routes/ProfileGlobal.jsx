import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGlobalIdentity, getSavedProfileLinkId, deleteSavedProfile, addGlobalIdentityCondition, updateGlobalIdentity } from '../lib/store';
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

export default function ProfileGlobal() {
  const { id: globalId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [linkId, setLinkId] = useState(null);
  const [instagram, setInstagram] = useState('');
  const [savedSocials, setSavedSocials] = useState(false);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!globalId) {
      setLoading(false);
      return;
    }
    Promise.all([getGlobalIdentity(globalId), getSavedProfileLinkId(globalId)])
      .then(([p, lid]) => {
        setProfile(p);
        setLinkId(lid);
        if (p) setInstagram(p.instagram || '');
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [globalId]);

  async function handleAddCondition(e) {
    e.preventDefault();
    const input = e.currentTarget.elements.condition;
    const value = input?.value?.trim();
    if (!value || !globalId || !profile) return;
    try {
      await addGlobalIdentityCondition(globalId, value);
      const updated = await getGlobalIdentity(globalId);
      if (updated) setProfile(updated);
      if (input) input.value = '';
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveSocials() {
    if (!globalId) return;
    const value = (instagram || '').trim().replace(/^@/, '');
    try {
      await updateGlobalIdentity(globalId, { instagram: value });
      setInstagram(value);
      setSavedSocials(true);
      const updated = await getGlobalIdentity(globalId);
      if (updated) setProfile(updated);
      setTimeout(() => setSavedSocials(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveFromList() {
    if (!linkId) return;
    setRemoving(true);
    try {
      await deleteSavedProfile(linkId);
      navigate('/partners');
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(false);
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
          <button type="button" onClick={() => navigate('/partners')} className="mt-4 text-primary hover:underline">
            Back to Partners
          </button>
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
          <div className="flex h-24 w-24 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
            {profile.photo && profile.photo.startsWith('http') ? (
              <img src={profile.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-gray-400">Photo</span>
            )}
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
              placeholder="Add condition (e.g. Flu, COVID-19)"
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
            <label htmlFor="profile-global-instagram" className="sr-only">Instagram username</label>
            <input
              id="profile-global-instagram"
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

        {profile.notes && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Notes (from profile)</h2>
            <p className="rounded-xl border border-gray-200 bg-white p-4 text-gray-600">{profile.notes}</p>
          </section>
        )}

        {linkId && (
          <section className="mt-10">
            <Button
              type="button"
              variant="secondary"
              className="!text-red-600 hover:!bg-red-50"
              onClick={handleRemoveFromList}
              disabled={removing}
            >
              {removing ? 'Removing…' : 'Remove from my list'}
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
