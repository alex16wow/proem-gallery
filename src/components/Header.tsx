import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Dialog } from './Dialog';
import { useMotion } from '../lib/motion';

const NAV = [
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/works', label: 'Works' },
  { to: '/space', label: 'Space' },
  { to: '/visit', label: 'Visit' },
];

export function Header() {
  const { pathname } = useLocation();
  const { reduced, toggle } = useMotion();
  const [menu, setMenu] = useState(false);
  const [top, setTop] = useState(true);
  const overHero = pathname === '/';

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    const on = () => setTop(window.scrollY < 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname]);

  const motionBtn = (
    <button type="button" className="motion-toggle" aria-pressed={!reduced} onClick={toggle}>
      {reduced ? 'Motion: off' : 'Motion: on'}
    </button>
  );

  return (
    <header className={`site-header ${overHero && top ? 'is-over' : ''} ${top ? '' : 'is-scrolled'}`}>
      <Link to="/" className="logo" aria-label="PROEM — home">
        <span className="logo__sq" aria-hidden="true" />
        <span className="logo__name">PROEM</span>
        <span className="logo__sub">independent gallery</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to}>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="site-header__tools">{motionBtn}</div>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={menu}
        aria-controls="mobile-menu"
        onClick={() => setMenu(true)}
      >
        Menu
      </button>
      <Dialog open={menu} onClose={() => setMenu(false)} labelledBy="menu-title" variant="menu">
        <div id="mobile-menu" className="mobile-menu">
          <div className="mobile-menu__bar">
            <span id="menu-title" className="label">
              PROEM / navigation
            </span>
            <button type="button" className="btn-text" onClick={() => setMenu(false)} data-autofocus aria-expanded="true">
              Close menu
            </button>
          </div>
          <nav aria-label="Menu">
            <NavLink to="/" end>
              Home
            </NavLink>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <p className="small">Tue–Sun, 11:00–19:00 · Free admission</p>
          {motionBtn}
        </div>
      </Dialog>
    </header>
  );
}
