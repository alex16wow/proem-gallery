import { Link, useSearchParams } from 'react-router-dom';
import { ADDRESS, VISIT_ROUTES, type RouteMode } from '../data/content';
import { downloadText } from '../lib/download';

const nodeName = (node: string) => (/^\d/.test(node) ? `Room ${node}` : node);

/**
 * I-10 «Маршрут визита». Выбор длительности перестраивает шкалу (CSS-переход 300ms),
 * меняет текст, сумму и параметр route для перехода на план. Режим хранится в query.
 */
export function RouteScene() {
  const [params, setParams] = useSearchParams();
  const p = params.get('route') as RouteMode | null;
  const mode: RouteMode = p && VISIT_ROUTES.some((r) => r.id === p) ? p : 'full';
  const route = VISIT_ROUTES.find((r) => r.id === mode)!;
  const timed = route.steps.filter((s) => s.included && s.minutes);
  const sum = timed.reduce((a, s) => a + (s.minutes ?? 0), 0);

  const choose = (id: RouteMode) => {
    const next = new URLSearchParams(params);
    next.set('route', id);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const save = () => {
    const lines = [
      'PROEM — visit notes',
      '',
      'Hours: Tue–Sun, 11:00–19:00. Last entry 18:30. Closed on Mondays.',
      'Free admission.',
      `Address (concept): ${ADDRESS}`,
      '',
      `Route: ${route.label}`,
      route.text,
      '',
      ...route.steps.map((s) =>
        s.included
          ? `— ${nodeName(s.node)}${s.minutes ? `: ${s.minutes} min` : ''}`
          : `— ${nodeName(s.node)}: next time`,
      ),
      '',
      `Total: ${route.total}`,
      '',
      'Quiet hour — first Wednesday of the month, 11:00–12:00.',
      'PROEM is a concept project for an independent gallery; the address is fictional.',
    ];
    downloadText(`proem-visit-${mode}.txt`, lines.join('\r\n'));
  };

  return (
    <div className="route">
      <div className="seg seg--big" role="group" aria-label="How much time do you have">
        {VISIT_ROUTES.map((r) => (
          <button key={r.id} type="button" aria-pressed={r.id === mode} onClick={() => choose(r.id)}>
            {r.label}
          </button>
        ))}
      </div>

      <ol className={`route__line route__line--${mode}`} aria-label="Route sequence">
        {route.steps.map((s, i) => (
          <li
            key={s.node}
            className={`route__node ${s.included ? 'is-in' : 'is-out'}`}
            style={{ flexGrow: s.minutes ?? (s.included ? 10 : 6) }}
          >
            <span className="route__dot" aria-hidden="true" />
            <span className="route__name">{nodeName(s.node)}</span>
            <span className="route__min mono">
              {s.included ? (s.minutes ? `${s.minutes} min` : 'no limit') : 'another time'}
            </span>
            {i < route.steps.length - 1 && <span className="route__seg" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="route__info" aria-live="polite">
        <p className="lead-s">{route.text}</p>
        <p className="route__total mono">
          {route.total}
          {sum > 0 && mode !== 'slow' && <span className="small"> · sum of steps: {sum} min</span>}
        </p>
        <p className="small">Times are a suggestion. No timer will ask you to leave a room.</p>
      </div>

      <div className="route__actions">
        <Link className="btn btn--red" to={`/space?route=${mode}&room=01#plan`}>
          Show the route on the plan
        </Link>
        <button type="button" className="btn btn--line" onClick={save}>
          Save visit notes (.txt)
        </button>
      </div>
    </div>
  );
}
