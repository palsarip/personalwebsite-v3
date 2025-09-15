"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { type Project } from "@/data/projects";

// Konstanta grid tetap kita gunakan
export const GRID_UNIT = 200;
export const GAP = 20;

interface ProjectItemProps {
  project: Project;
  onSelect: (project: Project) => void;
  style?: React.CSSProperties;
}

export default function ProjectItem({
  project,
  onSelect,
  style,
}: ProjectItemProps) {
  const cardRef = useRef<HTMLButtonElement | null>(null);

  const width = project.colSpan * GRID_UNIT + (project.colSpan - 1) * GAP;
  const height = project.rowSpan * GRID_UNIT + (project.rowSpan - 1) * GAP;

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  // --- LOGIKA BARU UNTUK ALIGNMENT ---
  // Cek apakah ini kartu kecil (1x1)
  const isSmallCard = project.colSpan === 1 && project.rowSpan === 1;

  // Tentukan class untuk positioning & alignment berdasarkan ukuran kartu
  const typographyContainerClasses = isSmallCard
    ? "absolute inset-0 flex flex-col items-center justify-center p-4 text-center" // Untuk kartu kecil: center
    : "absolute bottom-0 left-0 p-8 text-left"; // Untuk kartu besar: rata kiri

  // Tentukan class untuk ukuran font judul berdasarkan ukuran kartu
  const titleClasses = isSmallCard
    ? "text-xl font-serif font-normal italic mb-1" // Judul lebih kecil
    : "text-3xl font-serif font-normal italic mb-1"; // Judul lebih besar

  return (
    <button
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden shadow-lg"
      style={{
        ...style,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

      {/* Terapkan class dinamis di sini */}
      <div
        className={`${typographyContainerClasses} text-white
                      opacity-0 translate-y-4 
                      transition-all duration-500 ease-out 
                      group-hover:opacity-100 group-hover:translate-y-0`}
      >
        <h3 className={titleClasses}>{project.title}</h3>
        <p className="text-sm font-sans font-light text-white/80 tracking-wider">
          {project.category}
        </p>
      </div>
    </button>
  );
}
