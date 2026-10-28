import { useEffect, useRef, useState } from 'react';
import { useActive, useMotion } from '../lib/motion';

const COLORS = {
  white: { label: 'white', rgb: [250, 248, 238] },
  red: { label: 'red', rgb: [235, 60, 48] },
  blue: { label: 'blue', rgb: [52, 92, 255] },
} as const;
type ColorKey = keyof typeof COLORS;

const DEFAULTS = { pos: 48, width: 32, color: 'white' as ColorKey };
const TRAIL_MS = 700;
const RING = 48;

/**
 * I-05 «Световой прибор». Canvas2D, режим 'lighter'. Источник по x (0..100), наклон по y (±20°),
 * ширина поля и цвет — DOM-контролы. След — ring buffer последних положений с затуханием ~700ms,
 * поле каждый кадр очищается полностью, поэтому изображение не «выгорает» и не темнеет до нуля.
 * Цикл работает, только пока сцена видна и не заморожена; reduced — один кадр на изменение.
 */
export function LightStudy() {
  const { reduced } = useMotion();
  const field = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useActive(field);
  const [pos, setPos] = useState(DEFAULTS.pos);
  const [width, setWidth] = useState(DEFAULTS.width);
  const [color, setColor] = useState<ColorKey>(DEFAULTS.color);
  const [tilt, setTilt] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [note, setNote] = useState('');
  const [noCanvas, setNoCanvas] = useState(false);

  const st = useRef({ pos, width, color, tilt, touched, x: pos, trail: [] as { x: number; a: number; t: number }[], size: { w: 0, h: 0, dpr: 1 } });
  st.current.pos = pos;
  st.current.width = width;
  st.current.color = color;
  st.current.tilt = tilt;
  st.current.touched = touched;

  const draw = (now: number, withTrail: boolean) => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { w, h, dpr } = st.current.size;
    if (!w) return;
    const s = st.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#060706';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const [r, g, b] = COLORS[s.color].rgb;

    const beam = (xPct: number, angle: number, alpha: number) => {
      const x = (xPct / 100) * w;
      const bw = Math.max(12, (s.width / 100) * w);
      ctx.save();
      ctx.translate(x, h / 2);
      ctx.rotate((angle * Math.PI) / 180);
      const grad = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${0.42 * alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(-bw / 2, -h, bw, h * 2);
      // ядро — тонкая вертикаль
      ctx.fillStyle = `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${0.95 * alpha})`;
      ctx.fillRect(-1.5, -h, 3, h * 2);
      ctx.restore();
    };

    if (withTrail) {
      for (const p of s.trail) {
        const age = now - p.t;
        if (age > TRAIL_MS) continue;
        beam(p.x, p.a, (1 - age / TRAIL_MS) * 0.18);
      }
    }
    beam(s.x, s.tilt, 1);
    // пол: отражение
    const floor = ctx.createLinearGradient(0, h * 0.78, 0, h);
    floor.addColorStop(0, `rgba(${r},${g},${b},0)`);
    floor.addColorStop(1, `rgba(${r},${g},${b},0.12)`);
    ctx.fillStyle = floor;
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
  };

  // Размер backing store по ResizeObserver, DPR ограничен 2.
  useEffect(() => {
    const c = canvas.current!;
    if (!c.getContext('2d')) {
      setNoCanvas(true);
      return;
    }
    const ro = new ResizeObserver(([e]) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = e.contentRect.width;
      const h = e.contentRect.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      st.current.size = { w, h, dpr };
      draw(performance.now(), false);
    });
    ro.observe(c);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loopOn = !reduced && !frozen && active && !noCanvas;

  // render-loop
  useEffect(() => {
    if (!loopOn) return;
    let raf = 0;
    const t0 = performance.now();
    let lastPush = 0;
    const loop = (t: number) => {
      const s = st.current;
      const target = s.touched ? s.pos : DEFAULTS.pos + Math.sin(((t - t0) / 12000) * Math.PI * 2) * 8;
      const prev = s.x;
      s.x += (target - s.x) * 0.18;
      if (t - lastPush > 16 && Math.abs(prev - s.x) > 0.05) {
        s.trail.push({ x: s.x, a: s.tilt, t });
        if (s.trail.length > RING) s.trail.shift();
        lastPush = t;
      }
      draw(t, true);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopOn]);

  // Без цикла (freeze, reduced, вне экрана) — один кадр на изменение параметров.
  useEffect(() => {
    if (loopOn) return;
    st.current.x = pos;
    st.current.trail = [];
    draw(performance.now(), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopOn, pos, width, color, tilt]);

  const input = () => {
    if (!touched) setTouched(true);
    if (note) setNote('');
  };

  const onPointer = (e: React.PointerEvent) => {
    if (frozen) return;
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    const r = field.current!.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    input();
    setPos(Math.round(nx * 100));
    if (e.pointerType !== 'touch') setTilt(Math.round((ny * 2 - 1) * 20));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      input();
      setPos((p) => Math.min(100, Math.max(0, p + (e.key === 'ArrowLeft' ? -step : step))));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      input();
      setWidth((w) => Math.min(100, Math.max(4, w + (e.key === 'ArrowDown' ? -step : step))));
    } else if (e.key === ' ') {
      e.preventDefault();
      setFrozen((f) => !f);
    }
  };

  const reset = () => {
    setPos(DEFAULTS.pos);
    setWidth(DEFAULTS.width);
    setColor(DEFAULTS.color);
    setTilt(0);
    setFrozen(false);
    setTouched(false);
    st.current.trail = [];
    setNote('Settings reset');
  };

  const shownPos = touched || !loopOn ? pos : DEFAULTS.pos;
  const result = `Source: ${shownPos}% · width: ${width}% · color: ${COLORS[color].label}`;
  const [r, g, b] = COLORS[color].rgb;

  return (
    <div className="light">
      <div
        ref={field}
        className={`light__field ${frozen ? 'is-frozen' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Light study field"
        aria-describedby="light-hint light-result"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onKeyDown={onKey}
      >
        <canvas ref={canvas} className="light__canvas" aria-hidden="true" />
        {noCanvas && (
          <div
            className="light__fallback"
            aria-hidden="true"
            style={{
              ['--x' as string]: `${pos}%`,
              ['--w' as string]: `${width}%`,
              ['--c' as string]: `rgb(${r},${g},${b})`,
            }}
          />
        )}
        <span className="light__tick light__tick--tl mono" aria-hidden="true">
          x 000
        </span>
        <span className="light__tick light__tick--tr mono" aria-hidden="true">
          x 100
        </span>
        <span className="light__tick light__tick--bl mono" aria-hidden="true">
          θ {tilt > 0 ? '+' : ''}
          {tilt}°
        </span>
        <span className="light__tick light__tick--br mono" aria-hidden="true">
          {frozen ? 'FIX' : 'LIVE'} · w {width}
        </span>
      </div>

      <div className="light__controls">
        <label className="range">
          <span className="label">Position</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => {
              input();
              setPos(Number(e.target.value));
            }}
          />
          <span className="mono range__val">{pos}</span>
        </label>
        <label className="range">
          <span className="label">Width</span>
          <input
            type="range"
            min={4}
            max={100}
            value={width}
            onChange={(e) => {
              input();
              setWidth(Number(e.target.value));
            }}
          />
          <span className="mono range__val">{width}</span>
        </label>
        <fieldset className="radios">
          <legend className="label">Light</legend>
          {(Object.keys(COLORS) as ColorKey[]).map((k) => (
            <label key={k} className={`radio radio--${k}`}>
              <input
                type="radio"
                name="light-color"
                value={k}
                checked={color === k}
                onChange={() => {
                  input();
                  setColor(k);
                }}
              />
              <span>{COLORS[k].label}</span>
            </label>
          ))}
        </fieldset>
        <div className="light__buttons">
          <button type="button" className="btn btn--inv" aria-pressed={frozen} onClick={() => setFrozen((f) => !f)}>
            {frozen ? 'Resume' : 'Freeze'}
          </button>
          <button type="button" className="btn-text btn-text--inv" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <p id="light-hint" className="small light__hint">
        Arrow keys change the position; Space freezes the composition while the field is focused.
      </p>
      <p id="light-result" className="light__result mono" aria-live="polite">
        {result}
        {frozen ? ' · Paused' : ''}
        {note ? ` · ${note}` : ''}
      </p>
    </div>
  );
}
