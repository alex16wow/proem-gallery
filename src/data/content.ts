import worksJson from './works.json';
import siteJson from './site.json';

export interface Work {
  id: string;
  title: string;
  artist: string;
  year: string;
  material: string;
  dimensions: string | null;
  category: string;
  images: string[];
  room: string | null;
  hoverText: string;
  description: string;
  collection: 'space' | 'cabinet';
  sourceUrl: string | null;
  rights: string;
  credit?: string;
  museum?: string;
  accession?: string;
  isFictional: boolean;
}

export const WORKS = worksJson as Work[];
export const WORK_BY_ID: Record<string, Work> = Object.fromEntries(WORKS.map((w) => [w.id, w]));
export const SPACE_WORKS = WORKS.filter((w) => w.collection === 'space');
export const CABINET_WORKS = WORKS.filter((w) => w.collection === 'cabinet');

/** Work number within its collection: 01..05 and 01..16 */
export function workNumber(w: Work) {
  const list = w.collection === 'space' ? SPACE_WORKS : CABINET_WORKS;
  return String(list.indexOf(w) + 1).padStart(2, '0');
}

export const SITE = siteJson;
export const ADDRESS = 'Block 04 · 12 Embankment';
export const ADDRESS_ICS = 'PROEM, Block 04, 12 Embankment (concept address)';
export const EMAIL = 'hello@proem.example';
export const HOURS = 'Tue–Sun, 11:00–19:00 · Free admission';

export type ExStatus = 'current' | 'upcoming' | 'archive';

export interface Exhibition {
  id: string;
  status: ExStatus;
  statusLabel: string;
  title: string;
  dates: string;
  start: string;
  materials: string;
  short: string;
  full?: string[];
  images: string[];
  href?: string;
}

export const STATUS_LABEL: Record<ExStatus, string> = { current: 'Now', upcoming: 'Upcoming', archive: 'Archive' };

export const EXHIBITIONS: Exhibition[] = [
  {
    id: 'EX01',
    status: 'current',
    statusLabel: 'Now',
    title: 'Between States',
    dates: '12 Sep — 22 Nov 2026',
    start: '2026-09-12',
    materials: 'Fabric · acrylic · light · ceramics · paper',
    short: 'Five ways to notice that a material changes along with the light, the distance and where you stand in the room.',
    images: ['04-room01-fabric'],
    href: '/exhibitions/between-states',
  },
  {
    id: 'EX02',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    title: 'Color Takes Up Space',
    dates: '5 Dec 2026 — 31 Jan 2027',
    start: '2026-12-05',
    materials: 'Objects · transparent materials',
    short:
      'A new assembly of colored planes: from a small ceramic form to a translucent wall. We treat color as a physical presence — it has thickness, weight and a shadow of its own.',
    full: [
      'This winter PROEM becomes a laboratory of intersections. The rooms will fill with transparent surfaces and objects whose color cannot be separated from the light. Visitors will be able to change their point of view and find new combinations in objects they already know.',
      'The exhibition continues the study of materials begun by the autumn program, but shifts attention from the edge of an object to the way colors sit side by side. The full list of works will be published closer to the opening.',
    ],
    images: ['05-room02-acrylic', '08-ceramic-ensemble'],
  },
  {
    id: 'EX03',
    status: 'archive',
    statusLabel: 'Archive',
    title: 'Folds of Silence',
    dates: '18 Apr — 21 Jun 2026',
    start: '2026-04-18',
    materials: 'Paper · textile · relief',
    short: 'What remains of a movement once it has stopped? An exhibition about the fold, the crease and the trace of touch.',
    full: [
      'Sheets of paper and strips of fabric formed a temporary architecture inside the concrete rooms. Its walls neither protected nor divided: they held the light and marked the movement of air.',
      'We asked visitors to slow down and look at a work not only from the front but from the side, where the surface turns into a thin line.',
      'The archive keeps the visual theme of the project; the images shown are a conceptual reconstruction, not documentary photographs of an exhibition that took place.',
    ],
    images: ['09-paper-relief', '07-textile-detail'],
  },
  {
    id: 'EX04',
    status: 'archive',
    statusLabel: 'Archive',
    title: 'Gathered Light',
    dates: '10 Jan — 15 Mar 2026',
    start: '2026-01-10',
    materials: 'Light · line · space',
    short: 'A single line can change a room. Several lines can suggest another way of being in it.',
    full: [
      'The dark room was lit by simple geometric elements: a vertical, a horizontal and a field of color. There was no single correct composition between them. The viewer’s position joined the separate fragments and pulled them apart again.',
      'You can explore this idea yourself in the digital study on this site. The archive entry belongs to the gallery’s fictional program.',
    ],
    images: ['06-room03-light'],
  },
];

export interface GalleryEvent {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  start: string;
  end: string;
  format: string;
  text: string;
  facts: string[];
  /** secondary action besides “Add to calendar” */
  link: { label: string; to: string };
}

export const EVENTS: GalleryEvent[] = [
  {
    id: 'E01',
    title: 'How to Look at the Transparent',
    date: '2026-10-31',
    dateLabel: '31 October',
    start: '16:00',
    end: '16:45',
    format: 'Walk',
    text: 'We will walk through the three rooms and talk about things that are easier to notice than to explain. You can ask questions, stay quiet and go back to a work you liked.',
    facts: [
      '45 minutes',
      'Up to 12 people',
      'Meet in the lobby 5 minutes before the start',
      'No booking needed',
      'If the group is full, come for a regular self-guided visit',
    ],
    link: { label: 'See the exhibition', to: '/exhibitions/between-states' },
  },
  {
    id: 'E03',
    title: 'An Unhurried Hour',
    date: '2026-11-04',
    dateLabel: '4 November',
    start: '11:00',
    end: '12:00',
    format: 'Quiet hour',
    text: 'No tour groups and no background sound. The light room keeps a soft, steady light with no interactive movement. You can take a folding stool at the entrance.',
    facts: ['No booking', 'Self-guided visit', 'First Wednesday of the month'],
    link: { label: 'Visiting conditions', to: '/visit#access' },
  },
  {
    id: 'E02',
    title: 'Folding Light',
    date: '2026-11-07',
    dateLabel: '7 November',
    start: '14:00',
    end: '15:00',
    format: 'Open workshop · 12+',
    text: 'We will make a small paper relief and see how a single desk lamp changes its volume. All materials are provided on site. You can take your finished piece home.',
    facts: ['Up to 8 people', 'Free to take part', 'First come, first served', 'Ages 12 and up'],
    link: { label: 'How to get here', to: '/visit' },
  },
];

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

export type RoomId = 'lobby' | '01' | '02' | '03';

export interface Room {
  id: RoomId;
  label: string;
  name: string;
  text: string;
  images: string[];
  workIds: string[];
}

export const ROOMS: Room[] = [
  {
    id: 'lobby',
    label: 'Lobby',
    name: 'Lobby',
    text: 'This is where a visit begins: a map, chairs, the gallery desk and answers to first questions. Each room can be entered from the shared passage.',
    images: ['03-lobby'],
    workIds: [],
  },
  {
    id: '01',
    label: '01',
    name: 'Room 01 / Air',
    text: 'The brightest room. A tall north skylight and an open center suit works that need air and distance.',
    images: ['04-room01-fabric', '07-textile-detail'],
    workIds: ['work-fabric'],
  },
  {
    id: '02',
    label: '02',
    name: 'Room 02 / Proximity',
    text: 'The central room brings together objects of different scales. The colored planes, ceramics and paper relief can be seen from several points.',
    images: ['05-room02-acrylic', '08-ceramic-ensemble', '09-paper-relief'],
    workIds: ['work-acrylic', 'work-ceramics', 'work-paper'],
  },
  {
    id: '03',
    label: '03',
    name: 'Room 03 / Trace',
    text: 'The light can be dimmed to leave the viewer alone with a line, a reflection or a projection. Conditions for the light work are posted at the entrance.',
    images: ['06-room03-light'],
    workIds: ['work-light'],
  },
];

export type RouteMode = 'short' | 'full' | 'slow';

export interface VisitRoute {
  id: RouteMode;
  label: string;
  text: string;
  steps: { node: string; minutes: number | null; included: boolean }[];
  total: string;
}

export const VISIT_ROUTES: VisitRoute[] = [
  {
    id: 'short',
    label: '20 minutes',
    text: 'One work, one room. Start with the fabric in Room 01, then choose the acrylic planes in Room 02. Save the light room for your next visit if you want to see it calmly.',
    steps: [
      { node: 'Lobby', minutes: 2, included: true },
      { node: '01', minutes: 8, included: true },
      { node: '02', minutes: 8, included: true },
      { node: '03', minutes: null, included: false },
      { node: 'Exit', minutes: 2, included: true },
    ],
    total: '20 minutes / 2 rooms / 2 works',
  },
  {
    id: 'full',
    label: '45 minutes',
    text: 'The whole exhibition at a comfortable pace. Look at the fabric from both sides, walk around the colored planes and finish in the light room.',
    steps: [
      { node: 'Lobby', minutes: 5, included: true },
      { node: '01', minutes: 12, included: true },
      { node: '02', minutes: 18, included: true },
      { node: '03', minutes: 10, included: true },
    ],
    total: '45 minutes / 3 rooms / 5 works',
  },
  {
    id: 'slow',
    label: 'No rush',
    text: 'See the exhibition, take a break in the courtyard and go back to the work that changed for you after seeing the others. Times here are a suggestion, not a limit.',
    steps: [
      { node: 'Lobby', minutes: null, included: true },
      { node: '01', minutes: null, included: true },
      { node: '02', minutes: null, included: true },
      { node: '03', minutes: null, included: true },
      { node: 'Courtyard', minutes: null, included: true },
    ],
    total: '60 minutes or more / a second walk-through / a pause in the courtyard',
  },
];

export const FAQ: [string, string][] = [
  ['Do I need a ticket?', 'No. The current exhibition and a regular self-guided visit are free.'],
  [
    'Do I need to book?',
    'Not for a self-guided visit. Talks and workshops have limited places; the conditions are listed with each event.',
  ],
  [
    'Can I take photos?',
    'Yes, for personal use, without flash or a tripod. If a particular work has a restriction, it will be noted next to it.',
  ],
  [
    'Can I bring children?',
    'Yes. Please stay close to your children and explain that the works must not be touched unless there is a special invitation. The “Folding Light” workshop is for participants aged 12 and up.',
  ],
  [
    'Can I touch the works?',
    'Only where it is clearly stated that interaction is allowed. On this site, the digital studies are free to explore.',
  ],
  ['Is there a café?', 'There is no café. You can take a break in the lobby; please do not bring food or drinks into the exhibition rooms.'],
  [
    'How long does the exhibition take?',
    'Usually 45–60 minutes. If you are short on time, start with one room — you can always come back.',
  ],
  [
    'What if I don’t know much about art?',
    'Start with whatever caught your eye. Look at the material, the size and the light. The title and short note nearby will help you go on, but nobody expects a correct reading from you.',
  ],
];

export const MATERIAL_FILTERS = ['Textile', 'Object', 'Light', 'Paper', 'Painting', 'Graphic art', 'Sculpture'];
