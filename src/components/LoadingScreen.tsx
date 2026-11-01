import { useEffect, useRef, useState } from 'react';
import { TypingAnimation } from './ui/typing-animation';

const GREETING = "Hi, I'm Nisha";

/** Sky overlay for the intro. The avatar itself lives in the hero and is moved to centre stage by CSS. */
export default function LoadingScreen() {
  const [active, setActive] = useState(true);
  const [talking, setTalking] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const finish = useRef<() => void>(() => {});
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro-playing')) { setActive(false); return; }
    const timers: number[] = [];
    let begun = false;
    const release = () => { root.classList.remove('intro-hold', 'intro-arrived'); history.scrollRestoration = 'auto'; };
    const done = () => { release(); root.classList.remove('intro-playing'); setActive(false); };
    const leave = () => { release(); setLeaving(true); };
    finish.current = () => { timers.forEach(clearTimeout); leave(); timers.push(window.setTimeout(done, 450)); };
    const begin = () => {
      if (begun) return;
      begun = true;
      root.classList.add('intro-arrived');
      timers.push(window.setTimeout(() => { setTalking(true); window.dispatchEvent(new Event('avatar:hello')); }, 1000));
      timers.push(window.setTimeout(leave, 3900));
      timers.push(window.setTimeout(done, 4500));
    };
    if ((window as unknown as { __avatarReady?: boolean }).__avatarReady) begin();
    else {
      window.addEventListener('avatar:ready', begin, { once: true });
      timers.push(window.setTimeout(begin, 2500));
    }
    return () => { timers.forEach(clearTimeout); window.removeEventListener('avatar:ready', begin); done(); };
  }, []);
  if (!active) return null;
  return <div className={`loading-screen ${leaving ? 'is-leaving' : ''}`} role="status" aria-label={GREETING}>
    {talking && <div className="speech-bubble" aria-hidden="true">
      <span className="speech-ghost">{GREETING}</span>
      <TypingAnimation startOnView={false} typeSpeed={55} className="speech-text">{GREETING}</TypingAnimation>
    </div>}
    <button className="intro-skip" onClick={() => finish.current()}>Skip</button>
  </div>;
}
