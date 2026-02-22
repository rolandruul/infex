import { useNavigate } from 'react-router-dom';
import { markNotificationRead, deleteNotification } from '../lib/store';
import Button from './Button';

function formatDateTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function NotificationCard({ notification, onRead, variant = 'seen' }) {
  const navigate = useNavigate();
  const { id, profileId, profileGlobalId, profileName, message, read, createdAt, photo, isBiohazard } = notification;

  async function handleSeen(e) {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      onRead?.();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleHide(e) {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      onRead?.();
    } catch (err) {
      console.error(err);
    }
  }

  function handleCardClick() {
    if (profileGlobalId) navigate(`/profile/global/${profileGlobalId}`);
    else if (profileId) navigate(`/profile/${profileId}`);
    else navigate('/partners');
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={handleCardClick}
        className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg -m-1 p-1"
      >
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {photo && photo.startsWith('http') ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-gray-400" aria-hidden>?</span>
            )}
          </div>
          {!read && (
            <span className="inline-block rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" aria-hidden>
              NEW
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 font-medium text-gray-900">
            {profileName}
            {isBiohazard && (
              <span className="rounded bg-yellow-400 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black shadow-sm" title="Biohazard">
                Biohazard
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600">{message}</p>
          {formatDateTime(createdAt) && (
            <p className="mt-1 text-xs text-gray-500">{formatDateTime(createdAt)}</p>
          )}
        </div>
      </button>
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 !py-1.5 !text-xs"
        onClick={variant === 'hide' ? handleHide : handleSeen}
      >
        {variant === 'hide' ? 'Hide' : 'Seen'}
      </Button>
    </div>
  );
}
