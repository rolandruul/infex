import { useNavigate } from 'react-router-dom';
import { markNotificationRead } from '../lib/store';

export default function NotificationCard({ notification, onRead }) {
  const navigate = useNavigate();
  const { id, profileId, profileName, message, read } = notification;

  async function handleClick() {
    if (!read) {
      try {
        await markNotificationRead(id);
        onRead?.();
      } catch (err) {
        console.error(err);
      }
    }
    navigate(`/profile/${profileId}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
          {!read && <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{profileName}</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </button>
  );
}
