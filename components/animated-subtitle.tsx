"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

interface AnimatedSubtitleProps {
  text: string;
}

export default function AnimatedSubtitle({ text }: AnimatedSubtitleProps) {
  useLayoutEffect(() => {
    gsap.fromTo(
      ".subtitle-char",
      {
        opacity: 0,
        y: 10,
        filter: "blur(2px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
        stagger: {
          each: 0.03,
          from: "random",
        },
      }
    );
  }, [text]);

  return (
    <p className="mt-5 text-2xl font-light text-slate-800 font-serif">
      {text.split("").map((char, index) => (
        <span key={index} className="subtitle-char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}
