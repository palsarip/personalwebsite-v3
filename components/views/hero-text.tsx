"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const TextContent = ({ shouldAnimate }: { shouldAnimate: boolean }) => {
  const subtitle =
    "Software Engineer. AI Enthusiast. Crafting tomorrow's tech.";

  return (
    <div className="text-center min-h-[120px]">
      <h1 className="text-8xl font-normal italic tracking-tight text-slate-800 font-serif">
        {"Naufal Syarif".split("").map((char, index) => (
          <span
            key={index}
            className={
              shouldAnimate ? "name-char inline-block" : "inline-block"
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className="mt-5 text-xl font-light text-slate-800 font-serif">
        {subtitle.split("").map((char, index) => (
          <span
            key={index}
            className={
              shouldAnimate ? "subtitle-char inline-block" : "inline-block"
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default function HeroText() {
  // Use a dedicated ref for the area that listens to mouse events
  const interactionAreaRef = useRef<HTMLDivElement | null>(null);
  const distortedLayerRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const turbulenceTimeline = useRef<gsap.core.Timeline | null>(null);

  // Animate ONLY the base layer on mount
  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".name-char",
      { opacity: 0, y: 10, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: { each: 0.05, from: "random" },
      }
    );
    tl.fromTo(
      ".subtitle-char",
      { opacity: 0, y: 10, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
        stagger: { each: 0.03, from: "random" },
      },
      "-=0.8"
    );
  }, []);

  // Setup the distortion effect listeners
  useLayoutEffect(() => {
    // Target the new ref for mouse events
    const interactionArea = interactionAreaRef.current;
    const distortedLayer = distortedLayerRef.current;
    if (!interactionArea || !distortedLayer) return;

    const quickToX = gsap.quickTo(distortedLayer, "--clip-x", {
      duration: 0.5,
      ease: "power3",
    });
    const quickToY = gsap.quickTo(distortedLayer, "--clip-y", {
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
      // Get position relative to the interactionArea
      const { top, left } = interactionArea.getBoundingClientRect();
      quickToX(clientX - left);
      quickToY(clientY - top);
    };

    const handleMouseEnter = () => {
      gsap.to(filterRef.current, {
        attr: { scale: 50 },
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(distortedLayer, {
        "--clip-size": 120,
        duration: 0.5,
        ease: "power3.out",
      });
      turbulenceTimeline.current?.play();
    };

    const handleMouseLeave = () => {
      gsap.to(filterRef.current, {
        attr: { scale: 0 },
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(distortedLayer, {
        "--clip-size": 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
      turbulenceTimeline.current?.pause();
    };

    interactionArea.addEventListener("mousemove", handleMouseMove);
    interactionArea.addEventListener("mouseenter", handleMouseEnter);
    interactionArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      interactionArea.removeEventListener("mousemove", handleMouseMove);
      interactionArea.removeEventListener("mouseenter", handleMouseEnter);
      interactionArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center max-w-3xl w-full p-12 sm:p-16 cursor-pointer">
      {/* Dedicated grid background layer */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, transparent 20%, #f8f9fa),
            linear-gradient(to right, #e0e0e0 1px, transparent 1px),
            linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)
          `,
          backgroundSize: `100% 100%, 40px 40px, 40px 40px`,
        }}
      />

      {/* This is now the main interaction area */}
      <div ref={interactionAreaRef} className="relative z-10 w-full">
        {/* Layer 1: Base, undistorted text. */}
        <div className="opacity-100">
          <TextContent shouldAnimate={true} />
        </div>

        {/* Layer 2: Clipped, distorted text. */}
        <div
          ref={distortedLayerRef}
          className="absolute inset-0 bg-[#F8F9FA]"
          style={
            {
              "--clip-size": "0px",
              "--clip-x": "0px",
              "--clip-y": "0px",
              clipPath:
                "circle(var(--clip-size) at var(--clip-x) var(--clip-y))",
              filter: `url(#liquid-distortion-filter)`,
            } as React.CSSProperties
          }
        >
          <TextContent shouldAnimate={false} />
        </div>
      </div>

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
