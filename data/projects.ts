export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  role: string;
  timeline: string;
};

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'AI-Powered Task Manager',
    description: 'An intelligent to-do list that categorizes and prioritizes tasks using machine learning.',
    image: 'https://picsum.photos/seed/proj1/800/600',
    tags: ['Next.js', 'Python', 'AI', 'Tailwind CSS'],
    link: '#',
    role: 'Full-Stack Developer',
    timeline: '3 Weeks (2025)',
  },
  {
    id: 'proj-2',
    title: 'Interactive Data Visualization',
    description: 'A web app for visualizing complex financial datasets with D3.js and React.',
    image: 'https://picsum.photos/seed/proj2/800/600',
    tags: ['React', 'D3.js', 'TypeScript'],
    link: '#',
    role: 'Frontend Developer',
    timeline: '1 Month (2025)',
  },
  {
    id: 'proj-3',
    title: 'E-commerce Platform',
    description: 'A full-stack online store with a custom CMS and payment integration.',
    image: 'https://picsum.photos/seed/proj3/800/600',
    tags: ['Bun', 'PostgreSQL', 'Stripe', 'GSAP'],
    link: '#',
    role: 'Lead Developer',
    timeline: '2 Months (2024)',
  },
  {
    id: 'proj-4',
    title: 'Creative Agency Portfolio',
    description: 'A visually-driven portfolio website for a design agency with complex animations.',
    image: 'https://picsum.photos/seed/proj4/800/600',
    tags: ['GSAP', 'Next.js', 'Figma'],
    link: '#',
    role: 'Creative Developer',
    timeline: '6 Weeks (2024)',
  }
];