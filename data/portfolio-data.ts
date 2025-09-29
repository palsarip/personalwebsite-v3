import { Project } from "@/types/portfolio";

// Canvas dimensions and project positioning
const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 2000;

export const portfolioProjects: Project[] = [
  {
    id: "1",
    title: "AI Analytics Dashboard",
    description:
      "Machine learning powered analytics platform with real-time insights and predictive capabilities.",
    category: "AI/ML",
    technologies: ["React", "Python", "TensorFlow", "PostgreSQL"],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=400&fit=crop",
    ],
    liveUrl: "https://analytics-demo.example.com",
    githubUrl: "https://github.com/example/analytics",
    featured: true,
    status: "completed",
    year: 2024,
    x: 400,
    y: 300,
    width: 320,
    height: 240,
  },
  {
    id: "2",
    title: "E-commerce Mobile App",
    description:
      "Modern shopping experience with seamless checkout and personalized recommendations.",
    category: "Mobile",
    technologies: ["React Native", "Node.js", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580974928064-7fb797c4446b?w=400&h=400&fit=crop",
    ],
    liveUrl: "https://shop-app.example.com",
    featured: false,
    status: "completed",
    year: 2024,
    x: 800,
    y: 200,
    width: 280,
    height: 200,
  },
  {
    id: "3",
    title: "Design System Library",
    description:
      "Comprehensive component library with design tokens and documentation.",
    category: "Design",
    technologies: ["Figma", "Storybook", "React", "Tailwind"],
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=400&fit=crop",
    ],
    featured: true,
    status: "completed",
    year: 2023,
    x: 200,
    y: 600,
    width: 300,
    height: 220,
  },
  {
    id: "4",
    title: "Blockchain DeFi Platform",
    description:
      "Decentralized finance platform with yield farming and automated market making.",
    category: "Web3",
    technologies: ["Solidity", "Web3.js", "React"],
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1642183533282-12cb38356d53?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1640280144322-a502a5b69a2d?w=400&h=400&fit=crop",
    ],
    githubUrl: "https://github.com/example/defi",
    featured: false,
    status: "in-progress",
    year: 2024,
    x: 1200,
    y: 400,
    width: 280,
    height: 200,
  },
  {
    id: "5",
    title: "Cloud Infrastructure",
    description:
      "Scalable cloud infrastructure with automated CI/CD and monitoring.",
    category: "DevOps",
    technologies: ["AWS", "Terraform", "Docker", "Kubernetes"],
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614728263952-84ea256ec346?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
    ],
    featured: false,
    status: "completed",
    year: 2023,
    x: 600,
    y: 700,
    width: 260,
    height: 180,
  },
  {
    id: "6",
    title: "Real-time Chat App",
    description:
      "Modern chat application with video calls and team collaboration features.",
    category: "Web",
    technologies: ["Next.js", "Socket.io", "WebRTC"],
    imageUrl:
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1535329367283-d34a414347af?w=400&h=400&fit=crop",
    ],
    liveUrl: "https://chat-app.example.com",
    githubUrl: "https://github.com/example/chat",
    featured: true,
    status: "completed",
    year: 2024,
    x: 1000,
    y: 650,
    width: 300,
    height: 220,
  },
  {
    id: "7",
    title: "Data Visualization Tool",
    description:
      "Interactive data visualization platform for complex datasets.",
    category: "Data",
    technologies: ["D3.js", "React", "Python", "FastAPI"],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579532582937-16c108930bf6?w=400&h=400&fit=crop",
    ],
    featured: false,
    status: "concept",
    year: 2024,
    x: 1400,
    y: 250,
    width: 280,
    height: 200,
  },
  {
    id: "8",
    title: "IoT Dashboard",
    description: "Real-time monitoring dashboard for IoT devices and sensors.",
    category: "IoT",
    technologies: ["React", "MQTT", "InfluxDB", "Grafana"],
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    // ✅ Gallery added
    imageGallery: [
      "https://images.unsplash.com/photo-1581442194129-6339d224d039?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558556403-30a0a8f8b2c4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519455981358-3f5f3a6a1a72?w=400&h=400&fit=crop",
    ],
    featured: false,
    status: "completed",
    year: 2023,
    x: 300,
    y: 900,
    width: 260,
    height: 180,
  },
];

export const canvasBounds = {
  minX: 0,
  maxX: CANVAS_WIDTH,
  minY: 0,
  maxY: CANVAS_HEIGHT,
};
