"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import CustomCursor from "@/components/ui/custom-cursor";
import HeroText from "@/components/views/hero-text";
import LazyWrapper, {
  LazyPortfolioView,
  LazyAboutView,
  LazyContactView,
} from "@/components/utils/lazy-wrapper";
import LayoutWrapper from "@/components/layout/layout-wrapper";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { trackPageView, trackInteraction } from "@/lib/analytics";

type ViewId = "home" | "portfolio" | "about" | "contact";

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isTouchDevice = useTouchDevice();

  // Keyboard navigation
  useKeyboardNavigation({
    onArrowKeys: (direction) => {
      if (activeView === "home") {
        // Navigate between dock items with arrow keys
        const views: ViewId[] = ["home", "portfolio", "about", "contact"];
        const currentIndex = views.indexOf(activeView);

        if (direction === "right" && currentIndex < views.length - 1) {
          const nextView = views[currentIndex + 1];
          if (nextView) navigateTo(nextView);
        } else if (direction === "left" && currentIndex > 0) {
          const prevView = views[currentIndex - 1];
          if (prevView) navigateTo(prevView);
        }
      }
    },
    enabled: true,
  });

  useLayoutEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.inOut" }
    );
  }, [activeView]);

  useEffect(() => {
    trackPageView(activeView);
  }, [activeView]);

  const navigateTo = (id: string) => {
    if (id === activeView || isLoading) return;

    setIsLoading(true);
    trackInteraction("navigate", id);

    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveView(id as ViewId);
        setIsLoading(false);

        // Focus management for accessibility
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus();
        }
      },
    });
  };

  const renderView = () => {
    switch (activeView) {
      case "portfolio":
        return (
          <LazyWrapper>
            <LazyPortfolioView />
          </LazyWrapper>
        );
      case "about":
        return (
          <LazyWrapper>
            <LazyAboutView />
          </LazyWrapper>
        );
      case "contact":
        return (
          <LazyWrapper>
            <LazyContactView />
          </LazyWrapper>
        );
      case "home":
      default:
        return <HeroText />;
    }
  };

  return (
    <LayoutWrapper onNavigate={navigateTo} activeView={activeView}>
      <main
        className={`relative flex items-center justify-center min-h-screen ${
          !isTouchDevice ? "cursor-none" : ""
        }`}
        role="main"
      >
        <CustomCursor />

        <div
          ref={contentRef}
          className="relative z-10"
          id="main-content"
          tabIndex={-1}
          aria-live="polite"
          aria-label={`Current view: ${activeView}`}
        >
          {renderView()}
        </div>
      </main>
    </LayoutWrapper>
  );
}
