import { useState } from 'react';
import { EMAIL } from '../data/content';

/** Копирование демонстрационного адреса. Никаких запросов на него не отправляется. */
export function CopyContact({ label = 'Copy mock-up contact', text = EMAIL }: { label?: string; text?: string }) {
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied');
    } catch {
      setStatus('Select and copy the text manually');
    }
    setTimeout(() => setStatus(''), 3000);
  };
  return (
    <div className="copy">
      <button type="button" className="btn btn--line" onClick={copy}>
        {label}
      </button>
      <span className="copy__text mono">{text}</span>
      <span className="small">Contact for the mock-up</span>
      <span className="copy__status" role="status">
        {status}
      </span>
    </div>
  );
}
