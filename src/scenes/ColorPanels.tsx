import { useEffect, useId, useRef, useState } from 'react';
import { useActive, useMotion } from '../lib/motion';

/** Пять полупрозрачных плоскостей: базовое положение (% ширины), размер и направление сдвига. */
const PANELS = [
  { color: '#2448D8', left: 14, w: 17, h: 62, dir: -1, depth: 0.9 },
  { color: '#E8705A', left: 28, w: 15, h: 78, dir: 1, depth: 0.6 },
  { color: '#E9A631', left: 42, w: 18, h: 52, dir: -0.7, depth: 1 },
  { color: '#E5E1D4', left: 55, w: 14, h: 70, dir: 0.8, depth: 0.7, hole: true },
  { color: '#E98FAE', left: 66, w: 16, h: 58, dir: -1, depth: 0.8 },
];

const MAX_SHIFT = 60;
const MAX_TILT = 8;

/**
 * I-03 «Цвет занимает место». Курсор по x сдвигает плоскости в противоположных направлениях
 * (до 60px), y меняет наклон ±8°. Наложения — mix-blend-mode: multiply в изолированном контейнере.
 * Slider дублирует положение; клик/пробел фиксирует; reset возвращает всё.
 */
export function ColorPanels({ compact = false, id }: { compact?: boolean; id?: string }) {
  const { reduced } = useMotion();
  const uid = useId();
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const active = useActive(stage);
  const [slider, setSlider] = useState(50);
  const [frozen, setFrozen] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  // Текущее состояние в ref, чтобы rAF не пересоздавался при каждом движении.
  const s = useRef({ x: 0, tilt: 0, tx: 0, ttilt: 0, pointer: false, t0: performance.now() });
  const sliderRef = useRef(slider);
  sliderRef.current = slider;
  const frozenRef = useRef(frozen);
  frozenRef.current = frozen;

  const posToShift = (v: number) => ((v - 50) / 50) * MAX_SHIFT;

  const render = (breath: number) => {
    const st = s.current;
    PANELS.forEach((p, i) => {
      const el = els.current[i];
      if (!el) return;
      const dx = st.x * p.dir;
      const dy = breath * p.depth * (i % 2 ? 1 : -1);
      el.style.transform = `perspective(900px) translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotateY(${(st.tilt * p.dir).toFixed(2)}deg)`;
    });
  };

  // Слабое устройство: при низком заряде батареи «дыхание» выключается.
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> };
    nav.getBattery?.().then((b) => {
      if (b.level <= 0.05 && !b.charging) setLowPower(true);
    }).catch(() => {});
  }, []);

  // Reduced: без сглаживания и дыхания, рендер по изменению.
  useEffect(() => {
    if (!reduced) return;
    s.current.x = s.current.tx = posToShift(slider);
    s.current.tilt = s.current.ttilt = 0;
    render(0);
  }, [reduced, slider]);

  // Основной цикл: только когда сцена видна, не заморожена и движение включено.
  useEffect(() => {
    if (reduced || frozen || !active) return;
    let raf = 0;
    let last = performance.now();
    let slow = 0;
    let frames = 0;
    let idleOff = lowPower;
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      frames++;
      if (dt > 40) slow++;
      if (frames === 90 && slow > 30) idleOff = true; // стабильно слабый FPS
      const st = s.current;
      if (!st.pointer) {
        st.tx = posToShift(sliderRef.current);
        st.ttilt = 0;
      }
      const k = 1 - Math.pow(1 - 0.08, dt / 16.67);
      st.x += (st.tx - st.x) * k;
      st.tilt += (st.ttilt - st.tilt) * k;
      const breath = idleOff ? 0 : Math.sin(((t - st.t0) / 8000) * Math.PI * 2) * 4;
      render(breath);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, frozen, active, lowPower]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (frozen) return;
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    const r = stage.current!.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    s.current.pointer = true;
    s.current.tx = (nx * 2 - 1) * MAX_SHIFT;
    s.current.ttilt = (ny * 2 - 1) * MAX_TILT;
    if (e.pointerType === 'touch') setSlider(Math.round(nx * 100));
    if (reduced) {
      s.current.x = s.current.tx;
      s.current.tilt = s.current.ttilt;
      render(0);
    }
  };

  const onPointerLeave = () => {
    s.current.pointer = false;
    if (reduced) {
      s.current.x = posToShift(sliderRef.current);
      s.current.tilt = 0;
      render(0);
    }
  };

  const toggleFreeze = () => setFrozen((f) => !f);

  const reset = () => {
    setFrozen(false);
    setSlider(50);
    s.current.pointer = false;
    s.current.tx = 0;
    s.current.ttilt = 0;
    if (reduced) {
      s.current.x = 0;
      s.current.tilt = 0;
      render(0);
    }
  };

  return (
    <div className={`panels ${compact ? 'panels--compact' : ''}`} id={id}>
      <div
        ref={stage}
        className={`panels__stage ${frozen ? 'is-frozen' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Field of transparent planes. Space freezes the composition."
        aria-describedby={`${uid}-hint`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={(e) => {
          if ((e.nativeEvent as PointerEvent).pointerType !== 'touch') toggleFreeze();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
            toggleFreeze();
          }
        }}
      >
        <div className="panels__iso">
          {PANELS.map((p, i) => (
            <div
              key={i}
              ref={(el) => (els.current[i] = el)}
              className={`panels__p ${p.hole ? 'has-hole' : ''}`}
              style={{
                left: `${p.left}%`,
                width: `${p.w}%`,
                height: `${p.h}%`,
                background: p.color,
              }}
            />
          ))}
        </div>
        <svg className="panels__floor" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="2" x2="100" y2="2" />
          <line x1="20" y1="2" x2="0" y2="20" />
          <line x1="50" y1="2" x2="50" y2="20" />
          <line x1="80" y1="2" x2="100" y2="20" />
          <line x1="0" y1="11" x2="100" y2="11" />
        </svg>
        <span className="panels__coord mono" aria-hidden="true">
          CMY · 05 planes
        </span>
      </div>
      <div className="panels__controls">
        <label className="range">
          <span className="label">Position</span>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => {
              s.current.pointer = false;
              setFrozen(false);
              setSlider(Number(e.target.value));
            }}
          />
          <span className="mono range__val">{slider}</span>
        </label>
        <button type="button" className="btn" aria-pressed={frozen} onClick={toggleFreeze}>
          {frozen ? 'Resume' : 'Freeze'}
        </button>
        <button type="button" className="btn-text" onClick={reset}>
          Reset
        </button>
        <p className="panels__status" role="status">
          {frozen ? 'Composition frozen' : 'Free movement'}
        </p>
      </div>
      <p id={`${uid}-hint`} className="small panels__hint">
        <span className="only-hover">Move the cursor · click to freeze. </span>
        Change the position with the slider.
      </p>
    </div>
  );
}
