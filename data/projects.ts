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
}

export const projects: Project[] = [
  // Item utama yang besar
  {
    id: "proj-1",
    title: "Project Alpha",
    category: "Web Development",
    imageUrl: "https://picsum.photos/seed/proj1/1200/1200",
    description: "A detailed description of Project Alpha...",
    colSpan: 2, // Lebar 2 unit
    rowSpan: 2, // Tinggi 2 unit
    colStart: 1, // Mulai di kolom 1
    rowStart: 1, // Mulai di baris 1
  },
  // Item horizontal panjang
  {
    id: "proj-2",
    title: "Project Beta",
    category: "UI/UX Design",
    imageUrl: "https://picsum.photos/seed/proj2/1200/600",
    description: "A deep dive into the design process for Project Beta...",
    colSpan: 2, // Lebar 2 unit
    rowSpan: 1, // Tinggi 1 unit
    colStart: 3, // Mulai di kolom 3
    rowStart: 1, // Mulai di baris 1
  },
  // Item vertikal
  {
    id: "proj-3",
    title: "Project Gamma",
    category: "Mobile App",
    imageUrl: "https://picsum.photos/seed/proj3/600/1200",
    description: "Developing a cross-platform mobile application...",
    colSpan: 1, // Lebar 1 unit
    rowSpan: 2, // Tinggi 2 unit
    colStart: 3, // Mulai di kolom 3
    rowStart: 2, // Mulai di baris 2
  },
  // Item persegi kecil
  {
    id: "proj-4",
    title: "Project Delta",
    category: "Branding",
    imageUrl: "https://picsum.photos/seed/proj4/600/600",
    description: "Crafting a unique brand identity for a startup...",
    colSpan: 1, // Lebar 1 unit
    rowSpan: 1, // Tinggi 1 unit
    colStart: 4, // Mulai di kolom 4
    rowStart: 2, // Mulai di baris 2
  },
  // Item persegi kecil lainnya
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
  },
  // Item horizontal di baris bawah
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
  },
];
