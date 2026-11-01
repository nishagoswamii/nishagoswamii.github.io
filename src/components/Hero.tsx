import type { CSSProperties } from 'react';
import AvatarScene from './AvatarScene';

const NAME = [
  { letter: 'N', color: '#ff2e93', tilt: -6 },
  { letter: 'i', color: '#ffd60f', tilt: 4 },
  { letter: 's', color: '#6c2bd9', tilt: -3 },
  { letter: 'h', color: '#2fa8f5', tilt: 5 },
  { letter: 'a', color: '#ff2e93', tilt: -4 },
];
const CHARMS = [
  { name: 'star', style: { left: '7%', top: '62%', width: 'clamp(54px,7vw,104px)' }, speed: -.12 },
  { name: 'heart', style: { right: '8%', top: '58%', width: 'clamp(46px,6vw,88px)' }, speed: .1 },
  { name: 'sparkle', style: { left: '24%', top: '77%', width: 'clamp(38px,4.6vw,68px)' }, speed: .16 },
];

export default function Hero() {
  return (
    <section id="home" className="book-hero">
      <h1 className="hero-name" aria-label="Nisha Goswami">
        {NAME.map(({ letter, color, tilt }, index) => (
          <span key={index} className="hero-letter" data-drag aria-hidden="true" style={{ '--i': index, '--tilt': `${tilt}deg`, color } as CSSProperties}><span>{letter}</span></span>
        ))}
      </h1>
      <p className="hero-tag hero-tag-role" data-drag><span>Engineer &amp; writer</span></p>
      {CHARMS.map(({ name, style, speed }) => (
        <div key={name} className="hero-charm" style={style} data-speed={speed} suppressHydrationWarning><img src={`/Images/stickers/${name}.webp`} alt="" data-drag draggable={false} /></div>
      ))}
      <div className="avatar-stage"><div className="avatar-drift"><AvatarScene /></div></div>
    </section>
  );
}
