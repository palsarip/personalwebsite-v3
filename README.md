# Naufal Syarif - Personal Portfolio

A modern, interactive portfolio website built with Next.js 15, featuring smooth animations, custom cursor interactions, and an innovative liquid distortion effect.

## ✨ Features

- **Interactive Design**: Custom cursor with smooth GSAP animations
- **Liquid Distortion Effect**: Unique hover effect on hero text
- **Draggable Project Grid**: Infinite scrolling project showcase
- **Modal Windows**: Detailed project views with smooth transitions
- **Responsive Design**: Optimized for all device sizes
- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP with Draggable plugin
- **Icons**: Lucide React
- **Graphics**: PixiJS for advanced effects
- **Package Manager**: Bun

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/personalwebsite-v3.git
cd personalwebsite-v3
```

2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── custom-cursor.tsx  # Custom cursor implementation
│   ├── dock.tsx          # Navigation dock
│   ├── hero-text.tsx     # Hero section with liquid effect
│   ├── projects-view.tsx # Draggable project grid
│   └── window.tsx        # Modal window component
├── data/                 # Static data
│   └── projects.ts       # Project information
└── public/              # Static assets
```

## 🎨 Key Components

### Custom Cursor

Smooth-following cursor with GSAP quickTo for optimal performance.

### Liquid Distortion Effect

SVG filter-based distortion effect that responds to mouse movement on the hero text.

### Draggable Project Grid

Infinite grid of projects using GSAP Draggable with inertia for natural feel.

### Modal System

Smooth modal transitions with backdrop blur and escape key handling.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for any environment-specific configurations.

### Image Optimization

Images are optimized through Next.js Image component with Unsplash integration.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

The project is optimized for deployment on Vercel:

```bash
bun run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for personal use. Please respect the design and code.

## 📞 Contact

- **Email**: [your-email@example.com]
- **LinkedIn**: [your-linkedin]
- **GitHub**: [your-github]

---

Built with ❤️ by Naufal Syarif
