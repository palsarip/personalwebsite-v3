"use client";

import { useRef, useLayoutEffect } from 'react';
import { Home, FolderKanban, User, Mail } from 'lucide-react';
import gsap from 'gsap';

const dockItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
];

interface DockProps {
  onNavigate: (id: string) => void;
  activeView: string;
}

export default function Dock({ onNavigate, activeView }: DockProps) {
  const dockRef = useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const icon = e.currentTarget.querySelector('.dock-icon');
    gsap.timeline()
      .to(icon, { scale: 0.9, duration: 0.1, ease: 'power2.inOut' })
      .to(icon, { scale: 1.25, duration: 0.4, ease: 'back.out(1.7)' });
    onNavigate(id);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget.querySelector('.dock-icon');
    gsap.to(icon, { scale: 1.25, duration: 0.3, ease: 'power3.out' });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget.querySelector('.dock-icon');
    gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power3.out' });
  };
  
  useLayoutEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(dockRef.current, { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" });
    tl.from(".dock-item", { opacity: 0, y: 20, scale: 0.5, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1 }, "-=0.3");
  }, []);

  return (
    <footer ref={dockRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-center h-16 p-2 space-x-4 bg-white/30 backdrop-blur-lg border border-white/40 shadow-inner rounded-2xl">
        {dockItems.map((item) => (
          <button 
            key={item.id}
            className="dock-item relative flex items-center justify-center w-12 h-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, item.id)}
            aria-label={item.label}
          >
            <div
              className={`absolute inset-0 bg-slate-200/50 backdrop-blur-lg border border-slate-300/50 shadow-inner rounded-xl transition-opacity duration-300
                ${activeView === item.id ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="relative z-10">
              <div className="dock-icon">
                <item.icon className="w-8 h-8 text-slate-800" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </footer>
  );
}