"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "GSAP",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "UI/UX Design",
  "Figma",
];

export default function AboutView() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    // Pastikan kita memiliki konteks GSAP untuk cleanup yang lebih baik
    const ctx = gsap.context(() => {
      // Timeline untuk mengurutkan animasi
      const tl = gsap.timeline();

      // Animasikan judul, narasi, dan daftar keahlian secara berurutan
      tl.from(".about-title", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".about-p",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.4"
        )
        .from(
          ".skill-item",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.4"
        );
    }, containerRef);

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto p-8 text-slate-800">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Kolom Kiri: Narasi */}
        <div className="lg:w-2/3">
          <h2 className="about-title text-5xl font-serif font-normal italic mb-6">
            Crafting Digital Experiences
          </h2>
          <p className="about-p text-lg font-sans text-slate-600 leading-relaxed">
            Saya adalah seorang software engineer dengan hasrat mendalam untuk
            perpaduan antara desain yang indah dan kode yang fungsional. Bagi
            saya, setiap baris kode adalah kesempatan untuk menciptakan
            interaksi yang intuitif dan pengalaman yang tak terlupakan.
          </p>
          <p className="about-p mt-4 text-lg font-sans text-slate-600 leading-relaxed">
            Perjalanan saya didorong oleh rasa ingin tahu yang tak pernah padam
            untuk mempelajari teknologi baru dan menerapkannya untuk memecahkan
            masalah di dunia nyata.
          </p>
        </div>

        {/* Kolom Kanan: Keahlian */}
        <div className="lg:w-1/3 mt-10 lg:mt-0">
          <h3 className="about-title text-3xl font-serif mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="skill-item bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
