"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import CustomCursor from "@/components/custom-cursor";
import Dock from "@/components/dock";
import Header from "@/components/header";
import HeroText from "@/components/hero-text";
import LazyWrapper, {
  LazyPortfolioView,
  LazyAboutView,
  LazyContactView,
} from "@/components/lazy-wrapper";
import ErrorBoundary from "@/components/error-boundary";
import SkipNavigation from "@/components/skip-navigation";
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
          navigateTo(views[currentIndex + 1]);
        } else if (direction === "left" && currentIndex > 0) {
          navigateTo(views[currentIndex - 1]);
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
    <>
      <SkipNavigation />
      <ErrorBoundary>
        <main
          className={`relative flex items-center justify-center min-h-screen ${
            !isTouchDevice ? "cursor-none" : ""
          }`}
          role="main"
        >
          <Header />
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

          <Dock onNavigate={navigateTo} activeView={activeView} />
        </main>
      </ErrorBoundary>
    </>
  );
}
