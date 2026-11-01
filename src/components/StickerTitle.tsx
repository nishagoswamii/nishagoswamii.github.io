import { createElement, type CSSProperties } from 'react';

const TILTS = [-5, 3, -2, 5, -4, 2, 4, -3];

/** Big die-cut lettering. Each letter is its own sticker so it can slap on and wobble independently. */
export default function StickerTitle({ text, as = 'h2' }: { text: string; as?: 'h1' | 'h2' }) {
  return createElement(as, { className: 'sticker-title', 'aria-label': text, 'data-scroll-reveal': true },
    [...text].map((letter, index) => (
      <span key={index} aria-hidden="true" className="sticker-letter" style={{ '--i': index, '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties}>
        {letter === ' ' ? ' ' : letter}
      </span>
    )));
}
