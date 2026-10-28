import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroPortal } from '../scenes/HeroPortal';
import { Assembly } from '../scenes/Assembly';
import { ColorPanels } from '../scenes/ColorPanels';
import { Img } from '../components/Img';
import { WorkCard } from '../components/WorkCard';
import { EventDrawer, IcsButton } from '../components/Events';
import { Titr } from '../components/Titr';
import { EVENT_BY_ID, WORK_BY_ID } from '../data/content';

const HOME_WORKS = ['work-fabric', 'work-acrylic', 'work-ceramics', 'work-paper'];

export default function Home() {
  const [drawer, setDrawer] = useState<string | null>(null);
  return (
    <>
      <HeroPortal />

      {/* H02 */}
      <section id="about" className="section wrap about">
        <p className="label about__label">01 / ABOUT</p>
        <p className="lead about__lead">
          We show works <br className="br-d" />
          you want to stay <br className="br-d" />
          beside a little longer.
        </p>
        <div className="about__text">
          <p>
            PROEM is a small independent gallery of contemporary art. There are three rooms, one courtyard and enough time
            to look more closely. We work with color, light, objects and space — with everything that changes the habitual
            way of seeing.
          </p>
          <p>
            Heavy walls do not dictate the character of the art. Inside the concrete building there is room for
            transparent fabrics, fragile paper, bright ceramics and almost invisible lines of light.
          </p>
          <Link className="arrow-link" to="/space">
            How the space works ↗
          </Link>
        </div>
      </section>

      {/* H03 — I-02 */}
      <Assembly />

      {/* H04 — I-03 */}
      <section className="section study" aria-labelledby="study-title">
        <div className="wrap study__grid">
          <div className="study__head">
            <p className="label">DIGITAL STUDY / 01</p>
            <Titr as="h2" className="h2" id="study-title" lines={['Color', 'takes up space.']} />
            <p>
              Shift the transparent planes. Watch how the overlaps change and how many new colors fit between the two you
              started with.
            </p>
            <figure className="study__doc">
              <Img id="05-room02-acrylic" sizes="240px" />
              <figcaption className="small">Documentation: Five Mismatches, Room 02</figcaption>
            </figure>
          </div>
          <ColorPanels />
        </div>
      </section>

      {/* H05 */}
      <section className="section wrap home-works" aria-labelledby="works-title">
        <div className="home-works__head">
          <h2 id="works-title" className="h2">
            Not just looking. <br />
            Noticing.
          </h2>
          <Link className="arrow-link" to="/works?collection=space">
            All works ↗
          </Link>
        </div>
        <div className="home-works__grid">
          {HOME_WORKS.map((id, i) => (
            <div key={id} className={`home-works__item home-works__item--${i + 1}`}>
              <WorkCard work={WORK_BY_ID[id]} list={HOME_WORKS} sizes="(min-width: 900px) 40vw, 100vw" />
              <p className="home-works__text">{WORK_BY_ID[id].hoverText}</p>
            </div>
          ))}
        </div>
      </section>

      {/* H06 */}
      <section className="section wrap next-event" aria-labelledby="event-title-home">
        <p className="label">PROGRAM</p>
        <div className="next-event__grid">
          <p className="next-event__date">
            31 October <span className="mono">/ 16:00</span>
          </p>
          <div>
            <h2 id="event-title-home" className="h2">
              How to look <br />
              at the transparent
            </h2>
            <p>
              A walking conversation through the exhibition. We will trace how fabric lets light through, how acrylic
              colors a shadow, and how empty space connects separate objects. No preparation needed.
            </p>
            <p className="meta-line mono">45 minutes · up to 12 people · free admission</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setDrawer('E01')} aria-haspopup="dialog">
                About the event
              </button>
              <IcsButton event={EVENT_BY_ID.E01} />
              <Link className="arrow-link" to="/exhibitions#events">
                Full program
              </Link>
            </div>
          </div>
        </div>
        <EventDrawer id={drawer} onClose={() => setDrawer(null)} />
      </section>

      {/* H07 */}
      <section className="invite" aria-labelledby="invite-title">
        <div className="invite__photo">
          <Img id="02-exterior-dusk" sizes="100vw" />
        </div>
        <div className="invite__body wrap">
          <h2 id="invite-title" className="h1 invite__title">
            Drop in <br />
            for no reason.
          </h2>
          <div className="invite__text">
            <p>
              You don’t need to know about art to walk into a gallery. You can start with one room, pick one work, or
              simply spend a little time in a different kind of space.
            </p>
            <p className="mono">Tue–Sun, 11:00–19:00. Last entry 18:30. Free admission.</p>
            <Link className="btn btn--red" to="/visit">
              Plan your visit ↗
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
