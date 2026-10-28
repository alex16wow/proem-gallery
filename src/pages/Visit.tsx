import { Link } from 'react-router-dom';
import { Titr } from '../components/Titr';
import { Img } from '../components/Img';
import { CopyContact } from '../components/CopyContact';
import { RouteScene } from '../scenes/RouteScene';
import { ADDRESS, FAQ } from '../data/content';

export default function Visit() {
  return (
    <>
      {/* V01 */}
      <section className="visit-hero wrap">
        <div className="visit-hero__head">
          <p className="label label--red">FREE ADMISSION</p>
          <Titr lines={['Leave yourself', 'time to look.']} className="h1" />
          <p className="lead-s">Come for an hour or start with a single room. No ticket or preparation needed.</p>
        </div>
        <dl className="hours">
          <div>
            <dt>Tue–Sun</dt>
            <dd>11:00—19:00</dd>
          </div>
          <div>
            <dt>Monday</dt>
            <dd>closed</dd>
          </div>
          <div>
            <dt>Last entry</dt>
            <dd>18:30</dd>
          </div>
          <div>
            <dt>Concept address</dt>
            <dd className="hours__addr">{ADDRESS}</dd>
          </div>
        </dl>
        <figure className="visit-hero__photo">
          <Img id="01-exterior-day" priority sizes="(min-width: 900px) 50vw, 100vw" />
        </figure>
        <div className="btn-row visit-hero__ctas">
          <a className="btn btn--red" href="#route">
            Choose a route ↓
          </a>
          <a className="arrow-link" href="#access">
            Accessibility
          </a>
        </div>
      </section>

      {/* V02 — I-10 */}
      <section id="route" className="section dark" aria-labelledby="route-title">
        <div className="wrap">
          <h2 id="route-title" className="h2">
            How much time <br />
            do you have?
          </h2>
          <RouteScene />
        </div>
      </section>

      {/* V03 */}
      <section className="section wrap find" aria-labelledby="find-title">
        <div>
          <h2 id="find-title" className="h2">
            Through the courtyard. <br />
            Straight to the light.
          </h2>
          <p>
            The entrance is in the middle of the blank concrete facade. Look for the birch to the left of the opening and
            the long bench to the right. The glass door leads straight into the shared lobby.
          </p>
        </div>
        <figure className="site-plan">
          <svg viewBox="0 0 320 240" role="img" aria-label="Site plan: the building at the top, the entrance in the middle of the south facade, a birch on the left, a bench on the right, a path across the courtyard.">
            <rect className="sp__ground" x="0" y="0" width="320" height="240" />
            <rect className="sp__building" x="40" y="20" width="240" height="110" />
            <text className="sp__label" x="160" y="80" textAnchor="middle">
              PROEM
            </text>
            <rect className="sp__door" x="145" y="122" width="30" height="12" />
            <path className="sp__path" d="M160 236 V140" />
            <circle className="sp__tree" cx="100" cy="170" r="16" />
            <text className="sp__small" x="100" y="200" textAnchor="middle">
              birch
            </text>
            <rect className="sp__bench" x="200" y="164" width="60" height="10" />
            <text className="sp__small" x="230" y="190" textAnchor="middle">
              bench
            </text>
            <text className="sp__small" x="174" y="226">
              entrance ↑
            </text>
          </svg>
          <figcaption className="small">Site diagram; the street address will be confirmed.</figcaption>
        </figure>
      </section>

      {/* V04 */}
      <section id="access" className="section wrap access" aria-labelledby="access-title">
        <h2 id="access-title" className="h2">
          A comfortable visit <br />
          starts with information.
        </h2>
        <div className="access__text">
          <p className="lead-s">
            All rooms are on one level. The concept layout includes a step-free entrance and an accessible restroom on the
            right side of the lobby. The passages between rooms are wide and straight; you can take a chair from the desk.
          </p>
          <p>
            Room 03 has dimmed light. The current installation uses no flashes or strobe. If you prefer steady lighting, come
            during the quiet hour: the first Wednesday of the month, 11:00–12:00.
          </p>
          <details className="note">
            <summary>About the layout</summary>
            <p className="small">
              For a real venue, passage widths, access and assistance arrangements need to be confirmed separately. This
              concept site shows the intended scenario, not the results of a technical survey of a building.
            </p>
          </details>
          <Link className="arrow-link" to="/space?room=lobby#plan">
            The lobby on the plan ↗
          </Link>
        </div>
      </section>

      {/* V05 */}
      <section className="section wrap faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="h2">
          FAQ
        </h2>
        <div className="faq__list">
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq__item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* V06 */}
      <section className="closing" aria-labelledby="close-title">
        <div className="closing__photo">
          <Img id="03-lobby" sizes="100vw" />
        </div>
        <div className="wrap closing__body">
          <h2 id="close-title" className="h1">
            See you <br />
            at PROEM.
          </h2>
          <p className="lead-s">Three rooms. One courtyard. A few new ways of looking.</p>
          <nav className="closing__links" aria-label="Next">
            <Link to="/exhibitions/between-states">Current exhibition</Link>
            <Link to="/exhibitions#events">Upcoming events</Link>
            <a href="#sources" onClick={() => document.querySelector<HTMLDetailsElement>('#sources')?.setAttribute('open', '')}>
              About the images
            </a>
          </nav>
          <CopyContact label="Copy address" />
        </div>
      </section>
    </>
  );
}
