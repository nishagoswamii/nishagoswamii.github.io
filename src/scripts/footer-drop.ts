import { withBase } from '@/lib/utils';

const BATCH = 15;
const GRAVITY = 2400;
const STEP = 1 / 120;
const MAX_SPIN = 2.2;
const STICKERS = ['star.webp', 'heart.webp', 'sparkle.webp', 'rocket.webp', 'smiley.svg', 'smiley-wink.svg', 'smiley-love.svg', 'smiley-laugh.svg', 'starfish.svg'];

type Body = { el: HTMLImageElement; x: number; y: number; vx: number; vy: number; r: number; angle: number; spin: number; held: boolean };

const shuffled = <T,>(list: T[]) => [...list].sort(() => Math.random() - .5);

/** Tapping the footer rains 15 stickers that bounce, pile up on the floor, and can be picked up and thrown. Footer only. */
export function footerDrop(reduced: boolean) {
  const footer = document.querySelector<HTMLElement>('.site-footer');
  const layer = footer?.querySelector<HTMLElement>('.footer-drops');
  if (!footer || !layer) return () => {};
  const sources = STICKERS.map(name => withBase(`/Images/stickers/${name}`));
  const bodies: Body[] = [];
  let frame = 0, last = 0, still = 0, width = 0, floor = 0;

  const measure = () => {
    const box = footer.getBoundingClientRect();
    const row = footer.querySelector('.footer-row')!.getBoundingClientRect();
    const tabs = footer.querySelector('.footer-tabs')!.getBoundingClientRect();
    width = box.width;
    floor = Math.min(row.top, tabs.top) - box.top;
  };

  const step = () => {
    for (const b of bodies) {
      if (b.held) continue;
      b.vy += GRAVITY * STEP;
      b.x += b.vx * STEP; b.y += b.vy * STEP;
      b.spin = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, b.spin));
      b.angle += b.spin * STEP;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * .5; }
      if (b.x > width - b.r) { b.x = width - b.r; b.vx = -Math.abs(b.vx) * .5; }
      if (b.y > floor - b.r) {
        b.y = floor - b.r;
        b.vy = b.vy > 120 ? -b.vy * .42 : 0;
        b.vx *= .97; b.spin = b.spin * .9 + b.vx / b.r * .03;
      }
    }
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      const dx = b.x - a.x, dy = b.y - a.y, reach = a.r + b.r, dist2 = dx * dx + dy * dy;
      if (dist2 >= reach * reach || !dist2) continue;
      const dist = Math.sqrt(dist2), nx = dx / dist, ny = dy / dist, push = (reach - dist) / 2;
      if (!a.held) { a.x -= nx * push; a.y -= ny * push; }
      if (!b.held) { b.x += nx * push; b.y += ny * push; }
      const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (closing <= 0) continue;
      const impulse = closing * .62;
      if (!a.held) { a.vx -= impulse * nx; a.vy -= impulse * ny; a.spin *= .9; }
      if (!b.held) { b.vx += impulse * nx; b.vy += impulse * ny; b.spin *= .9; }
    }
  };
  const paint = () => { for (const b of bodies) b.el.style.transform = `translate(${b.x - b.r}px,${b.y - b.r}px) rotate(${b.angle}rad)`; };

  const tick = (now: number) => {
    const before = bodies.map(b => [b.x, b.y]);
    let steps = Math.min(12, Math.round((now - last) / (STEP * 1000)));
    last = now;
    while (steps-- > 0) step();
    paint();
    const moved = bodies.some((b, i) => b.held || Math.abs(b.x - before[i][0]) + Math.abs(b.y - before[i][1]) > .4);
    still = moved ? 0 : still + 1;
    frame = still < 20 ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => {
    still = 0;
    if (reduced) { for (let i = 0; i < 1400; i++) step(); paint(); return; }
    if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
  };

  const grab = (el: HTMLImageElement, body: Body) => {
    let lastX = 0, lastY = 0, lastTime = 0;
    el.addEventListener('pointerdown', event => {
      el.setPointerCapture(event.pointerId);
      body.held = true; body.vx = 0; body.vy = 0;
      lastX = event.clientX; lastY = event.clientY; lastTime = performance.now();
      wake();
    });
    el.addEventListener('pointermove', event => {
      if (!body.held) return;
      const box = footer.getBoundingClientRect(), now = performance.now(), dt = Math.max(1, now - lastTime) / 1000;
      body.vx = (event.clientX - lastX) / dt; body.vy = (event.clientY - lastY) / dt;
      body.x = Math.max(body.r, Math.min(width - body.r, event.clientX - box.left));
      body.y = Math.min(floor - body.r, event.clientY - box.top);
      lastX = event.clientX; lastY = event.clientY; lastTime = now;
      wake();
    });
    const drop = () => {
      if (!body.held) return;
      body.held = false;
      body.vx = Math.max(-2600, Math.min(2600, body.vx)); body.vy = Math.max(-2600, Math.min(2600, body.vy));
      body.spin = body.vx / body.r * .2;
      wake();
    };
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
  };

  const rain = () => {
    measure();
    // Keep the pile from burying the page: two batches on a phone, three on a big screen.
    const limit = BATCH * (width < 700 ? 2 : 3);
    for (const old of bodies.splice(0, Math.max(0, bodies.length + BATCH - limit))) {
      old.el.classList.add('is-leaving');
      old.el.addEventListener('transitionend', () => old.el.remove(), { once: true });
    }
    const size = Math.max(46, Math.min(84, width * .058));
    const picks = shuffled(sources);
    for (let index = 0; index < BATCH; index++) {
      const el = document.createElement('img');
      el.src = picks[index % picks.length];
      el.alt = ''; el.draggable = false; el.className = 'drop-sticker';
      el.setAttribute('aria-hidden', 'true');
      el.style.width = `${size}px`;
      layer.appendChild(el);
      const r = size * .46;
      const body: Body = { el, r, x: r + Math.random() * (width - r * 2), y: -r - index * size * .9 - Math.random() * size, vx: (Math.random() - .5) * 240, vy: Math.random() * 200, angle: Math.random() * 6.28, spin: (Math.random() - .5) * 2.4, held: false };
      bodies.push(body);
      grab(el, body);
    }
    footer.classList.add('has-dropped');
    wake();
  };

  const click = (event: MouseEvent) => {
    if ((event.target as Element).closest('a,button,[data-drag],.drop-sticker')) return;
    if (getSelection()?.toString()) return;
    rain();
  };
  footer.addEventListener('click', click);

  // Fetch the art as the footer comes into view, so the first tap has nothing to wait for.
  const seen = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    seen.disconnect();
    sources.forEach(src => { new Image().src = src; });
  });
  seen.observe(footer);
  const resized = new ResizeObserver(() => { if (bodies.length) { measure(); wake(); } });
  resized.observe(footer);

  return () => {
    cancelAnimationFrame(frame);
    footer.removeEventListener('click', click);
    seen.disconnect(); resized.disconnect();
    layer.replaceChildren();
  };
}
