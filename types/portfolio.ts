export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl: string;
  imageGallery?: string[]; // <-- TAMBAHKAN BARIS INI
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "concept";
  year: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface MinimapProps {
  viewport: CanvasViewport;
  canvasBounds: CanvasBounds;
  projects: Project[];
  onNavigate: (x: number, y: number) => void;
  viewportSize: { width: number; height: number };
}

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}
