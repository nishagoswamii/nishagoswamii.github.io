
import React from 'react';
import { jobs } from '@/data/experienceData';
import { ExternalLink } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl font-heading font-bold mb-16">Experience</h2>

        <div className="space-y-0">
          {jobs.map((job, index) => (
            <div key={index} className="group grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 border-t border-border/60 py-12 transition-all hover:bg-card/30 px-4 -mx-4 rounded-xl">

              {/* Left Column: Dates */}
              <div className="text-sm font-mono text-muted-foreground pt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                {job.dates}
              </div>

              {/* Right Column: Content */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <h4 className="text-lg font-medium text-primary/80 mb-6">
                  {job.company}
                </h4>

                <ul className="space-y-3 text-muted-foreground/90 leading-relaxed max-w-2xl">
                  {job.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-border shrink-0 group-hover:bg-primary transition-colors"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {job.linkedInUrl && (
                    <li className="flex items-center gap-2 pt-2">
                      <a
                        href={job.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline hover:underline-offset-4 transition-all"
                      >
                        View Post <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
