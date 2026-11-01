type DragOptions = { onStart?: () => void; onEnd?: () => void; onTap?: () => void };

/** Lets an element be pulled around and springs it home on release. Clicks after a drag are swallowed. */
export function makeDraggable(el: HTMLElement, { onStart, onEnd, onTap }: DragOptions = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = false, moved = false, swallowClick = false, frame = 0;
  let originX = 0, originY = 0, x = 0, y = 0, velocityX = 0, velocityY = 0, lastX = 0, lastY = 0, springTime = 0;

  const place = () => {
    el.style.setProperty('--drag-x', `${x}px`);
    el.style.setProperty('--drag-y', `${y}px`);
    el.style.setProperty('--drag-r', `${Math.max(-24, Math.min(24, x * .05 + velocityX * .35))}deg`);
  };
  // Stepped at 60Hz whatever the display does, so it feels the same on slow and high refresh screens.
  const spring = (now: number) => {
    const steps = Math.max(1, Math.min(10, Math.round((now - springTime) / 16.7)));
    springTime = now;
    for (let step = 0; step < steps; step++) {
      velocityX = (velocityX - x * .09) * .84; velocityY = (velocityY - y * .09) * .84;
      x += velocityX; y += velocityY;
    }
    place();
    if (Math.abs(x) + Math.abs(y) + Math.abs(velocityX) + Math.abs(velocityY) > .3) frame = requestAnimationFrame(spring);
    else { x = 0; y = 0; velocityX = 0; velocityY = 0; place(); }
  };
  const release = () => {
    el.classList.remove('is-dragging');
    if (reduced) { x = 0; y = 0; velocityX = 0; velocityY = 0; place(); }
    else { springTime = performance.now(); frame = requestAnimationFrame(spring); }
  };

  const down = (event: PointerEvent) => {
    if (event.button) return;
    cancelAnimationFrame(frame);
    originX = event.clientX - x; originY = event.clientY - y; lastX = event.clientX; lastY = event.clientY;
    active = true; moved = false; swallowClick = false;
  };
  const move = (event: PointerEvent) => {
    if (!active) return;
    if (!moved) {
      if (Math.hypot(event.clientX - lastX, event.clientY - lastY) < 6) return;
      moved = true;
      el.setPointerCapture(event.pointerId);
      el.classList.add('is-dragging');
      onStart?.();
    }
    velocityX = event.clientX - lastX; velocityY = event.clientY - lastY; lastX = event.clientX; lastY = event.clientY;
    x = event.clientX - originX; y = event.clientY - originY; place();
  };
  const up = () => {
    if (!active) return;
    active = false;
    if (moved) { swallowClick = true; release(); onEnd?.(); } else onTap?.();
  };
  const cancel = () => { if (!active) return; active = false; if (moved) { release(); onEnd?.(); } };
  const click = (event: Event) => { if (swallowClick) { event.preventDefault(); event.stopPropagation(); swallowClick = false; } };
  const nativeDrag = (event: Event) => event.preventDefault();

  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('click', click, true);
  el.addEventListener('dragstart', nativeDrag);
  return () => {
    cancelAnimationFrame(frame);
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', cancel);
    el.removeEventListener('click', click, true);
    el.removeEventListener('dragstart', nativeDrag);
  };
}
