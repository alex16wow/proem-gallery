import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../components/Img';
import { useActive, useMedia, useMotion } from '../lib/motion';

const INTRO_KEY = 'proem-intro';

/**
 * I-01 «ПРОЁМ». Фото зала 01 открыто сразу (≥60% кадра); два молочных слоя по краям
 * расходятся как створки проёма с лёгким perspective rotateY. Прокрутка 0..0.8vh
 * уменьшает фото 1.04→1 и раздвигает слои ещё на 6vw. Всё — CSS-переменные + rAF.
 */
export function HeroPortal() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const desktop = useMedia('(min-width: 900px) and (hover: hover)');
  const active = useActive(root, '0px');
  const animate = !reduced && desktop;

  // Вступление: 800ms, повторно в сессии — 300ms. Без лоадера, CTA доступен сразу.
  useEffect(() => {
    const el = root.current!;
    if (!animate) {
      el.style.setProperty('--open', '1');
      return;
    }
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(INTRO_KEY);
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
    const dur = seen ? 300 : 820;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.style.setProperty('--open', e.toFixed(4));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    el.style.setProperty('--open', '0');
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  // Прокрутка и слабая перспектива от курсора — только пока hero виден.
  useEffect(() => {
    const el = root.current!;
    if (!animate || !active) {
      if (!animate) {
        el.style.setProperty('--scroll', '0');
        el.style.setProperty('--px', '0');
      }
      return;
    }
    let raf = 0;
    let px = 0;
    let tx = 0;
    const loop = () => {
      const s = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8)));
      px += (tx - px) * 0.06;
      el.style.setProperty('--scroll', s.toFixed(4));
      el.style.setProperty('--px', px.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    };
    el.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
    };
  }, [animate, active]);

  return (
    <section ref={root} className="hero" aria-labelledby="home-title">
      <div className="hero__photo">
        <Img id="04-room01-fabric" priority sizes="100vw" focal={desktop ? { x: 1, y: 0.5 } : { x: 0.7, y: 0.5 }} />
      </div>
      <div className="hero__planes" aria-hidden="true">
        <div className="plane plane--l">
          <span className="plane__mark">PROEM</span>
          <span className="plane__coord mono">x 00 / 24</span>
        </div>
        <div className="plane plane--r">
          <span className="plane__coord mono">y 18 / 18</span>
        </div>
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__content">
        <p className="label label--inv">PROEM / INDEPENDENT GALLERY</p>
        <h1 id="home-title" className="h1 hero__title" tabIndex={-1}>
          A place to <br />
          look differently.
        </h1>
        <div className="hero__ctas">
          <Link className="btn btn--red" to="/exhibitions/between-states">
            Enter the exhibition ↗
          </Link>
          <Link className="btn btn--inv" to="/visit">
            Plan your visit
          </Link>
        </div>
      </div>
      <p className="hero__now">
        <span className="label label--inv">Now at the gallery</span>
        <Link to="/exhibitions/between-states">Between States</Link>
        <span className="mono">12 Sep — 22 Nov 2026</span>
      </p>
      <a className="hero__scroll" href="#about">
        Next — the space <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
