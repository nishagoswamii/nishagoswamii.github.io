import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/portfolioData';
import Sticker from './Sticker';
import StickerTitle from './StickerTitle';

export default function Projects() {
  return (
    <section id="projects" className="book-section sheet-purple page-top">
      <StickerTitle text="Projects" as="h1" />
      <div className="section-sticker"><Sticker mood="thumbs" react="wow" /></div>
      <div className="polaroid-grid">
        {projects.map((project, index) => (
          <div key={project.id} className="polaroid-slot" data-deal style={{ '--from-x': index % 2 ? '-52%' : '52%', '--rot': index % 2 ? '1.2deg' : '-1.2deg', '--from-rot': index % 2 ? '-7deg' : '6deg' } as CSSProperties}>
            <a href={project.externalLink?.url || project.githubUrl} target="_blank" rel="noreferrer" className="polaroid" data-drag draggable={false}>
              <span className="polaroid-face">
                <span className="tape-bit" aria-hidden="true" />
                <span className="polaroid-image" data-cycle>
                  {project.images.map((image, imageIndex) => (
                    <img key={image} src={image} loading="lazy" width="1000" height="750" draggable={false} alt={imageIndex === 0 ? project.title : ''} className={imageIndex === 0 ? 'active' : ''} />
                  ))}
                </span>
                <span className="polaroid-caption">
                  <strong>{project.title}</strong>
                  <em>{project.short}</em>
                  <ArrowUpRight aria-hidden="true" size={26} />
                </span>
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
