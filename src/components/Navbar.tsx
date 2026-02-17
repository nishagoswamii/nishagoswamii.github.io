import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X } from 'lucide-react';
import { SearchCommand } from './SearchCommand';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/blog/my-journey' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
];

interface NavbarProps {
    posts?: { title: string; slug: string }[];
    projects?: { id: number; title: string; githubUrl?: string }[];
}

export function Navbar({ posts = [], projects = [] }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors">
                    Nisha.
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-6">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-2 pl-4 border-l border-border">
                        <button
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted rounded-md border border-input transition-colors"
                            onClick={() => setOpen(true)}
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden lg:inline">Search...</span>
                            <kbd className="hidden lg:inline pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-foreground"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted rounded-md border border-input transition-colors"
                            onClick={() => {
                                setOpen(true);
                                setIsMenuOpen(false);
                            }}
                        >
                            <Search className="w-4 h-4" />
                            <span>Search...</span>
                        </button>
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="block px-4 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <SearchCommand open={open} onOpenChange={setOpen} posts={posts} projects={projects} />
        </nav>
    );
}
