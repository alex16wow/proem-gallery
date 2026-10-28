import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Titr } from '../components/Titr';
import { Img } from '../components/Img';
import { WorkCard } from '../components/WorkCard';
import { EventList } from '../components/Events';
import { useWorkModal } from '../components/WorkModal';
import { LightStudy } from '../scenes/LightStudy';
import { ColorPanels } from '../scenes/ColorPanels';
import { Connections } from '../scenes/Connections';
import { SPACE_WORKS, WORK_BY_ID, workNumber } from '../data/content';

const SPACE_LIST = SPACE_WORKS.map((w) => w.id);
const ROOM2 = [
  { id: 'work-acrylic', tag: 'INTERSECTION' },
  { id: 'work-ceramics', tag: 'SCALE' },
  { id: 'work-paper', tag: 'SURFACE' },
];
const LINKS = ROOM2.map((r) => ({ key: r.id, from: 'room2-photo', to: `num-${r.id}` }));
const ONLINE = ['cma-143278', 'cma-109638', 'cma-138684'];

export default function Exhibition() {
  const { open } = useWorkModal();
  const room2 = useRef<HTMLElement>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  return (
    <>
      {/* X01 */}
      <section className="ex-hero">
        <div className="ex-hero__head wrap">
          <nav className="crumbs small" aria-label="Breadcrumb">
            <Link to="/exhibitions">Exhibitions</Link> / <Link to="/exhibitions?status=current">Now</Link>
          </nav>
          <p className="label">12 SEP — 22 NOV 2026</p>
          <Titr lines={['Between', 'States']} className="h1" />
          <p className="lead ex-hero__intro">Fabric, color, light and objects that change along with the way you look.</p>
          <dl className="ex-hero__meta mono">
            <div>
              <dt className="sr-only">Format</dt>
              <dd>Group exhibition concept</dd>
            </div>
            <div>
              <dt className="sr-only">By</dt>
              <dd>PROEM Studio</dd>
            </div>
            <div>
              <dt className="sr-only">Rooms</dt>
              <dd>Rooms 01—03</dd>
            </div>
            <div>
              <dt className="sr-only">Admission</dt>
              <dd>Free admission</dd>
            </div>
          </dl>
          <div className="btn-row">
            <a className="btn btn--red" href="#room-01">
              Walk through the rooms ↓
            </a>
            <Link className="btn btn--line" to="/visit">
              Plan your visit
            </Link>
          </div>
        </div>
        <div className="ex-hero__photo">
          <Img id="04-room01-fabric" priority sizes="100vw" focal={{ x: 0.6, y: 0.5 }} />
        </div>
      </section>

      {/* X02 */}
      <section className="section wrap curator" aria-labelledby="cur-title">
        <h2 id="cur-title" className="h2 curator__title">
          Material <br />
          isn’t everything.
        </h2>
        <div className="curator__text">
          <p className="lead-s">
            We are used to recognizing an object by its material: glass is transparent, fabric is soft, concrete is heavy.
            But in the gallery these definitions quickly stop working. Fabric gathers light and becomes a colored wall.
            Acrylic leaves an image on the floor that does not exist on its surface. White paper turns out to be more
            complex than a shadow.
          </p>
          <p>
            “Between States” invites you to see a work as an event between an object, a space and a viewer. Sometimes it
            is enough to take a step to the side. Sometimes you need to wait for the light to change. There is no
            required reading order and no right answer.
          </p>
          <p>
            The route begins with air and daylight, passes through colored surfaces and small objects, and ends in a room
            where a single line sets the boundary. The five works form one exhibition, but each allows its own pace.
          </p>
        </div>
      </section>

      {/* X03 */}
      <section id="room-01" className="section room room--01" aria-labelledby="r1-title">
        <div className="wrap room__head">
          <p className="room__num mono">01 / DAYLIGHT</p>
          <Titr as="h2" id="r1-title" className="h2" lines={['What holds itself up', 'on almost nothing.']} />
        </div>
        <div className="wrap room1__grid">
          <WorkCard
            work={WORK_BY_ID['work-fabric']}
            list={SPACE_LIST}
            sizes="(min-width: 900px) 62vw, 100vw"
            className="room1__main"
          />
          <figure className="room1__detail">
            <Img id="07-textile-detail" sizes="(min-width: 900px) 26vw, 60vw" />
            <figcaption className="small">
              Look at the edge of the panel: there the dense surface turns back into separate threads.
            </figcaption>
          </figure>
          <div className="room1__text">
            <p>
              Translucent panels fill the room without closing it off. Through the red, milk-white and blue layers you can
              still see the walls and other visitors. Air makes the surface move, and the north light assembles a different
              combination of colors every time.
            </p>
            <p className="mono small">Air Holds Color, 2026 · PROEM Studio · concept</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => open('work-fabric', SPACE_LIST)}>
                More about the work
              </button>
              <Link className="arrow-link" to="/space?room=01#plan">
                Room 01 on the plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* X04 — I-07 */}
      <section ref={room2} id="room-02" className="section room room--02" aria-labelledby="r2-title">
        <Connections root={room2} links={LINKS} active={activeLink} />
        <div className="wrap room__head room2__head">
          <p className="room__num mono">02 / COLOR AND OBJECT</p>
          <Titr as="h2" id="r2-title" className="h2" lines={['On their own.', 'Together — different.']} />
          <p className="room2__intro">
            Transparent acrylic planes stand in the center of the room. Their colors overlap on the floor, the walls and
            each other. Nearby are seven ceramic forms, each with its own size, surface and character. A paper relief on the
            wall links these different objects through a shared theme of light.
          </p>
        </div>
        <div className="wrap">
          <figure className="room2__photo" data-node="room2-photo">
            <Img id="05-room02-acrylic" sizes="(min-width: 900px) 50vw, 100vw" />
          </figure>
        </div>
        <ol className="wrap room2__cards">
          {ROOM2.map(({ id, tag }) => {
            const w = WORK_BY_ID[id];
            return (
              <li
                key={id}
                className={`room2__card ${activeLink === id ? 'is-active' : ''}`}
                onPointerEnter={() => setActiveLink(id)}
                onPointerLeave={() => setActiveLink(null)}
                onFocusCapture={() => setActiveLink(id)}
                onBlurCapture={() => setActiveLink(null)}
              >
                <p className="room2__tag">
                  <span className="room2__n mono" data-node={`num-${id}`}>
                    {workNumber(w)}
                  </span>
                  <span className="label">{tag}</span>
                </p>
                <WorkCard work={w} list={SPACE_LIST} sizes="(min-width: 900px) 30vw, 100vw" caption={false} />
                <h3 className="room2__title">
                  {w.title}, {w.year}
                </h3>
                <p className="small">{w.material}</p>
                <p>{w.description}</p>
              </li>
            );
          })}
        </ol>
        <div className="wrap room2__study" id="color-study">
          <div>
            <p className="label">DIGITAL STUDY / 01 · compact</p>
            <h3 className="h3">Explore the colored planes</h3>
            <p className="small">The numbers and lines above the cards are a local page composition, not object dimensions.</p>
          </div>
          <ColorPanels compact />
        </div>
      </section>

      {/* X05 */}
      <section id="room-03" className="section room room--03 dark" aria-labelledby="r3-title">
        <div className="wrap room3__grid">
          <div className="room__head">
            <p className="room__num mono">03 / LIGHT ROOM</p>
            <Titr as="h2" id="r3-title" className="h2" lines={['A room', 'made of one line.']} />
            <p>
              The red horizontal is not a wall, but it makes you feel a boundary. The blue field changes the depth, and the
              white vertical restores the scale of the body. There are almost no objects here — which makes it especially
              clear how much work the eye is doing.
            </p>
            <p className="mono small">Line of Presence, 2026 · Light installation with no flashes or strobe</p>
            <button type="button" className="btn btn--inv" onClick={() => open('work-light', SPACE_LIST)}>
              Details
            </button>
          </div>
          <WorkCard work={WORK_BY_ID['work-light']} list={SPACE_LIST} sizes="(min-width: 900px) 58vw, 100vw" caption={false} />
        </div>
      </section>

      {/* X06 — I-05 */}
      <section id="light-study" className="section dark light-sec" aria-labelledby="ls-title">
        <div className="wrap light-sec__grid">
          <div className="light-sec__head">
            <p className="label">DIGITAL STUDY / 02</p>
            <h2 id="ls-title" className="h2">
              Set your own <br />
              distance.
            </h2>
            <p>
              Move the source. Change the width of the light band. There is no final picture here — only a state you can
              hold for a few seconds.
            </p>
          </div>
          <LightStudy />
        </div>
      </section>

      {/* X07 */}
      <section className="section wrap" aria-labelledby="talk-title">
        <div className="split-head">
          <h2 id="talk-title" className="h2">
            Stay <br />
            for a talk.
          </h2>
          <Link className="arrow-link" to="/exhibitions#events">
            Full program
          </Link>
        </div>
        <EventList />
      </section>

      {/* X08 */}
      <section className="section wrap outro" aria-labelledby="outro-title">
        <div className="outro__text">
          <h2 id="outro-title" className="h2">
            You can see the exhibition <br />
            in a single visit.
          </h2>
          <p>
            Allow 45–60 minutes. Start with Room 01 or with a work that has already caught your interest. There are chairs
            and a printed map in the lobby; the team will help you find your way.
          </p>
          <Link className="btn btn--red" to="/visit">
            Hours and visiting conditions ↗
          </Link>
        </div>
        <div className="outro__online">
          <p className="label">Continue online</p>
          <div className="outro__row">
            {ONLINE.map((id) => (
              <WorkCard key={id} work={WORK_BY_ID[id]} list={ONLINE} sizes="(min-width: 900px) 14vw, 33vw" />
            ))}
          </div>
          <p className="small">
            Reproductions from the Cleveland Museum of Art open collection. The originals are not part of the current
            exhibition.
          </p>
        </div>
      </section>
    </>
  );
}
