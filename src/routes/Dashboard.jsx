import { useState, useCallback, useEffect } from 'react';
import { getNotifications, addProfile } from '../lib/store';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import NotificationCard from '../components/NotificationCard';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    city: '',
    condition: '',
    notes: '',
  });

  const refresh = useCallback(async () => {
    try {
      const list = await getNotifications();
      setNotifications(list);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleOpenModal() {
    setForm({ name: '', city: '', condition: '', notes: '' });
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addProfile({
        name: form.name,
        city: form.city,
        condition: form.condition || undefined,
        notes: form.notes,
      });
      handleCloseModal();
      await refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dashboard" />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:pb-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button variant="primary" onClick={handleOpenModal}>
            + Add New
          </Button>
        </div>

        <Modal open={modalOpen} onClose={handleCloseModal} title="Add New Profile">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-500">
                Upload
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

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Alerts</h2>
          {loading ? (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500 shadow-sm">
              Loading…
            </p>
          ) : notifications.filter((n) => !n.read).length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500 shadow-sm">
              No alerts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications
                .filter((n) => !n.read)
                .map((n) => (
                  <NotificationCard key={n.id} notification={n} onRead={refresh} />
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
