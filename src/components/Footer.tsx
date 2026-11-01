import { footerData } from '../data/footerData';
import { withBase } from '@/lib/utils';
import StickerTitle from './StickerTitle';

const links = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nishagoswamii' },
  { label: 'GitHub', href: 'https://github.com/nishagoswamii' },
  { label: 'Medium', href: 'https://medium.com/@nnishagoswamii' },
  { label: 'X', href: 'https://x.com/Nisha342020' },
  { label: 'Email', href: 'mailto:hello@nishagoswami.com' },
];

type Petal = [angle: number, length: number, spread: number];

const polar = (angle: number, radius: number) => {
  const rad = (angle - 90) * Math.PI / 180;
  return `${(radius * Math.cos(rad)).toFixed(1)} ${(radius * Math.sin(rad)).toFixed(1)}`;
};

// One unbroken outline: each petal is a lobe out and back to the next dip, so uneven numbers read as hand painted.
const flower = (petals: Petal[], dip: number) => {
  const valley = (index: number) => {
    const [angle] = petals[index], [next] = petals[(index + 1) % petals.length];
    return polar((angle + (next < angle ? next + 360 : next)) / 2, dip);
  };
  return `M${valley(petals.length - 1)}` + petals.map(([angle, length, spread], index) => `C${polar(angle - spread, length * 1.32)} ${polar(angle + spread, length * 1.32)} ${valley(index)}`).join('') + 'Z';
};

const LINE_FLOWER = flower([[6, 43, 17], [48, 39, 19], [92, 44, 16], [136, 37, 19], [180, 42, 17], [226, 39, 18], [270, 45, 16], [316, 38, 19]], 19);
const RED_FLOWER = flower([[4, 44, 31], [76, 39, 34], [146, 43, 29], [214, 37, 34], [288, 43, 30]], 19);
const YELLOW_FLOWER = flower([[14, 43, 33], [84, 38, 30], [152, 44, 32], [226, 36, 35], [296, 41, 29]], 20);
const STARFISH = flower([[2, 47, 11], [74, 44, 13], [146, 46, 11], [216, 43, 13], [290, 47, 11]], 19);
const STARFISH_DOTS = [[0, -24], [-1, -11], [22, -8], [11, -3], [14, 19], [7, 9], [-14, 19], [-7, 9], [-23, -7], [-11, -3]];
const CHARMS = ['star star-big', 'star star-small', 'heart heart-left', 'heart heart-right', 'heart heart-word', 'sparkle sparkle-top', 'sparkle sparkle-low'];
const GREEN_FLOWER = flower([[28, 44, 27], [100, 40, 33], [172, 43, 27], [240, 38, 34], [312, 43, 28]], 18);

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <svg className="footer-paper" aria-hidden="true">
        <defs>
          <pattern id="footer-check" width="240" height="240" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="#bfe1f8" />
            <rect x="120" y="120" width="120" height="120" fill="#bfe1f8" />
          </pattern>
          <filter id="footer-cut" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".007" numOctaves="2" seed="8" />
            <feDisplacementMap in="SourceGraphic" scale="9" result="cut" />
            <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 .25  0 0 0 0 .5  0 0 0 0 .75  0 0 0 .3 0" />
            <feComposite in2="cut" operator="in" result="grain" />
            <feMerge><feMergeNode in="cut" /><feMergeNode in="grain" /></feMerge>
          </filter>
          <filter id="footer-boil">
            <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-check)" filter="url(#footer-cut)" />
      </svg>

      <div className="footer-note">
        <svg className="footer-flower footer-flower-line" viewBox="-54 -54 108 108" aria-hidden="true"><path d={LINE_FLOWER} fill="none" stroke="#fac95d" strokeWidth="7" strokeLinejoin="round" filter="url(#footer-boil)" /></svg>
        <svg className="footer-flower footer-flower-red" viewBox="-54 -54 108 108" aria-hidden="true"><g filter="url(#footer-boil)"><path d={RED_FLOWER} fill="#e8716c" /><ellipse cx="1" cy="1" rx="6" ry="8" fill="#fbcf74" /></g></svg>
        <svg className="footer-flower footer-flower-yellow" viewBox="-54 -54 108 108" aria-hidden="true"><g filter="url(#footer-boil)"><path d={YELLOW_FLOWER} fill="#fbcf74" /><ellipse cx="-1" cy="1" rx="8" ry="6" fill="#c9972b" /></g></svg>
        <svg className="footer-flower footer-flower-green" viewBox="-54 -54 108 108" aria-hidden="true"><g filter="url(#footer-boil)"><path d={GREEN_FLOWER} fill="#86a964" /><ellipse cx="1" cy="-1" rx="9" ry="8" fill="#fbcf74" /></g></svg>
        <StickerTitle text="Say Hi!" />
        <svg className="footer-starfish" viewBox="-54 -54 108 108" aria-hidden="true"><g filter="url(#footer-boil)"><path d={STARFISH} fill="#ff8a5c" stroke="#fff" strokeWidth="7" strokeLinejoin="round" paintOrder="stroke" />{STARFISH_DOTS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="#fff3d6" />)}</g></svg>
        {CHARMS.map(charm => <img key={charm} className={`footer-charm charm-${charm.split(' ')[1]}`} data-drag src={withBase(`/Images/stickers/${charm.split(' ')[0]}.webp`)} alt="" draggable={false} loading="lazy" />)}
        <a className="footer-mail" href="mailto:hello@nishagoswami.com">hello@nishagoswami.com</a>
        <p className="footer-hint">psst... tap anywhere!</p>
      </div>
      <div className="footer-drops" aria-hidden="true" />

      <div className="footer-row">
        <span>© {footerData.currentYear} Nisha Goswami</span>
        <a href="#top">Back to Top</a>
      </div>
      <nav className="footer-tabs" aria-label="Contact">
        {links.map(({ label, href }) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a>)}
      </nav>
    </footer>
  );
}
