import { type Project } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({
  project,
}: ProjectDetailContentProps) {
  return (
    <div className="p-4">
      <h3 className="text-4xl font-serif font-normal text-slate-900">
        {project.title}
      </h3>
      <a
        href="#" // Ganti dengan link proyek asli jika ada
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mt-2"
      >
        Lihat Proyek <ArrowUpRight className="w-4 h-4" />
      </a>
      <p className="text-lg text-slate-600 mt-6 leading-relaxed">
        {project.description}
      </p>

      {/* Tampilkan tag di sini */}
      <div className="flex items-center gap-2 mt-6 flex-wrap">
        {/* Gunakan optional chaining (?.) untuk keamanan jika tags tidak ada */}
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
