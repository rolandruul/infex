import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProfiles, getSavedProfiles, deleteProfile, deleteSavedProfile, addProfile, uploadProfilePhoto } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

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

export default function Partners() {
  const [legacyProfiles, setLegacyProfiles] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', condition: '', notes: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

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

  function handleOpenModal() {
    setForm({ name: '', city: '', condition: '', notes: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
    setModalOpen(true);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    setPhotoFile(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let photoUrl = null;
      if (photoFile) {
        photoUrl = await uploadProfilePhoto(photoFile);
      }
      await addProfile({
        name: form.name,
        city: form.city,
        condition: form.condition || undefined,
        notes: form.notes,
        photoUrl,
      });
      handleCloseModal();
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  function formatDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function getPurityRating(conditions) {
    const count = conditions?.length ?? 0;
    if (count === 0) return 'Pure';
    if (count === 1) return 'Suspicious';
    return 'Biohazard';
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
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              {profile.photo && profile.photo.startsWith('http') ? (
                <img src={profile.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm text-gray-400">Photo</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="flex flex-wrap items-center gap-1.5 font-semibold text-gray-900">
                {profile.name}
                {getPurityRating(profile.conditions) === 'Biohazard' && (
                  <span className="rounded bg-yellow-400 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black shadow-sm" title="Biohazard">
                    Biohazard
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600">{profile.city}</p>
              {profile.lastConditionAt && formatDate(profile.lastConditionAt) && (
                <p className="mt-0.5 text-xs text-gray-500">Last condition: {formatDate(profile.lastConditionAt)}</p>
              )}
              <p className="mt-0.5 text-xs font-medium text-gray-600">
                Purity rating: {getPurityRating(profile.conditions)}
              </p>
            </div>
          </div>
          {profile.conditions && profile.conditions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.conditions.map((c) => (
                <span key={c} className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {c}
                </span>
              ))}
            </div>
          )}
        </Link>
        {profile.instagram && (
          <a
            href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
          >
            <InstagramIcon className="h-4 w-4 shrink-0 text-pink-600" />
            <span>@{profile.instagram.replace(/^@/, '')}</span>
          </a>
        )}
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
    <div className="flex h-screen flex-col bg-white sm:min-h-screen sm:h-auto">
      <Navbar variant="dashboard" />
      <main className="flex-1 min-h-0 overflow-auto mx-auto w-full max-w-5xl px-6 py-10 pb-24 sm:pb-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <Button variant="primary" onClick={handleOpenModal}>
            + Add New
          </Button>
        </div>

        <Modal open={modalOpen} onClose={handleCloseModal} title="Add New Profile">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-500 transition hover:bg-gray-100">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>Upload</span>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
                <div className="text-sm text-gray-500">
                  {photoFile ? photoFile.name : 'Choose an image'}
                </div>
              </div>
            </div>
            <Input
              label="Name"
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="City"
              id="city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
            <Input
              label="Condition"
              id="condition"
              value={form.condition}
              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
              placeholder="e.g. Flu, COVID-19"
            />
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : !hasAny ? (
          <p className="text-gray-500">No partners yet. Add one using the button above.</p>
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
