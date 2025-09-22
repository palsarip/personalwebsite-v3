// /data/projects.ts

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  colStart: number; // 1-based grid position
  rowStart: number; // 1-based grid position
  colSpan: number; // How many columns wide
  rowSpan: number; // How many rows tall
  description?: string;
  year?: string;
  client?: string;
  services?: string[];
  images?: string[]; // Additional images for detail view
}

export const projects: Project[] = [
  {
    id: "modern-residence",
    title: "Modern Residence",
    category: "Residential Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center",
    colStart: 1,
    rowStart: 1,
    colSpan: 2, // Takes up 2 columns
    rowSpan: 1, // Takes up 1 row
    description:
      "A contemporary residential project that redefines modern living through innovative design and sustainable materials.",
    year: "2024",
    client: "Private Client",
    services: ["Architecture", "Interior Design", "Landscape"],
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da2db52?w=1200&h=800&fit=crop",
    ],
  },
  {
    id: "urban-tower",
    title: "Urban Tower",
    category: "Commercial Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop&crop=center",
    colStart: 3,
    rowStart: 1,
    colSpan: 1, // Takes up 1 column
    rowSpan: 2, // Takes up 2 rows (tall card)
    description:
      "A 40-story mixed-use tower that serves as a landmark in the city skyline while promoting sustainable urban living.",
    year: "2023",
    client: "Urban Development Corp",
    services: ["Architecture", "Urban Planning", "MEP Engineering"],
  },
  {
    id: "cultural-center",
    title: "Cultural Center",
    category: "Public Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&crop=center",
    colStart: 4,
    rowStart: 1,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "A community cultural center designed to foster local arts and bring people together through thoughtful spatial design.",
    year: "2023",
    client: "City Municipality",
    services: ["Architecture", "Acoustics", "Interior Design"],
  },
  {
    id: "sustainable-office",
    title: "Sustainable Office",
    category: "Green Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&h=600&fit=crop&crop=center",
    colStart: 1,
    rowStart: 2,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "An innovative office building that achieves net-zero energy consumption through passive design strategies.",
    year: "2024",
    client: "Tech Startup Inc",
    services: [
      "Architecture",
      "Sustainability Consulting",
      "LEED Certification",
    ],
  },
  {
    id: "luxury-hotel",
    title: "Luxury Hotel",
    category: "Hospitality Design",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&crop=center",
    colStart: 2,
    rowStart: 2,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "A boutique hotel that seamlessly blends local culture with contemporary luxury amenities.",
    year: "2023",
    client: "Hospitality Group",
    services: ["Architecture", "Interior Design", "Branding"],
  },
  {
    id: "education-campus",
    title: "Education Campus",
    category: "Educational Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=center",
    colStart: 4,
    rowStart: 2,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "A progressive school campus designed to inspire learning through flexible, interconnected spaces.",
    year: "2024",
    client: "International School",
    services: ["Architecture", "Educational Planning", "Landscape Design"],
  },
  {
    id: "waterfront-pavilion",
    title: "Waterfront Pavilion",
    category: "Landscape Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center",
    colStart: 1,
    rowStart: 3,
    colSpan: 2, // Wide card
    rowSpan: 1,
    description:
      "A public pavilion that creates a harmonious relationship between built form and natural waterscape.",
    year: "2023",
    client: "Parks Department",
    services: ["Architecture", "Landscape Design", "Environmental Planning"],
  },
  {
    id: "innovation-lab",
    title: "Innovation Lab",
    category: "Research Facility",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center",
    colStart: 3,
    rowStart: 3,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "A cutting-edge research facility designed to promote collaboration and scientific breakthrough.",
    year: "2024",
    client: "Research Institute",
    services: ["Architecture", "Lab Planning", "Technology Integration"],
  },
  {
    id: "heritage-restoration",
    title: "Heritage Restoration",
    category: "Historic Preservation",
    imageUrl:
      "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=800&h=600&fit=crop&crop=center",
    colStart: 4,
    rowStart: 3,
    colSpan: 1, // Small square card
    rowSpan: 1,
    description:
      "Careful restoration of a 19th-century building, preserving its historical character while adding modern functionality.",
    year: "2023",
    client: "Heritage Foundation",
    services: ["Historic Preservation", "Architecture", "Conservation"],
  },
];

// Helper function to get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};

// Helper function to get projects by category
export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter((project) => project.category === category);
};

// Get all unique categories
export const getCategories = (): string[] => {
  return Array.from(new Set(projects.map((project) => project.category)));
};
