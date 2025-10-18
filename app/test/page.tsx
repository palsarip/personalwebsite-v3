"use client";

// import Window from "@/components/window"; // Component doesn't exist
import Header from "@/components/layout/header";
import Dock from "@/components/layout/dock";
import CustomCursor from "@/components/ui/custom-cursor";
import HeroText from "@/components/views/hero-text";

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
      <HeroText />
      <Dock onNavigate={() => {}} activeView="home" />
      {/* <Window title="Test Window" isOpen={true} onClose={() => {}}>
        <p>This is a test.</p>
      </Window> */}
    </main>
  );
}
