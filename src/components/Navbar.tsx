import { useEffect, useRef, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { SearchCommand } from './SearchCommand';

const links = [{name:'Projects',href:'/projects'},{name:'Writing',href:'/blog'},{name:'About',href:'/blog/my-journey'},{name:'Contact',href:'/#contact'},{name:'Resume',href:'/resume.pdf',newTab:true}];
interface NavbarProps { posts?: {title:string;slug:string}[]; projects?: {id:number;title:string;githubUrl?:string}[]; }
export function Navbar({posts=[],projects=[]}:NavbarProps) {
  const [menu,setMenu]=useState(false);
  const [search,setSearch]=useState(false);
  const nav=useRef<HTMLElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    const keys=(event:KeyboardEvent)=>{
      if(event.key==='k'&&(event.ctrlKey||event.metaKey)){event.preventDefault();setSearch(v=>!v);}
      if(event.key==='Escape'){setMenu(false);toggle.current?.focus();}
    };
    const outside=(event:PointerEvent)=>{if(!nav.current?.contains(event.target as Node))setMenu(false);};
    document.addEventListener('keydown',keys);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',keys);document.removeEventListener('pointerdown',outside);};
  },[]);
  return <nav className="sky-nav" ref={nav} aria-label="Main navigation">
    <div className="nav-inner"><a className="wordmark" href="/" aria-label="Nisha Goswami home">nisha</a>
      <div className="nav-tools"><div className="desktop-nav">{links.map(link=><a key={link.name} href={link.href} target={link.newTab?'_blank':undefined} rel={link.newTab?'noreferrer':undefined}>{link.name}</a>)}</div><button className="nav-search" onClick={()=>setSearch(true)} aria-label="Search the site" title="Search (Ctrl or ⌘ K)"><Search aria-hidden="true"/><span>Search</span></button><button ref={toggle} className="icon-button mobile-toggle" onClick={()=>setMenu(v=>!v)} aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} aria-controls="mobile-nav">{menu?<X size={20}/>:<Menu size={20}/>}</button></div>
    </div>
    {menu&&<div id="mobile-nav" className="mobile-nav">{links.map(link=><a key={link.name} href={link.href} target={link.newTab?'_blank':undefined} rel={link.newTab?'noreferrer':undefined} onClick={()=>setMenu(false)}>{link.name}</a>)}</div>}
    <SearchCommand open={search} onOpenChange={setSearch} posts={posts} projects={projects}/>
  </nav>;
}
