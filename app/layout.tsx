import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { reportWebVitals } from "@/lib/analytics";
import PerformanceMonitor from "@/components/performance-monitor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
});

export const metadata: Metadata = {
  title: "Naufal Syarif | Software Engineer & AI Enthusiast",
  description:
    "Software Engineer. AI Enthusiast. Crafting tomorrow's tech. Explore my portfolio of innovative projects and technical expertise.",
  keywords: [
    "Software Engineer",
    "AI",
    "Machine Learning",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Naufal Syarif" }],
  creator: "Naufal Syarif",
  openGraph: {
    title: "Naufal Syarif | Software Engineer & AI Enthusiast",
    description: "Software Engineer. AI Enthusiast. Crafting tomorrow's tech.",
    url: "https://your-domain.com",
    siteName: "Naufal Syarif Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naufal Syarif | Software Engineer & AI Enthusiast",
    description: "Software Engineer. AI Enthusiast. Crafting tomorrow's tech.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${libreBaskerville.variable}`}>
        <PerformanceMonitor />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('web-vitals' in window) {
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(${reportWebVitals.toString()});
                  getFID(${reportWebVitals.toString()});
                  getFCP(${reportWebVitals.toString()});
                  getLCP(${reportWebVitals.toString()});
                  getTTFB(${reportWebVitals.toString()});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
