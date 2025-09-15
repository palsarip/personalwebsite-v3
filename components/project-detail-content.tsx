import type { Project } from '@/data/projects';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  return (
    <div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
        <Image src={project.image} alt={project.title} fill className="object-cover" />
      </div>
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between">
        <h2 className="text-4xl font-serif font-bold text-slate-800">{project.title}</h2>
        <ArrowUpRight className="w-8 h-8 text-slate-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </a>
      <p className="text-lg text-slate-600 mt-2">{project.description}</p>
      <div className="flex items-center gap-2 mt-6 flex-wrap">
        {project.tags.map((tag) => (
          <span key={tag} className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}