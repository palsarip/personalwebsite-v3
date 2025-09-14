"use client";

import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import CustomCursor from "@/components/custom-cursor";
import Dock from "@/components/dock";
import Header from "@/components/header";
import HeroText from "@/components/hero-text";
import ProjectsView from "@/components/projects-view";
import AboutView from "@/components/about-view";
import ContactView from "@/components/contact-view";

type ViewId = "home" | "projects" | "about" | "contact";

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.inOut" }
    );
  }, [activeView]);

  const navigateTo = (id: string) => {
    if (id === activeView) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveView(id as ViewId);
      },
    });
  };

  const renderView = () => {
    switch (activeView) {
      case "projects":
        return <ProjectsView />;
      case "about":
        return <AboutView />;
      case "contact":
        return <ContactView />;
      case "home":
      default:
        return <HeroText />;
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen cursor-none">
      <Header />
      <CustomCursor />

      <div ref={contentRef}>{renderView()}</div>

      <Dock onNavigate={navigateTo} activeView={activeView} />
    </main>
  );
}
