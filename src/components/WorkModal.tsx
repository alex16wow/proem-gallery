import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from './Dialog';
import { Img } from './Img';
import { WORK_BY_ID, workNumber, type Work } from '../data/content';

interface Ctx {
  open: (id: string, list?: string[]) => void;
}

const WorkCtx = createContext<Ctx>({ open: () => {} });
export const useWorkModal = () => useContext(WorkCtx);

export function WorkModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ id: string; list: string[] } | null>(null);
  const open = useCallback((id: string, list?: string[]) => setState({ id, list: list?.length ? list : [id] }), []);
  const close = useCallback(() => setState(null), []);

  const work = state ? WORK_BY_ID[state.id] : null;
  const idx = state ? state.list.indexOf(state.id) : -1;
  const total = state?.list.length ?? 0;
  const go = (d: number) => {
    if (!state) return;
    const next = state.list[(idx + d + total) % total];
    setState({ ...state, id: next });
  };

  return (
    <WorkCtx.Provider value={{ open }}>
      {children}
      <Dialog open={!!work} onClose={close} labelledBy="work-title" variant="modal">
        {work && (
          <WorkDetail work={work} index={idx} total={total} onPrev={() => go(-1)} onNext={() => go(1)} onClose={close} />
        )}
      </Dialog>
    </WorkCtx.Provider>
  );
}

function WorkDetail({
  work,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  work: Work;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const museum = !work.isFictional;
  return (
    <article className="work-detail" key={work.id}>
      <div className="work-detail__bar">
        <span className="label">
          {total > 1 ? `Work ${index + 1} of ${total}` : museum ? 'Open Cabinet' : 'In the Space'}
        </span>
        <button type="button" className="btn-text" onClick={onClose} data-autofocus>
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={`work-detail__media ${work.images.length > 1 ? 'is-pair' : ''}`}>
        {work.images.map((img) => (
          <Img key={img} id={img} fit="contain" full className="work-detail__img" />
        ))}
      </div>
      <div className="work-detail__body">
        <p className="label">
          {museum ? 'Cabinet' : 'Space'} / {workNumber(work)}
        </p>
        <h2 id="work-title" className="work-detail__title">
          {work.title}
        </h2>
        <dl className="facts">
          <div>
            <dt>Artist</dt>
            <dd>{work.artist}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{work.year}</dd>
          </div>
          <div>
            <dt>Medium</dt>
            <dd>{work.material}</dd>
          </div>
          <div>
            <dt>Dimensions</dt>
            <dd>{work.dimensions ?? 'Dimensions not given in the record'}</dd>
          </div>
          {work.room && (
            <div>
              <dt>Room</dt>
              <dd>{work.room}</dd>
            </div>
          )}
        </dl>
        <h3 className="label">Note</h3>
        <p className="work-detail__note">{work.description}</p>
        <p className="work-detail__source small">
          {museum ? (
            <>
              {work.museum}, {work.credit}, {work.accession}. Digital reproduction, {work.rights}. Does not mean the
              original is at PROEM.
            </>
          ) : (
            <>An original visual concept for the project; the image is AI-generated. Not a real museum object.</>
          )}
        </p>
        <div className="work-detail__actions">
          {total > 1 && (
            <>
              <button type="button" className="btn" onClick={onPrev}>
                ← Previous work
              </button>
              <button type="button" className="btn" onClick={onNext}>
                Next work →
              </button>
            </>
          )}
          {museum && work.sourceUrl && (
            <a className="btn btn--line" href={work.sourceUrl} target="_blank" rel="noopener noreferrer">
              Open source ↗
            </a>
          )}
          {!museum && work.room && (
            <Link className="btn btn--line" to={`/space?room=${work.room}#plan`} onClick={onClose}>
              On the plan
            </Link>
          )}
          <button type="button" className="btn-text" onClick={onClose}>
            Back to the collection
          </button>
        </div>
      </div>
    </article>
  );
}
