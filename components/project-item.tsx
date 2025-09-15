"use client";

import type { Project } from '@/data/projects';
import Image from 'next/image';

interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
  style: React.CSSProperties;
}

export default function ProjectItem({ project, onSelect, style }: ProjectItemProps) {
  return (
    <button
      className="group absolute w-[400px] h-[300px] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
      style={style}
      onClick={onSelect}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-300"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />
      <h3 className="absolute bottom-4 left-4 text-white text-xl font-serif font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {project.title}
      </h3>
    </button>
  );
}