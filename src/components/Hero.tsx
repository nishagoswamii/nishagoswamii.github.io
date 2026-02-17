
import React from 'react';
import { Button } from './ui/button';
import { ArrowDown, MoveRight } from 'lucide-react';

const heroData = {
  name: "Nisha Goswami",
  title: " Engineer & Writer ",
  description: "Bridging the gap between complex AI algorithms and intuitive user interfaces. I build intelligent systems that feel human.",
  knowingMe: {
    text: "From curious childhood experiments to training complex ML models, my journey has been driven by an insatiable hunger to understand 'how'. I'm currently documenting my entire life path—failures, learnings, and small wins—in a detailed blog series.",
  }
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center py-20 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">
        {/* Flex layout for vertical stacking */}
        <div className="flex flex-col gap-16 items-center lg:items-start max-w-5xl mx-auto">

          {/* Top: Main Heading */}
          <div className="space-y-8 relative z-10 w-full text-center lg:text-left">

            {/* Name with creative font - Split Layout */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 text-left w-full flex flex-col items-center lg:items-start">
              <p className="text-3xl md:text-5xl font-special text-muted-foreground font-light mb-2">
                Hi, I'm
              </p>
              <h1 className="text-7xl md:text-9xl font-special font-bold text-foreground leading-[0.85] tracking-tighter text-primary">
                Nisha Goswami
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {heroData.title}
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="rounded-full text-base px-8 h-12 bg-foreground text-background hover:bg-foreground/90" asChild>
                <a href="#projects">View Work</a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-base px-8 h-12" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>

          {/* Bottom: Knowing Me - Stacked Below */}
          <div className="relative w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="relative w-full max-w-4xl mx-auto lg:mx-0">
              {/* Horizontal Card for Stacked Layout */}
              <div className="relative bg-card/40 backdrop-blur-xl border border-border p-6 rounded-[2rem] shadow-2xl overflow-hidden group flex flex-col md:flex-row gap-8 items-center">

                {/* Childhood Image */}
                <div className="relative w-full md:w-1/3 aspect-[4/5] md:aspect-square overflow-hidden rounded-[1.5rem] bg-muted shrink-0">
                  <img
                    src="/Images/childhood.jpg"
                    alt="Childhood memory"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent w-full">
                    <div className="text-[10px] font-mono opacity-80 uppercase tracking-widest">The Start</div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-special font-bold leading-tight">It started with a curiosity.</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {heroData.knowingMe.text}
                  </p>

                  <div className="pt-2 flex justify-center md:justify-start">
                    <Button variant="link" className="p-0 h-auto font-heading font-bold text-primary hover:text-primary/80 group/btn" asChild>
                      <a href="/blog/my-journey" className="flex items-center gap-2">
                        Read My Full Journey <MoveRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
