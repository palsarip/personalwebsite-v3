"use client";

import { useLayoutEffect } from "react";
import { Github, Instagram, Linkedin, AtSign } from "lucide-react";
import gsap from "gsap";

const socials = [
  {
    href: "https://github.com/your-username",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://instagram.com/your-username",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://threads.net/your-username",
    icon: AtSign,
    label: "Threads",
  },
  {
    href: "https://linkedin.com/in/your-username",
    icon: Linkedin,
    label: "LinkedIn",
  },
];

export default function Header() {
  useLayoutEffect(() => {
    const tl = gsap.timeline();

    tl.from("#header-logo", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power3.out",
    });

    tl.from(
      "#header-socials a",
      {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
      },
      "-=0.5"
    );
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="/"
          id="header-logo"
          className="text-xl font-serif text-slate-800"
        >
          Naufal Syarif
        </a>

        <nav id="header-socials" className="flex items-center space-x-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex items-center justify-center w-10 h-10 bg-white/30 backdrop-blur-lg border border-white/40 shadow-inner rounded-full transition-colors hover:bg-white/40"
            >
              <social.icon className="w-5 h-5 text-slate-800" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
