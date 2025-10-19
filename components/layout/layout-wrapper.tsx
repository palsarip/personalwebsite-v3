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
      {/* Header - Fixed position with its own max-width wrapper */}
      <Header />

      {/* Main Content Area */}
      <div className="w-full">{children}</div>

      {/* Dock Navigation - Fixed position at bottom */}
      <Dock onNavigate={onNavigate} activeView={activeView} />
    </div>
  );
}
