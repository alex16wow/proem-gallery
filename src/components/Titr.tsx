import { useEffect, useState, type ElementType } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useMotion } from '../lib/motion';

interface Props {
  as?: ElementType;
  lines: string[];
  className?: string;
  id?: string;
}

/**
 * I-08 «Титр». Строки заголовка один раз (~500ms) собираются из горизонтальных масок.
 * Текст всегда в DOM и в итоговом виде; анимируется только transform внутри маски, поэтому CLS нет.
 * Back/Forward и повторный показ в сессии — без анимации.
 */
export function Titr({ as: Tag = 'h1', lines, className = '', id }: Props) {
  const { reduced } = useMotion();
  const nav = useNavigationType();
  const { pathname } = useLocation();
  const [play] = useState(() => {
    if (reduced || nav === 'POP') return false;
    const key = `proem-titr:${pathname}:${lines[0]}`;
    try {
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, '1');
    } catch {
      /* без хранилища просто проигрываем */
    }
    return true;
  });
  const [done, setDone] = useState(!play);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setDone(true), 700);
    return () => clearTimeout(t);
  }, [play]);

  return (
    <Tag id={id} className={`titr ${className} ${play && !done ? 'is-playing' : ''}`} tabIndex={Tag === 'h1' ? -1 : undefined}>
      {lines.map((l, i) => (
        <span className="titr__line" key={i} style={{ ['--i' as string]: i }}>
          <span className="titr__in">{l}</span>
          {i < lines.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
