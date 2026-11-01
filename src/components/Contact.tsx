import Sticker from './Sticker';
import StickerTitle from './StickerTitle';

const links = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nishagoswamii' },
  { label: 'GitHub', href: 'https://github.com/nishagoswamii' },
  { label: 'Medium', href: 'https://medium.com/@nnishagoswamii' },
];

export default function Contact() {
  return (
    <section id="contact" className="book-section sheet-pink">
      <StickerTitle text="Say hi!" />
      <div className="section-sticker"><Sticker mood="smile" react="wow" /></div>
      <div className="contact-body" data-scroll-reveal>
        <a className="contact-mail" href="mailto:hello@nishagoswami.com" data-drag draggable={false}><span>hello@nishagoswami.com</span></a>
        <div className="contact-links">
          {links.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" data-drag draggable={false}><span>{label}</span></a>)}
        </div>
      </div>
    </section>
  );
}
