import type { CSSProperties } from 'react';
import { jobs } from '@/data/experienceData';
import Sticker from './Sticker';
import StickerTitle from './StickerTitle';

export default function ExperienceSection() {
  return (
    <section id="experience" className="book-section sheet-yellow">
      <StickerTitle text="Experience" />
      <div className="section-sticker"><Sticker mood="sparkle" react="laugh" /></div>
      <div className="job-grid">
        {jobs.map((job, index) => (
          <div key={`${job.company}-${job.title}`} className="job-slot" data-scroll-reveal style={{ '--reveal-delay': `${index * 120}ms` } as CSSProperties}>
            <a href={job.linkedInUrl} target="_blank" rel="noreferrer" className="job-card" data-drag draggable={false}>
              <span className={`job-face job-face-${index % 2}`}>
                <span className="tape-bit" aria-hidden="true" />
                <span className="job-dates">{job.dates}</span>
                <strong>{job.title}</strong>
                <span className="job-company">{job.company}</span>
              </span>
            </a>
          </div>
        ))}
        <svg className="job-road" aria-hidden="true">
          <defs>
            <symbol id="road-pin" overflow="visible"><path d="M0 0C-5-12-17-19-17-31A17 17 0 1 1 17-31C17-19 5-12 0 0Z" /><circle cx="0" cy="-31" r="6.5" /></symbol>
          </defs>
        </svg>
      </div>
    </section>
  );
}
