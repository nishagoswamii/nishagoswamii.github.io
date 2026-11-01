import { MOOD_PATH, MOODS, type Mood } from '../data/moods';
import { makeDraggable } from './draggable';

const ORDER = Object.keys(MOODS) as Mood[];
// Brief expressions a sticker pulls on its own while it is on screen.
const IDLE: Record<Mood, Mood[]> = {
  smile: ['sparkle', 'think'],
  thumbs: ['laugh', 'smile'],
  think: ['wow', 'smile'],
  laugh: ['smile', 'thumbs'],
  sparkle: ['smile', 'laugh'],
  wow: ['laugh', 'smile'],
};

let cleanups: (() => void)[] = [];
let preloaded = false;

function preload() {
  if (preloaded) return;
  preloaded = true;
  for (const mood of ORDER) {
    new Image().src = `${MOOD_PATH}/${mood}.webp`;
    if (MOODS[mood].origin) new Image().src = `${MOOD_PATH}/${mood}-accent.webp`;
  }
}

function setup(sticker: HTMLElement, reduced: boolean) {
  const rest = sticker.dataset.rest as Mood;
  const react = sticker.dataset.react as Mood;
  const body = sticker.querySelector<HTMLImageElement>('.mood-body')!;
  const accent = sticker.querySelector<HTMLImageElement>('.mood-accent')!;
  const section = sticker.closest('section');
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  let hovering = false, dragging = false, onScreen = false, restTimer = 0, idleTimer = 0;

  const show = (mood: Mood) => {
    if (sticker.dataset.mood === mood) return;
    sticker.dataset.mood = mood;
    body.src = `${MOOD_PATH}/${mood}.webp`;
    const origin = MOODS[mood].origin;
    accent.hidden = !origin;
    if (origin) { accent.src = `${MOOD_PATH}/${mood}-accent.webp`; sticker.style.setProperty('--accent-origin', origin); }
    sticker.classList.remove('is-swapping');
    void sticker.offsetWidth;
    sticker.classList.add('is-swapping');
  };
  const backToRest = (delay: number) => {
    clearTimeout(restTimer);
    restTimer = later(() => { if (!hovering && !dragging) show(rest); }, delay);
  };
  const flash = (mood: Mood, ms: number) => { clearTimeout(restTimer); show(mood); backToRest(ms); };

  const scheduleIdle = () => {
    clearTimeout(idleTimer);
    if (reduced || !onScreen) return;
    idleTimer = later(() => {
      if (!hovering && !dragging && sticker.dataset.mood === rest) {
        const options = IDLE[rest];
        flash(options[Math.floor(Math.random() * options.length)], 1300);
      }
      scheduleIdle();
    }, 4500 + Math.random() * 4000);
  };

  // Stick on when it scrolls into view, and only run the idle loop while visible.
  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) { sticker.classList.add('is-stuck'); scheduleIdle(); } else clearTimeout(idleTimer);
  }, { threshold: .25 });
  observer.observe(sticker);

  // React to whatever the visitor is pointing at in the same section.
  const over = (event: Event) => {
    const link = (event.target as Element).closest?.('a');
    if (!link || sticker.contains(link)) return;
    hovering = true; clearTimeout(restTimer); show(react);
  };
  const out = (event: Event) => {
    const link = (event.target as Element).closest?.('a');
    const next = (event as PointerEvent | FocusEvent).relatedTarget as Element | null;
    if (!link || next?.closest?.('a') === link) return;
    hovering = false; backToRest(260);
  };
  section?.addEventListener('pointerover', over);
  section?.addEventListener('pointerout', out);
  section?.addEventListener('focusin', over);
  section?.addEventListener('focusout', out);

  // Tilt toward the pointer, like a card held in the hand.
  const tilt = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || dragging) return;
    const box = sticker.getBoundingClientRect();
    sticker.style.setProperty('--tilt-x', `${((event.clientY - box.top) / box.height - .5) * -22}deg`);
    sticker.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 24}deg`);
  };
  const untilt = () => { sticker.style.setProperty('--tilt-x', '0deg'); sticker.style.setProperty('--tilt-y', '0deg'); };
  sticker.addEventListener('pointermove', tilt);
  sticker.addEventListener('pointerleave', untilt);

  // Drag it around, then let go and it springs home. A click changes the expression.
  const stopDrag = makeDraggable(sticker, {
    onStart: () => { dragging = true; untilt(); clearTimeout(restTimer); show('wow'); },
    onEnd: () => { dragging = false; flash('laugh', 1100); },
    onTap: () => { flash(ORDER[(ORDER.indexOf(sticker.dataset.mood as Mood) + 1) % ORDER.length], 2400); },
  });

  return () => {
    observer.disconnect(); stopDrag(); timers.forEach(clearTimeout);
    section?.removeEventListener('pointerover', over);
    section?.removeEventListener('pointerout', out);
    section?.removeEventListener('focusin', over);
    section?.removeEventListener('focusout', out);
  };
}

document.addEventListener('astro:page-load', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  cleanups = [...document.querySelectorAll<HTMLElement>('.mood-sticker')].map(sticker => setup(sticker, reduced));
  if (cleanups.length) window.setTimeout(preload, 1200);
});
document.addEventListener('astro:before-swap', () => { cleanups.forEach(cleanup => cleanup()); cleanups = []; });
