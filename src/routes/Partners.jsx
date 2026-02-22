import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfiles, getSavedProfiles, deleteProfile, deleteSavedProfile } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function Partners() {
  const [legacyProfiles, setLegacyProfiles] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([getProfiles(), getSavedProfiles()])
      .then(([legacy, saved]) => {
        setLegacyProfiles(legacy);
        setSavedProfiles(saved || []);
      })
      .catch(() => {
        setLegacyProfiles([]);
        setSavedProfiles([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeleteLegacy(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(`legacy-${id}`);
    try {
      await deleteProfile(id);
      setLegacyProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteSaved(e, linkId) {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(`saved-${linkId}`);
    try {
      await deleteSavedProfile(linkId);
      setSavedProfiles((prev) => prev.filter((p) => p.id !== linkId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const renderCard = (profile, isSaved) => {
    const profileUrl = isSaved ? `/profile/global/${profile.globalId}` : `/profile/${profile.id}`;
    const deleteKey = isSaved ? `saved-${profile.id}` : `legacy-${profile.id}`;
    const onDelete = isSaved ? (e) => handleDeleteSaved(e, profile.id) : (e) => handleDeleteLegacy(e, profile.id);
    return (
      <div
        key={isSaved ? `s-${profile.id}` : `l-${profile.id}`}
        className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <Link
          to={profileUrl}
          className="block flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg -m-1 p-1"
        >
          <div className="mb-4 flex h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
            {profile.photo && profile.photo.startsWith('http') ? (
              <img src={profile.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-gray-400">Photo</span>
            )}
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
          onClick={onDelete}
          disabled={deletingId === deleteKey}
        >
          {deletingId === deleteKey ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    );
  };

  const hasAny = legacyProfiles.length > 0 || savedProfiles.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dashboard" />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Partners</h1>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : !hasAny ? (
          <p className="text-gray-500">No partners yet. Add one from the Dashboard.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProfiles.map((p) => renderCard(p, true))}
            {legacyProfiles.map((p) => renderCard(p, false))}
          </div>
        )}
      </main>
    </div>
  );
}
