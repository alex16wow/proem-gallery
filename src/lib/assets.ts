import assetsJson from '../data/assets.json';

export interface Asset {
  id: string;
  title: string;
  kind: string;
  alt: string;
  fit: 'cover' | 'contain';
  focalPoint: { x: number; y: number };
  source: string;
  rights: string;
  generated: boolean;
  width: number;
  height: number;
}

const BASE = import.meta.env.BASE_URL;

export const ASSETS: Record<string, Asset> = Object.fromEntries(
  (assetsJson as unknown as Asset[]).map((a) => [a.id, a]),
);

function scaled(a: Asset, long: number) {
  const s = Math.min(1, long / Math.max(a.width, a.height));
  return { w: Math.round(a.width * s), h: Math.round(a.height * s) };
}

/** Пути к деривативам: web — до 1600px, thumbs — до 480px по длинной стороне. */
export function assetUrls(id: string) {
  const a = ASSETS[id];
  if (!a) throw new Error(`Unknown asset ${id}`);
  const web = scaled(a, 1600);
  const thumb = scaled(a, 480);
  return {
    asset: a,
    web: `${BASE}assets/web/${id}.jpg`,
    thumb: `${BASE}assets/thumbs/${id}.jpg`,
    webW: web.w,
    webH: web.h,
    thumbW: thumb.w,
    srcSet: `${BASE}assets/thumbs/${id}.jpg ${thumb.w}w, ${BASE}assets/web/${id}.jpg ${web.w}w`,
  };
}

export const url = (path: string) => `${BASE}${path.replace(/^\//, '')}`;
