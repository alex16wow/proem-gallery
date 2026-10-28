import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Img } from './Img';
import { useWorkModal } from './WorkModal';
import { workNumber, type Work } from '../data/content';
import { useMotion } from '../lib/motion';

interface Props {
  work: Work;
  list: string[];
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** подпись под изображением; если false — только плавающая этикетка */
  caption?: boolean;
  image?: string;
  onActive?: (active: boolean) => void;
}

/**
 * I-06 «Этикетка». Карточка — настоящая кнопка, открывает modal.
 * Мышь: табличка следует за курсором с отставанием, clamp в пределах карточки.
 * Фокус: табличка закреплена у нижнего края. Touch: постоянная подпись, tap сразу открывает.
 */
export const WorkCard = forwardRef<HTMLButtonElement, Props>(function WorkCard(
  { work, list, sizes, className = '', style, caption = true, image, onActive },
  ref,
) {
  const { open } = useWorkModal();
  const { reduced } = useMotion();
  const box = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<'off' | 'hover' | 'focus'>('off');
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const timer = useRef(0);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
  }, []);

  const place = () => {
    const b = box.current;
    const l = label.current;
    if (!b || !l) return;
    const bw = b.clientWidth;
    const bh = b.clientHeight;
    const lw = l.offsetWidth;
    const lh = l.offsetHeight;
    // отступ 24px от курсора; у правого края — переносим на другую сторону
    let x = target.current.x + 24;
    if (x + lw > bw - 8) x = target.current.x - 24 - lw;
    let y = target.current.y + 24;
    if (y + lh > bh - 8) y = target.current.y - 24 - lh;
    x = Math.max(8, Math.min(x, bw - lw - 8));
    y = Math.max(8, Math.min(y, bh - lh - 8));
    return { x, y };
  };

  const tick = () => {
    const t = place();
    if (!t || !label.current) return;
    const k = reduced ? 1 : 0.2;
    pos.current.x += (t.x - pos.current.x) * k;
    pos.current.y += (t.y - pos.current.y) * k;
    label.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    if (Math.abs(t.x - pos.current.x) > 0.5 || Math.abs(t.y - pos.current.y) > 0.5) {
      raf.current = requestAnimationFrame(tick);
    } else raf.current = 0;
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !box.current) return;
    const r = box.current.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (mode !== 'hover') {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const t = place();
        if (t) pos.current = { ...t };
        setMode('hover');
        onActive?.(true);
      }, 100);
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    clearTimeout(timer.current);
    if (mode === 'hover') {
      setMode('off');
      onActive?.(false);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`work-card ${className} ${mode !== 'off' ? `is-${mode}` : ''}`}
      style={style}
      data-collection={work.collection}
      onClick={() => open(work.id, list)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) {
          setMode('focus');
          onActive?.(true);
        }
      }}
      onBlur={() => {
        setMode('off');
        onActive?.(false);
      }}
      aria-label={`${work.title}. ${work.artist}, ${work.year}. Open details`}
    >
      <span ref={box} className="work-card__frame">
        <Img
          id={image ?? work.images[0]}
          fit={work.collection === 'cabinet' ? 'contain' : 'cover'}
          sizes={sizes}
          alt=""
        />
        <span
          ref={label}
          className="tag-label"
          aria-hidden="true"
          style={mode === 'focus' ? { transform: 'none' } : { transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)` }}
        >
          <span className="tag-label__top">
            {workNumber(work)} · {work.category}
          </span>
          <span className="tag-label__title">{work.title}</span>
          <span className="tag-label__meta">
            {work.artist}, {work.year}
          </span>
          <span className="tag-label__text">{work.hoverText}</span>
          <span className="tag-label__open">Open ↗</span>
        </span>
      </span>
      {caption && (
        <span className="work-card__cap" aria-hidden="true">
          <span className="num">{workNumber(work)}</span>
          <span className="work-card__title">{work.title}</span>
          <span className="work-card__meta">
            {work.isFictional ? work.material : `${work.artist.split(' (')[0]}, ${work.year}`}
          </span>
        </span>
      )}
    </button>
  );
});
