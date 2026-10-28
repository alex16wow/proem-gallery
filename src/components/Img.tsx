import { useState, type CSSProperties } from 'react';
import { assetUrls } from '../lib/assets';

interface Props {
  id: string;
  sizes?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  /** переопределение точки фокуса, 0..1 */
  focal?: { x: number; y: number };
  className?: string;
  alt?: string;
  /** только большая web-версия (modal) */
  full?: boolean;
  style?: CSSProperties;
}

/**
 * Изображение из реестра: width/height для резервирования места, srcset из готовых деривативов,
 * lazy ниже первого экрана, состояния загрузки и ошибки.
 */
export function Img({ id, sizes = '100vw', priority, fit, focal, className = '', alt, full, style }: Props) {
  const u = assetUrls(id);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const f = focal ?? u.asset.focalPoint;
  const objectFit = fit ?? u.asset.fit;
  return (
    <span className={`img img--${objectFit} is-${state} ${className}`} style={style}>
      {state !== 'error' && (
        <img
          key={attempt}
          src={u.web}
          srcSet={full ? undefined : u.srcSet}
          sizes={full ? undefined : sizes}
          width={u.webW}
          height={u.webH}
          alt={alt ?? u.asset.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // @ts-expect-error — атрибут поддерживается браузерами, но отсутствует в типах React 18
          fetchpriority={priority ? 'high' : undefined}
          style={{ objectFit, objectPosition: `${f.x * 100}% ${f.y * 100}%` }}
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
        />
      )}
      {state === 'loading' && <span className="img__status" aria-hidden="true">Image loading</span>}
      {state === 'error' && (
        <span className="img__error" role="status">
          The image could not be shown. The description and source are available below.
          <button
            type="button"
            className="btn-text"
            onClick={() => {
              setAttempt((a) => a + 1);
              setState('loading');
            }}
          >
            Try again
          </button>
        </span>
      )}
    </span>
  );
}
