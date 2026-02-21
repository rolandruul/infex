import { useNavigate } from 'react-router-dom';
import { markNotificationRead } from '../lib/store';
import Button from './Button';

export default function NotificationCard({ notification, onRead }) {
  const navigate = useNavigate();
  const { id, profileId, profileName, message, read } = notification;

  async function handleSeen(e) {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      onRead?.();
    } catch (err) {
      console.error(err);
    }
  }

  function handleCardClick() {
    navigate(`/profile/${profileId}`);
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={handleCardClick}
        className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg -m-1 p-1"
      >
        <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
          {!read && <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{profileName}</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </button>
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 !py-1.5 !text-xs"
        onClick={handleSeen}
      >
        Seen
      </Button>
    </div>
  );
}
