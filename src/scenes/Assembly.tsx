import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Img } from '../components/Img';
import { useMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * I-02 «Сборка». Финальная сетка задаётся CSS; анимация лишь компенсирует начальные смещения
 * (offset ±80px, rotation ±3°, scale .94–1.02) и scrub-ом возвращает их к нулю.
 * 0–.35 — движение к колонкам, .35–.75 — выравнивание и масштаб, .75–1 — линии и подписи.
 * Mobile и reduced: сразу финальная сетка.
 */
export function Assembly() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.assembly__stage',
            start: 'top 85%',
            end: '+=' + window.innerHeight,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none' },
        });
        const a = '[data-piece="a"]';
        const b = '[data-piece="b"]';
        const c = '[data-piece="c"]';
        tl.fromTo(a, { x: -80, y: 60, rotation: -3, scale: 0.94 }, { x: -20, y: 10, rotation: -1, scale: 0.97, duration: 0.35 }, 0)
          .fromTo(b, { x: 80, y: -70, rotation: 2.5, scale: 1.02 }, { x: 20, y: -15, rotation: 0.8, scale: 1.01, duration: 0.35 }, 0)
          .fromTo(c, { x: -60, y: 80, rotation: 3, scale: 0.94 }, { x: -12, y: 18, rotation: 1, scale: 0.98, duration: 0.35 }, 0)
          .to([a, b, c], { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.4 }, 0.35)
          .fromTo('.assembly__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.25 }, 0.75)
          .fromTo('.assembly__mat', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.75);
        return () => tl.kill();
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} className="assembly section" aria-labelledby="now-title">
      <div className="assembly__stage">
        <figure className="assembly__piece assembly__piece--a" data-piece="a">
          <div className="assembly__frame">
            <Img id="04-room01-fabric" sizes="(min-width: 900px) 58vw, 100vw" />
          </div>
          <figcaption className="assembly__mat">
            <span className="mono">01</span> Fabric · Room 01
          </figcaption>
        </figure>
        <figure className="assembly__piece assembly__piece--b" data-piece="b">
          <div className="assembly__frame">
            <Img id="05-room02-acrylic" sizes="(min-width: 900px) 33vw, 100vw" />
          </div>
          <figcaption className="assembly__mat">
            <span className="mono">02</span> Acrylic · Room 02
          </figcaption>
        </figure>
        <figure className="assembly__piece assembly__piece--c" data-piece="c">
          <div className="assembly__frame">
            <Img id="06-room03-light" sizes="(min-width: 900px) 25vw, 100vw" />
          </div>
          <figcaption className="assembly__mat">
            <span className="mono">03</span> Light · Room 03
          </figcaption>
        </figure>
        <span className="assembly__rule assembly__rule--1" aria-hidden="true" />
        <span className="assembly__rule assembly__rule--2" aria-hidden="true" />

        <div className="assembly__text">
          <p className="label">NOW / 12 SEP — 22 NOV 2026</p>
          <h2 id="now-title" className="h2">
            Between <br />
            States
          </h2>
          <p>
            When does fabric become a wall, color an object, and light a boundary? Five works explore the moment when a
            material stops being familiar. The exhibition unfolds across three rooms: from daylight and moving air to
            colored reflections and a dark room.
          </p>
          <p className="meta-line mono">5 works · 3 rooms · 45–60 minutes · free admission</p>
          <Link className="btn btn--red" to="/exhibitions/between-states">
            See the exhibition ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
