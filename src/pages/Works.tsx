import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Titr } from '../components/Titr';
import { Img } from '../components/Img';
import { WorkCard } from '../components/WorkCard';
import { useWorkModal } from '../components/WorkModal';
import { CABINET_WORKS, MATERIAL_FILTERS, SPACE_WORKS, WORK_BY_ID, workNumber } from '../data/content';
import { useFlip } from '../lib/flip';
import { useMedia, useMotion } from '../lib/motion';

const SPANS = [6, 3, 3, 4, 5, 3];
const PAIRS = [
  { a: 'work-acrylic', b: 'cma-143278', label: 'Acrylic and painting' },
  { a: 'work-paper', b: 'cma-138684', label: 'Paper and collage' },
];

export default function Works() {
  const [params, setParams] = useSearchParams();
  const { reduced } = useMotion();
  const desktop = useMedia('(min-width: 900px)');
  const { open } = useWorkModal();
  const collection = params.get('collection') === 'cabinet' ? 'cabinet' : 'space';
  const view = params.get('view') === 'index' ? 'index' : 'wall';
  const material = params.get('material');
  const q = params.get('q') ?? '';
  const [preview, setPreview] = useState<string | null>(null);
  const [pair, setPair] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const source = collection === 'space' ? SPACE_WORKS : CABINET_WORKS;
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return source.filter(
      (w) =>
        (!material || w.category === material) &&
        (!needle || w.title.toLowerCase().includes(needle) || w.artist.toLowerCase().includes(needle)),
    );
  }, [source, material, q]);
  const ids = items.map((w) => w.id);

  const capture = useFlip(listRef, [view, material, q, collection], !reduced && desktop);

  const setQ = (patch: Record<string, string | null>, replace = false) => {
    capture();
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? next.delete(k) : next.set(k, v)));
    setParams(next, { replace, preventScrollReset: true });
  };

  // Прямая ссылка на работу: /works?work=work-paper
  const workParam = params.get('work');
  useEffect(() => {
    if (workParam && WORK_BY_ID[workParam]) {
      open(workParam, ids.includes(workParam) ? ids : [workParam]);
      const next = new URLSearchParams(params);
      next.delete('work');
      setParams(next, { replace: true, preventScrollReset: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workParam]);

  const prev = items.find((w) => w.id === preview) ?? items[0];

  return (
    <>
      <section className="page-head wrap">
        <p className="label">OBJECTS / SURFACES / SIGNALS</p>
        <Titr lines={['Every form has', 'its own way of speaking.']} className="h1" />
        <p className="lead-s page-head__intro">
          You can start with a color, a material or one unexpected detail. Open a work to see it in full and read a short
          note.
        </p>
      </section>

      <section className="section-tight wrap" aria-label="Catalog of works">
        <div className="tabs" role="group" aria-label="Collection">
          <button
            type="button"
            className="tab"
            aria-pressed={collection === 'space'}
            onClick={() => setQ({ collection: 'space', material: null, q: null })}
          >
            In the Space <span className="mono">·5</span>
          </button>
          <button
            type="button"
            className="tab"
            aria-pressed={collection === 'cabinet'}
            onClick={() => setQ({ collection: 'cabinet', material: null, q: null })}
          >
            Open Cabinet <span className="mono">·16</span>
          </button>
        </div>

        <div className="collection-intro">
          {collection === 'space' ? (
            <p>
              Five contemporary works make up the exhibition “Between States”. They are original visual concepts by PROEM
              Studio, created for the gallery project.
            </p>
          ) : (
            <>
              <h2 className="h2">
                Origins <br />
                without a showcase.
              </h2>
              <div>
                <p>
                  This selection exists online. We look at real works from the early 20th century alongside the themes of
                  today’s gallery: how a plane becomes space, how a line sets a rhythm, how a material holds on to movement.
                </p>
                <p className="small">
                  The images are published by the Cleveland Museum of Art under open access with a CC0 designation. They do
                  not imply that the originals are at PROEM, a museum partnership or an exhibition that took place. Each
                  card keeps a link to the museum record.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="toolbar toolbar--works">
          <div className="chips" role="group" aria-label="Material">
            <button type="button" aria-pressed={!material} onClick={() => setQ({ material: null })}>
              All materials
            </button>
            {MATERIAL_FILTERS.map((m) => (
              <button key={m} type="button" aria-pressed={material === m} onClick={() => setQ({ material: m })}>
                {m}
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Title or artist"
              value={q}
              onChange={(e) => setQ({ q: e.target.value }, true)}
            />
          </label>
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'wall'} onClick={() => setQ({ view: null })}>
              Wall
            </button>
            <button type="button" aria-pressed={view === 'index'} onClick={() => setQ({ view: 'index' })}>
              Index
            </button>
          </div>
          <p className="toolbar__count mono" role="status">
            Found: {items.length}
          </p>
          {(material || q) && (
            <button type="button" className="btn-text" onClick={() => setQ({ material: null, q: null })}>
              Clear filters
            </button>
          )}
        </div>

        <div ref={listRef} className={`catalog catalog--${view}`}>
          {items.length === 0 && (
            <div className="empty">
              <p>No works match this combination yet. Remove one of the filters.</p>
              <button type="button" className="btn" onClick={() => setQ({ material: null, q: null })}>
                Clear filters
              </button>
            </div>
          )}

          {view === 'wall' && items.length > 0 && (
            <ul className="wall">
              {items.map((w, i) => (
                <li key={w.id} className="wall__item" style={{ ['--span' as string]: SPANS[i % SPANS.length] }} data-flip={`i-${w.id}`}>
                  <WorkCard work={w} list={ids} sizes="(min-width: 900px) 45vw, (min-width: 600px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          )}

          {view === 'index' && items.length > 0 && (
            <div className="index">
              <ol className="index__rows">
                {items.map((w) => (
                  <li key={w.id}>
                    <button
                      type="button"
                      className={`irow ${prev?.id === w.id ? 'is-active' : ''}`}
                      onClick={() => open(w.id, ids)}
                      onPointerEnter={() => setPreview(w.id)}
                      onFocus={() => setPreview(w.id)}
                    >
                      <span className="irow__num mono">{workNumber(w)}</span>
                      <span className="irow__thumb" data-flip={`i-${w.id}`}>
                        <Img id={w.images[0]} sizes="64px" alt="" fit={w.isFictional ? 'cover' : 'contain'} />
                      </span>
                      <span className="irow__title">{w.title}</span>
                      <span className="irow__artist">{w.artist.split(' (')[0]}</span>
                      <span className="irow__year mono">{w.year}</span>
                      <span className="irow__mat small">{w.category}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="index__preview" aria-hidden="true">
                {prev && (
                  <>
                    <Img key={prev.id} id={prev.images[0]} sizes="34vw" fit="contain" className="fade-in" />
                    <p className="small">{prev.hoverText}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section wrap compare" aria-labelledby="cmp-title">
        <div className="compare__head">
          <h2 id="cmp-title" className="h2">
            Look <br />
            side by side.
          </h2>
          <p>
            Try comparing fabric and collage, a transparent object and geometric painting. The similarity may lie in the
            rhythm, and the difference in how each work takes up space.
          </p>
          <div className="seg" role="group" aria-label="Pair to compare">
            {PAIRS.map((p, i) => (
              <button key={p.label} type="button" aria-pressed={pair === i} onClick={() => setPair(i)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="compare__pair">
          {[PAIRS[pair].a, PAIRS[pair].b].map((id) => {
            const w = WORK_BY_ID[id];
            return (
              <figure key={id} className="compare__item">
                <button type="button" className="compare__btn" onClick={() => open(id, [PAIRS[pair].a, PAIRS[pair].b])}>
                  <Img id={w.images[0]} fit="contain" sizes="(min-width: 900px) 40vw, 50vw" className="fade-in" />
                  <span className="sr-only">Open {w.title}</span>
                </button>
                <figcaption>
                  <span className="compare__t">{w.title}</span>
                  <span className="small">
                    {w.artist.split(' (')[0]}, {w.year} · {w.material}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <Link className="arrow-link" to="/visit">
          Continue in the gallery ↗
        </Link>
      </section>
    </>
  );
}
