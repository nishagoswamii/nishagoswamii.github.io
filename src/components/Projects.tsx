
import React from 'react';
import { projects } from '@/data/portfolioData';
import { ArrowUpRight, Github } from 'lucide-react';
import { Button } from './ui/button';

export default function Projects() {
    return (
        <section id="projects" className="py-24 bg-secondary/5">
            <div className="container mx-auto px-4 max-w-5xl z-10 relative">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-heading font-bold mb-6">Projects</h2>
                    <p className="text-muted-foreground text-lg">
                        A small selection of projects that showcase my passion for building things!
                    </p>
                </div>

                <div className="flex flex-col gap-16">
                    {projects.map((project, i) => (
                        <div key={project.id} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Image Section */}
                            <div className="w-full md:w-2/5 group">
                                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl aspect-video">
                                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-3/5 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.slice(0, 4).map(tag => (
                                        <span key={tag} className="px-3 py-1 text-xs font-mono font-medium tracking-wider rounded-full border border-primary/20 text-primary bg-primary/5 uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {project.githubUrl ? (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition-colors inline-block"
                                    >
                                        <h3 className="text-2xl md:text-3xl font-special font-bold text-foreground leading-tight flex items-center gap-3">
                                            {project.title}
                                            <Github className="w-5 h-5 md:w-6 md:h-6 inline-block" />
                                        </h3>
                                    </a>
                                ) : (
                                    <h3 className="text-2xl md:text-3xl font-special font-bold text-foreground leading-tight">
                                        {project.title}
                                    </h3>
                                )}

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {project.summary}
                                </p>

                                <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                                    <h4 className="text-sm font-bold font-heading mb-2">The Solution</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {project.details.solution}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    {project.externalLink && (
                                        <Button variant="outline" className="group rounded-full pl-6 pr-4" asChild>
                                            <a href={project.externalLink.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                                View Project
                                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center -mr-2 group-hover:bg-primary/90 transition-colors">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
