import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const KEY = 'proem-motion';

interface MotionCtx {
  /** true — анимации выключены (системная настройка или кнопка) */
  reduced: boolean;
  toggle: () => void;
}

const Ctx = createContext<MotionCtx>({ reduced: false, toggle: () => {} });

function readStored(): 'on' | 'off' | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(() => {
    const stored = readStored();
    if (stored) return stored === 'off';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'off' : 'on';
  }, [reduced]);

  // Пока пользователь сам не выбрал режим, следуем системной настройке.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (!readStored()) setReduced(mq.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setReduced((r) => {
      const next = !r;
      try {
        localStorage.setItem(KEY, next ? 'off' : 'on');
      } catch {
        /* хранилище недоступно — режим действует до перезагрузки */
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ reduced, toggle }}>{children}</Ctx.Provider>;
}

export const useMotion = () => useContext(Ctx);

/** Совпадение media query с подпиской на изменения. */
export function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Видимость элемента во viewport + видимость документа: для остановки render-loop. */
export function useActive(ref: React.RefObject<Element>, rootMargin = '100px') {
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return inView && visible;
}
