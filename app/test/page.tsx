"use client";

import Window from "@/components/window";
import Header from "@/components/header";
import Dock from "@/components/dock";
import CustomCursor from "@/components/custom-cursor";
import HeroText from "@/components/hero-text"; // Add this import

export default function TestPage() {
  return (
    <main
      className="cursor-none"
      style={{
        backgroundColor: "#bebebe",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Header />
      <CustomCursor />
      <HeroText /> {/* Add this component */}
      <Dock onNavigate={() => {}} activeView="home" />
      <Window title="Test Window" isOpen={true} onClose={() => {}}>
        <p>This is a test.</p>
      </Window>
    </main>
  );
}
