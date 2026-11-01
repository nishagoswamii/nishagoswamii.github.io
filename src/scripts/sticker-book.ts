import { makeDraggable } from './draggable';
import { withBase } from '@/lib/utils';
import { footerDrop } from './footer-drop';

const STAMPS = ['star', 'heart', 'sparkle', 'rocket'];
const MAX_STAMPS = 10;
const BABY_FACES = ['smile', 'laugh', 'thumbs', 'wow', 'think', 'love'];
let cleanups: (() => void)[] = [];

function scrollEffects(reduced: boolean) {
  const parallax = [...document.querySelectorAll<HTMLElement>('[data-speed]')];
  const deals = [...document.querySelectorAll<HTMLElement>('[data-deal]')];
  const scrollStar = document.querySelector<HTMLElement>('.scroll-star');
  let tick = 0;

  const update = () => {
    tick = 0;
    const height = innerHeight;
    for (const el of parallax) {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--py', `${(box.top + box.height / 2 - height / 2) * Number(el.dataset.speed)}px`);
    }
    for (const el of deals) {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--deal', String(Math.min(1, Math.max(0, (height * .98 - box.top) / (height * .38)))));
    }
    if (scrollStar) {
      const range = document.documentElement.scrollHeight - height;
      scrollStar.style.setProperty('--progress', String(range > 0 ? scrollY / range : 0));
      scrollStar.classList.toggle('is-away', scrollY > height * .5);
    }
  };
  const schedule = () => { if (!tick) tick = requestAnimationFrame(update); };
  if (reduced) {
    deals.forEach(el => el.style.setProperty('--deal', '1'));
    if (scrollStar) scrollStar.hidden = true;
    return () => {};
  }
  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  return () => { cancelAnimationFrame(tick); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); };
}

/** Clicking any empty spot on the page slaps a little sticker there, which peels off after a while. */
function stampOnClick() {
  const live: HTMLElement[] = [];
  const timers = new Set<number>();
  const click = (event: MouseEvent) => {
    const target = event.target as Element;
    if (document.documentElement.classList.contains('intro-playing')) return;
    if (target.closest('a,button,input,textarea,canvas,[data-drag],.mood-sticker,.baby-sticker,.book-text,.shelf-rail,[role=dialog],.prose,.sky-nav,.site-footer')) return;
    if (getSelection()?.toString()) return;
    const stamp = document.createElement('img');
    stamp.src = withBase(`/Images/stickers/${STAMPS[Math.floor(Math.random() * STAMPS.length)]}.webp`);
    stamp.alt = '';
    stamp.className = 'click-stamp';
    stamp.setAttribute('aria-hidden', 'true');
    stamp.style.left = `${Math.min(event.pageX, document.documentElement.clientWidth - 50)}px`;
    stamp.style.top = `${event.pageY}px`;
    stamp.style.setProperty('--stamp-r', `${Math.round(Math.random() * 50 - 25)}deg`);
    document.body.appendChild(stamp);
    live.push(stamp);
    if (live.length > MAX_STAMPS) live.shift()?.remove();
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      stamp.classList.add('is-peeling');
      const gone = window.setTimeout(() => { timers.delete(gone); stamp.remove(); }, 500);
      timers.add(gone);
    }, 6000);
    timers.add(timer);
  };
  // Capture phase: React may swap the clicked element out (the menu icon) before this would bubble up.
  document.addEventListener('click', click, true);
  return () => { document.removeEventListener('click', click, true); timers.forEach(clearTimeout); live.forEach(stamp => stamp.remove()); };
}

function cycleImages(reduced: boolean) {
  if (reduced) return () => {};
  const stacks = [...document.querySelectorAll<HTMLElement>('[data-cycle]')].filter(stack => stack.children.length > 1);
  if (!stacks.length) return () => {};
  let tick = 0;
  const timer = window.setInterval(() => {
    tick += 1;
    for (const stack of stacks) [...stack.children].forEach((image, index) => image.classList.toggle('active', index === tick % stack.children.length));
  }, 3600);
  return () => clearInterval(timer);
}

// A winding road through the jobs, newest first like a resume, with a pin at each stop and dots marching toward the current job. Redrawn when a card moves so it stretches as cards are dragged.
function jobRoad() {
  const grid = document.querySelector<HTMLElement>('.job-grid');
  const svg = grid?.querySelector<SVGSVGElement>('.job-road');
  if (!grid || !svg) return () => {};
  const NS = 'http://www.w3.org/2000/svg';
  const cards = [...grid.querySelectorAll<HTMLElement>('.job-card')];
  const add = <K extends keyof SVGElementTagNameMap>(tag: K, className: string) => { const el = document.createElementNS(NS, tag); el.setAttribute('class', className); return svg.appendChild(el); };
  const dots = cards.slice(1).map(() => add('path', 'road-dots'));
  const pins = cards.map((_, index) => { const pin = add('use', `road-pin road-pin-${index % 2}`); pin.setAttribute('href', '#road-pin'); return pin; });
  const stacked = matchMedia('(max-width:800px)');
  let frame = 0, followUntil = 0;
  const draw = () => {
    frame = 0;
    const origin = grid.getBoundingClientRect();
    dots.forEach((road, index) => {
      const from = cards[index].getBoundingClientRect(), to = cards[index + 1].getBoundingClientRect();
      const fromLeft = from.left - origin.left, toLeft = to.left - origin.left;
      const fromBottom = from.bottom - origin.top, toTop = to.top - origin.top;
      const gapY = (fromBottom + toTop) / 2;
      let d, startX, startY, endX, endY;
      if (stacked.matches) {
        startX = fromLeft + from.width * .22; startY = fromBottom + 62;
        endX = toLeft + to.width * .78; endY = toTop - 22;
        const turn = (endY - startY) * .95;
        d = `M${startX} ${startY}C${startX} ${startY + turn} ${endX} ${endY - turn} ${endX} ${endY}`;
      } else {
        // Out to the side of the upper card, back under it, then along into the side of the lower one.
        const direction = to.left > from.left ? 1 : -1;
        startX = direction > 0 ? fromLeft + from.width + 28 : fromLeft - 28; startY = from.top - origin.top + from.height * .42;
        endX = direction > 0 ? toLeft - 28 : toLeft + to.width + 28; endY = toTop + to.height * .42;
        const midX = fromLeft + from.width * (direction > 0 ? .78 : .22);
        const farX = direction > 0 ? toLeft + to.width * .42 : toLeft + to.width * .58;
        const backX = direction > 0 ? fromLeft + from.width * .08 : fromLeft + from.width * .92;
        d = `M${startX} ${startY}C${farX} ${startY - 50} ${farX} ${gapY} ${midX} ${gapY}C${backX} ${gapY} ${backX} ${endY} ${endX} ${endY}`;
      }
      road.setAttribute('d', d);
      if (!index) pins[0].setAttribute('transform', `translate(${startX} ${startY})`);
      pins[index + 1].setAttribute('transform', `translate(${endX} ${endY})`);
    });
    if (performance.now() < followUntil) schedule();
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  // The road shows before the cards finish landing, so it follows them while they move.
  const follow = () => { followUntil = performance.now() + 1500; schedule(); };
  const resize = new ResizeObserver(schedule); resize.observe(grid);
  const moved = new MutationObserver(schedule);
  cards.forEach(card => moved.observe(card, { attributes: true, attributeFilter: ['style'] }));
  grid.addEventListener('transitionrun', follow);
  stacked.addEventListener('change', schedule);
  draw();
  return () => {
    cancelAnimationFrame(frame); resize.disconnect(); moved.disconnect();
    grid.removeEventListener('transitionrun', follow); stacked.removeEventListener('change', schedule);
    [...dots, ...pins].forEach(el => el.remove());
  };
}

// The footer doodles boil like hand-drawn animation: a new noise seed ten times a second, only while the footer is on screen.
function footerBoil(reduced: boolean) {
  const footer = document.querySelector<HTMLElement>('.site-footer');
  const noise = footer?.querySelector('#footer-boil feTurbulence');
  if (!footer || !noise || reduced) return () => {};
  let timer = 0;
  const seen = new IntersectionObserver(([entry]) => {
    clearInterval(timer);
    if (entry.isIntersecting) timer = window.setInterval(() => noise.setAttribute('seed', String(Math.floor(Math.random() * 1000))), 100);
  });
  seen.observe(footer);
  return () => { clearInterval(timer); seen.disconnect(); };
}

// The baby stickers in the picture book: pull one around, or tap it for the next face.
function babyStickers() {
  const stickers = [...document.querySelectorAll<HTMLElement>('.baby-sticker')];
  if (stickers.length) BABY_FACES.forEach(face => { new Image().src = withBase(`/Images/baby/${face}.webp`); });
  return stickers.map(sticker => makeDraggable(sticker, {
    onTap: () => {
      const face = BABY_FACES[(BABY_FACES.indexOf(sticker.dataset.face!) + 1) % BABY_FACES.length];
      sticker.dataset.face = face;
      sticker.querySelector('img')!.src = withBase(`/Images/baby/${face}.webp`);
      sticker.classList.remove('is-swapping');
      void sticker.offsetWidth;
      sticker.classList.add('is-swapping');
    },
  }));
}

// The Books and Movies rails: arrows for mouse users, shown only once there is more than fits.
function shelfRail(section: Element, reduced: boolean) {
  const rail = section.querySelector<HTMLElement>('.shelf-rail')!;
  const arrows = section.querySelector<HTMLElement>('.shelf-arrows')!;
  const prev = arrows.querySelector<HTMLButtonElement>('.shelf-prev')!;
  const next = arrows.querySelector<HTMLButtonElement>('.shelf-next')!;
  const update = () => {
    const room = rail.scrollWidth - rail.clientWidth;
    arrows.hidden = room < 4;
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft > room - 4;
  };
  const go = (direction: number) => rail.scrollBy({ left: direction * rail.clientWidth * .8, behavior: reduced ? 'auto' : 'smooth' });
  const back = () => go(-1), forward = () => go(1);
  const resize = new ResizeObserver(update); resize.observe(rail);
  rail.addEventListener('scroll', update, { passive: true });
  prev.addEventListener('click', back);
  next.addEventListener('click', forward);
  return () => { resize.disconnect(); rail.removeEventListener('scroll', update); prev.removeEventListener('click', back); next.removeEventListener('click', forward); };
}

document.addEventListener('astro:page-load', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  cleanups = [
    scrollEffects(reduced),
    stampOnClick(),
    cycleImages(reduced),
    jobRoad(),
    footerBoil(reduced),
    footerDrop(reduced),
    ...[...document.querySelectorAll('.book-section:has(.shelf-rail)')].map(section => shelfRail(section, reduced)),
    ...babyStickers(),
    ...[...document.querySelectorAll<HTMLElement>('[data-drag]')].map(el => makeDraggable(el)),
  ];
});
document.addEventListener('astro:before-swap', () => { cleanups.forEach(cleanup => cleanup()); cleanups = []; });
