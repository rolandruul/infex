import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getProfile(id)
      .then((p) => {
        setProfile(p);
        if (p) setNotes(p.notes || '');
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
