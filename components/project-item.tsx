import Image from "next/image";
import { type Project } from "@/data/projects";

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
  return (
    <button
      onClick={() => onSelect(project)}
      className="group relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:!scale-105"
      style={style}
    >
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-serif text-white">{project.title}</h3>
        <p className="text-sm text-white/80">{project.category}</p>
      </div>
    </button>
  );
}
