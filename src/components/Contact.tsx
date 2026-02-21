
import React from 'react';

import { Mail, Linkedin, Github, Handshake } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-4xl font-heading font-bold mb-6">Let's Collaborate Guys!</h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-secondary/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-secondary/20 transition-colors">
                        <div className="bg-background p-4 rounded-full shadow-sm">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Email Me</h3>
                        <a href="mailto:nnishagoswamii@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                            nnishagoswamii@gmail.com
                        </a>
                    </div>

                    <div className="bg-secondary/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-secondary/20 transition-colors">
                        <div className="bg-background p-4 rounded-full shadow-sm">
                            <Handshake className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Connect</h3>
                        <div className="flex gap-4">
                            <a href="https://linkedin.com/in/nishagoswamii" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="https://github.com/nishagoswamii" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="https://codeforces.com/profile/nishagoswami" className="text-muted-foreground hover:text-primary transition-colors" title="Codeforces">
                                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21H1.5A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5V4.5A1.5 1.5 0 0 1 10.5 3h3zm9 9A1.5 1.5 0 0 1 24 13.5v6a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 18 19.5v-6a1.5 1.5 0 0 1 1.5-1.5h3z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
