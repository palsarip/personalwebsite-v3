export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Project Alpha",
    category: "Web Development",
    imageUrl: "https://picsum.photos/seed/proj1/800/600",
    description:
      "A detailed description of Project Alpha, focusing on the technologies used and the problems solved. It was a challenging yet rewarding experience.",
  },
  {
    id: "proj-2",
    title: "Project Beta",
    category: "UI/UX Design",
    imageUrl: "https://picsum.photos/seed/proj2/800/600",
    description:
      "A deep dive into the design process for Project Beta. From user research to high-fidelity prototypes, every decision was data-driven.",
  },
  {
    id: "proj-3",
    title: "Project Gamma",
    category: "Mobile App",
    imageUrl: "https://picsum.photos/seed/proj3/800/600",
    description:
      "Developing a cross-platform mobile application using modern frameworks. The focus was on performance and a seamless user experience.",
  },
  {
    id: "proj-4",
    title: "Project Delta",
    category: "Branding",
    imageUrl: "https://picsum.photos/seed/proj4/800/600",
    description:
      "Crafting a unique brand identity for a startup. This involved creating a logo, style guide, and marketing materials from scratch.",
  },
  // Tambahkan lebih banyak proyek di sini jika perlu
];
