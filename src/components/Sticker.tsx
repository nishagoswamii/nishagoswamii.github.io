import type { CSSProperties } from 'react';
import { MOOD_PATH, MOODS, type Mood } from '@/data/moods';

/** Markup only; behaviour comes from src/scripts/stickers.ts so it also works outside hydrated islands. */
export default function Sticker({ mood, react }: { mood: Mood; react: Mood }) {
  const origin = MOODS[mood].origin;
  return (
    <div className="mood-sticker" data-mood={mood} data-rest={mood} data-react={react} aria-hidden="true" style={{ '--accent-origin': origin ?? '50% 50%' } as CSSProperties}>
      <div className="mood-tilt">
        <div className="mood-sway">
          <img className="mood-body" src={`${MOOD_PATH}/${mood}.webp`} width="540" height="540" alt="" draggable={false} loading="lazy" />
          <img className="mood-accent" src={origin ? `${MOOD_PATH}/${mood}-accent.webp` : undefined} hidden={!origin} width="540" height="540" alt="" draggable={false} />
        </div>
      </div>
    </div>
  );
}
