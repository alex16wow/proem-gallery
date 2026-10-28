/** Реальное скачивание файла, собранного в браузере. Никаких запросов на сервер. */
export function downloadText(filename: string, text: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const pad = (n: number) => String(n).padStart(2, '0');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Разбивка длинных строк iCalendar по 75 октетов (упрощённо — по символам). */
const fold = (line: string) => line.match(/.{1,70}/g)!.join('\r\n ');

export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  start?: string; // HH:MM — если нет, событие на весь день
  end?: string;
}

/**
 * Время «плавающее» (без Z и без TZID): город и часовой пояс площадки не определены,
 * поэтому часы трактуются как местное время посетителя календаря.
 */
export function buildIcs(ev: IcsEvent, location: string) {
  const d = ev.date.replace(/-/g, '');
  const stamp = new Date();
  const dtstamp = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}00Z`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PROEM concept//RU',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.uid}@proem.example`,
    `DTSTAMP:${dtstamp}`,
  ];
  if (ev.start && ev.end) {
    lines.push(`DTSTART:${d}T${ev.start.replace(':', '')}00`, `DTEND:${d}T${ev.end.replace(':', '')}00`);
  } else {
    const next = new Date(ev.date + 'T00:00:00');
    next.setDate(next.getDate() + 1);
    lines.push(`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`);
  }
  lines.push(
    fold(`SUMMARY:${esc(ev.title)}`),
    fold(`DESCRIPTION:${esc(ev.description)}`),
    fold(`LOCATION:${esc(location)}`),
    'END:VEVENT',
    'END:VCALENDAR',
  );
  return lines.join('\r\n') + '\r\n';
}

export function downloadIcs(ev: IcsEvent, location: string) {
  downloadText(`proem-${ev.uid.toLowerCase()}.ics`, buildIcs(ev, location), 'text/calendar;charset=utf-8');
}
