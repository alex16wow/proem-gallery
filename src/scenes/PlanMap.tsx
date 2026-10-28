import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Img } from '../components/Img';
import { useWorkModal } from '../components/WorkModal';
import { ROOMS, SPACE_WORKS, WORK_BY_ID, type RoomId } from '../data/content';
import { useMotion } from '../lib/motion';

/** Координаты из брифа ×10: x 0..240 (запад→восток), y 0..180 (север→юг). */
const S = 10;
const ZONES: Record<RoomId, [number, number, number, number]> = {
  '01': [0, 0, 8, 12],
  '02': [8, 0, 8, 12],
  '03': [16, 0, 8, 12],
  lobby: [0, 12, 24, 6],
};
const ROUTES: Record<string, [number, number][]> = {
  full: [[12, 18], [12, 15], [4, 15], [4, 6], [12, 6], [20, 6], [20, 15], [12, 15], [12, 18]],
  slow: [[12, 18], [12, 15], [4, 15], [4, 6], [12, 6], [20, 6], [20, 15], [12, 15], [12, 18]],
  short: [[12, 18], [12, 15], [4, 15], [4, 6], [12, 6], [12, 15], [12, 18]],
};
const ROUTE_NAMES: Record<string, string> = {
  full: '45 minutes: lobby → 01 → 02 → 03 → lobby',
  slow: 'No rush: lobby → 01 → 02 → 03 → courtyard',
  short: '20 minutes: lobby → 01 → 02 → exit',
};
const ORDER: RoomId[] = ['lobby', '01', '02', '03'];

/**
 * I-09 «План». Чистый SVG по координатам брифа; кнопки залов вне SVG дублируют карту
 * (стрелки — следующий зал, Enter/Space — закрепить). Выбор и маршрут живут в query.
 */
export function PlanMap() {
  const [params, setParams] = useSearchParams();
  const { reduced } = useMotion();
  const { open } = useWorkModal();
  const roomParam = params.get('room') as RoomId | null;
  const selected: RoomId = roomParam && ORDER.includes(roomParam) ? roomParam : 'lobby';
  const routeParam = params.get('route');
  const route = routeParam && ROUTES[routeParam] ? routeParam : null;
  const [hover, setHover] = useState<RoomId | null>(null);
  const [mode, setMode] = useState<'plan' | 'photo'>('plan');
  const [imgIdx, setImgIdx] = useState(0);
  const shown = hover ?? selected;
  const room = ROOMS.find((r) => r.id === shown)!;
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});
  const path = useRef<SVGPolylineElement>(null);

  useEffect(() => setImgIdx(0), [shown]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const select = (id: RoomId) => update({ room: id });

  // Пунктир маршрута прорисовывается один раз за 800ms.
  useEffect(() => {
    const p = path.current;
    if (!p || !route) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = '0';
    if (reduced) return;
    const anim = p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: 800,
      easing: 'cubic-bezier(.4,0,.2,1)',
    });
    return () => anim.cancel();
  }, [route, reduced]);

  const onKey = (e: React.KeyboardEvent, id: RoomId) => {
    const i = ORDER.indexOf(id);
    let next: RoomId | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = ORDER[(i + 1) % ORDER.length];
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = ORDER[(i - 1 + ORDER.length) % ORDER.length];
    if (next) {
      e.preventDefault();
      btns.current[next]?.focus();
      setHover(next);
    }
  };

  const zone = (id: RoomId) => {
    const [x, y, w, h] = ZONES[id];
    return (
      <rect
        key={id}
        className={`plan__zone ${selected === id ? 'is-selected' : ''} ${hover === id ? 'is-hover' : ''} ${id === '03' ? 'is-blue' : ''}`}
        x={x * S}
        y={y * S}
        width={w * S}
        height={h * S}
        onPointerEnter={() => setHover(id)}
        onPointerLeave={() => setHover(null)}
        onClick={() => select(id)}
      />
    );
  };

  const works = room.workIds.map((id) => WORK_BY_ID[id]);
  const spaceList = SPACE_WORKS.map((w) => w.id);

  return (
    <div className="plan">
      <div className="plan__map">
        <div className="plan__toolbar">
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={mode === 'plan'} onClick={() => setMode('plan')}>
              Plan
            </button>
            <button type="button" aria-pressed={mode === 'photo'} onClick={() => setMode('photo')}>
              Photo
            </button>
          </div>
          <button
            type="button"
            className="btn-text"
            aria-pressed={!!route}
            onClick={() => update({ route: route ? null : 'full' })}
          >
            {route ? 'Hide route' : 'Show route'}
          </button>
        </div>

        <div className="plan__canvas">
          <svg
            className={`plan__svg ${mode === 'photo' ? 'is-hidden' : ''}`}
            viewBox="-14 -22 268 240"
            aria-hidden="true"
          >
            <g className="plan__zones">{ORDER.map(zone)}</g>
            {/* внутренние стены с проёмами: в залы при x4/12/20 y12, боковые двери x8/16 y6 */}
            <g className="plan__walls-in">
              <path d="M0 120 H30 M50 120 H110 M130 120 H190 M210 120 H240" />
              <path d="M80 0 V50 M80 70 V120 M160 0 V50 M160 70 V120" />
              <path d="M200 140 V180 M200 140 H240" />
            </g>
            {/* наружная оболочка, вход шириной ~3 м по центру южной стены */}
            <path className="plan__shell" d="M105 180 H0 V0 H240 V180 H135" />
            <rect className="plan__lantern" x="10" y="-6" width="60" height="4" />
            <rect className="plan__desk" x="10" y="140" width="40" height="20" />
            <text className="plan__small" x="30" y="153" textAnchor="middle">
              desk
            </text>
            <text className="plan__small" x="220" y="163" textAnchor="middle">
              WC
            </text>
            <text className="plan__num" x="40" y="38" textAnchor="middle">
              01
            </text>
            <text className="plan__num" x="120" y="38" textAnchor="middle">
              02
            </text>
            <text className="plan__num" x="200" y="38" textAnchor="middle">
              03
            </text>
            <text className="plan__small" x="120" y="140" textAnchor="middle">
              lobby
            </text>
            <text className="plan__small" x="120" y="198" textAnchor="middle">
              entrance · courtyard
            </text>
            <path className="plan__entry" d="M120 210 V186 M114 192 L120 186 L126 192" />
            <g className="plan__north" transform="translate(234 -12)">
              <path d="M0 -6 L4 4 L0 2 L-4 4 Z" />
              <text x="-10" y="4" textAnchor="end">
                N
              </text>
            </g>
            {route && (
              <polyline
                ref={path}
                key={route}
                className="plan__route"
                points={ROUTES[route].map(([x, y]) => `${x * S},${y * S}`).join(' ')}
              />
            )}
          </svg>
          {mode === 'photo' && (
            <div className="plan__photo">
              <Img id={room.images[imgIdx]} sizes="(min-width: 900px) 58vw, 100vw" key={room.images[imgIdx]} className="fade-in" />
            </div>
          )}
        </div>

        <div className="room-btns" role="group" aria-label="Choose a room">
          {ORDER.map((id) => (
            <button
              key={id}
              ref={(el) => (btns.current[id] = el)}
              type="button"
              aria-pressed={selected === id}
              onClick={() => select(id)}
              onKeyDown={(e) => onKey(e, id)}
              onFocus={() => setHover(id)}
              onBlur={() => setHover(null)}
              onPointerEnter={() => setHover(id)}
              onPointerLeave={() => setHover(null)}
            >
              {ROOMS.find((r) => r.id === id)!.label}
            </button>
          ))}
        </div>
        <p className="small plan__legend">
          A conceptual 24 × 18 m plan for navigation, not a construction document. {route ? ROUTE_NAMES[route] + '.' : ''}
        </p>
      </div>

      <div className="plan__panel" aria-live="polite">
        <div className="plan__media">
          <Img key={room.images[imgIdx]} id={room.images[imgIdx]} sizes="(min-width: 900px) 34vw, 100vw" className="fade-in" />
        </div>
        {room.images.length > 1 && (
          <div className="plan__thumbs" role="group" aria-label="Room photos">
            {room.images.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-pressed={i === imgIdx}
                aria-label={`Photo ${i + 1} of ${room.images.length}`}
                onClick={() => setImgIdx(i)}
              >
                <Img id={img} sizes="80px" alt="" />
              </button>
            ))}
          </div>
        )}
        <h3 className="plan__title">{room.name}</h3>
        <p>{room.text}</p>
        {works.length > 0 && (
          <div className="plan__works">
            <p className="label">Now showing</p>
            <ul>
              {works.map((w) => (
                <li key={w.id}>
                  <button type="button" className="link-btn" onClick={() => open(w.id, spaceList)}>
                    {w.title} ↗
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hover && hover !== selected && <p className="small">Click to keep this selection.</p>}
        <p className="small">
          The route 01 → 02 → 03 takes about 45 minutes. You can also walk it in reverse.
        </p>
        <Link className="btn btn--line" to="/exhibitions/between-states">
          See the current exhibition
        </Link>
      </div>
    </div>
  );
}
