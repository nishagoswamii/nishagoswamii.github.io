import React from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from './ui/command';
import { FileText, Github, Home, Layout, Radio, User } from 'lucide-react';

interface LinkItem {
    name: string;
    href: string;
}

interface ProjectItem {
    id: number;
    title: string;
    githubUrl?: string;
}

interface PostItem {
    title: string;
    slug: string;
}

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    posts?: PostItem[];
    projects?: ProjectItem[];
}

export function SearchCommand({ open, onOpenChange, posts = [], projects = [] }: SearchCommandProps) {
    const [query, setQuery] = React.useState('');
    const linkedProjects = projects.filter(project => project.githubUrl);

    const runCommand = React.useCallback((command: () => unknown) => {
        onOpenChange(false);
        command();
    }, [onOpenChange]);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search projects, writing, and more..." value={query} onValueChange={setQuery} />
            <CommandList className="thin-scrollbar">
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Explore">
                    <CommandItem onSelect={() => runCommand(() => window.location.href = '/')}>
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.location.href = '/blog/my-journey')}>
                        <User className="mr-2 h-4 w-4" />
                        About
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.location.href = '/projects')}>
                        <Layout className="mr-2 h-4 w-4" />
                        Projects
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.location.href = '/blog')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Writing
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.location.href = '/#contact')}>
                        <Radio className="mr-2 h-4 w-4" />
                        Say hello
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.open('/resume.pdf', '_blank'))}>
                        <FileText className="mr-2 h-4 w-4" />
                        Resume
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                {linkedProjects.length > 0 && (
                    <CommandGroup heading="Projects">
                        {linkedProjects.map((project) => (
                            <CommandItem key={project.id} onSelect={() => runCommand(() => window.open(project.githubUrl, '_blank'))}>
                                <Github className="mr-2 h-4 w-4" />
                                {project.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                <CommandSeparator />

                {posts.length > 0 && (
                    <CommandGroup heading="Writing">
                        {posts.map((post) => (
                            <CommandItem key={post.slug} onSelect={() => runCommand(() => window.location.href = `/blog/${post.slug}`)}>
                                <FileText className="mr-2 h-4 w-4" />
                                {post.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

            </CommandList>
        </CommandDialog>
    );
}
