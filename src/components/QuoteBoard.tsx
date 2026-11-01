import { useEffect, useRef, useState } from 'react';
import { TextFlippingBoard } from '@/components/ui/text-flipping-board';
import { quotes } from '@/data/quotes';

const HOLD_MS = 9000;

/** Flips through the quotes while on screen. With reduced motion the quote is plain text and only changes on request. */
export default function QuoteBoard() {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState<boolean | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const { quote, by } = quotes[index];
  const next = () => setIndex(current => (current + 1) % quotes.length);

  useEffect(() => {
    setMotion(!matchMedia('(prefers-reduced-motion: reduce)').matches);
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: .3 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  // Clicking "next" restarts the wait, so a quote someone chose gets its full time.
  useEffect(() => {
    if (!motion || !onScreen) return;
    const timer = setTimeout(next, HOLD_MS);
    return () => clearTimeout(timer);
  }, [motion, onScreen, index]);

  return (
    <div ref={root} className={`quote-stage${motion === false ? ' is-still' : ''}`}>
      <div className="dark quote-board" aria-hidden="true">
        <TextFlippingBoard text={motion && onScreen ? `${quote}\n- ${by}` : undefined} className="w-full max-w-none rounded-none bg-transparent p-0 shadow-none md:rounded-none md:p-0 dark:bg-transparent dark:shadow-none" />
      </div>
      <figure className="quote-caption">
        <blockquote>{quote}</blockquote>
        <figcaption>{by}</figcaption>
      </figure>
      <div className="shelf-arrows">
        <button type="button" aria-label="Next quote" onClick={next}>→</button>
      </div>
    </div>
  );
}
