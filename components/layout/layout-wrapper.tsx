import { ReactNode } from "react";
import Header from "./header";
import Dock from "./dock";

interface LayoutWrapperProps {
  children: ReactNode;
  onNavigate: (id: string) => void;
  activeView: string;
}

export default function LayoutWrapper({
  children,
  onNavigate,
  activeView,
}: LayoutWrapperProps) {
  return (
    <div className="relative min-h-screen">
      {/* Header with consistent padding */}
      <Header />

      {/* Main Content Area - with consistent max-width and padding */}
      <div className="w-full">{children}</div>

      {/* Dock Navigation */}
      <Dock onNavigate={onNavigate} activeView={activeView} />
    </div>
  );
}
