import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from './Dialog';
import { ADDRESS_ICS, EVENTS, EVENT_BY_ID, type GalleryEvent } from '../data/content';
import { downloadIcs } from '../lib/download';

function icsFor(e: GalleryEvent) {
  downloadIcs(
    {
      uid: e.id,
      title: `${e.title} — PROEM`,
      description: `${e.format}. ${e.text} ${e.facts.join('. ')}.`,
      date: e.date,
      start: e.start,
      end: e.end,
    },
    ADDRESS_ICS,
  );
}

export function IcsButton({ event, className = 'btn btn--line' }: { event: GalleryEvent; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => icsFor(event)}>
      Add to calendar <span className="small">(.ics)</span>
    </button>
  );
}

export function EventDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const e = id ? EVENT_BY_ID[id] : null;
  return (
    <Dialog open={!!e} onClose={onClose} labelledBy="event-title" variant="drawer">
      {e && (
        <div className="drawer">
          <div className="drawer__bar">
            <span className="label">
              {e.id} / {e.format}
            </span>
            <button type="button" className="btn-text" onClick={onClose} data-autofocus>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className="drawer__date mono">
            {e.dateLabel} 2026 · {e.start}–{e.end}
          </p>
          <h2 id="event-title" className="drawer__title">
            {e.title}
          </h2>
          <p className="lead-s">{e.text}</p>
          <ul className="fact-list">
            {e.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="small">
            Times are local to the gallery; the calendar file has no time zone until the venue’s city is confirmed. There
            is no registration — the file only adds the event to your calendar.
          </p>
          <div className="drawer__actions">
            <button type="button" className="btn btn--red" onClick={() => icsFor(e)}>
              Download event (.ics)
            </button>
            <Link className="btn btn--line" to={e.link.to} onClick={onClose}>
              {e.link.label}
            </Link>
          </div>
        </div>
      )}
    </Dialog>
  );
}

/** Events E01–E03, by date. */
export function EventList({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <ol className={`events ${dark ? 'events--dark' : ''}`}>
        {EVENTS.map((e) => (
          <li key={e.id} className="event">
            <p className="event__date">
              <span className="event__day">{e.dateLabel}</span>
              <span className="mono">
                {e.start}–{e.end}
              </span>
            </p>
            <div className="event__body">
              <p className="label">{e.format}</p>
              <h3 className="event__title">{e.title}</h3>
              <p>{e.text}</p>
            </div>
            <div className="event__actions">
              <button type="button" className="btn" onClick={() => setOpen(e.id)} aria-haspopup="dialog">
                Details
              </button>
              <IcsButton event={e} />
            </div>
          </li>
        ))}
      </ol>
      <EventDrawer id={open} onClose={() => setOpen(null)} />
    </>
  );
}
