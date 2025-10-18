#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up development environment...");

// Create .env.local if it doesn't exist
const envLocalPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envLocalPath)) {
  const envExample = fs.readFileSync(
    path.join(process.cwd(), ".env.example"),
    "utf8"
  );
  fs.writeFileSync(envLocalPath, envExample);
  console.log("✅ Created .env.local from .env.example");
} else {
  console.log("ℹ️  .env.local already exists");
}

// Check if all required dependencies are installed
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
);
const requiredDeps = ["gsap", "next", "react", "web-vitals"];
const missingDeps = requiredDeps.filter(
  (dep) => !packageJson.dependencies[dep]
);

if (missingDeps.length > 0) {
  console.log("❌ Missing dependencies:", missingDeps.join(", "));
  console.log("Run: bun install");
} else {
  console.log("✅ All required dependencies are installed");
}

console.log("🎉 Development environment is ready!");
console.log("Run: bun dev to start the development server");
