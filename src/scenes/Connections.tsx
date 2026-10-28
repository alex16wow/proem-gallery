import { useEffect, useRef, useState, type RefObject } from 'react';
import { useActive, useMedia } from '../lib/motion';

interface Link {
  key: string;
  from: string; // data-node
  to: string;
}

interface Line {
  key: string;
  d: string;
  a: [number, number];
  b: [number, number];
}

/**
 * I-07 «Линии внимания». SVG-оверлей поверх сцены соединяет реальные DOM-узлы
 * (угол фото → номер работы). Геометрия пересчитывается на rAF по scroll/resize,
 * только пока сцена видна; измеряются лишь узлы из списка. На узких экранах оверлей убран.
 */
export function Connections({ root, links, active }: { root: RefObject<HTMLElement>; links: Link[]; active: string | null }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const wide = useMedia('(min-width: 900px)');
  const visible = useActive(root, '0px');
  const raf = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el || !wide || !visible) return;
    const measure = () => {
      raf.current = 0;
      const base = el.getBoundingClientRect();
      const pt = (name: string, corner: 'br' | 'tl' | 'c') => {
        const n = el.querySelector<HTMLElement>(`[data-node="${name}"]`);
        if (!n) return null;
        const r = n.getBoundingClientRect();
        const x = corner === 'br' ? r.right : corner === 'tl' ? r.left : r.left + r.width / 2;
        const y = corner === 'br' ? r.bottom : corner === 'tl' ? r.top : r.top;
        return [x - base.left, y - base.top] as [number, number];
      };
      const out: Line[] = [];
      for (const l of links) {
        const a = pt(l.from, 'br');
        const b = pt(l.to, 'c');
        if (!a || !b) continue;
        const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const c = Math.min(160, dist * 0.35);
        out.push({
          key: l.key,
          a,
          b,
          d: `M${a[0].toFixed(1)},${a[1].toFixed(1)} C${a[0].toFixed(1)},${(a[1] + c).toFixed(1)} ${b[0].toFixed(1)},${(b[1] - c).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`,
        });
      }
      setLines(out);
      setSize({ w: base.width, h: base.height });
    };
    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      ro.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [root, links, wide, visible]);

  if (!wide) return null;
  return (
    <svg className="connections" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      {lines.map((l) => (
        <g key={l.key} className={active === l.key ? 'is-active' : ''}>
          <path d={l.d} />
          <rect x={l.a[0] - 3} y={l.a[1] - 3} width="6" height="6" />
          <rect x={l.b[0] - 3} y={l.b[1] - 9} width="6" height="6" />
          <text x={l.b[0] + 8} y={l.b[1] - 4}>
            {Math.round(l.b[0])}·{Math.round(l.b[1])}
          </text>
        </g>
      ))}
      {lines[0] && (
        <text className="connections__note" x={lines[0].a[0] + 10} y={lines[0].a[1] + 16}>
          local composition
        </text>
      )}
    </svg>
  );
}
