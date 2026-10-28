import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useNavigationType,
  Link,
} from 'react-router-dom';
import { MotionProvider } from './lib/motion';
import { WorkModalProvider } from './components/WorkModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Exhibitions from './pages/Exhibitions';
import Exhibition from './pages/Exhibition';
import Works from './pages/Works';
import Space from './pages/Space';
import Visit from './pages/Visit';
import './styles.css';

const TITLES: Record<string, string> = {
  '/': 'PROEM — a place to look differently',
  '/exhibitions': 'Exhibitions — PROEM',
  '/exhibitions/between-states': 'Between States — PROEM',
  '/works': 'Works — PROEM',
  '/space': 'Space — PROEM',
  '/visit': 'Visit — PROEM',
};

function Layout() {
  const { pathname, hash } = useLocation();
  const nav = useNavigationType();
  const first = useRef(true);

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'PROEM';
    if (first.current) {
      first.current = false;
      return;
    }
    // При смене страницы фокус переводится на h1, чтобы скринридер и клавиатура начинали с содержимого.
    const h1 = document.querySelector<HTMLElement>('main h1');
    h1?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    if (!hash || nav === 'POP') return;
    const id = decodeURIComponent(hash.slice(1));
    const t = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(t);
  }, [pathname, hash, nav]);

  // Прямое открытие с якорем: изображения выше якоря имеют размеры, поэтому позиция стабильна.
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(), 50);
    }
  }, []);

  return (
    <WorkModalProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </WorkModalProvider>
  );
}

function NotFound() {
  return (
    <section className="page-head wrap">
      <p className="label">404</p>
      <h1 className="h1" tabIndex={-1}>
        There’s no room here.
      </h1>
      <p className="lead-s">This page doesn’t exist. Go back to the home page or choose a section in the menu.</p>
      <Link className="btn btn--red" to="/">
        Home
      </Link>
    </section>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/exhibitions', element: <Exhibitions /> },
        { path: '/exhibitions/between-states', element: <Exhibition /> },
        { path: '/works', element: <Works /> },
        { path: '/space', element: <Space /> },
        { path: '/visit', element: <Visit /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <RouterProvider router={router} />
    </MotionProvider>
  </StrictMode>,
);
