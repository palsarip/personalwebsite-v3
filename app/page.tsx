"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import CustomCursor from "@/components/custom-cursor";
import Dock from "@/components/dock";
import Header from "@/components/header";
import HeroText from "@/components/hero-text";
import ProjectsView from "@/components/projects-view";
import AboutView from "@/components/about-view";
import ContactView from "@/components/contact-view";
import Window from "@/components/window";
import ProjectDetailContent from "@/components/project-detail-content";
import { type Project } from "@/data/projects";

type ViewId = 'home' | 'projects' | 'about' | 'contact';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
  }, [activeView]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateTo = (id: string) => {
    if (id === activeView) return;
    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveView(id as ViewId);
      }
    });
  };

  const renderView = () => {
    switch(activeView) {
      case 'projects':
        return <ProjectsView isInteractive={!selectedProject} onProjectSelect={setSelectedProject} />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'home':
      default:
        return <HeroText />;
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen cursor-none">
      <Header />
      <CustomCursor />
      
      <div ref={contentRef} className="relative z-10">
        {renderView()}
      </div>

      <Dock onNavigate={navigateTo} activeView={activeView} />

      <Window
        title={selectedProject?.title || ''}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && <ProjectDetailContent project={selectedProject} />}
      </Window>
    </main>
  );
}