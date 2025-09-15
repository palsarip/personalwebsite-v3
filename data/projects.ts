export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  colSpan: number;
  rowSpan: number;
  colStart: number;
  rowStart: number;
  tags?: string[]; // <-- TAMBAHKAN INI (tanda ? membuatnya opsional)
}

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Project Alpha",
    category: "Web Development",
    imageUrl: "https://picsum.photos/seed/proj1/1200/1200",
    description: "A detailed description of Project Alpha...",
    colSpan: 2,
    rowSpan: 2,
    colStart: 1,
    rowStart: 1,
    tags: ["Next.js", "React", "GSAP", "TypeScript"], // <-- TAMBAHKAN DATA TAGS
  },
  {
    id: "proj-2",
    title: "Project Beta",
    category: "UI/UX Design",
    imageUrl: "https://picsum.photos/seed/proj2/1200/600",
    description: "A deep dive into the design process for Project Beta...",
    colSpan: 2,
    rowSpan: 1,
    colStart: 3,
    rowStart: 1,
    tags: ["Figma", "UI Design", "User Research"],
  },
  {
    id: "proj-3",
    title: "Project Gamma",
    category: "Mobile App",
    imageUrl: "https://picsum.photos/seed/proj3/600/1200",
    description: "Developing a cross-platform mobile application...",
    colSpan: 1,
    rowSpan: 2,
    colStart: 3,
    rowStart: 2,
    tags: ["React Native", "Firebase"],
  },
  {
    id: "proj-4",
    title: "Project Delta",
    category: "Branding",
    imageUrl: "https://picsum.photos/seed/proj4/600/600",
    description: "Crafting a unique brand identity for a startup...",
    colSpan: 1,
    rowSpan: 1,
    colStart: 4,
    rowStart: 2,
    tags: ["Branding", "Illustration"],
  },
  {
    id: "proj-5",
    title: "Project Epsilon",
    category: "AI Integration",
    imageUrl: "https://picsum.photos/seed/proj5/600/600",
    description: "Integrating AI models into existing infrastructure...",
    colSpan: 1,
    rowSpan: 1,
    colStart: 4,
    rowStart: 3,
    tags: ["Python", "Machine Learning"],
  },
  {
    id: "proj-6",
    title: "Project Zeta",
    category: "Cloud Architecture",
    imageUrl: "https://picsum.photos/seed/proj6/1200/600",
    description: "Designing a scalable cloud architecture...",
    colSpan: 2,
    rowSpan: 1,
    colStart: 1,
    rowStart: 3,
    tags: ["AWS", "Terraform", "CI/CD"],
  },
];
