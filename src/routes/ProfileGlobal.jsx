import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGlobalIdentity, getSavedProfileLinkId, deleteSavedProfile, addGlobalIdentityCondition } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function ProfileGlobal() {
  const { id: globalId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [linkId, setLinkId] = useState(null);
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
