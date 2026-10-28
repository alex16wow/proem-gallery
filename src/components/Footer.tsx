import { Link } from 'react-router-dom';
import { ADDRESS, CABINET_WORKS, HOURS } from '../data/content';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top grid">
        <p className="site-footer__claim">Come and see it differently</p>
        <div className="site-footer__info">
          <p className="label">A place to look differently</p>
          <p>{HOURS}</p>
          <p>{ADDRESS}</p>
          <p className="small">Address and contact are for the mock-up</p>
        </div>
        <nav className="site-footer__nav" aria-label="Sections">
          <Link to="/exhibitions">Exhibitions</Link>
          <Link to="/exhibitions#events">Events</Link>
          <Link to="/works">Works</Link>
          <Link to="/space">Space</Link>
          <Link to="/visit">Visit</Link>
        </nav>
      </div>
      <details className="sources" id="sources">
        <summary>About the images</summary>
        <div className="sources__body">
          <p>
            Architecture and contemporary concepts are AI-generated images. Historical reproductions are from the Cleveland
            Museum of Art, CC0. Details are in each card.
          </p>
          <p className="small">
            The reproductions are published by the museum under open access (
            <a href="https://www.clevelandart.org/open-access" target="_blank" rel="noopener noreferrer">
              Open Access
            </a>
            ,{' '}
            <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">
              CC0
            </a>
            ). They do not imply that the originals are at PROEM or any museum partnership.
          </p>
          <ul className="sources__list">
            {CABINET_WORKS.map((w) => (
              <li key={w.id}>
                <a href={w.sourceUrl!} target="_blank" rel="noopener noreferrer">
                  {w.title}
                </a>{' '}
                — {w.artist.split(' (')[0]}, {w.year}. {w.accession}
              </li>
            ))}
          </ul>
          <p className="small">
            Typefaces: Jost and Overpass Mono (SIL Open Font License) — open substitutes for the intended ITC Avant Garde
            Gothic and Interstate.
          </p>
        </div>
      </details>
      <div className="site-footer__bottom">
        <span>PROEM is a concept project for an independent gallery</span>
        <span className="mono">PROEM · 2026</span>
      </div>
    </footer>
  );
}
