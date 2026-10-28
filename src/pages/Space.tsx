import { Link } from 'react-router-dom';
import { Titr } from '../components/Titr';
import { Img } from '../components/Img';
import { CopyContact } from '../components/CopyContact';
import { PlanMap } from '../scenes/PlanMap';

export default function Space() {
  return (
    <>
      {/* S01 */}
      <section className="space-hero">
        <div className="wrap space-hero__head">
          <p className="label">ONE FLOOR / THREE ROOMS / ONE COURTYARD</p>
          <Titr lines={['Concrete outside.', 'Possibility inside.']} className="h1" />
        </div>
        <figure className="space-hero__photo">
          <Img id="01-exterior-day" priority sizes="100vw" />
          <figcaption className="small wrap">South facade. Entrance from the courtyard.</figcaption>
        </figure>
      </section>

      {/* S02 */}
      <section className="section wrap history" aria-labelledby="hist-title">
        <p className="mono history__year" aria-hidden="true">
          2022
        </p>
        <h2 id="hist-title" className="h2">
          A small place <br />
          with plenty of quiet.
        </h2>
        <div className="history__text">
          <p className="lead-s">
            PROEM opened in 2022 as an independent venue for exhibitions that depend on contact with architecture. We chose a
            simple layout: three connected rooms, a shared lobby and a courtyard in front of the entrance. It is easy to
            tell where you are here, and to go back to a work you want to see again.
          </p>
          <p>
            The concrete keeps the marks of its formwork, the floor reflects light without a mirror shine, and narrow tracks
            let us change the hang. We don’t try to hide the building behind the exhibition. But we don’t ask every new work
            to adapt to its weight either.
          </p>
          <p>
            Instead of a permanent collection — a changing program. Instead of a required route — several ways through the
            same rooms.
          </p>
        </div>
      </section>

      {/* S03 */}
      <section className="section materials" aria-labelledby="mat-title">
        <h2 id="mat-title" className="sr-only">
          Materials
        </h2>
        <div className="wrap materials__grid">
          <article className="mat mat--concrete">
            <figure className="mat__img">
              <Img id="01-exterior-day" sizes="(min-width: 900px) 30vw, 100vw" focal={{ x: 0.82, y: 0.42 }} className="crop-zoom" alt="Detail of a concrete wall with a horizontal formwork pattern." />
              <figcaption className="small">Detail of the facade photo (crop)</figcaption>
            </figure>
            <h3 className="h3">Concrete.</h3>
            <p>A rough surface holds the light and brings out color. It stays in the background, even when it draws attention to itself.</p>
          </article>
          <article className="mat mat--light">
            <figure className="mat__img">
              <Img id="03-lobby" sizes="(min-width: 900px) 40vw, 100vw" />
              <figcaption className="small">The lobby and three openings into the rooms</figcaption>
            </figure>
            <h3 className="h3">Daylight.</h3>
            <p>In the first two rooms it changes gradually. You can find the same work in different states.</p>
          </article>
          <article className="mat mat--empty">
            <h3 className="h3">Empty space.</h3>
            <p>We leave enough distance between works. Each one has its own field of attention.</p>
            <figure className="mat__img mat__img--small">
              <Img id="07-textile-detail" sizes="(min-width: 900px) 16vw, 50vw" />
              <figcaption className="small">Fabric detail from Room 01 — the material of a work, not the wall</figcaption>
            </figure>
          </article>
        </div>
      </section>

      {/* S04 — I-09 */}
      <section id="plan" className="section wrap plan-sec" aria-labelledby="plan-title">
        <div className="split-head">
          <Titr as="h2" id="plan-title" className="h2" lines={['Choose', 'your way in.']} />
          <p>Click a room to see the space and the works.</p>
        </div>
        <PlanMap />
        <details className="raster">
          <summary>Original raster plan</summary>
          <figure>
            <Img id="10-building-plan" sizes="(min-width: 900px) 60vw, 100vw" fit="contain" />
            <figcaption className="small">
              Conceptual diagram. The interactive plan above is rebuilt from the brief’s coordinates; where they differ, it
              takes priority.
            </figcaption>
          </figure>
        </details>
      </section>

      {/* S05 */}
      <section className="yard" aria-labelledby="yard-title">
        <div className="yard__photo">
          <Img id="02-exterior-dusk" sizes="100vw" />
        </div>
        <div className="wrap yard__body">
          <h2 id="yard-title" className="h2">
            A pause is <br />
            part of the visit too.
          </h2>
          <p>
            In the courtyard you can wait for friends, talk about the exhibition or sit for a while before heading off. The
            entrance is in a deep opening in the middle of the facade; the bench is on the right, the birch on the left.
          </p>
          <Link className="arrow-link arrow-link--inv" to="/visit#access">
            Accessibility and conditions ↗
          </Link>
        </div>
      </section>

      {/* S06 */}
      <section className="section wrap collab" aria-labelledby="collab-title">
        <h2 id="collab-title" className="h2">
          Have an idea <br />
          for this place?
        </h2>
        <div>
          <p>
            We are interested in exhibitions and small events in which the space becomes a participant. A short description,
            a few images and a sense of scale are enough for a proposal. The venue’s contact will be added when a real project
            launches.
          </p>
          <CopyContact />
        </div>
      </section>
    </>
  );
}
