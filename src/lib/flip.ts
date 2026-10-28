import { useLayoutEffect, useRef, type RefObject } from 'react';

type Rects = Map<string, DOMRect>;

/**
 * FLIP для элементов с data-flip внутри контейнера. Вызовите capture() перед изменением раскладки;
 * после рендера элементы с тем же ключом анимируются из старого положения (WAAPI, transform only).
 */
export function useFlip(container: RefObject<HTMLElement>, deps: unknown[], enabled: boolean, duration = 600) {
  const snapshot = useRef<Rects | null>(null);

  const capture = () => {
    if (!enabled || !container.current) return;
    const m: Rects = new Map();
    container.current.querySelectorAll<HTMLElement>('[data-flip]').forEach((el) => {
      m.set(el.dataset.flip!, el.getBoundingClientRect());
    });
    snapshot.current = m;
  };

  useLayoutEffect(() => {
    const prev = snapshot.current;
    snapshot.current = null;
    if (!prev || !enabled || !container.current) return;
    container.current.querySelectorAll<HTMLElement>('[data-flip]').forEach((el) => {
      const before = prev.get(el.dataset.flip!);
      const after = el.getBoundingClientRect();
      if (!after.width || !after.height) return;
      if (!before) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
        return;
      }
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const sx = before.width / after.width;
      const sy = before.height / after.height;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      el.animate(
        [
          { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transformOrigin: '0 0', transform: 'none' },
        ],
        { duration, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return capture;
}
