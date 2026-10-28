import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Titr } from '../components/Titr';
import { Img } from '../components/Img';
import { Dialog } from '../components/Dialog';
import { EventList } from '../components/Events';
import { WorkCard } from '../components/WorkCard';
import { ADDRESS_ICS, EXHIBITIONS, WORK_BY_ID, type ExStatus, type Exhibition } from '../data/content';
import { useFlip } from '../lib/flip';
import { useMedia, useMotion } from '../lib/motion';
import { downloadIcs } from '../lib/download';

const FILTERS: { id: 'all' | ExStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'current', label: 'Now' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'archive', label: 'Archive' },
];

const plural = (n: number) => (n === 1 ? 'exhibition' : 'exhibitions');
const CABINET_PREVIEW = ['cma-143278', 'cma-138684', 'cma-102980'];

export default function Exhibitions() {
  const [params, setParams] = useSearchParams();
  const { reduced } = useMotion();
  const desktop = useMedia('(min-width: 900px)');
  const status = (params.get('status') as ExStatus | null) ?? 'all';
  const view = params.get('view') === 'grid' ? 'grid' : 'list';
  const [preview, setPreview] = useState('EX01');
  const [drawer, setDrawer] = useState<Exhibition | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => EXHIBITIONS.filter((e) => status === 'all' || e.status === status), [status]);
  const capture = useFlip(listRef, [status, view], !reduced && desktop);

  const setQ = (k: string, v: string | null) => {
    capture();
    const next = new URLSearchParams(params);
    if (v === null) next.delete(k);
    else next.set(k, v);
    setParams(next, { preventScrollReset: true });
  };

  const previewEx = items.find((e) => e.id === preview) ?? items[0];

  const action = (e: Exhibition) =>
    e.href ? (
      <Link className="btn btn--red" to={e.href}>
        Open the exhibition ↗
      </Link>
    ) : (
      <button type="button" className="btn" onClick={() => setDrawer(e)} aria-haspopup="dialog">
        Details
      </button>
    );

  return (
    <>
      <section className="page-head wrap">
        <p className="label">PROGRAM / 2026—2027</p>
        <Titr lines={['The exhibition changes.', 'So does the gaze.']} className="h1" />
        <p className="lead-s page-head__intro">
          We put together small exhibitions you can see in full and want to see again. The program includes new works,
          experiments with space and gatherings without a stage or distance.
        </p>
      </section>

      <section className="section-tight wrap" aria-label="Program exhibitions">
        <div className="toolbar">
          <div className="seg" role="group" aria-label="Status">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={status === f.id}
                onClick={() => setQ('status', f.id === 'all' ? null : f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'list'} onClick={() => setQ('view', null)}>
              List
            </button>
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setQ('view', 'grid')}>
              Grid
            </button>
          </div>
          <p className="toolbar__count mono" role="status">
            {items.length} {plural(items.length)}
          </p>
        </div>

        <div ref={listRef} className={`program program--${view}`}>
          {items.length === 0 && (
            <div className="empty">
              <p>It’s quiet here for now. Try another filter.</p>
              <button type="button" className="btn" onClick={() => setQ('status', null)}>
                Show the full program
              </button>
            </div>
          )}

          {view === 'list' && items.length > 0 && (
            <div className="program__list">
              <ol className="program__rows">
                {items.map((e) => (
                  <li
                    key={e.id}
                    className={`prow ${previewEx?.id === e.id ? 'is-active' : ''}`}
                    onPointerEnter={() => setPreview(e.id)}
                    onFocusCapture={() => setPreview(e.id)}
                  >
                    <span className="prow__num mono" data-flip={`n-${e.id}`}>
                      {e.id}
                    </span>
                    <span className="prow__thumb" data-flip={`i-${e.id}`}>
                      <Img id={e.images[0]} sizes="96px" alt="" />
                    </span>
                    <div className="prow__main" data-flip={`t-${e.id}`}>
                      <p className="label">
                        <span className={`status status--${e.status}`}>{e.statusLabel}</span> · {e.dates}
                      </p>
                      <h2 className="prow__title">{e.title}</h2>
                      <p className="prow__mat small">{e.materials}</p>
                      <p className="prow__short">{e.short}</p>
                    </div>
                    <div className="prow__act">{action(e)}</div>
                  </li>
                ))}
              </ol>
              <div className="program__preview" aria-hidden="true">
                {previewEx && (
                  <>
                    <Img key={previewEx.id} id={previewEx.images[0]} sizes="40vw" className="fade-in" />
                    <p className="mono small">
                      {previewEx.id} / {previewEx.statusLabel.toUpperCase()}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {view === 'grid' && items.length > 0 && (
            <ol className="program__grid">
              {items.map((e, i) => (
                <li key={e.id} className={`pcard pcard--${i % 4}`}>
                  <span className="pcard__img" data-flip={`i-${e.id}`}>
                    <Img id={e.images[0]} sizes="(min-width: 900px) 50vw, 100vw" alt="" />
                  </span>
                  <span className="pcard__num mono" data-flip={`n-${e.id}`}>
                    {e.id}
                  </span>
                  <div className="pcard__main" data-flip={`t-${e.id}`}>
                    <p className="label">
                      <span className={`status status--${e.status}`}>{e.statusLabel}</span> · {e.dates}
                    </p>
                    <h2 className="pcard__title">{e.title}</h2>
                    <p className="small">{e.materials}</p>
                    <p>{e.short}</p>
                    {action(e)}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section id="events" className="section dark" aria-labelledby="events-title">
        <div className="wrap">
          <Titr as="h2" id="events-title" className="h2" lines={['Art', 'in conversation.']} />
          <EventList dark />
        </div>
      </section>

      <section className="section wrap cabinet-teaser" aria-labelledby="cab-title">
        <div className="cabinet-teaser__text">
          <h2 id="cab-title" className="h2">
            Every new form <br />
            has a backstory.
          </h2>
          <p>
            In the digital cabinet we have gathered museum reproductions that are worth setting beside today’s exhibition:
            the geometry of painting, the rhythm of collage, the pattern of textile and the expressiveness of small
            sculpture. It is a separate online selection, not a list of originals in our rooms.
          </p>
          <Link className="btn btn--line" to="/works?collection=cabinet">
            Open the cabinet ↗
          </Link>
        </div>
        <div className="cabinet-teaser__row">
          {CABINET_PREVIEW.map((id) => (
            <WorkCard key={id} work={WORK_BY_ID[id]} list={CABINET_PREVIEW} sizes="(min-width: 900px) 18vw, 33vw" />
          ))}
        </div>
      </section>

      <ExDrawer ex={drawer} onClose={() => setDrawer(null)} />
    </>
  );
}

function ExDrawer({ ex, onClose }: { ex: Exhibition | null; onClose: () => void }) {
  return (
    <Dialog open={!!ex} onClose={onClose} labelledBy="ex-title" variant="drawer">
      {ex && (
        <div className="drawer">
          <div className="drawer__bar">
            <span className="label">
              {ex.id} / {ex.statusLabel}
            </span>
            <button type="button" className="btn-text" onClick={onClose} data-autofocus>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className={`drawer__imgs ${ex.images.length > 1 ? 'is-pair' : ''}`}>
            {ex.images.map((i) => (
              <Img key={i} id={i} sizes="(min-width: 900px) 280px, 50vw" />
            ))}
          </div>
          <p className="drawer__date mono">{ex.dates}</p>
          <h2 id="ex-title" className="drawer__title">
            {ex.title}
          </h2>
          <p className="small">{ex.materials}</p>
          <p className="lead-s">{ex.short}</p>
          {ex.full?.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <div className="drawer__actions">
            {ex.id === 'EX02' && (
              <>
                <button
                  type="button"
                  className="btn btn--red"
                  onClick={() =>
                    downloadIcs(
                      {
                        uid: 'EX02-opening',
                        title: 'Opening: Color Takes Up Space — PROEM',
                        description:
                          'First day of the exhibition. Free admission, Tue–Sun 11:00–19:00. The list of works will be published closer to the opening.',
                        date: '2026-12-05',
                      },
                      ADDRESS_ICS,
                    )
                  }
                >
                  Add the opening to your calendar
                </button>
                <Link className="btn btn--line" to="/visit" onClick={onClose}>
                  Plan a visit
                </Link>
              </>
            )}
            {ex.id === 'EX03' && (
              <>
                <Link className="btn btn--line" to="/works?collection=space&work=work-paper" onClick={onClose}>
                  See the paper relief
                </Link>
                <Link className="btn btn--line" to="/works?collection=cabinet&material=Textile" onClick={onClose}>
                  Works with textile
                </Link>
              </>
            )}
            {ex.id === 'EX04' && (
              <Link className="btn btn--line" to="/exhibitions/between-states#light-study" onClick={onClose}>
                Try the light study
              </Link>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
