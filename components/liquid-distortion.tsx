"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface LiquidDistortionProps {
  children: React.ReactNode;
}

export default function LiquidDistortion({ children }: LiquidDistortionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);

  const turbulenceTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use GSAP to update CSS variables for the clip-path position. This is highly performant.
    const quickToX = gsap.quickTo(container, "--clip-x", {
      duration: 0.5,
      ease: "power3",
    });
    const quickToY = gsap.quickTo(container, "--clip-y", {
      duration: 0.5,
      ease: "power3",
    });

    turbulenceTimeline.current = gsap
      .timeline({ paused: true, repeat: -1, yoyo: true })
      .to(turbulenceRef.current, {
        attr: { baseFrequency: 0.015 },
        duration: 10,
        ease: "power2.inOut",
      });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { top, left } = container.getBoundingClientRect();
      quickToX(clientX - left);
      quickToY(clientY - top);
    };

    const handleMouseEnter = () => {
      gsap.to(filterRef.current, {
        attr: { scale: 50 },
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(container, {
        "--clip-size": 120,
        duration: 0.5,
        ease: "power3.out",
      }); // Animate clip-path size
      turbulenceTimeline.current?.play();
    };

    const handleMouseLeave = () => {
      gsap.to(filterRef.current, {
        attr: { scale: 0 },
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(container, {
        "--clip-size": 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
      turbulenceTimeline.current?.pause();
    };

    // We add listeners to the parent element in HeroText, but the logic is here.
    // This is a placeholder to show the logic is encapsulated. The actual listeners
    // will be on the parent container in the next file.
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter); // These should be attached to the hover area
    window.addEventListener("mouseleave", handleMouseLeave); // in the HeroText component.

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={
        {
          "--clip-size": "0px",
          "--clip-x": "0px",
          "--clip-y": "0px",
          clipPath: "circle(var(--clip-size) at var(--clip-x) var(--clip-y))",
          filter: `url(#liquid-distortion-filter)`,
        } as React.CSSProperties
      }
    >
      {/* The duplicated, distorted content will go here */}
      {children}

      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <filter id="liquid-distortion-filter">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="1"
            result="turbulence"
          />
          <feDisplacementMap
            ref={filterRef}
            in="SourceGraphic"
            in2="turbulence"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}
